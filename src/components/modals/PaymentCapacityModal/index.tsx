import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { PaymentCapacityInterface } from "./interface";

export interface PaymentCapacityProps {
  handleClose: () => void;
  title: string;
  reportedIncomeSources: number;
  reportedFinancialObligations: number;
  subsistenceReserve: number;
  availableForNewCommitments: number;
  maxVacationTerm: number;
  maxAmount: number;
  iconVisible?: boolean;
  loading?: boolean;
}

export const PaymentCapacity = (props: PaymentCapacityProps) => {
  const {
    handleClose,
    title,
    reportedIncomeSources,
    reportedFinancialObligations,
    subsistenceReserve,
    availableForNewCommitments,
    maxVacationTerm,
    maxAmount,
    iconVisible,
    loading = false,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [error, setError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 2000);
  }, []);

  return (
    <PaymentCapacityInterface
      loading={loading}
      error={error}
      handleClose={handleClose}
      title={title}
      isMobile={isMobile}
      reportedIncomeSources={reportedIncomeSources}
      reportedFinancialObligations={reportedFinancialObligations}
      subsistenceReserve={subsistenceReserve}
      availableForNewCommitments={availableForNewCommitments}
      maxVacationTerm={maxVacationTerm}
      maxAmount={maxAmount}
      iconVisible={iconVisible}
    />
  );
};
