import { MdOutlineVisibility, MdInfoOutline } from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  SkeletonLine,
  useMediaQuery,
  Divider,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";

import { creditLimitTexts } from "./creditLimitConfig";
import { StyledList } from "./styles";

export interface ICreditLimitProps {
  title: string;
  maxPaymentCapacity: number;
  maxReciprocity: number;
  maxDebtFRC: number;
  assignedLimit: number;
  currentPortfolio: number;
  maxUsableLimit: number;
  availableLimitWithoutGuarantee: number;
  loading?: boolean;
  handleClose: () => void;
  onOpenMaxLimitModal?: () => void;
  onOpenPaymentCapacityModal?: () => void;
  onOpenReciprocityModal?: () => void;
  onOpenFrcModal?: () => void;
}

export const CreditLimit = (props: ICreditLimitProps) => {
  const {
    title,
    loading,
    maxPaymentCapacity,
    maxReciprocity,
    maxDebtFRC,
    assignedLimit,
    maxUsableLimit,
    availableLimitWithoutGuarantee,
    handleClose,
    onOpenMaxLimitModal,
    onOpenPaymentCapacityModal,
    onOpenReciprocityModal,
    onOpenFrcModal,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <BaseModal
      title={title}
      nextButton={creditLimitTexts.close}
      handleNext={handleClose}
      width={isMobile ? "280px" : "550px"}
      height={isMobile ? "auto" : "497px"}
      handleBack={handleClose}
      finalDivider={true}
    >
      <Stack direction="column" gap="24px">
        <StyledList>
          <Stack direction="column" gap="12px">
            <li>
              <Stack justifyContent="space-between">
                <Text appearance="dark" size="large" weight="bold" type="label">
                  {creditLimitTexts.maxPaymentCapacity}
                </Text>

                <Stack alignItems="center">
                  <Text appearance="success">$</Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text type="body" size="medium" appearance="dark">
                      {currencyFormat(maxPaymentCapacity, false)}
                    </Text>
                  )}
                  <Stack margin="0px 0px 0px 5px">
                    <Icon
                      appearance="primary"
                      icon={<MdOutlineVisibility />}
                      size="16px"
                      spacing="narrow"
                      cursorHover={true}
                      variant="filled"
                      shape="circle"
                      onClick={onOpenMaxLimitModal}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </li>
            <li>
              <Stack justifyContent="space-between">
                <Text appearance="dark" size="large" weight="bold" type="label">
                  {creditLimitTexts.maxReciprocity}
                </Text>
                <Stack alignItems="center">
                  <Text appearance="success">$</Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text type="body" size="medium" appearance="dark">
                      {currencyFormat(maxReciprocity, false)}
                    </Text>
                  )}
                  <Stack margin="0px 0px 0px 5px">
                    <Icon
                      appearance="primary"
                      icon={<MdOutlineVisibility />}
                      size="16px"
                      spacing="narrow"
                      cursorHover={true}
                      variant="filled"
                      shape="circle"
                      onClick={onOpenReciprocityModal}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </li>
            <li>
              <Stack justifyContent="space-between">
                <Text appearance="dark" size="large" weight="bold" type="label">
                  {creditLimitTexts.maxDebtFRC}
                </Text>
                <Stack alignItems="center">
                  <Text appearance="success">$</Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text type="body" size="medium" appearance="dark">
                      {currencyFormat(maxDebtFRC, false)}
                    </Text>
                  )}
                  <Stack margin="0px 0px 0px 5px">
                    <Icon
                      appearance="primary"
                      icon={<MdOutlineVisibility />}
                      size="16px"
                      spacing="narrow"
                      cursorHover
                      variant="filled"
                      shape="circle"
                      onClick={onOpenPaymentCapacityModal}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </li>
            <li>
              <Stack justifyContent="space-between">
                <Text appearance="dark" size="large" weight="bold" type="label">
                  {creditLimitTexts.maxIndebtedness}
                </Text>
                <Stack alignItems="center">
                  <Text appearance="success">$</Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text type="body" size="medium" appearance="dark">
                      {currencyFormat(maxUsableLimit, false)}
                    </Text>
                  )}
                  <Stack margin="0px 0px 0px 5px">
                    <Icon
                      appearance="primary"
                      icon={<MdOutlineVisibility />}
                      size="16px"
                      spacing="narrow"
                      cursorHover
                      variant="filled"
                      shape="circle"
                      onClick={onOpenFrcModal}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </li>
            <li>
              <Stack justifyContent="space-between">
                <Text appearance="dark" size="large" weight="bold" type="label">
                  {creditLimitTexts.assignedLimit}
                </Text>
                <Stack alignItems="center" gap="4px">
                  <Text appearance="success">$</Text>
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text
                      weight="bold"
                      type="body"
                      size="medium"
                      appearance="dark"
                    >
                      {currencyFormat(assignedLimit, false)}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </li>
          </Stack>
        </StyledList>
        <Divider />
        <Stack alignItems="center">
          <Icon
            appearance="help"
            icon={<MdInfoOutline />}
            size="16px"
            spacing="narrow"
          />
          <Text margin="0px 5px" size="small">
            {creditLimitTexts.maxUsableQuote}
          </Text>
        </Stack>
        <Stack direction="column" alignItems="center">
          <Text type="headline" size="large" weight="bold" appearance="primary">
            {currencyFormat(availableLimitWithoutGuarantee, true)}
          </Text>
          <Text type="body" size="small">
            Monto máximo utilizable
          </Text>
        </Stack>
      </Stack>
    </BaseModal>
  );
};
