import { useEffect, useMemo, useState } from "react";
import {
  MdErrorOutline,
  MdInfoOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import {
  Divider,
  Icon,
  Stack,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  SkeletonLine,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import { IMaximumCreditLimit } from "@services/creditRequest/types";
import { postBusinessUnitRules } from "@services/creditLimit/getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/components/CreditLimitCard/types";
import { CardGray } from "@components/cards/CardGray";
import { IExtraordinaryInstallments } from "@services/creditRequest/types";
import { ISourcesOfIncomeState } from "@pages/simulateCredit/types";
import { formatPrimaryDate } from "@utils/formatData/date";
import { EnumType } from "@hooks/useEnum/useEnum";
import { useToken } from "@hooks/useToken";

import { BaseModal } from "../baseModal";
import {
  dataTabs,
  getMaxValueText,
  headers,
  paymentCapacityData,
  detailsExtraordinaryInstallments,
} from "./config";
import { StyledTable } from "./styles";

interface IPaymentCapacityModalProps {
  isMobile: boolean;
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  userAccount: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
  incomeData: ISourcesOfIncomeState;
  lang: EnumType;
}

export function PaymentCapacityModal(props: IPaymentCapacityModalProps) {
  const {
    isMobile,
    dataMaximumCreditLimitService,
    handleClose,
    setError,
    setLoading,
    loading,
    error,
    incomeData,
    businessUnitPublicCode,
    businessManagerCode,
    userAccount,
    lang,
  } = props;
  const { getAuthorizationToken } = useToken();

  const [currentTab, setCurrentTab] = useState("ordinary");
  const [selectedDetail, setSelectedDetail] =
    useState<IExtraordinaryInstallments | null>(null);
  const [maximumCreditLimitData, setMaximumCreditLimitData] =
    useState<IMaximumCreditLimit | null>(null);

  const tabsToRender = useMemo(() => {
    const hasExtraordinary =
      maximumCreditLimitData?.extraordinaryInstallments &&
      maximumCreditLimitData.extraordinaryInstallments.length > 0;

    const filteredTabs = hasExtraordinary
      ? dataTabs
      : dataTabs.filter((tab) => tab.id !== "extraordinary");

    return filteredTabs.map((tab) => ({
      ...tab,
      label: tab.label.i18n[lang],
    }));
  }, [maximumCreditLimitData, lang]);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  useEffect(() => {
    const fetchMaximumCreditLimit = async () => {
      setLoading(true);
      setError(false);

      try {
        const submitData: IMaximumCreditLimit = {
          customerCode:
            dataMaximumCreditLimitService.identificationDocumentNumber,
          dividends: incomeData.Dividends || 0,
          financialIncome: incomeData.FinancialIncome || 0,
          leases: incomeData.Leases || 0,
          lineOfCreditAbbreviatedName:
            dataMaximumCreditLimitService.lineOfCreditAbbreviatedName || "",
          moneyDestination: dataMaximumCreditLimitService.moneyDestination,
          otherNonSalaryEmoluments: incomeData.OtherNonSalaryEmoluments || 0,
          pensionAllowances: incomeData.PensionAllowances || 0,
          periodicSalary: incomeData.PeriodicSalary || 0,
          personalBusinessUtilities: incomeData.PersonalBusinessUtilities || 0,
          professionalFees: incomeData.ProfessionalFees || 0,
        };

        const authorizationToken = await getAuthorizationToken();

        const data = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          submitData,
          authorizationToken,
        );

        if (data) {
          setMaximumCreditLimitData(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMaximumCreditLimit();
  }, [businessUnitPublicCode, businessManagerCode, userAccount]);

  const totalExtraordinary =
    (maximumCreditLimitData?.maximumCreditLimitValue || 0) +
    (maximumCreditLimitData?.extraordinaryInstallments?.reduce(
      (sum, quote) => sum + (Number(quote.installmentAmount) || 0),
      0,
    ) || 0);

  const handleOpenDetail = (row: IExtraordinaryInstallments | null) => {
    setSelectedDetail(row);
  };

  const handleCloseDetail = () => {
    setSelectedDetail(null);
  };

  return (
    <>
      <BaseModal
        title="Monto máx. según capacidad de pago"
        nextButton="Cerrar"
        variantNext="outlined"
        handleClose={handleClose}
        handleNext={handleClose}
        width={isMobile ? "335px" : "500px"}
        height={isMobile ? "734px" : "692px"}
      >
        {error ? (
          <Fieldset>
            <Stack
              direction="column"
              alignItems="center"
              gap="16px"
              padding="24px 8px"
            >
              <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
              <Text size="large" weight="bold" appearance="danger">
                {paymentCapacityData.errorDate.i18n[lang]}
              </Text>
              <Text size="small" appearance="dark" textAlign="center">
                {paymentCapacityData.errorNoData.i18n[lang]}
              </Text>
            </Stack>
          </Fieldset>
        ) : (
          <Stack
            direction="column"
            height={isMobile ? "566px" : "530px"}
            width="auto"
          >
            <Fieldset>
              <Stack
                direction="column"
                gap="16px"
                padding={isMobile ? "0 3px" : "0 8px"}
                height={isMobile ? "378px" : "350px"}
              >
                <Stack width="100%" padding="0">
                  <Tabs
                    selectedTab={currentTab}
                    tabs={tabsToRender}
                    onChange={onChange}
                    scroll={isMobile}
                  />
                </Stack>
                {currentTab === "ordinary" && (
                  <Stack direction="column" gap="16px">
                    <Stack justifyContent="space-between">
                      <Text type="body" size="medium" weight="bold">
                        {paymentCapacityData.incomeSources.i18n[lang]}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="small">
                            {currencyFormat(
                              maximumCreditLimitData?.maximumCreditLimitValue ||
                                0,
                              false,
                            )}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    <Stack justifyContent="space-between">
                      <Text type="body" size="medium" appearance="gray">
                        {paymentCapacityData.subsistenceReserve.i18n[lang]}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="small">
                            {currencyFormat(
                              maximumCreditLimitData?.basicLivingExpenseReserve ||
                                0,
                              false,
                            )}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    <Divider dashed />
                    <Stack justifyContent="space-between">
                      <Text type="body" size="medium" weight="bold">
                        {paymentCapacityData.newPromises.i18n[lang]}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="small">
                            {currencyFormat(
                              maximumCreditLimitData?.maxAmount || 0,
                              false,
                            )}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    <Stack justifyContent="space-between">
                      <Text type="body" size="medium" appearance="gray">
                        {paymentCapacityData.getLineOfCredit(
                          maximumCreditLimitData?.lineOfCreditAbbreviatedName ||
                            "",
                        )}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="small">
                            {maximumCreditLimitData?.maxTerm}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    <Divider dashed />
                    <Text type="body" size="small">
                      {getMaxValueText(
                        maximumCreditLimitData?.maxAmount || 0,
                        maximumCreditLimitData?.maxTerm || 0,
                      )}
                    </Text>
                    <Stack
                      direction="column"
                      alignItems="center"
                      margin="0 0 8px 0"
                    >
                      {loading ? (
                        <SkeletonLine
                          width="250px"
                          height="50px"
                          animated={true}
                        />
                      ) : (
                        <>
                          <Text
                            type="headline"
                            size="small"
                            weight="bold"
                            appearance="gray"
                          >
                            {currencyFormat(
                              maximumCreditLimitData?.maximumCreditLimitValue ||
                                0,
                              true,
                            )}
                          </Text>
                          <Text type="body" size="small" appearance="gray">
                            {paymentCapacityData.maxValueDescription.i18n[lang]}
                          </Text>
                        </>
                      )}
                    </Stack>
                  </Stack>
                )}
                {currentTab === "extraordinary" &&
                  maximumCreditLimitData?.extraordinaryInstallments !==
                    undefined && (
                    <StyledTable>
                      <Table tableLayout="auto">
                        <Thead>
                          <Tr>
                            {headers
                              .filter((header) =>
                                isMobile
                                  ? header.mobile
                                  : header.key !== "details",
                              )
                              .map((header) => (
                                <Th key={header.key} align="center">
                                  {header.label.i18n[lang]}
                                </Th>
                              ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading && (
                            <Tr>
                              <Td colSpan={isMobile ? 2 : 3} align="center">
                                <SkeletonLine width="100%" animated={true} />
                              </Td>
                            </Tr>
                          )}
                          {!loading &&
                          maximumCreditLimitData?.extraordinaryInstallments &&
                          maximumCreditLimitData.extraordinaryInstallments
                            .length > 0 ? (
                            maximumCreditLimitData.extraordinaryInstallments.map(
                              (row, rowIndex) => (
                                <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
                                  <Td align="center">
                                    {row.paymentChannelAbbreviatedName}
                                  </Td>
                                  {!isMobile && (
                                    <>
                                      <Td align="center">
                                        {currencyFormat(
                                          Number(row.installmentAmount) || 0,
                                          true,
                                        )}
                                      </Td>
                                      <Td align="center">
                                        {formatPrimaryDate(
                                          new Date(row.installmentDate),
                                        )}
                                      </Td>
                                    </>
                                  )}
                                  {isMobile && (
                                    <Td align="center">
                                      <Icon
                                        appearance="primary"
                                        icon={<MdOutlineRemoveRedEye />}
                                        size="24px"
                                        cursorHover
                                        onClick={() => handleOpenDetail(row)}
                                      />
                                    </Td>
                                  )}
                                </Tr>
                              ),
                            )
                          ) : (
                            <Tr>
                              <Td colSpan={isMobile ? 2 : 3} align="center">
                                <Text
                                  type="body"
                                  size="small"
                                  appearance="gray"
                                >
                                  {
                                    paymentCapacityData.noExtraordinary.i18n[
                                      lang
                                    ]
                                  }
                                </Text>
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </StyledTable>
                  )}
              </Stack>
            </Fieldset>
            <Fieldset>
              <Stack direction="column" gap="6px" padding="0px 8px">
                <Stack alignItems="center">
                  <Icon
                    appearance="help"
                    icon={<MdInfoOutline />}
                    size="16px"
                    spacing="narrow"
                  />
                  <Text margin="0px 5px" size="small">
                    {paymentCapacityData.maxAmountExtraordinary.i18n[lang]}
                  </Text>
                </Stack>
                <Stack direction="column" alignItems="center" gap="4px">
                  {loading ? (
                    <SkeletonLine width="250px" height="50px" animated={true} />
                  ) : (
                    <>
                      <Text
                        type="headline"
                        size="large"
                        weight="bold"
                        appearance="primary"
                      >
                        {currencyFormat(totalExtraordinary, true)}
                      </Text>
                      <Text type="body" size="small" appearance="gray">
                        {paymentCapacityData.maxTotal.i18n[lang]}
                      </Text>
                    </>
                  )}
                </Stack>
              </Stack>
            </Fieldset>
          </Stack>
        )}
      </BaseModal>

      {selectedDetail && (
        <BaseModal
          title={detailsExtraordinaryInstallments.title}
          nextButton={detailsExtraordinaryInstallments.close}
          handleNext={handleCloseDetail}
          handleClose={handleCloseDetail}
          width="335px"
          height="278px"
        >
          <Stack direction="column" gap="16px">
            <CardGray
              label={detailsExtraordinaryInstallments.date}
              placeHolder={currencyFormat(
                Number(selectedDetail.installmentAmount) || 0,
                true,
              )}
              height="52px"
            />
            <CardGray
              label={detailsExtraordinaryInstallments.value}
              placeHolder={formatPrimaryDate(
                new Date(selectedDetail.installmentDate),
              )}
              height="52px"
            />
          </Stack>
        </BaseModal>
      )}
    </>
  );
}
