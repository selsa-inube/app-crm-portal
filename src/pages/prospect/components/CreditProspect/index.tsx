import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FormikValues } from "formik";
import {
  MdOutlineAdd,
  MdOutlineInfo,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Button,
  Select,
  useFlag,
  Spinner,
  Textarea,
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
import { generatePDF } from "@utils/pdf/generetePDF";
import { AppContext } from "@context/AppContext";
import {
  IAddCreditProduct,
  ICreditProduct,
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { IPaymentChannel } from "@services/creditRequest/types";
import { addCreditProduct } from "@services/prospect/addCreditProduct";
import { getSearchProspectById } from "@services/prospect/SearchByIdProspect";
import { getCreditLimit } from "@services/creditLimit/getCreditLimit";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { CustomerContext } from "@context/CustomerContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import { AddProductModal } from "@src/pages/prospect/components/AddProductModal";
import { CardGray } from "@components/cards/CardGray";
import { privilegeCrm } from "@config/privilege";
import { updateProspect } from "@services/prospect/updateProspect";

import { IncomeDebtor } from "../modals/DebtorDetailsModal/incomeDebtor";
import {
  dataCreditProspect,
  labelsAndValuesShare,
  configModal,
} from "./config";
import { StyledPrint } from "./styles";
import { IIncomeSources } from "./types";
import { CreditLimitModal } from "../modals/CreditLimitModal";
import InfoModal from "../InfoModal";

interface ICreditProspectProps {
  showMenu: () => void;
  isMobile: boolean;
  businessManagerCode: string;
  prospectData?: IProspect;
  sentData: IExtraordinaryInstallments | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  isPrint?: boolean;
  showPrint?: boolean;
  setRequestValue?: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  onProspectUpdate?: (prospect: IProspect) => void;
  onProspectRefreshData?: () => void;
}

export function CreditProspect(props: ICreditProspectProps) {
  const {
    prospectData,
    businessManagerCode,
    showMenu,
    setRequestValue,
    onProspectUpdate,
    sentData,
    setSentData,
    onProspectRefreshData,
    isMobile,
    isPrint = false,
    showPrint = true,
  } = props;

  const { customerData } = useContext(CustomerContext);
  const customerPublicCode: string = customerData.publicCode;

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();
  const [isLoadingCreditLimit, setIsLoadingCreditLimit] = useState(false);
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
  const [messageError, setMessageError] = useState("");
  const [currentIncomeModalData, setCurrentIncomeModalData] = useState<
    IIncomeSources | undefined
  >();
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [editedComments, setEditedComments] = useState("");

  const { addFlag } = useFlag();
  const dataPrint = useRef<HTMLDivElement>(null);

  const fetchCreditLimitData = async () => {
    if (!customerPublicCode) return;

    try {
      setIsLoadingCreditLimit(true);
      setCreditLimitError(null);
      const result = await getCreditLimit(
        businessUnitPublicCode,
        businessManagerCode,
        customerPublicCode,
      );
      setCreditLimitData(result);
      setCurrentIncomeModalData(result);
    } catch (error) {
      console.error("Error al obtener las solicitudes de crédito:", error);
      setCreditLimitError("Error al cargar los datos");
    } finally {
      setIsLoadingCreditLimit(false);
    }
  };
  const handleOpenModal = (modalName: string) => {
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
      const payload: IAddCreditProduct = {
        prospectId: prospectData.prospectId,
        creditProducts: [
          {
            lineOfCreditAbbreviatedName: values.selectedProducts[0],
          },
        ],
      };

      await addCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (prospectData?.prospectId) {
        const updatedProspect = await getSearchProspectById(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
        );
        setDataProspect([updatedProspect]);
        if (onProspectUpdate) {
          onProspectUpdate(updatedProspect);
        }
      }

      handleCloseModal();
    } catch (error) {
      handleCloseModal();
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
        description = "El producto de crédito ya existe en el prospecto";
      }
      addFlag({
        title: dataCreditProspect.descriptionError,
        description,
        appearance: "danger",
        duration: 5000,
      });
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

  function hasExtraordinaryInstallments(dataProspect: IProspect): boolean {
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
  }

  const handleIncomeSubmit = (updatedData: IIncomeSources) => {
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

      setDataProspect((prev) => {
        return prev.map((prospect) => {
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
      });
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

  const generateAndSharePdf = async () => {
    try {
      const pdfBlob = await generatePDF(
        dataCommercialManagementRef,
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
      );

      if (onProspectRefreshData) {
        onProspectRefreshData();
      }

      addFlag({
        title: "Observaciones actualizadas",
        description: "Las observaciones se han guardado correctamente",
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(configModal.observations.errorMessage);
    }
  };

  return (
    <div ref={dataPrint}>
      <Stack direction="column" gap="24px">
        {!isMobile && (
          <StyledPrint>
            <Stack gap="16px" justifyContent="end" alignItems="center">
              <Stack alignItems="center" gap="4px">
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
                >
                  {dataCreditProspect.addProduct}
                </Button>
                {!prospectData?.creditProducts[0].extraordinaryInstallments && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
              {!hasExtraordinaryInstallments(prospectData as IProspect) && (
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
                >
                  {dataCreditProspect.extraPayment}
                </Button>
              )}
              <StyledVerticalDivider />
              <StyledContainerIcon>
                {showPrint && (
                  <Stack gap="8px">
                    <Icon
                      icon={<MdOutlinePictureAsPdf />}
                      appearance="primary"
                      size="24px"
                      disabled={!isPrint}
                      cursorHover
                      onClick={print}
                    />
                    <Icon
                      icon={<MdOutlineShare />}
                      appearance="primary"
                      size="24px"
                      onClick={async () => await generateAndSharePdf()}
                      cursorHover
                    />
                    <StyledVerticalDivider />
                  </Stack>
                )}
                <MenuProspect
                  only
                  options={menuOptions(
                    handleOpenModal,
                    !prospectProducts?.ordinaryInstallmentsForPrincipal,
                  )}
                  onMouseLeave={showMenu}
                />
              </StyledContainerIcon>
            </Stack>
          </StyledPrint>
        )}
        <Stack direction="column">
          <CardCommercialManagement
            id={id!}
            dataRef={dataCommercialManagementRef}
            onClick={() => handleOpenModal("editProductModal")}
            prospectData={prospectData || undefined}
            onProspectUpdate={onProspectUpdate}
            onProspectRefreshData={onProspectRefreshData}
          />
        </Stack>
        {currentModal === "creditLimit" && (
          <CreditLimitModal
            handleClose={handleCloseModal}
            isMobile={isMobile}
            setRequestValue={setRequestValue || (() => {})}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            dataMaximumCreditLimitService={dataMaximumCreditLimitService}
            moneyDestination={prospectData?.moneyDestinationAbbreviatedName || ""}
          />
        )}
        {openModal === "paymentCapacity" && (
          <MaxLimitModal
            handleClose={() => setOpenModal(null)}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            dataMaximumCreditLimitService={dataMaximumCreditLimitService}
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
          />
        )}
        {currentModal === "IncomeModal" && (
          <BaseModal
            title={dataCreditProspect.incomeSources}
            nextButton={dataCreditProspect.close}
            handleNext={handleCloseModal}
            handleClose={handleCloseModal}
            width={isMobile ? "auto" : "448px"}
          >
            {isLoadingCreditLimit ? (
              <Stack
                justifyContent="center"
                alignItems="center"
                height="300px"
                direction="column"
                gap="16px"
              >
                <Spinner />
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
                <Stack
                  justifyContent="space-between"
                  alignItems="end"
                  width={isMobile ? "auto" : "100%"}
                  gap="16px"
                >
                  <Select
                    label="Deudor"
                    id="borrower"
                    name="borrower"
                    options={borrowerOptions}
                    value={borrowerOptions[selectedIndex]?.value}
                    onChange={handleChange}
                    size="compact"
                  />
                  <Stack alignItems="center">
                    <Button
                      onClick={() => {
                        setOpenModal("IncomeModalEdit");
                      }}
                      disabled={canEditCreditRequest}
                    >
                      {dataCreditProspect.edit}
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
          />
        )}
        {currentModal === "reportCreditsModal" && (
          <ReportCreditsModal
            handleClose={handleCloseModal}
            options={incomeOptions}
            onChange={onChanges}
            debtor={form.borrower}
            prospectData={prospectData ? [prospectData] : undefined}
            onProspectUpdate={onProspectRefreshData}
          />
        )}

        {currentModal === "extraPayments" && (
          <ExtraordinaryPaymentModal
            handleClose={handleCloseModal}
            prospectData={prospectData}
            sentData={sentData}
            setSentData={setSentData}
            businessUnitPublicCode={businessUnitPublicCode}
          />
        )}

        {currentModal === "observations" && (
          <BaseModal
            title={configModal.observations.title}
            handleClose={handleCloseModal}
            handleNext={() => {
              setEditedComments(prospectData!.clientComments || "");
              setShowEditMessageModal(true);
            }}
            nextButton={configModal.observations.modify}
            backButton={configModal.observations.cancel}
            width={isMobile ? "300px" : "500px"}
          >
            <Stack direction="column" gap="16px">
              <CardGray
                label={configModal.observations.labelTextarea}
                placeHolder={prospectData!.clientComments || ""}
                apparencePlaceHolder="gray"
              />
            </Stack>
          </BaseModal>
        )}

        {showEditMessageModal && (
          <BaseModal
            title={configModal.observations.title}
            handleClose={() => setShowEditMessageModal(false)}
            handleNext={handleSaveComments}
            nextButton={configModal.observations.modify}
            backButton={configModal.observations.cancel}
            width={isMobile ? "300px" : "500px"}
          >
            <Textarea
              id="comments"
              label={configModal.observations.labelTextarea}
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
