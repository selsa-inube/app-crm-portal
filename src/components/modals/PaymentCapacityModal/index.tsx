import { useEffect, useState } from "react";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
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

import { BaseModal } from "../baseModal";
import {
  dataTabs,
  getMaxValueText,
  headers,
  paymentCapacityData,
} from "./config";
import { StyledTable } from "./styles";

interface IPaymentCapacityModalProps {
  isMobile: boolean;
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  userAccount: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  dividends?: number;
  financialIncome?: number;
  leases?: number;
  otherNonSalaryEmoluments?: number;
  pensionAllowances?: number;
  periodicSalary?: number;
  personalBusinessUtilities?: number;
  professionalFees?: number;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
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
    businessUnitPublicCode,
    businessManagerCode,
    userAccount,
    dividends,
    financialIncome,
    leases,
    otherNonSalaryEmoluments,
    pensionAllowances,
    periodicSalary,
    personalBusinessUtilities,
    professionalFees,
  } = props;

  const [currentTab, setCurrentTab] = useState("ordinary");
  const [maximumCreditLimitData, setMaximumCreditLimitData] =
    useState<IMaximumCreditLimit | null>(null);

  const tabsToRender = dataTabs.filter((tab) => tab.id !== "extraordinary");

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
          dividends: dividends || 0,
          financialIncome: financialIncome || 0,
          leases: leases || 0,
          lineOfCreditAbbreviatedName:
            dataMaximumCreditLimitService.lineOfCreditAbbreviatedName || "",
          moneyDestination: dataMaximumCreditLimitService.moneyDestination,
          otherNonSalaryEmoluments: otherNonSalaryEmoluments || 0,
          pensionAllowances: pensionAllowances || 0,
          periodicSalary: periodicSalary || 0,
          personalBusinessUtilities: personalBusinessUtilities || 0,
          professionalFees: professionalFees || 0,
        };

        const data = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          userAccount,
          submitData,
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

  const maximumTotalAmount =
    (maximumCreditLimitData?.maximumCreditLimitValue || 0) +
    (maximumCreditLimitData?.extraordinaryInstallments?.reduce(
      (sum, installment) => sum + (Number(installment.installmentAmount) || 0),
      0,
    ) || 0);

  return (
    <BaseModal
      title="Monto máx. según capacidad de pago"
      nextButton="Cerrar"
      variantNext="outlined"
      handleClose={handleClose}
      handleNext={handleClose}
      width={isMobile ? "290px" : "500px"}
      height="692px"
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
              {paymentCapacityData.errorDate}
            </Text>
            <Text size="small" appearance="dark" textAlign="center">
              {paymentCapacityData.errorNoData}
            </Text>
          </Stack>
        </Fieldset>
      ) : (
        <Stack direction="column" height="530px">
          <Fieldset>
            <Stack
              direction="column"
              gap="16px"
              padding="0px 8px"
              height="350px"
            >
              <Tabs
                selectedTab={currentTab}
                tabs={tabsToRender}
                onChange={onChange}
              />
              {currentTab === "ordinary" && (
                <Stack direction="column" gap="16px">
                  <Stack justifyContent="space-between">
                    <Text type="body" size="medium" weight="bold">
                      {paymentCapacityData.incomeSources}
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
                      {paymentCapacityData.subsistenceReserve}
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
                      {paymentCapacityData.newPromises}
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
                      {paymentCapacityData.lineOfCredit}
                    </Text>
                    <Stack alignItems="center" gap="4px">
                      <Text appearance="success">$</Text>
                      {loading ? (
                        <SkeletonLine width="70px" animated={true} />
                      ) : (
                        <Text type="body" size="small">
                          {currencyFormat(
                            maximumCreditLimitData?.maxTerm || 0,
                            false,
                          )}
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
                  <Stack direction="column" alignItems="center">
                    {loading ? (
                      <SkeletonLine width="150px" animated={true} />
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
                          {paymentCapacityData.maxValueDescription}
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
                          {headers.map((header) => (
                            <Th key={header.key} align="center">
                              {header.label}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {loading ? (
                          <Tr>
                            <Td colSpan={headers.length} align="center">
                              <SkeletonLine width="100%" animated={true} />
                            </Td>
                          </Tr>
                        ) : maximumCreditLimitData?.extraordinaryInstallments &&
                          maximumCreditLimitData.extraordinaryInstallments
                            .length > 0 ? (
                          maximumCreditLimitData.extraordinaryInstallments.map(
                            (row, rowIndex) => (
                              <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
                                <Td align="center">
                                  {row.paymentChannelAbbreviatedName}
                                </Td>
                                <Td align="center">
                                  {currencyFormat(
                                    Number(row.installmentAmount) || 0,
                                    true,
                                  )}
                                </Td>
                                <Td align="center">{row.installmentDate}</Td>
                              </Tr>
                            ),
                          )
                        ) : (
                          <Tr>
                            <Td colSpan={headers.length} align="center">
                              <Text type="body" size="small" appearance="gray">
                                {paymentCapacityData.noExtraordinary}
                              </Text>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <Stack direction="column" gap="8px" margin="8px 0 0 0">
                      <Text type="body" size="small">
                        {paymentCapacityData.maxValueAmount}
                      </Text>
                      <Stack direction="column" alignItems="center">
                        <Stack alignItems="center" gap="4px">
                          {loading ? (
                            <SkeletonLine width="150px" animated={true} />
                          ) : (
                            <>
                              <Text
                                type="headline"
                                size="small"
                                weight="bold"
                                appearance="gray"
                              >
                                {currencyFormat(maximumTotalAmount, true)}
                              </Text>
                              <Icon
                                appearance="primary"
                                icon={<MdInfoOutline />}
                                size="14px"
                                spacing="narrow"
                              />
                            </>
                          )}
                        </Stack>
                        <Text type="body" size="small" appearance="gray">
                          {paymentCapacityData.maxAmountOridinary}
                        </Text>
                      </Stack>
                    </Stack>
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
                  {paymentCapacityData.maxAmountExtraordinary}
                </Text>
              </Stack>
              <Stack direction="column" alignItems="center" gap="4px">
                {loading ? (
                  <SkeletonLine width="150px" animated={true} />
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
                      {paymentCapacityData.maxTotal}
                    </Text>
                  </>
                )}
              </Stack>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </BaseModal>
  );
}
