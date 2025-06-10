import { SkeletonLine, Stack, Text, Divider } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";

import { deductibleexpenses } from "./config";
import { StyledContainer } from "./styles";

export interface DeductibleExpensesModalProps {
  initialValues: { expenseName: string; expenseValue: number }[];
  loading: boolean;
  isMobile: boolean;
  handleClose: () => void;
}

export function DeductibleExpensesModal(props: DeductibleExpensesModalProps) {
  const { handleClose, initialValues, isMobile, loading } = props;

  const calculateTotalExpenses = () => {
    return initialValues.reduce((acc, item) => acc + item.expenseValue, 0);
  };

  const lenght = initialValues.length < 5;

  const expenseTranslations: Record<string, string> = {
    "Bond value": deductibleexpenses.BondValue,
    "Interest for cycle adjustment in disbursement":
      deductibleexpenses.Interest,
  };

  return (
    <BaseModal
      title={deductibleexpenses.deductibleExpenses}
      nextButton={deductibleexpenses.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "540px" : "290px"}
      finalDivider={true}
    >
      <Stack direction="column" gap={lenght ? "10px" : "24px"} height="165px">
        {initialValues.length > 0 ? (
          <>
            <Fieldset>
              <StyledContainer>
                <Stack
                  direction="column"
                  padding={lenght ? "0px" : "8px"}
                  gap="10px"
                >
                  {initialValues.map((item, index) => (
                    <Stack key={index} justifyContent="space-between">
                      {loading ? (
                        <SkeletonLine width="50%" animated={true} />
                      ) : (
                        <Text type="label" size="medium" appearance="gray">
                          {expenseTranslations[item.expenseName] ||
                            item.expenseName}
                        </Text>
                      )}
                      {loading ? (
                        <SkeletonLine width="30%" animated={true} />
                      ) : (
                        <Stack alignItems="center">
                          <Text
                            type="body"
                            weight="bold"
                            size="small"
                            appearance="success"
                          >
                            $
                          </Text>
                          <Text type="label" size="medium">
                            {currencyFormat(item.expenseValue, false)}
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </StyledContainer>
            </Fieldset>
            <Divider dashed />
            <Stack direction="column" justifyContent="space-between" gap="12px">
              <Stack justifyContent="space-between">
                <Text type="body" weight="bold" size="medium">
                  {deductibleexpenses.totalExpenses}
                </Text>
                <Stack alignItems="center">
                  <Text
                    type="body"
                    weight="bold"
                    size="small"
                    appearance="success"
                  >
                    $
                  </Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text type="body" weight="bold" size="medium">
                      {currencyFormat(calculateTotalExpenses(), false)}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </>
        ) : (
          <Stack margin="auto">
            <Text>{deductibleexpenses.noData}</Text>
          </Stack>
        )}
      </Stack>
    </BaseModal>
  );
}
