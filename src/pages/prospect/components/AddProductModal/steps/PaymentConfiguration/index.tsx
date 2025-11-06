import { useEffect, useMemo } from "react";

import { formatPrimaryDate } from "@utils/formatData/date";

import { PaymentConfigurationUI } from "./interface";
import { paymentConfiguration, IPaymentConfigurationMain } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;
  console.log("paymentConfig: ", paymentConfig);
  const paymentMethodOptions = useMemo(() => {
    return (
      paymentConfig.paymentChannelData?.map((channel, index) => ({
        id: `${channel.abbreviatedName}-${channel.paymentChannel}-${index}`,
        value: channel.abbreviatedName,
        label: channel.abbreviatedName,
      })) || []
    );
  }, [paymentConfig.paymentChannelData]);
  console.log("paymentMethodOptions : ", paymentMethodOptions);
  const selectedChannel = paymentConfig.paymentChannelData?.find(
    (channel) => channel.abbreviatedName === paymentConfig.paymentMethod,
  );

  const paymentCycleOptions = useMemo(() => {
    return (
      selectedChannel?.regularCycles?.map((cycle, index) => ({
        id: `${cycle.cycleName}-${index}`,
        value: cycle.cycleName,
        label: cycle.cycleName,
      })) || []
    );
  }, [selectedChannel]);

  const selectedCycle = selectedChannel?.regularCycles?.find(
    (cycle) => cycle.cycleName === paymentConfig.paymentCycle,
  );

  const firstPaymentDateOptions = useMemo(() => {
    return (
      selectedCycle?.detailOfPaymentDate?.map((date, index) => ({
        id: `${date}-${index}`,
        value: date,
        label: formatPrimaryDate(new Date(date)),
      })) || []
    );
  }, [selectedCycle]);

  useEffect(() => {
    const updates: {
      paymentMethod?: string;
      paymentCycle?: string;
      firstPaymentDate?: string;
    } = {};

    if (paymentMethodOptions.length === 1 && !paymentConfig.paymentMethod) {
      updates.paymentMethod = paymentMethodOptions[0].value;
    }

    if (
      paymentCycleOptions.length === 1 &&
      paymentConfig.paymentMethod &&
      !paymentConfig.paymentCycle
    ) {
      updates.paymentCycle = paymentCycleOptions[0].value;
    }

    if (
      firstPaymentDateOptions.length === 1 &&
      paymentConfig.paymentCycle &&
      !paymentConfig.firstPaymentDate
    ) {
      updates.firstPaymentDate = firstPaymentDateOptions[0].value;
    }

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [
    paymentMethodOptions,
    paymentCycleOptions,
    firstPaymentDateOptions,
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
    onChange({
      paymentMethod: value,
      paymentCycle: "",
      firstPaymentDate: "",
    });
  };

  const handlePaymentCycleChange = (value: string) => {
    onChange({
      paymentCycle: value,
      firstPaymentDate: "",
    });
  };

  const handleFirstPaymentDateChange = (value: string) => {
    onChange({ firstPaymentDate: value });
  };

  const hasOnlyOnePaymentMethod = paymentMethodOptions.length === 1;
  const hasOnlyOnePaymentCycle = paymentCycleOptions.length === 1;
  const hasOnlyOneFirstPaymentDate = firstPaymentDateOptions.length === 1;

  return (
    <PaymentConfigurationUI
      paymentConfig={paymentConfig}
      paymentMethodOptions={paymentMethodOptions}
      paymentCycleOptions={paymentCycleOptions}
      firstPaymentDateOptions={firstPaymentDateOptions}
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
