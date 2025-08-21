import { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
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
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";

import { BaseModal } from "../baseModal";
import { dataTabs, headers, paymentCapacityData } from "./config";
import { StyledTable } from "./styles";
import { CurrentDataRow } from "./types";

interface IPaymentCapacityModalProps {
  isMobile: boolean;
  incomeSources: number;
  subsistenceReserve: number;
  newPromises: number;
  lineOfCredit: number;
  maxValue: number;
  extraordinary: number;
  extraordinaryQuotes?: CurrentDataRow[];
  handleClose: () => void;
}

export function PaymentCapacityModal(props: IPaymentCapacityModalProps) {
  const {
    isMobile,
    incomeSources,
    subsistenceReserve,
    newPromises,
    lineOfCredit,
    maxValue,
    extraordinary,
    extraordinaryQuotes,
    handleClose,
  } = props;

  const tabsToRender = extraordinaryQuotes
    ? dataTabs
    : dataTabs.filter((tab) => tab.id !== "extraordinary");

  const [currentTab, setCurrentTab] = useState("ordinary");

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <BaseModal
      title="Monto máx. según capacidad de pago"
      nextButton="Cerrar"
      variantNext="outlined"
      handleClose={handleClose}
      handleNext={handleClose}
      width={isMobile ? "290px" : "500px"}
    >
      <Fieldset>
        <Stack direction="column" gap="16px" padding="0px 8px">
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
                  <Text type="body" size="small">
                    {currencyFormat(incomeSources, false)}
                  </Text>
                </Stack>
              </Stack>
              <Stack justifyContent="space-between">
                <Text type="body" size="medium" appearance="gray">
                  {paymentCapacityData.subsistenceReserve}
                </Text>
                <Stack alignItems="center" gap="4px">
                  <Text appearance="success">$</Text>
                  <Text type="body" size="small">
                    {currencyFormat(subsistenceReserve, false)}
                  </Text>
                </Stack>
              </Stack>
              <Divider dashed />
              <Stack justifyContent="space-between">
                <Text type="body" size="medium" weight="bold">
                  {paymentCapacityData.newPromises}
                </Text>
                <Stack alignItems="center" gap="4px">
                  <Text appearance="success">$</Text>
                  <Text type="body" size="small">
                    {currencyFormat(newPromises, false)}
                  </Text>
                </Stack>
              </Stack>
              <Stack justifyContent="space-between">
                <Text type="body" size="medium" appearance="gray">
                  {paymentCapacityData.lineOfCredit}
                </Text>
                <Stack alignItems="center" gap="4px">
                  <Text appearance="success">$</Text>
                  <Text type="body" size="small">
                    {currencyFormat(lineOfCredit, false)}
                  </Text>
                </Stack>
              </Stack>
              <Divider dashed />
              <Text type="body" size="small">
                {paymentCapacityData.maxValue}
              </Text>
              <Stack direction="column" alignItems="center">
                <Text
                  type="headline"
                  size="small"
                  weight="bold"
                  appearance="gray"
                >
                  {currencyFormat(maxValue, true)}
                </Text>
                <Text type="body" size="small" appearance="gray">
                  {paymentCapacityData.maxValueDescription}
                </Text>
              </Stack>
            </Stack>
          )}
          {currentTab === "extraordinary" &&
            extraordinaryQuotes !== undefined && (
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
                    {extraordinaryQuotes.map((row, rowIndex) => (
                      <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
                        {headers.map((header, colIndex) => (
                          <Td key={colIndex} align="center">
                            {row[header.key]}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Stack
                  direction="column"
                  alignItems="center"
                  gap="8px"
                  margin="8px 0 0 0"
                >
                  <Text type="body" size="small">
                    {paymentCapacityData.maxValueAmount}
                  </Text>
                  <Stack direction="column" alignItems="center">
                    <Stack alignItems="center" gap="4px">
                      <Text
                        type="headline"
                        size="small"
                        weight="bold"
                        appearance="gray"
                      >
                        {currencyFormat(maxValue, true)}
                      </Text>
                      <Icon
                        appearance="primary"
                        icon={<MdInfoOutline />}
                        size="14px"
                        spacing="narrow"
                      />
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
            <Text
              type="headline"
              size="large"
              weight="bold"
              appearance="primary"
            >
              {currencyFormat(extraordinary, true)}
            </Text>
            <Text type="body" size="small" appearance="gray">
              {paymentCapacityData.maxTotal}
            </Text>
          </Stack>
        </Stack>
      </Fieldset>
    </BaseModal>
  );
}
