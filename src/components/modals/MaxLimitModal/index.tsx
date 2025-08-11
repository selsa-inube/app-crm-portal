import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { MaxLimitModalUI } from "./interface";

export interface PaymentCapacityProps {
  title: string;
  reportedIncomeSources: number;
  reportedFinancialObligations: number;
  subsistenceReserve: number;
  availableForNewCommitments: number;
  maxVacationTerm: number;
  maxAmount: number;
  iconVisible?: boolean;
  loading?: boolean;
  handleClose: () => void;
}

export const MaxLimitModal = (props: PaymentCapacityProps) => {
  const {
    title,
    reportedIncomeSources,
    reportedFinancialObligations,
    subsistenceReserve,
    availableForNewCommitments,
    maxVacationTerm,
    maxAmount,
    iconVisible,
    loading = false,
    handleClose,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [error, setError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 2000);
  }, []);

  return (
    <MaxLimitModalUI
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
