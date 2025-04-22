import { SkeletonLine, useMediaQuery } from "@inubekit/inubekit";
import { Stack } from "@inubekit/stack";
import { Text } from "@inubekit/text";

import { currencyFormat } from "@utils/formatData/currency";
import { mockDeductibleExpenses } from "@mocks/add-prospect/deductible-expenses-modal/deductibleexpenses.mock";

import { ScrollableContainer } from "./styles";
import { deductibleexpenses } from "./config";
import { BaseModal } from "@components/modals/baseModal";

export interface DeductibleExpensesModalProps {
  handleClose: () => void;
  loading?: boolean;
}

export function DeductibleExpensesModal(props: DeductibleExpensesModalProps) {
  const { handleClose, loading = false } = props;

  const calculateTotalExpenses = () => {
    return mockDeductibleExpenses.reduce((acc, item) => acc + item.value, 0);
  };

  const isMobile = useMediaQuery("(max-width:880px)");

  const lenght = mockDeductibleExpenses.length < 5;

  return (
    <BaseModal
      title={deductibleexpenses.deductibleExpenses}
      nextButton={deductibleexpenses.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "540px" : "290px"}
      finalDivider={true}
    >
      <Stack direction="column" gap={lenght ? "10px" : "24px"} height="186px">
        <ScrollableContainer $length={lenght}>
          <Stack direction="column" padding={lenght ? "0px" : "8px"} gap="10px">
            {mockDeductibleExpenses.map((item, index) => (
              <Stack key={index} justifyContent="space-between">
                {loading ? (
                  <SkeletonLine width="50%" animated={true} />
                ) : (
                  <Text type="label" weight="bold" size="large">
                    {item.type}
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
                    <Text type="body" size="medium">
                      {currencyFormat(item.value, false)}
                    </Text>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </ScrollableContainer>
        <Stack direction="column" justifyContent="space-between" gap="12px">
          <Stack justifyContent="space-between">
            <Text type="label" weight="bold" size="large">
              {deductibleexpenses.totalExpenses}
            </Text>
            <Stack>
              <Text type="body" weight="bold" size="small" appearance="success">
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
      </Stack>
    </BaseModal>
  );
}
