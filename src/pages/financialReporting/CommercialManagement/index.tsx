import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
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
} from "@inubekit/inubekit";
import { MenuProspect } from "@components/navigation/MenuProspect";
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterEachWord,
} from "@utils/formatData/text";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { DisbursementModal } from "@components/modals/DisbursementModal";
import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import {
  IProspect,
  ICreditProduct,
  IProspectSummaryById,
} from "@services/prospect/types";
import { CreditProspect } from "@pages/prospect/components/CreditProspect";
import { AppContext } from "@context/AppContext";
import { dataTabsDisbursement } from "@components/modals/DisbursementModal/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { BaseModal } from "@components/modals/baseModal";
import userNotFound from "@assets/images/ItemNotFound.png";
import { IExtraordinaryInstallments } from "@services/prospect/types";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { CreditLimitModal } from "@pages/prospect/components/modals/CreditLimitModal";
import {
  ICreditRequest,
  IModeOfDisbursement,
  IPaymentChannel,
} from "@services/creditRequest/types";
import { formatPrimaryDate } from "@utils/formatData/date";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { getModeOfDisbursement } from "@services/creditRequest/getModeOfDisbursement";
import { IIncomeSources } from "@services/creditLimit/types";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

import { titlesModal } from "./config/config";
import { errorMessages } from "../config";
import { incomeOptions, menuOptions, tittleOptions } from "./config/config";
import {
  StyledCollapseIcon,
  StyledFieldset,
  StyledContainerIcon,
  StyledVerticalDivider,
  StyledPrint,
} from "./styles";

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
  const isMobile = useMediaQuery("(max-width: 720px)");

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>({} as IProspectSummaryById);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

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
          userAccount,
          { creditRequestCode },
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

  useEffect(() => {
    setDataProspect(prospectData ? [prospectData] : []);
  }, [prospectData]);

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

  return (
    <>
      <Fieldset
        title={errorMessages.comercialManagement.titleCard}
        descriptionTitle={data.stage}
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
                      <TruncatedText
                        text={data.clientName}
                        maxLength={50}
                        type="title"
                        size={!isMobile ? "large" : "medium"}
                        transformFn={capitalizeFirstLetterEachWord}
                      />
                    </Stack>
                  )}
                  <Stack gap={!isMobile ? "4px" : "4px"}>
                    <Text type="title" size="small" appearance="gray">
                      {tittleOptions.titleDestination}
                    </Text>
                    <TruncatedText
                      text={data.moneyDestinationAbreviatedName}
                      maxLength={60}
                      type="title"
                      size="small"
                      transformFn={capitalizeFirstLetter}
                    />
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
                    <TruncatedText
                      text={data.clientName}
                      maxLength={60}
                      type="title"
                      transformFn={capitalizeFirstLetterEachWord}
                    />
                  </Stack>
                )}
                <Stack gap="2px">
                  {!isMobile && (
                    <>
                      <StyledPrint>
                        <Stack gap="16px">
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
                  prospectSummaryData={prospectSummaryData}
                  setProspectSummaryData={setProspectSummaryData}
                  showPrint
                  showMenu={() => setShowMenu(false)}
                  isPrint={true}
                  sentData={sentData}
                  setSentData={setSentData}
                  setRequestValue={setRequestValue}
                  onProspectUpdate={() => {
                    setRefreshKey((prev) => prev + 1);
                  }}
                  showAddButtons={false}
                  showAddProduct={false}
                  userAccount={userAccount}
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
                userAccount={userAccount}
                moneyDestination={prospectData.moneyDestinationAbbreviatedName}
                incomeData={incomeDataValues}
              />
            )}
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
