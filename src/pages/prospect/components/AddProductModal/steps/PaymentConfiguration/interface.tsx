import { Stack, Select } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";

import { IPaymentConfigurationUI } from "../config";

export function PaymentConfigurationUI(props: IPaymentConfigurationUI) {
  const {
    paymentConfig,
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
          label={paymentConfiguration.paymentMethod.label}
          placeHolder={paymentConfig.availablePaymentMethods[0].label}
        />
      ) : (
        <Select
          label={paymentConfiguration.paymentMethod.label}
          name="paymentMethod"
          id="paymentMethod"
          size="compact"
          placeholder={paymentConfiguration.paymentMethod.placeholder}
          options={paymentConfig.availablePaymentMethods}
          value={paymentConfig.paymentMethod}
          onChange={(__, value) => {
            handlePaymentMethodChange(value);
          }}
          fullwidth
          required
        />
      )}

      {hasOnlyOnePaymentCycle ? (
        <CardGray
          label={paymentConfiguration.paymentCycle.label}
          placeHolder={paymentConfig.availablePaymentCycles[0].label}
        />
      ) : (
        <Select
          label={paymentConfiguration.paymentCycle.label}
          name="paymentCycle"
          id="paymentCycle"
          size="compact"
          placeholder="Selecciona una opción"
          options={paymentConfig.availablePaymentCycles}
          value={paymentConfig.paymentCycle}
          onChange={(__, value) => {
            handlePaymentCycleChange(value);
          }}
          fullwidth
          required
        />
      )}

      {hasOnlyOneFirstPaymentDate ? (
        <CardGray
          label={paymentConfiguration.firstPaymentDate.label}
          placeHolder={paymentConfig.availableFirstPaymentDates[0].label}
        />
      ) : (
        <Select
          label={paymentConfiguration.firstPaymentDate.label}
          name="firstPaymentDate"
          id="firstPaymentDate"
          size="compact"
          placeholder={paymentConfiguration.firstPaymentDate.placeholder}
          options={paymentConfig.availableFirstPaymentDates}
          value={paymentConfig.firstPaymentDate}
          onChange={(__, value) => {
            handleFirstPaymentDateChange(value);
          }}
          fullwidth
          required
        />
      )}
    </Stack>
  );
}
