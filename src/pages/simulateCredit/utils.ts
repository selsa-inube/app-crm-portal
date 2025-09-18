import { transformFinancialObligations } from "@pages/prospect/components/modals/DebtorEditModal/utils";
import { IBorrower } from "@src/services/prospect/types";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types.ts"

export const updateFinancialObligationsFormData = (borrowers: IBorrower[]) => {
    let transformedObligations: IObligations[] = [];

    borrowers.map((borrower) => {
        if (borrower.borrowerType === "MainBorrower") {
            const obligations = transformFinancialObligations(borrower.borrowerProperties);

            transformedObligations = obligations.map((obligation) => ({
                ...obligation,
                nextPaymentValueTotal: Number(obligation.nextPaymentValueTotal) || 0, 
            }));
        }
    });

    return transformedObligations;
}
