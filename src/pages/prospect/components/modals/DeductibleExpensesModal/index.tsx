import { SkeletonLine, Stack, Text, Divider } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { EnumType } from "@hooks/useEnum/useEnum";

import { deductibleExpenses } from "./config";
import { StyledContainer } from "./styles";

export interface DeductibleExpensesModalProps {
  initialValues: { expenseName: string; expenseValue: number }[];
  loading: boolean;
  isMobile: boolean;
  lang: EnumType;
  handleClose: () => void;
}

export function DeductibleExpensesModal(props: DeductibleExpensesModalProps) {
  const { handleClose, initialValues, isMobile, loading, lang } = props;

  const calculateTotalExpenses = () => {
    return initialValues.reduce((acc, item) => acc + item.expenseValue, 0);
  };

  const deductibleExpensedAmount = initialValues.length < 5;

  const expenseTranslations: Record<string, string> = {
    "Bond value": deductibleExpenses.BondValue.i18n[lang],
    "Interest for cycle adjustment in disbursement":
      deductibleExpenses.Interest.i18n[lang],
  };

  return (
    <BaseModal
      title={deductibleExpenses.deductibleExpenses.i18n[lang]}
      nextButton={deductibleExpenses.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "540px" : "290px"}
      finalDivider={true}
    >
      <Stack
        direction="column"
        gap={deductibleExpensedAmount ? "10px" : "24px"}
        height="165px"
      >
        {initialValues.length > 0 ? (
          <>
            <Fieldset>
              <StyledContainer>
                <Stack
                  direction="column"
                  padding={deductibleExpensedAmount ? "0px" : "8px"}
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
                  {deductibleExpenses.totalExpenses.i18n[lang]}
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
            <Text>{deductibleExpenses.noData.i18n[lang]}</Text>
          </Stack>
        )}
      </Stack>
    </BaseModal>
  );
}
