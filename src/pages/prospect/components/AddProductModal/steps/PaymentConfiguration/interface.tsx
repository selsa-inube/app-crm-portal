import { Stack, Select } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { dataAmount } from "@pages/simulateCredit/steps/loanAmount/config";

import { IPaymentConfigurationUI } from "../config";

export function PaymentConfigurationUI(props: IPaymentConfigurationUI) {
  const {
    paymentConfig,
    firstPaymentDateOptions,
    paymentCycleOptions,
    paymentMethodOptions,
    paymentConfiguration,
    handlePaymentMethodChange,
    handlePaymentCycleChange,
    handleFirstPaymentDateChange,
    hasOnlyOneFirstPaymentDate,
    hasOnlyOnePaymentCycle,
    hasOnlyOnePaymentMethod,
  } = props;

  return (
    <Stack direction="column" gap="24px" padding="0px 16px">
      {hasOnlyOnePaymentMethod ? (
        <CardGray
          label={dataAmount.ordinaryPayment}
          placeHolder={
            paymentMethodOptions[0]?.label || "No hay opciones disponibles."
          }
        />
      ) : (
        <Select
          label={dataAmount.ordinaryPayment}
          name="paymentMethod"
          id="paymentMethod"
          size="compact"
          placeholder={paymentConfiguration.paymentMethod.placeholder}
          options={paymentMethodOptions}
          value={paymentConfig.paymentMethod}
          onChange={(__, value) => {
            handlePaymentMethodChange(value);
          }}
          fullwidth
          required
        />
      )}

      {paymentConfig.paymentMethod && (
        <>
          {hasOnlyOnePaymentCycle ? (
            <CardGray
              label={dataAmount.paymentCycle}
              placeHolder={
                paymentCycleOptions[0]?.label || "No hay opciones disponibles."
              }
            />
          ) : (
            <Select
              label={dataAmount.paymentCycle}
              name="paymentCycle"
              id="paymentCycle"
              size="compact"
              placeholder={paymentConfiguration.paymentMethod.placeholder}
              options={paymentCycleOptions}
              value={paymentConfig.paymentCycle}
              onChange={(__, value) => {
                handlePaymentCycleChange(value);
              }}
              fullwidth
              required
            />
          )}
        </>
      )}

      {paymentConfig.paymentCycle && (
        <>
          {hasOnlyOneFirstPaymentDate ? (
            <CardGray
              label={dataAmount.paymentDate}
              placeHolder={
                firstPaymentDateOptions[0]?.label ||
                "No hay opciones disponibles."
              }
            />
          ) : (
            <Select
              label={dataAmount.paymentDate}
              name="firstPaymentDate"
              id="firstPaymentDate"
              size="compact"
              placeholder={paymentConfiguration.firstPaymentDate.placeholder}
              options={firstPaymentDateOptions}
              value={paymentConfig.firstPaymentDate}
              onChange={(__, value) => {
                handleFirstPaymentDateChange(value);
              }}
              fullwidth
              required
            />
          )}
        </>
      )}
    </Stack>
  );
}
