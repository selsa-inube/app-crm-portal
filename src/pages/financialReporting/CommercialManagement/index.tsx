import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineAdd,
  MdOutlineChevronRight,
  MdOutlineMoreVert,
  MdOutlinePhone,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
  MdOutlineVideocam,
  MdOutlinePayments,
} from "react-icons/md";

import {
  Stack,
  Icon,
  Text,
  Divider,
  useMediaQuery,
  Button,
  useFlag,
} from "@inubekit/inubekit";
import { MenuProspect } from "@components/navigation/MenuProspect";
import {
  truncateTextToMaxLength,
  capitalizeFirstLetter,
  capitalizeFirstLetterEachWord,
} from "@utils/formatData/text";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { DisbursementModal } from "@components/modals/DisbursementModal";
import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import { IProspect, ICreditProduct } from "@services/prospect/types";
import { CreditProspect } from "@pages/prospect/components/CreditProspect";
import { AppContext } from "@context/AppContext";
import { dataTabsDisbursement } from "@components/modals/DisbursementModal/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { BaseModal } from "@components/modals/baseModal";
import userNotFound from "@assets/images/ItemNotFound.png";
import { IExtraordinaryInstallments } from "@services/prospect/types";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { IIncomeSources } from "@pages/prospect/components/CreditProspect/types";
import { CreditLimitModal } from "@pages/prospect/components/modals/CreditLimitModal";
import { IncomeModal } from "@pages/prospect/components/modals/IncomeModal";
import { getPropertyValue } from "@utils/mappingData/mappings";

import { titlesModal } from "../ToDo/config";
import { errorMessages } from "../config";
import { incomeOptions, menuOptions, tittleOptions } from "./config/config";
import {
  StyledCollapseIcon,
  StyledFieldset,
  StyledContainerIcon,
  StyledVerticalDivider,
  StyledPrint,
} from "./styles";
import {
  ICreditRequest,
  IModeOfDisbursement,
  IPaymentChannel,
} from "@src/services/creditRequest/types";
import { formatPrimaryDate } from "@src/utils/formatData/date";
import { getCreditRequestByCode } from "@src/services/creditRequest/getCreditRequestByCode";
import { getModeOfDisbursement } from "@src/services/creditRequest/getModeOfDisbursement";

interface ComercialManagementProps {
  data: ICreditRequest;
  prospectData: IProspect;
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  sentData: IExtraordinaryInstallments | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  generateAndSharePdf: () => void;
  creditRequestCode: string;
  isPrint?: boolean;
  hideContactIcons?: boolean;
  requestValue?: IPaymentChannel[];
}

export const ComercialManagement = (props: ComercialManagementProps) => {
  const {
    data,
    isPrint = false,
    collapse,
    setCollapse,
    creditRequestCode,
    hideContactIcons,
    prospectData,
    generateAndSharePdf,
    sentData,
    setSentData,
    setRequestValue,
  } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );
  const [localProspectData, setLocalProspectData] =
    useState<IProspect>(prospectData);
  const [internal, setInternal] = useState<IModeOfDisbursement | null>(null);
  const [external, setExternal] = useState<IModeOfDisbursement | null>(null);
  const [checkEntity, setCheckEntity] = useState<IModeOfDisbursement | null>(
    null,
  );
  const [checkManagement, setCheckManagement] =
    useState<IModeOfDisbursement | null>(null);
  const [cash, setCash] = useState<IModeOfDisbursement | null>(null);
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [dataProspect, setDataProspect] = useState<IProspect[]>([]);
  const [incomeData, setIncomeData] = useState<Record<string, IIncomeSources>>(
    {},
  );
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

  const navigation = useNavigate();
  const { addFlag } = useFlag();
  const isMobile = useMediaQuery("(max-width: 720px)");

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    console.log("prospectData   ", prospectData);
    setLocalProspectData(prospectData);
  }, [prospectData]);

  const handleOpenModal = (modalName: string) => {
    setModalHistory((prevHistory) => [...prevHistory, modalName]);
  };

  useEffect(() => {
    if (prospectData && Array.isArray(prospectData.creditProducts)) {
      setProspectProducts(prospectData.creditProducts as ICreditProduct[]);
    }
  }, [prospectData]);

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode,
          userAccount,
        );
        setRequests(data[0] as ICreditRequest);
      } catch (error) {
        console.error(error);
      }
    };

    if (creditRequestCode) {
      fetchCreditRequest();
    }
  }, [
    businessUnitPublicCode,
    creditRequestCode,
    userAccount,
    businessManagerCode,
  ]);

  const handleDisbursement = async () => {
    if (requests?.creditRequestId) {
      setLoading(true);
      try {
        const disbursement = await getModeOfDisbursement(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId,
        );

        const internalData =
          disbursement.find(
            (item) => item.modeOfDisbursementType === "Internal_account",
          ) || null;
        const externalData =
          disbursement.find(
            (item) => item.modeOfDisbursementType === "External_account",
          ) || null;
        const checkEntityData =
          disbursement.find(
            (item) => item.modeOfDisbursementType === "Certified_check",
          ) || null;
        const checkManagementData =
          disbursement.find(
            (item) => item.modeOfDisbursementType === "Business_check",
          ) || null;
        const cashData =
          disbursement.find((item) => item.modeOfDisbursementType === "Cash") ||
          null;
        setInternal(internalData);
        setExternal(externalData);
        setCheckEntity(checkEntityData);
        setCheckManagement(checkManagementData);
        setCash(cashData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setModalHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.pop();
      return newHistory;
    });
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
    setShowMenu(false);
  };

  const currentModal = modalHistory[modalHistory.length - 1];

  const dataDefault: dataTabsDisbursement = {
    disbursementAmount: "",
    isInTheNameOfBorrower: "",
    payeeName: "",
    payeeSurname: "",
    payeeBiologicalSex: "",
    payeeIdentificationType: "",
    payeeIdentificationNumber: "",
    payeeBirthday: "",
    payeePhoneNumber: "",
    payeeEmail: "",
    payeeCityOfResidence: "",
    accountBankName: "",
    accountType: "",
    accountNumber: "",
    observation: "",
  };

  const onChangesReportCredit = (name: string, newValue: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: newValue }));
  };

  const borrowersProspect =
    dataProspect.length > 0 ? dataProspect[0] : undefined;

  const selectedBorrower = borrowersProspect?.borrowers?.[selectedIndex];

  const handleIncomeSubmit = (updatedData: IIncomeSources) => {
    if (selectedBorrower) {
      const borrowerName = selectedBorrower.borrowerName;

      setIncomeData((prev) => ({
        ...prev,
        [borrowerName]: { ...updatedData, edited: true },
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
                { propertyName: "name", propertyValue: updatedData.name || "" },
                {
                  propertyName: "surname",
                  propertyValue: updatedData.surname || "",
                },
              ];

              return { ...borrower, borrowerProperties: updatedProperties };
            }
            return borrower;
          });

          return { ...prospect, borrowers: updatedBorrowers };
        });
      });
      setOpenModal(null);
    }
  };

  const borrowerOptions =
    borrowersProspect?.borrowers?.map((borrower) => ({
      id: crypto.randomUUID(),
      label: borrower.borrowerName,
      value: borrower.borrowerName,
    })) ?? [];

  useEffect(() => {
    setDataProspect(prospectData ? [prospectData] : []);
  }, [prospectData]);

  const handleChangeIncome = (_name: string, value: string) => {
    const index = borrowersProspect?.borrowers?.findIndex(
      (borrower) => borrower.borrowerName === value,
    );
    setSelectedIndex(index ?? 0);
  };

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

  console.log(prospectData, "prospect");

  return (
    <>
      <Fieldset
        title={errorMessages.comercialManagement.titleCard}
        descriptionTitle={errorMessages.comercialManagement.descriptionCard}
      >
        {!data ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.comercialManagement.title}
            description={errorMessages.comercialManagement.description}
            buttonDescription={errorMessages.comercialManagement.button}
            onRetry={() => navigation(-2)}
          />
        ) : (
          <StyledFieldset>
            <Stack direction="column" gap="6px">
              <Stack justifyContent="space-between" alignItems="center">
                <Stack direction="column">
                  <Stack>
                    <Stack gap="6px" width="max-content">
                      <Text type="title" size="small" appearance="gray">
                        {tittleOptions.titleCreditId}
                      </Text>
                      <Text type="title" size="small">
                        {data.creditRequestCode}
                      </Text>
                      <Text
                        type="title"
                        size="small"
                        appearance="gray"
                        padding={`0px 0px 0px 8px`}
                      >
                        {formatPrimaryDate(
                          new Date(data.creditRequestDateOfCreation),
                        )}
                      </Text>
                    </Stack>
                  </Stack>
                  {isMobile && (
                    <Stack margin="4px 0px">
                      <Text type="title" size={!isMobile ? "large" : "medium"}>
                        {data.clientName &&
                          capitalizeFirstLetterEachWord(
                            truncateTextToMaxLength(data.clientName),
                          )}
                      </Text>
                    </Stack>
                  )}
                  <Stack gap={!isMobile ? "4px" : "4px"}>
                    <Text type="title" size="small" appearance="gray">
                      {tittleOptions.titleDestination}
                    </Text>
                    <Text type="title" size="small">
                      {data.clientName &&
                        capitalizeFirstLetter(
                          truncateTextToMaxLength(data.moneyDestinationId, 60),
                        )}
                    </Text>
                  </Stack>
                  <Stack gap="4px">
                    <Text type="title" size="small" appearance="gray">
                      {tittleOptions.tittleAmount}
                    </Text>
                    <Text type="title" size="small">
                      {data.loanAmount === 0
                        ? "$ 0"
                        : currencyFormat(data.loanAmount)}
                    </Text>
                  </Stack>
                </Stack>

                {!isMobile && (
                  <Stack gap="36px">
                    <Text type="title">
                      {data.clientName &&
                        capitalizeFirstLetterEachWord(
                          truncateTextToMaxLength(data.clientName),
                        )}
                    </Text>
                  </Stack>
                )}
                <Stack gap="2px">
                  {!isMobile && (
                    <>
                      <StyledPrint>
                        <Stack gap="16px">
                          <Button
                            type="link"
                            spacing="compact"
                            path={`/extended-card/${creditRequestCode}/credit-profile`}
                          >
                            {tittleOptions.titleProfile}
                          </Button>
                          <Stack gap="2px" alignItems="center">
                            <Button
                              type="button"
                              spacing="compact"
                              variant="outlined"
                              onClick={() => {
                                handleDisbursement();
                                handleOpenModal("disbursementModal");
                              }}
                            >
                              {tittleOptions.titleDisbursement}
                            </Button>
                          </Stack>
                        </Stack>
                      </StyledPrint>
                      {!hideContactIcons && (
                        <>
                          <StyledVerticalDivider />
                          <StyledPrint>
                            <Icon
                              icon={<MdOutlinePhone />}
                              appearance="primary"
                              size="24px"
                              cursorHover
                            />
                          </StyledPrint>
                          <StyledPrint>
                            <Icon
                              icon={<MdOutlineVideocam />}
                              appearance="primary"
                              size="24px"
                              cursorHover
                            />
                          </StyledPrint>
                        </>
                      )}
                      <StyledVerticalDivider />
                    </>
                  )}
                  <StyledCollapseIcon
                    $collapse={collapse}
                    onClick={handleCollapse}
                  >
                    <StyledPrint>
                      <Icon
                        icon={<MdOutlineChevronRight />}
                        appearance="primary"
                        size={"26px"}
                        cursorHover
                      />
                    </StyledPrint>
                  </StyledCollapseIcon>
                </Stack>
              </Stack>
              {isMobile && (
                <>
                  <StyledPrint>
                    <Button
                      type="link"
                      spacing="compact"
                      path={`/extended-card/${creditRequestCode}/credit-profile`}
                      fullwidth
                    >
                      {tittleOptions.titleProfile}
                    </Button>
                  </StyledPrint>
                  <StyledPrint>
                    <Button
                      type="button"
                      spacing="compact"
                      variant="outlined"
                      onClick={() => {
                        handleDisbursement();
                        handleOpenModal("disbursementModal");
                      }}
                      fullwidth
                    >
                      {tittleOptions.titleDisbursement}
                    </Button>
                  </StyledPrint>
                </>
              )}
              {isMobile && !hideContactIcons && (
                <Stack gap="16px" padding="12px 0px 12px 0px">
                  <Button
                    spacing="compact"
                    variant="outlined"
                    fullwidth
                    iconBefore={<MdOutlinePhone />}
                  >
                    {tittleOptions.titleCall}
                  </Button>
                  <Button
                    spacing="compact"
                    variant="outlined"
                    fullwidth
                    iconBefore={<MdOutlineVideocam />}
                  >
                    {tittleOptions.titleVideoCall}
                  </Button>
                </Stack>
              )}
              {collapse && <Divider />}
              {collapse && (
                <>
                  {isMobile && (
                    <Stack padding="10px 0px" width="100%">
                      <Button
                        type="button"
                        appearance="primary"
                        spacing="compact"
                        fullwidth
                        iconBefore={
                          <Icon
                            icon={<MdOutlineAdd />}
                            appearance="light"
                            size="18px"
                            spacing="narrow"
                          />
                        }
                      >
                        {tittleOptions.titleAddProduct}
                      </Button>
                    </Stack>
                  )}
                </>
              )}
              {collapse && (
                <>
                  {isMobile && (
                    <Stack padding="0px 0px 10px">
                      {prospectProducts?.some(
                        (product) => product.extraordinaryInstallments,
                      ) && (
                        <Button
                          type="button"
                          appearance="primary"
                          spacing="compact"
                          variant="outlined"
                          fullwidth
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
                          {tittleOptions.titleExtraPayments}
                        </Button>
                      )}
                    </Stack>
                  )}
                </>
              )}
              {collapse && (
                <>
                  {isMobile && (
                    <Stack justifyContent="end">
                      <StyledContainerIcon>
                        <Icon
                          icon={<MdOutlinePictureAsPdf />}
                          appearance="primary"
                          size="24px"
                          disabled={isPrint}
                          cursorHover
                          onClick={print}
                        />
                        <Icon
                          icon={<MdOutlineShare />}
                          appearance="primary"
                          size="24px"
                          cursorHover
                          onClick={generateAndSharePdf}
                        />
                        <Icon
                          icon={<MdOutlineMoreVert />}
                          appearance="primary"
                          size="24px"
                          cursorHover
                          onClick={() => setShowMenu(!showMenu)}
                        />
                        {showMenu && (
                          <MenuProspect
                            options={menuOptions(
                              handleOpenModal,
                              !prospectProducts?.some(
                                (product) => product.extraordinaryInstallments,
                              ),
                            )}
                          />
                        )}
                      </StyledContainerIcon>
                    </Stack>
                  )}
                </>
              )}
              {collapse && <Stack>{isMobile && <Divider />}</Stack>}
              {collapse && (
                <CreditProspect
                  key={refreshKey}
                  isMobile={isMobile}
                  prospectData={prospectData}
                  businessManagerCode={businessManagerCode}
                  showPrint
                  showMenu={() => setShowMenu(false)}
                  isPrint={true}
                  sentData={sentData}
                  setSentData={setSentData}
                  setRequestValue={setRequestValue}
                  onProspectUpdate={(prospect) => {
                    setLocalProspectData(prospect);
                    setRefreshKey((prev) => prev + 1);
                  }}
                  showAddButtons={false}
                  showAddProduct={false}
                />
              )}
            </Stack>
            {currentModal === "creditLimit" && (
              <CreditLimitModal
                isMobile={isMobile}
                handleClose={handleCloseModal}
                setRequestValue={() => {}}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                dataMaximumCreditLimitService={dataMaximumCreditLimitService}
              />
            )}
            {/* {currentModal === "IncomeModal" && (
              <IncomeBorrowersModal
                borrowersProspect={borrowersProspect}
                borrowerOptions={borrowerOptions}
                selectedIndex={selectedIndex}
                dataProspect={dataProspect}
                selectedBorrower={selectedBorrower}
                isMobile={isMobile}
                handleCloseModal={handleCloseModal}
                handleChange={handleChangeIncome}
                setOpenModal={setOpenModal}
              />
            )} */}
            {currentModal === "reportCreditsModal" && (
              <ReportCreditsModal
                onChange={onChangesReportCredit}
                debtor={form.borrower}
                handleClose={handleCloseModal}
                prospectData={prospectData ? [prospectData] : undefined}
                options={incomeOptions}
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
            {openModal === "IncomeModalEdit" && (
              <IncomeModal
                handleClose={() => setOpenModal(null)}
                initialValues={
                  selectedBorrower && incomeData[selectedBorrower.borrowerName]
                }
                onSubmit={handleIncomeSubmit}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
              />
            )}
            {currentModal === "disbursementModal" && (
              <DisbursementModal
                isMobile={isMobile}
                handleClose={handleCloseModal}
                loading={loading}
                data={{
                  internal: internal || dataDefault,
                  external: external || dataDefault,
                  CheckEntity: checkEntity || dataDefault,
                  checkManagementData: checkManagement || dataDefault,
                  cash: cash || dataDefault,
                }}
              />
            )}
            {infoModal && (
              <>
                <BaseModal
                  title={titlesModal.title}
                  nextButton={titlesModal.textButtonNext}
                  handleNext={() => setInfoModal(false)}
                  handleClose={() => setInfoModal(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text weight="bold" size="large">
                      {titlesModal.subTitle}
                    </Text>
                    <Text weight="normal" size="medium" appearance="gray">
                      {titlesModal.description}
                    </Text>
                  </Stack>
                </BaseModal>
              </>
            )}
          </StyledFieldset>
        )}
      </Fieldset>
    </>
  );
};
