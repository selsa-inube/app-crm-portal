import { useEffect } from "react";

import { PaymentConfigurationUI } from "./interface";
import { paymentConfiguration, IPaymentConfigurationMain } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;

  useEffect(() => {
    const updates: {
      paymentMethod?: string;
      paymentCycle?: string;
      firstPaymentDate?: string;
    } = {};

    if (
      paymentConfig.availablePaymentMethods.length === 1 &&
      !paymentConfig.paymentMethod
    ) {
      updates.paymentMethod = paymentConfig.availablePaymentMethods[0].id;
    }

    if (
      paymentConfig.availablePaymentCycles.length === 1 &&
      !paymentConfig.paymentCycle
    ) {
      updates.paymentCycle = paymentConfig.availablePaymentCycles[0].id;
    }

    if (
      paymentConfig.availableFirstPaymentDates.length === 1 &&
      !paymentConfig.firstPaymentDate
    ) {
      updates.firstPaymentDate = paymentConfig.availableFirstPaymentDates[0].id;
    }

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [
    paymentConfig.availablePaymentMethods,
    paymentConfig.availablePaymentCycles,
    paymentConfig.availableFirstPaymentDates,
    paymentConfig.paymentMethod,
    paymentConfig.paymentCycle,
    paymentConfig.firstPaymentDate,
    onChange,
  ]);

  useEffect(() => {
    const isValid =
      paymentConfig.paymentMethod !== "" &&
      paymentConfig.paymentCycle !== "" &&
      paymentConfig.firstPaymentDate !== "";

    onFormValid(isValid);
  }, [paymentConfig, onFormValid]);

  const handlePaymentMethodChange = (value: string) => {
    onChange({ paymentMethod: value });
  };

  const handlePaymentCycleChange = (value: string) => {
    onChange({ paymentCycle: value });
  };

  const handleFirstPaymentDateChange = (value: string) => {
    onChange({ firstPaymentDate: value });
  };

  const hasOnlyOnePaymentMethod =
    paymentConfig.availablePaymentMethods.length === 1;
  const hasOnlyOnePaymentCycle =
    paymentConfig.availablePaymentCycles.length === 1;
  const hasOnlyOneFirstPaymentDate =
    paymentConfig.availableFirstPaymentDates.length === 1;

  return (
    <PaymentConfigurationUI
      paymentConfig={paymentConfig}
      paymentConfiguration={paymentConfiguration}
      handlePaymentMethodChange={handlePaymentMethodChange}
      handlePaymentCycleChange={handlePaymentCycleChange}
      handleFirstPaymentDateChange={handleFirstPaymentDateChange}
      hasOnlyOnePaymentMethod={hasOnlyOnePaymentMethod}
      hasOnlyOnePaymentCycle={hasOnlyOnePaymentCycle}
      hasOnlyOneFirstPaymentDate={hasOnlyOneFirstPaymentDate}
    />
  );
}
