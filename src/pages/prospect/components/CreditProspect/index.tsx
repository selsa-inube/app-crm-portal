import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FormikValues } from "formik";
import {
  MdOutlineAdd,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
} from "react-icons/md";
import { Stack, Icon, Button, Select } from "@inubekit/inubekit";

import { MenuProspect } from "@components/navigation/MenuProspect";
import { PaymentCapacity } from "@components/modals/PaymentCapacityModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { EditProductModal } from "@components/modals/ProspectProductModal";
import { IncomeModal } from "@pages/prospect/components/modals/IncomeModal";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { BaseModal } from "@components/modals/baseModal";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { ShareCreditModal } from "@components/modals/ShareCreditModal";
import { ICreditProductProspect, IPaymentChannel } from "@services/types";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { addCreditProduct } from "@mocks/utils/addCreditProductMock.service";
import { mockProspectCredit } from "@mocks/prospect/prospectCredit.mock";
import {
  incomeOptions,
  menuOptions,
} from "@pages/prospect/outlets/CardCommercialManagement/config/config";
import {
  StyledContainerIcon,
  StyledVerticalDivider,
} from "@pages/prospect/outlets/CardCommercialManagement/styles";
import { CardCommercialManagement } from "@pages/prospect/outlets/CardCommercialManagement/CardCommercialManagement";
import { IProspect } from "@services/prospects/types";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { generatePDF } from "@utils/pdf/generetePDF";
import { AppContext } from "@context/AppContext";
import { getCreditLimit } from "@services/creditRequest/getCreditLimit";

import { IncomeDebtor } from "../modals/DebtorDetailsModal/incomeDebtor";
import { dataCrsimulations } from "./config";
import { StyledPrint } from "./styles";
import { IIncomeSources } from "./types";
import { CreditLimitModal } from "../modals/CreditLimitModal";

interface ICrsimulationsProps {
  showMenu: () => void;
  isMobile: boolean;
  prospectData?: IProspect;
  isPrint?: boolean;
  showPrint?: boolean;
  setRequestValue?: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
}

export function Crsimulations(props: ICrsimulationsProps) {
  const {
    prospectData,
    showMenu,
    setRequestValue,
    isMobile,
    isPrint = false,
    showPrint = true,
  } = props;

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();
  const { customerPublicCode } = useParams();
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect[]>([]);
  const [incomeData, setIncomeData] = useState<Record<string, IIncomeSources>>(
    {},
  );
  const [prospectProducts, setProspectProducts] =
    useState<ICreditProductProspect>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [pdfProspect, setPdfProspect] = useState<string | null>(null);

  const dataPrint = useRef<HTMLDivElement>(null);

  const handleOpenModal = (modalName: string) => {
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

  useEffect(() => {
    if (id) {
      const foundProspect = mockProspectCredit.find(
        (prospect) => prospect.public_code === id,
      );
      if (foundProspect) {
        const mockCredit = foundProspect.consolidated_credit[0];
        setForm({
          borrower: foundProspect.borrower[0].borrower_name,
          monthlySalary: mockCredit.monthly_salary ?? 0,
          otherMonthlyPayments: mockCredit.other_monthly_payments ?? 0,
          pensionAllowances: mockCredit.pension_allowances ?? 0,
          leases: mockCredit.leases ?? 0,
          dividendsOrShares: mockCredit.dividends_or_shares ?? 0,
          financialReturns: mockCredit.financial_returns ?? 0,
          averageMonthlyProfit: mockCredit.average_monthly_profit ?? 0,
          monthlyFees: mockCredit.monthly_fees ?? 0,
          total: undefined,
        });
      }
    }
  }, [id]);

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
    if (!id) {
      console.error("ID no está definido");
      setProspectProducts;
      return;
    }

    const result = await addCreditProduct(id, values, mockProspectCredit);

    if (result) {
      handleCloseModal();
    }
  };

  const borrowersProspect =
    dataProspect.length > 0 ? dataProspect[0] : undefined;

  const borrowerOptions =
    borrowersProspect?.borrowers?.map((borrower) => ({
      id: crypto.randomUUID(),
      label: borrower.borrowerName,
      value: borrower.borrowerName,
    })) ?? [];

  const handleChange = (_name: string, value: string) => {
    const index = borrowersProspect?.borrowers?.findIndex(
      (borrower) => borrower.borrowerName === value,
    );
    setSelectedIndex(index ?? 0);
  };

  const selectedBorrower = borrowersProspect?.borrowers?.[selectedIndex];

  const handleIncomeSubmit = (updatedData: IIncomeSources) => {
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

  useEffect(() => {
    const fetchPDF = async () => {
      const pdfData = await generatePDF(dataPrint, "");
      if (pdfData) {
        setPdfProspect(pdfData);
      }
    };
    fetchPDF();
  }, []);

  useEffect(() => {
    const fetchCreditLimit = async () => {
      try {
        const result = await getCreditLimit(
          businessUnitPublicCode,
          customerPublicCode!,
        );

        setCreditLimitData(result);
      } catch (error) {
        console.error("Error al obtener las solicitudes de crédito:", error);
        return null;
      }
    };
    fetchCreditLimit();
  }, []);
  return (
    <div ref={dataPrint}>
      <Stack direction="column" gap="24px">
        {!isMobile && (
          <StyledPrint>
            <Stack gap="16px" justifyContent="end" alignItems="center">
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
                onClick={() => handleOpenModal("editProductModal")}
              >
                {dataCrsimulations.addProduct}
              </Button>
              {prospectData?.creditProducts && (
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
                  {dataCrsimulations.extraPayment}
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
                      onClick={() => setShowShareModal(true)}
                      cursorHover
                    />
                    <StyledVerticalDivider />
                  </Stack>
                )}
                <MenuProspect
                  only
                  options={menuOptions(
                    handleOpenModal,
                    !prospectProducts?.ordinary_installment_for_principal,
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
          />
        </Stack>
        {currentModal === "creditLimit" && (
          <CreditLimitModal
            handleClose={handleCloseModal}
            isMobile={isMobile}
            setRequestValue={setRequestValue || (() => {})}
          />
        )}
        {openModal === "paymentCapacity" && (
          <PaymentCapacity
            title="Cupo máx. capacidad de pago"
            handleClose={() => setOpenModal(null)}
            reportedIncomeSources={2000000}
            reportedFinancialObligations={6789000}
            subsistenceReserve={2000000}
            availableForNewCommitments={5000000}
            maxVacationTerm={12}
            maxAmount={1000000}
          />
        )}
        {openModal === "reciprocityModal" && (
          <ReciprocityModal
            handleClose={() => setOpenModal(null)}
            balanceOfContributions={4000000}
            accordingToRegulation={2}
            assignedQuota={1000000}
          />
        )}
        {openModal === "scoreModal" && (
          <ScoreModal
            title="Score Details"
            handleClose={() => setOpenModal(null)}
            subTitle="Your Financial Score"
            totalScore={150}
            seniority={150}
            centralRisk={50}
            employmentStability={230}
            maritalStatus={30}
            economicActivity={118}
            monthlyIncome={3000000}
            maxIndebtedness={50000000}
          />
        )}
        {currentModal === "editProductModal" && (
          <EditProductModal
            title="Agregar productos"
            confirmButtonText="Guardar"
            initialValues={initialValues}
            iconBefore={<MdOutlineAdd />}
            onCloseModal={handleCloseModal}
            onConfirm={handleConfirm}
          />
        )}
        {currentModal === "IncomeModal" && (
          <BaseModal
            title={dataCrsimulations.incomeSources}
            nextButton={dataCrsimulations.close}
            handleNext={handleCloseModal}
            handleClose={handleCloseModal}
          >
            <Stack
              justifyContent="space-between"
              alignItems="end"
              width="400px"
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
              <Button
                onClick={() => {
                  handleCloseModal();
                  setOpenModal("IncomeModalEdit");
                }}
              >
                {dataCrsimulations.edit}
              </Button>
            </Stack>
            <IncomeDebtor
              initialValues={
                dataProspect[0]?.borrowers?.find(
                  (b) =>
                    b.borrowerName === borrowerOptions[selectedIndex]?.value,
                ) || selectedBorrower
              }
            />
          </BaseModal>
        )}
        {openModal === "IncomeModalEdit" && (
          <IncomeModal
            handleClose={() => setOpenModal(null)}
            initialValues={creditLimitData}
            onSubmit={handleIncomeSubmit}
          />
        )}
        {currentModal === "reportCreditsModal" && (
          <ReportCreditsModal
            handleClose={handleCloseModal}
            options={incomeOptions}
            onChange={onChanges}
            debtor={form.borrower}
            prospectData={prospectData ? [prospectData] : undefined}
          />
        )}
        {currentModal === "extraPayments" && (
          <ExtraordinaryPaymentModal
            dataTable={extraordinaryInstallmentMock}
            handleClose={handleCloseModal}
            prospectData={prospectData}
          />
        )}
        {showShareModal && (
          <ShareCreditModal
            handleClose={() => setShowShareModal(false)}
            isMobile={isMobile}
            prospectId={prospectData?.prospectId || ""}
            pdf={pdfProspect}
          />
        )}
      </Stack>
    </div>
  );
}
