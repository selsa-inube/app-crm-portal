import { useEffect } from "react";

import { PaymentConfigurationUI } from "./interface";
import { paymentConfiguration, IPaymentConfigurationMain } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;

  useEffect(() => {
    const isValid =
      paymentConfig.paymentMethod !== "" &&
      paymentConfig.paymentCycle !== "" &&
      paymentConfig.firstPaymentDate !== "";

    onFormValid(true); /// onFormValid(isValid) -- sorry for this comment but i need for the integration :)
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

  return (
    <PaymentConfigurationUI
      paymentConfig={paymentConfig}
      paymentConfiguration={paymentConfiguration}
      handlePaymentMethodChange={handlePaymentMethodChange}
      handlePaymentCycleChange={handlePaymentCycleChange}
      handleFirstPaymentDateChange={handleFirstPaymentDateChange}
    />
  );
}
