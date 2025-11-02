import { Stack, Textfield, Icon } from "@inubekit/inubekit";
import { MdAttachMoney } from "react-icons/md";

import { IAmountCaptureUI } from "../config";

export function AmountCaptureUI(props: IAmountCaptureUI) {
  const {
    displayValue,
    loanAmountError,
    amountCaptureTexts,
    handleCurrencyChange,
  } = props;

  return (
    <Stack
      direction="column"
      gap="24px"
      padding="0px 16px"
      height="230px"
      width="450px"
    >
      <Textfield
        label={amountCaptureTexts.label}
        name="creditAmount"
        id="creditAmount"
        placeholder={amountCaptureTexts.placeholder}
        value={displayValue}
        status={loanAmountError ? "invalid" : undefined}
        message={loanAmountError}
        iconBefore={
          <Icon
            icon={<MdAttachMoney />}
            appearance="success"
            size="18px"
            spacing="narrow"
          />
        }
        size="compact"
        onChange={handleCurrencyChange}
        fullwidth
        required
      />
    </Stack>
  );
}
