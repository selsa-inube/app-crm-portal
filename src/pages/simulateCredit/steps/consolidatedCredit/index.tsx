import { useState, useEffect } from "react";
import { Stack, Text, Divider, Grid } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { CardGray } from "@components/cards/CardGray";
import { CardConsolidatedCredit } from "@pages/simulateCredit/components/CardConsolidatedCredit";
import { currencyFormat } from "@utils/formatData/currency";
import {
  IPayment,
  paymentOptionValues,
} from "@services/creditLimit/getCreditPayments/types";

import { dataConsolidated } from "./config";
import { StyledCards } from "./style";

interface IConsolidatedCreditProps {
  initialValues: {
    totalCollected: number;
    selectedValues: Record<string, number>;
    selectedLabels: Record<string, string>;
  };
  isMobile: boolean;
  onChange?: (
    items: {
      borrowerIdentificationNumber: string;
      borrowerIdentificationType: string;
      consolidatedAmount: number;
      consolidatedAmountType: string;
      creditProductCode: string;
      estimatedDateOfConsolidation: string;
      lineOfCreditDescription: string;
    }[],
  ) => void;
  data?: IPayment[];
}

export function ConsolidatedCredit(props: IConsolidatedCreditProps) {
  const { initialValues, isMobile, onChange, data } = props;

  const [totalCollected, setTotalCollected] = useState(
    initialValues.totalCollected,
  );

  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>(
    {},
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    initialValues.selectedValues || {},
  );

  const consolidatedCredit = data;

  const buildSelectedArray = () => {
    return (consolidatedCredit ?? [])
      .filter(
        (creditData) =>
          selectedValues[creditData.id] && selectedLabels[creditData.id],
      )
      .map((creditData) => {
        const selectedValue = selectedValues[creditData.id];
        const selectedLabel = selectedLabels[creditData.id];
        const estimatedDate =
          creditData.options.find((opt) => opt.date)?.date?.toISOString() ??
          new Date().toISOString();

        return {
          borrowerIdentificationNumber: "debtorData?.identificationNumber",
          borrowerIdentificationType: "debtorData?.identificationType",
          consolidatedAmount: selectedValue,
          consolidatedAmountType: selectedLabel,
          creditProductCode: creditData.id,
          estimatedDateOfConsolidation: estimatedDate,
          lineOfCreditDescription: creditData.title,
        };
      });
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
      setSelectedLabels((prev) => ({ ...prev, [code]: label }));
      setSelectedValues((prev) => ({ ...prev, [id]: newValue }));
    }

    if (!label && code && id) {
      setSelectedLabels((prev) => {
        const updated = { ...prev };
        delete updated[code];
        return updated;
      });
      setSelectedValues((prev) => {
        const updated = { ...prev };
        delete updated[id];
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
          direction="column"
          alignItems="flex-end"
          margin={isMobile ? "10px 0px 0px 0px" : "0px"}
        >
          <Text type="headline" size="large" weight="bold" appearance="primary">
            {currencyFormat(totalCollected)}
          </Text>
          <Text type="body" size="small" appearance="gray">
            {dataConsolidated.totalvalue}
          </Text>
        </Stack>
        <Divider />
        <StyledCards>
          <Stack
            gap="16px"
            justifyContent={isMobile ? "center" : "initial"}
            margin={isMobile ? "10px 0px" : "10px 5px"}
            direction="column"
            height="450px"
          >
            <Grid
              templateColumns={`repeat(3, minmax(262px, 1fr))`}
              gap={isMobile ? "16px" : "24px"}
              autoRows="auto"
            >
              {data?.map((creditData) => (
                <CardConsolidatedCredit
                  key={creditData.id}
                  title={creditData.title}
                  code={creditData.id}
                  expiredValue={
                    creditData.options.find(
                      (option) =>
                        option.label === paymentOptionValues.EXPIREDVALUE,
                    )?.value ?? 0
                  }
                  nextDueDate={
                    creditData.options.find(
                      (option) =>
                        option.label === paymentOptionValues.NEXTVALUE,
                    )?.value ?? 0
                  }
                  fullPayment={
                    creditData.options.find(
                      (option) =>
                        option.label === paymentOptionValues.TOTALVALUE,
                    )?.value ?? 0
                  }
                  description={
                    creditData.options.find(
                      (option) =>
                        option.description === paymentOptionValues.INMEDIATE,
                    )?.description ?? ""
                  }
                  date={
                    creditData.options.find((option) => option.date)?.date ??
                    new Date()
                  }
                  onUpdateTotal={(oldValue, newValue, label) =>
                    handleUpdateTotal(
                      oldValue,
                      newValue,
                      label,
                      creditData.id,
                      creditData.id,
                    )
                  }
                  tags={creditData.tags}
                  initialValue={initialValues.selectedValues[creditData.id]}
                  isMobile={isMobile}
                  allowCustomValue={creditData.allowCustomValue}
                />
              ))}
            </Grid>
          </Stack>
        </StyledCards>
      </Stack>
    </Fieldset>
  );
}
