import { Schedule } from "@services/enum/schedule";

import { CreditProductCardUI } from "./interface";

interface CreditProductCardProps {
  lineOfCredit: string;
  paymentMethod: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  periodicFee: number;
  schedule: Schedule | string;
  showIcons?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function CreditProductCard(props: CreditProductCardProps) {
  const {
    lineOfCredit,
    paymentMethod,
    loanAmount,
    interestRate,
    termMonths,
    periodicFee,
    schedule,
    showIcons = true,
    onEdit,
    onDelete,
  } = props;

  return (
    <CreditProductCardUI
      lineOfCredit={lineOfCredit}
      paymentMethod={paymentMethod}
      loanAmount={loanAmount}
      interestRate={interestRate}
      termMonths={termMonths}
      periodicFee={periodicFee}
      schedule={schedule}
      showIcons={showIcons}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

export { CreditProductCard };
export type { CreditProductCardProps };
