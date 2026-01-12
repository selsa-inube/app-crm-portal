import { useState } from "react";
import { createPortal } from "react-dom";
import { MdOutlineClose } from "react-icons/md";
import {
  Blanket,
  Button,
  Divider,
  Icon,
  Message,
  Moneyfield,
  Stack,
  Text,
  useMediaQuery,
} from "@inubekit/inubekit";

import { IPaymentOption } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import {
  currencyFormat,
  parseCurrencyString,
} from "@utils/formatData/currency";
import { validationMessages } from "@validations/validationMessages";
import { EnumType } from "@hooks/useEnum/useEnum";

import {
  StyledApplyPayContainer,
  StyledApplyPayOption,
  StyledInputRadio,
  StyledModal,
} from "./styles";
import { IApplyPayOption, getOptions } from "./utils";
import { options } from "./config";

interface CustomValueModalProps {
  portalId: string;
  value: number;
  id: string;
  lineCode: string;
  nextPaymentValue: number;
  totalPaymentValue: number;
  expiredValue: number;
  lang: EnumType;
  onCloseModal: () => void;
  onChangeOtherValue: (option: IPaymentOption) => void;
  nextPaymentDate?: Date;
  onApplyPayOption?: (applyPayOption: IApplyPayOption, value: number) => void;
}

const DECISION_ROUNDING = 500;
const DECISION_LIMIT_DAYS_NEXT_QUOTE = 5;

function CustomValueModal(props: CustomValueModalProps) {
  const {
    portalId,
    value,
    nextPaymentValue,
    totalPaymentValue,
    nextPaymentDate,
    expiredValue,
    lang,
    onCloseModal,
    onChangeOtherValue,
    onApplyPayOption,
  } = props;
  const [showResponse, setShowResponse] = useState(false);
  const [inputValidation, setInputValidation] = useState<{
    state: "invalid" | "pending" | undefined;
    message: string;
  }>({ state: "pending", message: "" });
  const [selectedOption, setSelectedOption] = useState<IApplyPayOption>();
  const [customValue, setCustomValue] = useState(value);
  const [applyPayOptions, setApplyPayOptions] = useState<IApplyPayOption[]>([]);

  const isMobile = useMediaQuery("(max-width: 580px)");

  const handleValidateValue = () => {
    const today = new Date();
    today.setUTCHours(5, 0, 0, 0);

    if (totalPaymentValue !== 0 && customValue > totalPaymentValue) {
      setInputValidation({
        state: "invalid",
        message: options.messageValidation.i18n[lang],
      });

      return;
    }

    setInputValidation({ state: "pending", message: "" });

    const daysUntilNextExpiration = Math.ceil(
      ((nextPaymentDate?.getTime() ?? 0) - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const isRounded =
      Math.abs(customValue - nextPaymentValue) <= DECISION_ROUNDING;

    if (
      !isRounded &&
      daysUntilNextExpiration > DECISION_LIMIT_DAYS_NEXT_QUOTE &&
      ((customValue > expiredValue && customValue < nextPaymentValue) ||
        (customValue > nextPaymentValue && customValue < totalPaymentValue))
    ) {
      setApplyPayOptions(getOptions(customValue, nextPaymentValue));
      setShowResponse(true);
    } else {
      onChangeOtherValue({
        label: options.labelOtherValue.i18n[lang],
        value: customValue,
      });
      onCloseModal();
    }
  };

  const handleApplyPayOption = () => {
    if (!selectedOption || !onApplyPayOption) return;

    onApplyPayOption(selectedOption, customValue);
    onCloseModal();
  };

  const handleChangeCustomValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowResponse(false);
    const parsedValue = parseCurrencyString(event.target.value);
    setCustomValue(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack direction="column" width="100%" gap="8px">
          <Stack justifyContent="space-between" alignItems="center">
            <Text type="title" size="medium">
              {options.labelPayAnotherValue.i18n[lang]}
            </Text>

            <Icon
              appearance="dark"
              icon={<MdOutlineClose />}
              onClick={onCloseModal}
              cursorHover={true}
              size="20px"
              spacing="narrow"
            />
          </Stack>
          <Text type="body" size="medium" appearance="gray">
            {options.labelInputValue.i18n[lang]}
          </Text>
        </Stack>

        <Divider dashed />

        <Stack gap="16px" direction="column">
          <Moneyfield
            id="customValue"
            name="customValue"
            label={options.labelCustomValue.i18n[lang]}
            placeholder=""
            value={customValue ? currencyFormat(customValue, false) : ""}
            onChange={handleChangeCustomValue}
            fullwidth
            status={inputValidation.state}
            message={
              (inputValidation.message !== "" && inputValidation.message) ||
              undefined
            }
          />
          <Stack width="100%" justifyContent="flex-end">
            <Button
              variant="outlined"
              spacing="compact"
              onClick={handleValidateValue}
              disabled={customValue === 0 || showResponse}
            >
              {options.buttonContinue.i18n[lang]}
            </Button>
          </Stack>
        </Stack>

        {showResponse && (
          <>
            <Divider dashed />

            <Stack gap="16px" direction="column">
              <Message title="Valor aprobado" appearance="success" fullwidth />

              {customValue !== totalPaymentValue && (
                <>
                  <Text type="body" size="medium" appearance="gray">
                    {options.labelSelectPaymentApplication.i18n[lang]}
                  </Text>

                  <StyledApplyPayContainer>
                    {applyPayOptions.map((option) => (
                      <StyledApplyPayOption
                        key={option.id}
                        onClick={() => setSelectedOption(option)}
                      >
                        <StyledInputRadio
                          id={option.id}
                          type="radio"
                          checked={
                            (selectedOption &&
                              selectedOption.id === option.id) ||
                            false
                          }
                          readOnly
                          value={option.id}
                        />
                        <Text type="label" size="large">
                          {option.label}
                        </Text>
                      </StyledApplyPayOption>
                    ))}
                  </StyledApplyPayContainer>
                </>
              )}

              <Stack width="100%" justifyContent="flex-end" gap="8px">
                <Button
                  appearance="gray"
                  variant="outlined"
                  spacing="compact"
                  onClick={onCloseModal}
                >
                  {options.buttonCancel.i18n[lang]}
                </Button>
                <Button
                  spacing="compact"
                  onClick={handleApplyPayOption}
                  disabled={
                    !selectedOption ||
                    (totalPaymentValue !== 0 && customValue > totalPaymentValue)
                  }
                >
                  {options.buttonAccept.i18n[lang]}
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </StyledModal>
    </Blanket>,
    node,
  );
}

export { CustomValueModal };
