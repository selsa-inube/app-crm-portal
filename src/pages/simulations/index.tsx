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
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { ICreditRequest, IPaymentChannel } from "@services/creditRequest/types";
import { generatePDF } from "@utils/pdf/generetePDF";
import { cancelProspect } from "@services/prospect/cancelProspect";
import { MoneyDestinationTranslations } from "@services/enum/icorebanking-vi-crediboard/moneyDestination";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IValidateRequirement } from "@services/requirement/types";
import { IProspectSummaryById } from "@services/prospect/types";
import { recalculateProspect } from "@services/prospect/recalculateProspect";
import { validatePrerequisitesForCreditApplication } from "@services/prospect/validatePrerequisitesForCreditApplication";
import { useEnum } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { SimulationsUI } from "./interface";
import {
  dataEditProspect,
  labelsAndValuesShare,
  prerequisitesConfig,
  requirementsMessageError,
} from "./config";

export function Simulations() {
  const [showMenu, setShowMenu] = useState(false);
  const [managerErrors, setManagerErrors] = useState<string[]>([]);
  const [dataProspect, setDataProspect] = useState<IProspect>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
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
  const dataPrint = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { lang, enums } = useEnum();

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
    if (!dataProspect || !customerData.publicCode) return false;

    const mainBorrower = dataProspect.borrowers?.find(
      (b) => b.borrowerType === "MainBorrower",
    );

    if (mainBorrower && customerData.publicCode) {
      return (
        mainBorrower.borrowerIdentificationNumber === customerData.publicCode
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
        eventData.token,
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
    try {
      setIsLoading(true);

      if (!dataProspect) {
        setMessageError(dataEditProspect.errorProspect.i18n[lang]);
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }
      const validationResult = await validatePrerequisitesForCreditApplication(
        businessUnitPublicCode,
        prospectCode!,
        eventData.token,
      );

      if (
        !validationResult ||
        validationResult.isCreditSetupCompleteForCreditRequest === "N"
      ) {
        setMessageError(prerequisitesConfig.prerequisitesNotMet.i18n[lang]);
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }
      const result = await fetchValidateCreditRequest();

      if (result) {
        setShowCreditRequest(true);
        setIsLoading(false);
        return;
      }

      navigate(`/credit/apply-for-credit/${prospectCode}`);
    } catch (error) {
      setMessageError(
        prerequisitesConfig.errorValidatePrerequisites.i18n[lang],
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProspectData = async () => {
    try {
      setIsLoading(true);
      const result = await getSearchProspectByCode(
        businessUnitPublicCode,
        businessManagerCode,
        prospectCode!,
        eventData.token,
      );
      setDataProspect(Array.isArray(result) ? result[0] : result);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
    if (dataProspect && !codeError && customerData.publicCode) {
      const isValid = validateProspectOwnership();
      if (!isValid) {
        setCodeError(1015);
      }
    }
  }, [dataProspect, validateProspectOwnership, codeError, customerData]);

  const generateAndSharePdf = async () => {
    try {
      const pdfBlob = await generatePDF(
        dataPrint,
        labelsAndValuesShare.titleOnPdf.i18n[lang],
        labelsAndValuesShare.titleOnPdf.i18n[lang],
        { top: 10, bottom: 10, left: 10, right: 10 },
        true,
      );

      if (pdfBlob) {
        const pdfFile = new File(
          [pdfBlob],
          labelsAndValuesShare.fileName.i18n[lang],
          {
            type: "application/pdf",
          },
        );

        await navigator.share({
          files: [pdfFile],
          title: labelsAndValuesShare.titleOnPdf.i18n[lang],
          text: labelsAndValuesShare.text.i18n[lang],
        });
      }
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(labelsAndValuesShare.error.i18n[lang]);
    }
  };

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
          eventData.token,
        );

        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        if (!managerErrors.includes("errorValidateRequirements")) {
          setMessageError(description || requirementsMessageError.i18n[lang]);
          setShowErrorModal(true);
          setValidateRequirements([]);
          setManagerErrors((prev) => [...prev, "errorValidateRequirements"]);
        }
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
      setIsLoadingDelete(true);

      await cancelProspect(
        businessUnitPublicCode,
        businessManagerCode,
        {
          cancelProspectsRequest: [
            {
              prospectId: dataProspect.prospectId,
              prospectCode: dataProspect.prospectCode,
              clientIdentificationNumber: customerData.publicCode,
            },
          ],
        },
        eventData.token,
      );

      navigate("/credit/prospects");
      setIsLoadingDelete(false);
    } catch (error) {
      setIsLoadingDelete(false);
      setCodeError(1022);
      setAddToFix([dataEditProspect.errorRemoveProspect.i18n[lang]]);
    }
  };

  const handleRecalculateSimulation = async () => {
    try {
      setIsLoading(true);

      const newDataProspect = await recalculateProspect(
        businessUnitPublicCode,
        prospectCode || "",
        eventData.token,
      );

      if (newDataProspect === null) {
        throw new Error();
      }

      setDataProspect(newDataProspect);
      setShowRecalculateSimulation(false);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setMessageError(description || requirementsMessageError.description);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
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
      isLoading={isLoading}
      lang={lang}
      isLoadingDelete={isLoadingDelete}
      enums={enums as IAllEnumsResponse}
    />
  );
}
