import { useState, useEffect } from "react";
import { Stack, Text, Divider } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { CardGray } from "@components/cards/CardGray";
import { CardConsolidatedCredit } from "@pages/SimulateCredit/components/CardConsolidatedCredit";
import { currencyFormat } from "@utils/formatData/currency";
import { mockConsolidatedCredit } from "@mocks/add-prospect/consolidates-credit/consolidatedcredit.mock";

import { dataConsolidated } from "./config";
import { StyledCards } from "./style";

interface IConsolidatedCreditProps {
  initialValues: {
    totalCollected: number;
    selectedValues: Record<string, number>;
    title: string;
    code: string;
    label: string;
    value: number;
  };
  isMobile: boolean;
  onChange?: (
    items: {
      title: string;
      code: string;
      label: string;
      value: number;
    }[],
  ) => void;
}

export function ConsolidatedCredit(props: IConsolidatedCreditProps) {
  const { initialValues, isMobile, onChange } = props;

  const [totalCollected, setTotalCollected] = useState(
    initialValues.totalCollected,
  );

  console.log(totalCollected);

  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>(
    {},
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    initialValues.selectedValues || {},
  );

  const debtorData = mockConsolidatedCredit[0];

  const buildSelectedArray = () => {
    return debtorData.data_card
      .filter(
        (creditData) =>
          selectedValues[creditData.consolidated_credit_id] &&
          selectedLabels[creditData.consolidated_credit_code],
      )
      .map((creditData) => ({
        title: creditData.consolidated_credit_title,
        code: creditData.consolidated_credit_code,
        label: selectedLabels[creditData.consolidated_credit_code],
        value: selectedValues[creditData.consolidated_credit_id],
      }));
  };

  const handleUpdateTotal = (
    oldValue: number,
    newValue: number,
    label?: string,
    code?: string,
    id?: string,
  ) => {
    setTotalCollected((prevTotal) => prevTotal - oldValue + newValue);
    if (label && code && id) {
      setSelectedLabels((prev) => {
        const updated = { ...prev, [code]: label };
        return updated;
      });
      setSelectedValues((prev) => {
        const updated = { ...prev, [id]: newValue };
        return updated;
      });
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(buildSelectedArray());
    }
  }, [selectedLabels, selectedValues]);

  return (
    <Fieldset heightFieldset="100%">
      <Stack direction="column" gap="24px" padding="16px">
        <Stack
          justifyContent="space-between"
          alignItems={isMobile ? "initial" : "end"}
          direction={isMobile ? "column" : "row"}
        >
          {!isMobile && (
            <Stack direction="column">
              <Text type="body" size="small" weight="bold" appearance="gray">
                {dataConsolidated.debtor}
              </Text>
              <Text type="title" size="medium">
                {debtorData.name}
              </Text>
            </Stack>
          )}
          {isMobile && (
            <CardGray
              label={dataConsolidated.debtor}
              placeHolder={debtorData.name}
            />
          )}
          <Stack
            direction="column"
            alignItems="center"
            margin={isMobile ? "10px 0px 0px 0px" : "0px"}
          >
            <Text
              type="headline"
              size="large"
              weight="bold"
              appearance="primary"
            >
              {currencyFormat(totalCollected / 3)}
            </Text>
            <Text type="body" size="small" appearance="gray">
              {dataConsolidated.totalvalue}
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <StyledCards>
          <Stack
            gap="16px"
            wrap="wrap"
            justifyContent={isMobile ? "center" : "initial"}
            margin={isMobile ? "10px 0px" : "10px 5px"}
          >
            {debtorData.data_card.map((creditData) => (
              <CardConsolidatedCredit
                key={creditData.consolidated_credit_id}
                title={creditData.consolidated_credit_title}
                code={creditData.consolidated_credit_code}
                expiredValue={creditData.expired_value}
                nextDueDate={creditData.next_due_date}
                fullPayment={creditData.full_payment}
                date={new Date(creditData.date)}
                onUpdateTotal={(oldValue, newValue, label) =>
                  handleUpdateTotal(
                    oldValue,
                    newValue,
                    label,
                    creditData.consolidated_credit_code,
                    creditData.consolidated_credit_id,
                  )
                }
                arrears={creditData.arrears === "Y"}
                initialValue={
                  initialValues.selectedValues[
                    creditData.consolidated_credit_id
                  ]
                }
                isMobile={isMobile}
              />
            ))}
          </Stack>
        </StyledCards>
      </Stack>
    </Fieldset>
  );
}
