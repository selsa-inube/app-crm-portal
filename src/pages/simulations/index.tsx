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
import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { IPrerequisiteError } from "@services/prospect/types";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";

import { ICreditData, ICardData } from "../prospect/pdf/types";
import { generateSolidPDF } from "../prospect/pdf";
import { paymentCycleMap } from "../prospect/outlets/CardCommercialManagement/config/config";
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
  const [loadingTasks, setLoadingTasks] = useState(0);
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
  const [isAddProductDisabled, setIsAddProductDisabled] = useState(false);
  const [showPrerequisiteModal, setShowPrerequisiteModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    IPrerequisiteError[]
  >([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const generalLoading = loadingTasks > 0;

  const isMobile = useMediaQuery("(max-width:880px)");
  const { prospectCode } = useParams();

  const dataCreditRef = useRef<ICreditRequest>();
  const dataPrint = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const { lang, enums } = useEnum();

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

  const setGeneralLoading = useCallback(
    (isLoading: boolean | ((prev: boolean) => boolean)) => {
      setLoadingTasks((prev) => {
        const isNowLoading =
          typeof isLoading === "function" ? isLoading(prev > 0) : isLoading;
        return isNowLoading ? prev + 1 : Math.max(0, prev - 1);
      });
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
        eventData?.user?.identificationDocumentNumber || "",
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

  const disableAddProduct = useCallback(async () => {
    if (!dataProspect) return;

    try {
      setGeneralLoading(true);
      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        dataProspect.moneyDestinationAbbreviatedName,
        customerData!.publicCode,
        eventData.token,
      );

      if (Array.isArray(lineOfCreditValues)) {
        setIsAddProductDisabled(
          lineOfCreditValues.length === dataProspect.creditProducts.length,
        );
      }
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(`${dataEditProspect.errorCredit}:, ${error}`);
    } finally {
      setGeneralLoading(false);
    }
  }, [businessUnitPublicCode, prospectCode, dataProspect]);

  useEffect(() => {
    disableAddProduct();
  }, [dataProspect, disableAddProduct]);

  const handleSubmitClick = async () => {
    try {
      setGeneralLoading(true);

      if (!dataProspect) {
        setMessageError(dataEditProspect.errorProspect.i18n[lang]);
        setShowErrorModal(true);
        setGeneralLoading(false);
        return;
      }
      const validationResult = await validatePrerequisitesForCreditApplication(
        businessUnitPublicCode,
        prospectCode!,
        eventData.token,
      );

      if (
        validationResult?.isCreditSetupCompleteForCreditRequest === "N" &&
        validationResult.validationErrors?.length > 0
      ) {
        setValidationErrors(validationResult.validationErrors);
        setShowPrerequisiteModal(true);
        setGeneralLoading(false);
        return;
      }

      const result = await fetchValidateCreditRequest();
      if (result) {
        setShowCreditRequest(true);
        setGeneralLoading(false);
        return;
      }

      navigate(`/credit/apply-for-credit/${prospectCode}`);
    } catch (error) {
      setMessageError(
        prerequisitesConfig.errorValidatePrerequisites.i18n[lang],
      );
      setShowErrorModal(true);
    } finally {
      setGeneralLoading(false);
    }
  };

  const fetchProspectData = async () => {
    try {
      setGeneralLoading(true);
      const result = await getSearchProspectByCode(
        businessUnitPublicCode,
        businessManagerCode,
        prospectCode!,
        eventData.token,
      );
      setDataProspect(Array.isArray(result) ? result[0] : result);
      setGeneralLoading(false);
    } catch (error) {
      setGeneralLoading(false);
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

  const generateAndSharePdf = async (shouldShare: boolean = false) => {
    try {
      setGeneratingPdf(shouldShare);
      setDownloadingPdf(!shouldShare);
      const dataPdf: ICreditData = {
        header: {
          destinationName: dataProspect?.moneyDestinationAbbreviatedName || "",
          mainBorrowerName: getMainBorrowerName(dataProspect),
          totalLoanAmount: Number(dataProspect?.requestedAmount),
        },
        cards:
          dataProspect?.creditProducts.map(
            (product) =>
              ({
                title: product.lineOfCreditAbbreviatedName,
                paymentMethod: capitalizeFirstLetter(
                  product.ordinaryInstallmentsForPrincipal?.[0]
                    ?.paymentChannelAbbreviatedName,
                ),
                loanAmount: product.loanAmount || 0,
                interestRate: `${parseFloat(Number(product.interestRate || 0).toFixed(4))}% ${
                  enums?.Peridiocity?.find(
                    (item) => item.code === product.installmentFrequency,
                  )?.i18n?.[lang] ||
                  "" ||
                  ""
                }`,
                termMonths: `${Number(Number(product.loanTerm).toFixed(4))}`,
                periodicPayment:
                  product.ordinaryInstallmentsForPrincipal?.[0]
                    ?.installmentAmount || 0,
                paymentCycle:
                  product.ordinaryInstallmentsForPrincipal?.[0]
                    ?.installmentFrequency ||
                  capitalizeFirstLetter(
                    product.ordinaryInstallmentsForPrincipal?.[0]
                      ?.installmentFrequency ||
                      paymentCycleMap[product.installmentFrequency as string] ||
                      "",
                  ) ||
                  "",
              }) as ICardData,
          ) || [],
        footer: {
          productsAmount: currencyFormat(
            Math.trunc(prospectSummaryData.requestedAmount || 0),
          ),
          obligations: currencyFormat(
            Math.trunc(prospectSummaryData.totalConsolidatedAmount || 0),
          ),
          expenses: currencyFormat(
            Math.trunc(prospectSummaryData.deductibleExpenses || 0),
          ),
          netToDisburse: currencyFormat(
            Math.trunc(prospectSummaryData.netAmountToDisburse || 0),
          ),
          ordinaryInstallment: currencyFormat(
            Math.trunc(prospectSummaryData.totalRegularInstallment || 0),
          ),
        },
      };

      const pdfBlob = await generateSolidPDF(
        dataPdf,
        lang,
        !shouldShare,
        prospectCode,
      );

      if (shouldShare && pdfBlob) {
        const pdfFile = new File(
          [pdfBlob],
          labelsAndValuesShare.fileName.i18n[lang],
          { type: "application/pdf" },
        );

        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            files: [pdfFile],
            title: labelsAndValuesShare.titleOnPdf.i18n[lang],
            text: labelsAndValuesShare.text.i18n[lang],
          });
        } else {
          setShowErrorModal(true);
          setMessageError(labelsAndValuesShare.error.i18n[lang]);
        }
      }
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(labelsAndValuesShare.error.i18n[lang]);
    } finally {
      setGeneratingPdf(false);
      setDownloadingPdf(false);
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
      setGeneralLoading(true);

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
      setGeneralLoading(false);
    } catch (error) {
      setCodeError(1022);
      setAddToFix([dataEditProspect.errorRemoveProspect.i18n[lang]]);
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleRecalculateSimulation = async () => {
    try {
      setGeneralLoading(true);

      const newDataProspect = await recalculateProspect(
        businessUnitPublicCode,
        prospectCode || "",
        eventData.token,
      );

      if (newDataProspect === null) {
        throw new Error();
      }

      await fetchProspectData();
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
      setGeneralLoading(false);
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
      downloadingPdf={downloadingPdf}
      generatingPdf={generatingPdf}
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
      isLoading={generalLoading}
      lang={lang}
      isLoadingDelete={generalLoading}
      enums={enums as IAllEnumsResponse}
      fetchProspectData={fetchProspectData}
      disableAddProduct={isAddProductDisabled}
      showPrerequisiteModal={showPrerequisiteModal}
      setShowPrerequisiteModal={setShowPrerequisiteModal}
      validationErrors={validationErrors}
      setGeneralLoading={setGeneralLoading}
      generalLoading={generalLoading}
    />
  );
}
