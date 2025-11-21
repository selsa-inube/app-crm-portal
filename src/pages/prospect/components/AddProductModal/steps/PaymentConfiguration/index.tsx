import { useEffect, useMemo } from "react";

import { formatPrimaryDate } from "@utils/formatData/date";

import { PaymentConfigurationUI } from "./interface";
import { paymentConfiguration, IPaymentConfigurationMain } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;
  const flatChannels = useMemo(() => {
    return (
      paymentConfig.paymentChannelData?.flatMap(
        (item) => item.paymentChannels,
      ) ?? []
    );
  }, [paymentConfig.paymentChannelData]);

  const paymentMethodOptions = useMemo(() => {
    const unique = new Map(flatChannels.map((ch) => [ch.abbreviatedName, ch]));

    return Array.from(unique.values()).map((channel, index) => ({
      id: `${channel.abbreviatedName}-${index}`,
      value: channel.abbreviatedName,
      label: channel.abbreviatedName,
    }));
  }, [flatChannels]);

  const selectedChannel = useMemo(() => {
    return flatChannels.find(
      (ch) => ch.abbreviatedName === paymentConfig.paymentMethod,
    );
  }, [flatChannels, paymentConfig.paymentMethod]);

  const paymentCycleOptions = useMemo(() => {
    if (!selectedChannel) return [];

    const unique = Array.from(
      new Map(
        selectedChannel.regularCycles.map((cycle) => [
          cycle.periodicity,
          cycle.periodicity,
        ]),
      ).values(),
    );

    return unique.map((period, index) => ({
      id: `${period}-${index}`,
      value: period,
      label: period,
    }));
  }, [selectedChannel]);

  const selectedCycle = useMemo(() => {
    return selectedChannel?.regularCycles.find(
      (cycle) => cycle.periodicity === paymentConfig.paymentCycle,
    );
  }, [selectedChannel, paymentConfig.paymentCycle]);

  const firstPaymentDateOptions = useMemo(() => {
    if (!selectedCycle) return [];

    return Array.from(new Set(selectedCycle.detailOfPaymentDate)).map(
      (date, index) => ({
        id: `${date}-${index}`,
        value: date,
        label: formatPrimaryDate(new Date(date)),
      }),
    );
  }, [selectedCycle]);

  useEffect(() => {
    const updates: Partial<IPaymentConfigurationMain["paymentConfig"]> = {};

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
