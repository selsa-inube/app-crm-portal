import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FormikValues } from "formik";
import {
  MdOutlineAdd,
  MdOutlineInfo,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Button,
  Select,
  useFlag,
  Textarea,
  SkeletonLine,
} from "@inubekit/inubekit";

import { MenuProspect } from "@components/navigation/MenuProspect";
import { MaxLimitModal } from "@components/modals/MaxLimitModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { IncomeModal } from "@pages/prospect/components/modals/IncomeModal";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { BaseModal } from "@components/modals/baseModal";
import {
  incomeOptions,
  menuOptions,
} from "@pages/prospect/outlets/CardCommercialManagement/config/config";
import {
  StyledContainerIcon,
  StyledVerticalDivider,
} from "@pages/prospect/outlets/CardCommercialManagement/styles";
import { CardCommercialManagement } from "@pages/prospect/outlets/CardCommercialManagement/CardCommercialManagement";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { AppContext } from "@context/AppContext";
import {
  IAddProduct,
  ICreditProduct,
  IExtraordinaryInstallments,
  IProspect,
  IProspectSummaryById,
} from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { IPaymentChannel } from "@services/creditRequest/types";
import { addCreditProduct } from "@services/prospect/addCreditProduct";
import { SearchByIdProspectUpdateProspect } from "@services/prospect/SearchByIdProspectUpdateProspect";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { CustomerContext } from "@context/CustomerContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import { AddProductModal } from "@pages/prospect/components/AddProductModal";
import { CardGray } from "@components/cards/CardGray";
import { privilegeCrm } from "@config/privilege";
import { updateProspect } from "@services/prospect/updateProspect";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/components/CreditLimitCard/types";
import { incomeCardData } from "@components/cards/IncomeCard/config";
import { IValidateRequirement } from "@services/requirement/types";
import { StyledDivider } from "@components/layout/Divider/styles";
import { getTotalIncomeByBorrowerInProspect } from "@services/prospect/totalIncomeByBorrowers/getTotalIncomeByBorrowerInProspect";
import { Fieldset } from "@components/data/Fieldset";
import { dataCreditProspects } from "@pages/creditProspects/config";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { IncomeDebtor } from "../modals/DebtorDetailsModal/incomeDebtor";
import {
  dataCreditProspect,
  configModal,
  propertyOfMetRequirement,
} from "./config";
import { StyledPrint } from "./styles";
import { IIncomeSources } from "./types";
import { CreditLimitModal } from "../modals/CreditLimitModal";
import { ScoreModalProspect } from "../ScoreModalProspect";
import InfoModal from "../InfoModal";
import { filterIncomeByBorrower } from "./utils";

interface ICreditProspectProps {
  showMenu: () => void;
  isMobile: boolean;
  lang: EnumType;
  businessManagerCode: string;
  setGeneralLoading: React.Dispatch<React.SetStateAction<boolean>>;
  generalLoading: boolean;
  prospectData?: IProspect;
  sentData: IExtraordinaryInstallments | null;
  enums: IAllEnumsResponse;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  isPrint?: boolean;
  showPrint?: boolean;
  showAddButtons?: boolean;
  showAddProduct?: boolean;
  setRequestValue?: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  onProspectUpdate?: (prospect: IProspect) => void;
  onProspectUpdated?: () => void;
  prospectSummaryData?: IProspectSummaryById;
  setProspectSummaryData?: React.Dispatch<
    React.SetStateAction<IProspectSummaryById>
  >;
  userAccount: string;
  onProspectRefreshData?: () => void;
  setShowRequirements?: React.Dispatch<React.SetStateAction<boolean>>;
  validateRequirements?: IValidateRequirement[];
  fetchProspectData?: () => Promise<void>;
  disableAddProduct?: boolean;
}

export function CreditProspect(props: ICreditProspectProps) {
  const {
    prospectData,
    businessManagerCode,
    lang,
    showMenu,
    setRequestValue,
    onProspectUpdate,
    sentData,
    setSentData,
    onProspectRefreshData,
    isMobile,
    isPrint = false,
    showPrint = true,
    setProspectSummaryData,
    prospectSummaryData,
    userAccount,
    showAddButtons = true,
    showAddProduct = true,
    setShowRequirements,
    validateRequirements,
    enums,
    fetchProspectData,
    disableAddProduct = false,
    setGeneralLoading,
    generalLoading,
  } = props;

  const { eventData } = useContext(AppContext);
  const { customerData } = useContext(CustomerContext);
  const customerPublicCode: string = customerData.publicCode;

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();
  const [creditLimitError, setCreditLimitError] = useState<string | null>(null);
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [dataProspect, setDataProspect] = useState<IProspect[]>([]);
  const [incomeData, setIncomeData] = useState<Record<string, IIncomeSources>>(
    {},
  );
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMessageSuccessModal, setShowMessageSuccessModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const [currentIncomeModalData, setCurrentIncomeModalData] = useState<
    IIncomeSources | undefined
  >();
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [editedComments, setEditedComments] = useState("");

  const { addFlag } = useFlag();
  const dataPrint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMessageSuccessModal) {
      addFlag({
        title: configModal.success.title.i18n[lang],
        description: configModal.success.text.i18n[lang],
        appearance: "success",
        duration: 5000,
      });

      const timeoutId = setTimeout(() => {
        setShowMessageSuccessModal(false);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showMessageSuccessModal]);

  useEffect(() => {
    fetchCreditLimitData();
  }, [selectedIndex]);

  const fetchCreditLimitData = async () => {
    if (!customerPublicCode) return;

    try {
      setGeneralLoading(true);
      setCreditLimitError(null);

      const incomesBorrowersByProspect =
        await getTotalIncomeByBorrowerInProspect(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData?.prospectCode || "",
          eventData.token,
        );

      const incomesFiltered = filterIncomeByBorrower(
        incomesBorrowersByProspect,
        prospectData?.borrowers[selectedIndex].borrowerIdentificationNumber ||
          "",
      );

      setCreditLimitData(incomesFiltered);
      setCurrentIncomeModalData(incomesFiltered);
    } catch (error) {
      console.error("Error al obtener las solicitudes de crédito:", error);
      setCreditLimitError("Error al cargar los datos");
    } finally {
      setGeneralLoading(false);
    }
  };
  const handleOpenModal = (modalName: string) => {
    if (modalName === "requirements" && setShowRequirements) {
      setShowRequirements(true);
      return;
    }
    if (modalName === "IncomeModal") {
      fetchCreditLimitData();
    }
    setModalHistory((prevHistory) => [...prevHistory, modalName]);
  };

  const currentModal = modalHistory[modalHistory.length - 1];
  const handleCloseModal = () => {
    setModalHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.pop();
      return newHistory;
    });
  };

  const { id } = useParams();
  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    borrower: "",
    monthlySalary: 0,
    otherMonthlyPayments: 0,
    pensionAllowances: 0,
    leases: 0,
    dividendsOrShares: 0,
    financialReturns: 0,
    averageMonthlyProfit: 0,
    monthlyFees: 0,
    total: undefined,
  });

  const initialValues: FormikValues = {
    creditLine: "",
    creditAmount: "",
    paymentMethod: "",
    paymentCycle: "",
    firstPaymentCycle: "",
    termInMonths: "",
    amortizationType: "",
    interestRate: "",
    rateType: "",
  };

  const onChanges = (name: string, newValue: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: newValue,
    }));
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!prospectData?.prospectId) {
      setProspectProducts;
      return;
    }

    try {
      setGeneralLoading(true);
      const payload: IAddProduct = {
        prospectId: prospectData.prospectId,
        paymentChannelAbbreviatedName:
          values.paymentConfiguration.paymentMethod,
        paymentCycle: values.paymentConfiguration.paymentCycle,
        firstPaymentCycleDate: values.paymentConfiguration.firstPaymentDate,
        lineOfCreditAbbreviatedName: values.selectedProducts[0],
        termLimit: Number(values.maximumTermValue) || 0,
        installmentLimit: Number(values.quotaCapValue) || 0,
        additionalAmount: Number(values.creditAmount),
      };

      await addCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token,
      );

      if (prospectData?.prospectId) {
        const updatedProspect = await SearchByIdProspectUpdateProspect(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
          eventData.token,
        );
        setDataProspect([updatedProspect]);
        if (onProspectUpdate) {
          onProspectUpdate(updatedProspect);
        }
      }
      handleCloseModal();
      setShowMessageSuccessModal(true);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      let description = code + err?.message + (err?.data?.description || "");

      if (
        err?.data?.description == "Credit product already exists in prospect"
      ) {
        description = "El producto de crédito ya existe en el prospecto";
      }
      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      setGeneralLoading(false);
    }
  };

  const borrowersProspect =
    dataProspect.length > 0 ? dataProspect[0] : undefined;

  const borrowerOptions =
    borrowersProspect?.borrowers?.map((borrower) => ({
      id: crypto.randomUUID(),
      label: borrower.borrowerName,
      value: borrower.borrowerName,
      publicCode: borrower.borrowerIdentificationNumber,
    })) ?? [];

  const handleChange = (_name: string, value: string) => {
    const index = borrowersProspect?.borrowers?.findIndex(
      (borrower) => borrower.borrowerName === value,
    );
    setSelectedIndex(index ?? 0);
  };
  const selectedBorrower = borrowersProspect?.borrowers?.[selectedIndex];

  const hasExtraordinaryInstallments = (dataProspect: IProspect): boolean => {
    if (
      !dataProspect?.creditProducts ||
      !Array.isArray(dataProspect.creditProducts)
    ) {
      return false;
    }

    for (const creditProduct of dataProspect.creditProducts) {
      if (
        creditProduct?.extraordinaryInstallments &&
        Array.isArray(creditProduct.extraordinaryInstallments) &&
        creditProduct.extraordinaryInstallments.length > 0
      ) {
        return true;
      }
    }

    return false;
  };

  const handleIncomeSubmit = async (updatedData: IIncomeSources) => {
    setCurrentIncomeModalData({ ...updatedData });
    setCreditLimitData({ ...updatedData });

    if (selectedBorrower) {
      const borrowerName = selectedBorrower.borrowerName;

      setIncomeData((prev) => ({
        ...prev,
        [borrowerName]: {
          ...updatedData,
          edited: true,
        },
      }));

      const updatedBorrower = () => {
        return dataProspect.map((prospect) => {
          const updatedBorrowers = prospect.borrowers.map((borrower) => {
            if (borrower.borrowerName === borrowerName) {
              const updatedProperties = [
                ...borrower.borrowerProperties.filter(
                  (prop) =>
                    ![
                      "PeriodicSalary",
                      "OtherNonSalaryEmoluments",
                      "PensionAllowances",
                      "PersonalBusinessUtilities",
                      "ProfessionalFees",
                      "Leases",
                      "Dividends",
                      "FinancialIncome",
                      "name",
                      "surname",
                    ].includes(prop.propertyName),
                ),
                {
                  propertyName: "PeriodicSalary",
                  propertyValue: updatedData.PeriodicSalary?.toString() || "0",
                },
                {
                  propertyName: "OtherNonSalaryEmoluments",
                  propertyValue:
                    updatedData.OtherNonSalaryEmoluments?.toString() || "0",
                },
                {
                  propertyName: "PensionAllowances",
                  propertyValue:
                    updatedData.PensionAllowances?.toString() || "0",
                },
                {
                  propertyName: "PersonalBusinessUtilities",
                  propertyValue:
                    updatedData.PersonalBusinessUtilities?.toString() || "0",
                },
                {
                  propertyName: "ProfessionalFees",
                  propertyValue:
                    updatedData.ProfessionalFees?.toString() || "0",
                },
                {
                  propertyName: "Leases",
                  propertyValue: updatedData.Leases?.toString() || "0",
                },
                {
                  propertyName: "Dividends",
                  propertyValue: updatedData.Dividends?.toString() || "0",
                },
                {
                  propertyName: "FinancialIncome",
                  propertyValue: updatedData.FinancialIncome?.toString() || "0",
                },
                {
                  propertyName: "name",
                  propertyValue: updatedData.name || "",
                },
                {
                  propertyName: "surname",
                  propertyValue: updatedData.surname || "",
                },
              ];

              return {
                ...borrower,
                borrowerProperties: updatedProperties,
              };
            }
            return borrower;
          });

          return {
            ...prospect,
            borrowers: updatedBorrowers,
          };
        });
      };

      setDataProspect(updatedBorrower());

      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedBorrower()[0],
        eventData.token,
      );

      if (onProspectRefreshData) onProspectRefreshData();

      setOpenModal(null);
    }
  };

  useEffect(() => {
    if (prospectData && Object.keys(prospectData).length > 0) {
      setDataProspect([prospectData]);
    }
  }, [prospectData]);

  useEffect(() => {
    if (selectedBorrower) {
      const borrowerName = selectedBorrower.borrowerName;
      if (!incomeData[borrowerName]?.edited) {
        setIncomeData((prev) => ({
          ...prev,
          [borrowerName]: {
            identificationNumber: selectedBorrower.borrowerIdentificationNumber,
            identificationType: selectedBorrower.borrowerIdentificationType,
            name:
              getPropertyValue(selectedBorrower.borrowerProperties, "name") ||
              "",
            surname:
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "surname",
              ) || "",
            Leases: parseFloat(
              getPropertyValue(selectedBorrower.borrowerProperties, "Leases") ||
                "0",
            ),
            Dividends: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "Dividends",
              ) || "0",
            ),
            FinancialIncome: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "FinancialIncome",
              ) || "0",
            ),
            PeriodicSalary: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PeriodicSalary",
              ) || "0",
            ),
            OtherNonSalaryEmoluments: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "OtherNonSalaryEmoluments",
              ) || "0",
            ),
            PensionAllowances: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PensionAllowances",
              ) || "0",
            ),
            PersonalBusinessUtilities: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PersonalBusinessUtilities",
              ) || "0",
            ),
            ProfessionalFees: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "ProfessionalFees",
              ) || "0",
            ),
            edited: false,
          },
        }));
      }
    }
  }, [selectedBorrower]);

  useEffect(() => {
    if (borrowerOptions.length === 1) {
      setSelectedIndex(0);
    }
  }, [borrowerOptions]);

  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };

  const borrower = dataProspect?.[0]?.borrowers?.[0];

  const dataMaximumCreditLimitService = {
    identificationDocumentType: borrower?.borrowerIdentificationType || "",
    identificationDocumentNumber: borrower?.borrowerIdentificationNumber || "",
    moneyDestination: dataProspect?.[0]?.moneyDestinationAbbreviatedName || "",
    primaryIncomeType:
      borrower?.borrowerProperties?.find(
        (property) => property.propertyName === "PeriodicSalary",
      )?.propertyValue || "",
    lineOfCreditAbbreviatedName: dataProspect?.[0]?.linesOfCredit || "",
  };

  const handleCommentsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedComments(event.target.value);
  };

  const handleSaveComments = async () => {
    try {
      if (!prospectData) return;

      const updatedProspect: IProspect = {
        ...prospectData,
        clientComments: editedComments,
      };

      if (onProspectUpdate) {
        onProspectUpdate(updatedProspect);
      }

      setShowEditMessageModal(false);
      handleCloseModal();

      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
        eventData.token,
      );

      if (onProspectRefreshData) {
        onProspectRefreshData();
      }

      setShowMessageSuccessModal(true);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(configModal.observations.errorMessage.i18n[lang]);
    }
  };
  const incomeDataProspect = (prospectData?: IProspect): IIncomeSources => {
    const borrower = prospectData?.borrowers?.[0];
    const properties = borrower?.borrowerProperties || [];

    const getValue = (name: string) => getPropertyValue(properties, name) || "";

    const getNumeric = (name: string) => parseFloat(getValue(name)) || 0;

    return {
      identificationNumber: borrower?.borrowerIdentificationNumber || "",
      identificationType: borrower?.borrowerIdentificationType || "",
      name: getValue("name"),
      surname: getValue("surname"),
      Dividends: getNumeric("Dividends"),
      FinancialIncome: getNumeric("FinancialIncome"),
      Leases: getNumeric("Leases"),
      OtherNonSalaryEmoluments: getNumeric("OtherNonSalaryEmoluments"),
      PensionAllowances: getNumeric("PensionAllowances"),
      PeriodicSalary: getNumeric("PeriodicSalary"),
      PersonalBusinessUtilities: getNumeric("PersonalBusinessUtilities"),
      ProfessionalFees: getNumeric("ProfessionalFees"),
    };
  };

  const incomeDataValues = incomeDataProspect(prospectData);

  const countRequirementsNotMet = () => {
    if (!validateRequirements) return 0;

    const requirementsOnlyNotMet = validateRequirements.filter(
      (requirement) =>
        requirement.requirementStatus !==
        propertyOfMetRequirement.approve.i18n[lang],
    );

    const requirementsOnlyNotMetCount = requirementsOnlyNotMet.length;

    return requirementsOnlyNotMetCount;
  };

  return (
    <div ref={dataPrint}>
      <Stack direction="column" gap="12px">
        <StyledPrint>
          <Stack
            gap="16px"
            justifyContent="end"
            alignItems={isMobile ? "center" : "normal"}
            direction={isMobile ? "column" : "row"}
          >
            <Stack
              alignItems={isMobile ? "center" : "normal"}
              gap="4px"
              direction={isMobile ? "column" : "row"}
              width={isMobile ? "100%" : "auto"}
            >
              {showAddProduct && !disableAddProduct && !generalLoading && (
                <Button
                  type="button"
                  appearance="primary"
                  spacing="compact"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineAdd />}
                      appearance="light"
                      size="18px"
                      spacing="narrow"
                    />
                  }
                  disabled={canEditCreditRequest}
                  onClick={() => handleOpenModal("editProductModal")}
                  fullwidth={isMobile}
                >
                  {dataCreditProspect.addProduct.i18n[lang]}
                </Button>
              )}
              {canEditCreditRequest && (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              )}
            </Stack>
            {hasExtraordinaryInstallments(prospectData as IProspect) && (
              <Button
                type="button"
                appearance="primary"
                spacing="compact"
                variant="outlined"
                iconBefore={
                  <Icon
                    icon={<MdOutlinePayments />}
                    appearance="primary"
                    size="18px"
                    spacing="narrow"
                  />
                }
                onClick={() => handleOpenModal("extraPayments")}
                disabled={canEditCreditRequest}
                fullwidth={isMobile}
              >
                {dataCreditProspect.extraPayment.i18n[lang]}
              </Button>
            )}
            {isMobile && <StyledDivider />}
            <StyledContainerIcon>
              {showPrint && (
                <Stack gap="8px">
                  {!isMobile && (
                    <>
                      <Icon
                        icon={<MdOutlinePictureAsPdf />}
                        appearance="primary"
                        size="24px"
                        disabled={!isPrint}
                        cursorHover
                        onClick={print}
                      />
                      <StyledVerticalDivider />
                    </>
                  )}
                </Stack>
              )}
              <MenuProspect
                only
                options={menuOptions(
                  handleOpenModal,
                  !prospectProducts?.ordinaryInstallmentsForPrincipal,
                )}
                onMouseLeave={showMenu}
                isMobile={isMobile}
                badges={{
                  requirements: countRequirementsNotMet(),
                }}
                hasExtraordinaryInstallments={hasExtraordinaryInstallments(
                  prospectData as IProspect,
                )}
              />
            </StyledContainerIcon>
          </Stack>
        </StyledPrint>
        <Stack direction="column">
          <CardCommercialManagement
            id={id!}
            dataRef={dataCommercialManagementRef}
            onClick={() => handleOpenModal("editProductModal")}
            prospectData={prospectData || undefined}
            onProspectUpdate={onProspectUpdate}
            prospectSummaryData={prospectSummaryData}
            setProspectSummaryData={setProspectSummaryData}
            setShowMessageSuccessModal={setShowMessageSuccessModal}
            onProspectRefreshData={onProspectRefreshData}
            showAddProduct={showAddProduct}
            lang={lang}
            enums={enums}
            fetchProspectData={fetchProspectData}
            disableAddProduct={disableAddProduct}
            setGeneralLoading={setGeneralLoading}
            generalLoading={generalLoading}
          />
        </Stack>
        {currentModal === "creditLimit" && (
          <CreditLimitModal
            handleClose={handleCloseModal}
            isMobile={isMobile}
            setRequestValue={setRequestValue || (() => {})}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            dataMaximumCreditLimitService={
              dataMaximumCreditLimitService as IdataMaximumCreditLimitService
            }
            moneyDestination={
              prospectData?.moneyDestinationAbbreviatedName || ""
            }
            userAccount={userAccount}
            incomeData={incomeDataValues}
            lang={lang}
          />
        )}
        {openModal === "paymentCapacity" && (
          <MaxLimitModal
            handleClose={() => setOpenModal(null)}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            dataMaximumCreditLimitService={
              dataMaximumCreditLimitService as IdataMaximumCreditLimitService
            }
            lang={lang}
          />
        )}
        {openModal === "reciprocityModal" && (
          <ReciprocityModal
            handleClose={() => setOpenModal(null)}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            clientIdentificationNumber={
              dataMaximumCreditLimitService.identificationDocumentNumber
            }
            lang={lang}
          />
        )}
        {openModal === "scoreModal" && (
          <ScoreModal
            handleClose={() => setOpenModal(null)}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            clientIdentificationNumber={
              dataMaximumCreditLimitService.identificationDocumentNumber
            }
            lang={lang}
          />
        )}
        {currentModal === "editProductModal" && (
          <AddProductModal
            title="Agregar productos"
            confirmButtonText="Guardar"
            initialValues={initialValues}
            iconBefore={<MdOutlineAdd />}
            onCloseModal={handleCloseModal}
            onConfirm={handleConfirm}
            moneyDestination={prospectData!.moneyDestinationAbbreviatedName}
            businessUnitPublicCode={businessUnitPublicCode}
            customerData={customerData}
            businessManagerCode={businessManagerCode}
            dataProspect={prospectData as IProspect}
            isLoading={generalLoading}
            lang={lang}
            eventData={eventData}
          />
        )}
        {currentModal === "IncomeModal" && (
          <BaseModal
            title={dataCreditProspect.incomeSources.i18n[lang]}
            nextButton={dataCreditProspect.close.i18n[lang]}
            handleNext={handleCloseModal}
            handleClose={handleCloseModal}
            width={isMobile ? "280px" : "448px"}
          >
            {generalLoading ? (
              <Stack gap="16px" direction="column">
                <SkeletonLine width="70%" height="30px" animated />
                <Fieldset>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    height="120px"
                    direction="column"
                    gap="16px"
                  >
                    <SkeletonLine width="100%" height="30px" animated />
                    <SkeletonLine width="100%" height="30px" animated />
                    <SkeletonLine width="100%" height="30px" animated />
                  </Stack>
                </Fieldset>
              </Stack>
            ) : creditLimitError ? (
              <Stack
                justifyContent="center"
                alignItems="center"
                height="300px"
                direction="column"
                gap="16px"
              >
                <Button onClick={fetchCreditLimitData}>Reintentar</Button>
              </Stack>
            ) : (
              <>
                {showAddButtons === true && (
                  <Stack
                    justifyContent="space-between"
                    alignItems={isMobile ? "normal" : "end"}
                    width={isMobile ? "auto" : "100%"}
                    direction={isMobile ? "column" : "row"}
                    gap="16px"
                  >
                    {borrowerOptions.length === 1 ? (
                      <CardGray
                        label={incomeCardData.borrower.i18n[lang]}
                        placeHolder={borrowerOptions[0]?.label || ""}
                        isMobile={isMobile}
                      />
                    ) : (
                      <Select
                        label="Deudor"
                        id="borrower"
                        name="borrower"
                        options={borrowerOptions}
                        value={borrowerOptions[selectedIndex]?.value}
                        onChange={handleChange}
                        size="compact"
                      />
                    )}

                    <Stack alignItems="center">
                      <Button
                        onClick={() => {
                          setOpenModal("IncomeModalEdit");
                        }}
                        disabled={canEditCreditRequest}
                        fullwidth={isMobile}
                      >
                        {dataCreditProspect.edit.i18n[lang]}
                      </Button>
                      {canEditCreditRequest ? (
                        <Icon
                          icon={<MdOutlineInfo />}
                          appearance="primary"
                          size="16px"
                          cursorHover
                          onClick={handleInfo}
                        />
                      ) : (
                        <></>
                      )}
                    </Stack>
                  </Stack>
                )}
                <IncomeDebtor
                  initialValues={
                    dataProspect[0]?.borrowers?.find(
                      (b) =>
                        b.borrowerName ===
                        borrowerOptions[selectedIndex]?.value,
                    ) || selectedBorrower
                  }
                />
              </>
            )}
          </BaseModal>
        )}
        {openModal === "IncomeModalEdit" && currentIncomeModalData && (
          <IncomeModal
            handleClose={() => {
              setOpenModal(null);
            }}
            initialValues={currentIncomeModalData}
            onSubmit={handleIncomeSubmit}
            customerData={customerData}
            borrowerOptions={borrowerOptions}
            selectedIndex={selectedIndex}
            creditLimitData={creditLimitData}
            publicCode={borrowerOptions[selectedIndex]?.publicCode || ""}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            prospectData={prospectData}
            lang={lang}
          />
        )}
        {currentModal === "reportCreditsModal" && (
          <ReportCreditsModal
            handleClose={handleCloseModal}
            options={incomeOptions}
            onChange={onChanges}
            debtor={form.borrower}
            prospectData={prospectData ? [prospectData] : []}
            onProspectUpdate={onProspectRefreshData}
            showAddButton={showAddButtons}
            lang={lang}
            enums={enums}
          />
        )}
        {currentModal === "extraPayments" && (
          <ExtraordinaryPaymentModal
            handleClose={handleCloseModal}
            prospectData={prospectData}
            sentData={sentData}
            setSentData={setSentData}
            businessUnitPublicCode={businessUnitPublicCode}
            showAddButton={showAddButtons}
            lang={lang}
          />
        )}

        {currentModal === "observations" && (
          <BaseModal
            title={configModal.observations.title.i18n[lang]}
            handleClose={handleCloseModal}
            handleNext={
              showAddButtons
                ? () => {
                    setEditedComments(
                      prospectData ? prospectData!.clientComments : "",
                    );
                    setShowEditMessageModal(true);
                  }
                : handleCloseModal
            }
            nextButton={
              showAddButtons
                ? configModal.observations.modify.i18n[lang]
                : configModal.observations.cancel.i18n[lang]
            }
            backButton={
              showAddButtons
                ? configModal.observations.cancel.i18n[lang]
                : undefined
            }
            width={isMobile ? "300px" : "500px"}
          >
            <Stack direction="column" gap="16px">
              <CardGray
                label={configModal.observations.preApproval.i18n[lang]}
                placeHolder={
                  prospectData!.clientManagerObservation ||
                  dataCreditProspects.notHaveComments.i18n[lang]
                }
                apparencePlaceHolder="gray"
              />
              <CardGray
                label={configModal.observations.labelTextarea.i18n[lang]}
                placeHolder={
                  prospectData!.clientComments ||
                  dataCreditProspects.notHaveObservations.i18n[lang]
                }
                apparencePlaceHolder="gray"
              />
            </Stack>
          </BaseModal>
        )}

        {currentModal === "scores" && (
          <ScoreModalProspect
            isMobile={isMobile}
            handleClose={handleCloseModal}
            lang={lang}
            customerPublicCode={customerPublicCode}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            setShowMessageSuccessModal={setShowMessageSuccessModal}
            setMessageError={setMessageError}
            eventData={eventData}
            setShowErrorModal={setShowErrorModal}
            prospectData={prospectData as IProspect}
            onProspectRefreshData={onProspectRefreshData}
          />
        )}

        {showEditMessageModal && (
          <BaseModal
            title={configModal.observations.title.i18n[lang]}
            handleClose={() => setShowEditMessageModal(false)}
            handleNext={handleSaveComments}
            nextButton={configModal.observations.modify.i18n[lang]}
            backButton={configModal.observations.cancel.i18n[lang]}
            width={isMobile ? "300px" : "500px"}
          >
            <Textarea
              id="comments"
              label={configModal.observations.labelTextarea.i18n[lang]}
              value={editedComments}
              onChange={(event) => handleCommentsChange(event)}
              maxLength={120}
            />
          </BaseModal>
        )}

        {showErrorModal && (
          <ErrorModal
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={messageError}
          />
        )}

        {isModalOpen ? (
          <InfoModal
            onClose={handleInfoModalClose}
            title={privilegeCrm.title}
            subtitle={privilegeCrm.subtitle}
            description={privilegeCrm.description}
            nextButtonText={privilegeCrm.nextButtonText}
            isMobile={isMobile}
          />
        ) : (
          <></>
        )}
      </Stack>
    </div>
  );
}
