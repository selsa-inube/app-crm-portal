import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { getSearchProspectByCode } from "@services/prospect/SearchAllProspects";
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { ICreditRequest, IPaymentChannel } from "@services/creditRequest/types";
import { generatePDF } from "@utils/pdf/generetePDF";
import { RemoveProspect } from "@services/prospect/removeProspect";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IValidateRequirement } from "@services/requirement/types";
import { IProspectSummaryById } from "@services/prospect/types";

import { ruleConfig } from "../applyForCredit/config/configRules";
import { evaluateRule } from "../applyForCredit/evaluateRule";
import { SimulationsUI } from "./interface";
import { ICondition, Irule } from "../simulateCredit/types";
import { dataEditProspect, labelsAndValuesShare } from "./config";

export function Simulations() {
  const [showMenu, setShowMenu] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreditRequest, setShowCreditRequest] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [showRecalculateSimulation, setShowRecalculateSimulation] =
    useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>({} as IProspectSummaryById);
  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);

  const isMobile = useMediaQuery("(max-width:880px)");
  const { prospectCode } = useParams();

  const dataCreditRef = useRef<ICreditRequest>();
  const valueRuleRef = useRef<{ [ruleName: string]: string[] }>({});
  const dataPrint = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const data = dataProspect;
  const [sentData, setSentData] = useState<IExtraordinaryInstallments | null>(
    null,
  );
  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
    publicCode: customerData.publicCode,
  };
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();

  const getTotalLoanAmount = useCallback(
    (data: IProspect | undefined): number => {
      if (!data || !data.creditProducts) return 0;

      return data.creditProducts.reduce((sum, product) => {
        return sum + (product.loanAmount || 0);
      }, 0);
    },
    [],
  );
  const getDestinationName = useCallback((code?: string) => {
    if (!code) return "";
    const found = MoneyDestinationTranslations.find(
      (item) => item.Code === code,
    );
    return found?.Code || code;
  }, []);

  const getMainBorrowerName = useCallback(
    (data: IProspect | undefined): string => {
      if (!data) return "";
      const mainBorrower = data.borrowers.find(
        (b) => b.borrowerType === "MainBorrower",
      );
      return mainBorrower?.borrowerName || "";
    },
    [],
  );

  const processedData = useMemo(
    () => ({
      totalLoanAmount: getTotalLoanAmount(dataProspect),
      destinationName: getDestinationName(
        data?.moneyDestinationAbbreviatedName,
      ),
      mainBorrowerName: getMainBorrowerName(data),
    }),
    [
      dataProspect,
      data,
      getTotalLoanAmount,
      getDestinationName,
      getMainBorrowerName,
    ],
  );

  const { disabledButton: canRequestCredit } = useValidateUseCase({
    useCase: getUseCaseValue("canRequestCredit"),
  });
  const { disabledButton: canDeleteCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canDeleteCreditRequest"),
  });
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });

  const validateProspectOwnership = useCallback((): boolean => {
    if (!dataProspect || !dataHeader) return false;

    const mainBorrower = dataProspect.borrowers?.find(
      (b) => b.borrowerType === "MainBorrower",
    );

    if (mainBorrower && dataHeader.publicCode) {
      return (
        mainBorrower.borrowerIdentificationNumber === dataHeader.publicCode
      );
    }

    return false;
  }, [dataProspect, dataHeader]);

  const fetchValidateCreditRequest = useCallback(async () => {
    if (!prospectCode) return;

    try {
      const result = await getCreditRequestByCode(
        businessUnitPublicCode,
        businessManagerCode,
        userAccount,
        {
          creditRequestCode: prospectCode!,
        },
      );

      const creditData = Array.isArray(result) ? result[0] : result;

      dataCreditRef.current = creditData;
      return creditData;
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(`${dataEditProspect.errorCredit}:, ${error}`);
      return null;
    }
  }, [businessUnitPublicCode, prospectCode]);

  const handleSubmitClick = async () => {
    const result = await fetchValidateCreditRequest();

    if (result) {
      setShowCreditRequest(true);
      return;
    }

    navigate(`/credit/apply-for-credit/${prospectCode}`);
  };

  const cleanConditions = (
    rule: Irule | null | undefined,
  ): Irule | null | undefined => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: ICondition) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        Reflect.deleteProperty(cleaned, "conditions");
      }
    }
    return cleaned;
  };

  const fetchProspectData = async () => {
    try {
      const result = await getSearchProspectByCode(
        businessUnitPublicCode,
        businessManagerCode,
        prospectCode!,
      );
      setDataProspect(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(`${dataEditProspect.errorProspect}:, ${error}`);
      setTimeout(() => {
        navigate(`/credit/prospects`);
      }, 1500);
    }
  };

  useEffect(() => {
    fetchProspectData();
  }, [businessUnitPublicCode, sentData]);

  useEffect(() => {
    if (dataProspect && !codeError) {
      const isValid = validateProspectOwnership();
      if (!isValid) {
        setCodeError(1015);
      }
    }
  }, [dataProspect, validateProspectOwnership, codeError]);

  const generateAndSharePdf = async () => {
    try {
      const pdfBlob = await generatePDF(
        dataPrint,
        labelsAndValuesShare.titleOnPdf,
        labelsAndValuesShare.titleOnPdf,
        { top: 10, bottom: 10, left: 10, right: 10 },
        true,
      );

      if (pdfBlob) {
        const pdfFile = new File([pdfBlob], labelsAndValuesShare.fileName, {
          type: "application/pdf",
        });

        await navigator.share({
          files: [pdfFile],
          title: labelsAndValuesShare.titleOnPdf,
          text: labelsAndValuesShare.text,
        });
      }
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(labelsAndValuesShare.error);
    }
  };

  const fetchValidationRules = useCallback(async () => {
    const rulesToCheck = ["ValidationGuarantee", "ValidationCoBorrower"];
    const notDefinedRules: string[] = [];
    await Promise.all(
      rulesToCheck.map(async (ruleName) => {
        try {
          const rule = cleanConditions(ruleConfig[ruleName]?.({}));
          if (!rule) return notDefinedRules.push(ruleName);
          await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
            businessManagerCode,
          );
        } catch (error) {
          const errorResponse = error as { response?: { status: number } };
          if (errorResponse.response?.status === 400) {
            notDefinedRules.push(ruleName);
          }
        }
      }),
    );

    if (notDefinedRules.length >= 1) {
      setCodeError(1013);
      setAddToFix(notDefinedRules);
    }
  }, [businessUnitPublicCode]);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = dataProspect?.creditProducts;

    if (!clientInfo.associateType || !creditProducts?.length || !dataProspect)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      LoanAmount: dataProspect.requestedAmount,
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rulesValidate = ["ValidationGuarantee", "ValidationCoBorrower"];

    for (const product of creditProducts) {
      if (!product || typeof product !== "object") continue;

      const dataRules = {
        ...dataRulesBase,
        LineOfCredit: product.lineOfCreditAbbreviatedName,
      };
      await Promise.all(
        rulesValidate.map(async (ruleName) => {
          const rule = ruleConfig[ruleName]?.(dataRules);
          if (!rule) return;

          try {
            const values = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              businessManagerCode,
            );

            const extractedValues = Array.isArray(values)
              ? values
                  .map((v) =>
                    typeof v === "string" ? v : (v?.valuesAvailable ?? ""),
                  )
                  .filter((val): val is string => val !== "")
              : [];

            if (
              ruleName === "ModeOfDisbursementType" &&
              extractedValues.length === 0
            ) {
              setCodeError(1014);
              setAddToFix([ruleName]);
              return;
            }

            valueRuleRef.current = {
              ...valueRuleRef.current,
              [ruleName]: extractedValues,
            };
          } catch (error) {
            console.error(
              `Error evaluando ${ruleName} para producto`,
              product,
              error,
            );
          }
        }),
      );
    }
  }, [customerData, dataProspect, businessUnitPublicCode]);

  useEffect(() => {
    if (customerData && dataProspect) {
      fetchValidationRules();
      fetchValidationRulesData();
    }
  }, [customerData, dataProspect, fetchValidationRulesData]);

  useEffect(() => {
    if (!customerData?.customerId || !dataProspect) return;
    const payload = {
      clientIdentificationNumber: customerData.publicCode,
      prospect: { ...dataProspect },
    };
    const handleSubmit = async () => {
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        setShowErrorModal(true);
        setMessageError("");
      }
    };

    handleSubmit();
  }, [
    customerData?.customerId,
    dataProspect,
    businessUnitPublicCode,
    businessManagerCode,
  ]);

  const handleInfo = () => {
    setIsModalOpen(true);
  };

  if (prospectCode === undefined) {
    navigate(`/credit/prospects`);
  }

  const handleDeleteProspect = async () => {
    if (!dataProspect) return;

    try {
      await RemoveProspect(businessUnitPublicCode, businessManagerCode, {
        removeProspectsRequest: [
          {
            prospectId: dataProspect.prospectId,
          },
        ],
      });

      navigate("/credit/prospects");
    } catch (error) {
      setCodeError(1022);
      setAddToFix([dataEditProspect.errorRemoveProspect]);
    }
  };

  const handleRecalculateSimulation = () => {
    setShowRecalculateSimulation(false);
  };

  return (
    <SimulationsUI
      dataHeader={dataHeader}
      isMobile={isMobile}
      prospectCode={prospectCode || ""}
      data={data}
      dataProspect={dataProspect}
      showMenu={showMenu}
      codeError={codeError}
      addToFix={addToFix}
      isModalOpen={isModalOpen}
      showCreditRequest={showCreditRequest}
      dataPrint={dataPrint}
      showErrorModal={showErrorModal}
      messageError={messageError}
      businessManagerCode={businessManagerCode}
      setShowDeleteModal={setShowDeleteModal}
      setShowErrorModal={setShowErrorModal}
      setShowMenu={setShowMenu}
      handleSubmitClick={handleSubmitClick}
      handleInfo={handleInfo}
      setIsModalOpen={setIsModalOpen}
      setShowCreditRequest={setShowCreditRequest}
      setRequestValue={setRequestValue}
      setProspectData={setDataProspect}
      requestValue={requestValue}
      sentData={sentData}
      setSentData={setSentData}
      onProspectUpdated={fetchProspectData}
      navigate={navigate}
      handleDeleteProspect={handleDeleteProspect}
      showDeleteModal={showDeleteModal}
      generateAndSharePdf={generateAndSharePdf}
      canRequestCredit={canRequestCredit}
      canDeleteCreditRequest={canDeleteCreditRequest}
      canEditCreditRequest={canEditCreditRequest}
      processedData={processedData}
      prospectSummaryData={prospectSummaryData}
      setProspectSummaryData={setProspectSummaryData}
      showRecalculateSimulation={showRecalculateSimulation}
      setShowRecalculateSimulation={setShowRecalculateSimulation}
      handleRecalculateSimulation={handleRecalculateSimulation}
      showRequirements={showRequirements}
      setShowRequirements={setShowRequirements}
      validateRequirements={validateRequirements}
    />
  );
}
