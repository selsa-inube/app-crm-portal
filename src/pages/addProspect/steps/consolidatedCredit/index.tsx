import { useState } from "react";
import { Stack, Text, Divider } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { CardGray } from "@components/cards/CardGray";
import { CardConsolidatedCredit } from "@pages/addProspect/components/CardConsolidatedCredit";
import { currencyFormat } from "@utils/formatData/currency";
import { mockConsolidatedCredit } from "@mocks/add-prospect/consolidates-credit/consolidatedcredit.mock";

import { dataConsolidated } from "./config";
import { StyledCards } from "./style";

interface IConsolidatedCreditProps {
  initialValues: {
    totalCollected: number;
    selectedValues: Record<string, number>;
  };
  isMobile: boolean;
  handleOnChange: (
    creditId: string,
    oldValue: number,
    newValue: number,
  ) => void;
}

export function ConsolidatedCredit(props: IConsolidatedCreditProps) {
  const { initialValues, isMobile, handleOnChange } = props;

  const [totalCollected, setTotalCollected] = useState(
    initialValues.totalCollected,
  );

  const handleUpdateTotal = (
    creditId: string,
    oldValue: number,
    newValue: number,
  ) => {
    setTotalCollected((prevTotal) => prevTotal - oldValue + newValue);
    handleOnChange(creditId, oldValue, newValue);
  };

  const debtorData = mockConsolidatedCredit[0];

  return (
    <Fieldset heightFieldset="100%">
      <Stack direction="column" gap="24px">
        <Text type="body" size="medium">
          {dataConsolidated.select}
        </Text>
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
              {currencyFormat(totalCollected)}
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
                onUpdateTotal={(oldValue, newValue) =>
                  handleUpdateTotal(
                    creditData.consolidated_credit_id,
                    oldValue,
                    newValue,
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
