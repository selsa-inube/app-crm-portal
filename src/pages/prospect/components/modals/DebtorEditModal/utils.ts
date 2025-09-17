import { IFormData } from "../../../../simulateCredit/types";

import { IBorrower } from "@services/creditLimit/types";

export function createMainBorrowerFromFormData(formData: Partial<IFormData>): IBorrower {
    const borrowerProperties: { propertyName: string; propertyValue: string }[] = [];

    if (formData.obligationsFinancial === null
        || !Array.isArray(formData.obligationsFinancial))
        return {} as IBorrower;

    if (formData.obligationsFinancial.length > 0) {
        const financialObligations = formData.obligationsFinancial.map((obligation) => {
            const propertyValue = [
                obligation.productName || '',
                obligation.balanceObligationTotal || 0,
                obligation.nextPaymentValueTotal || 0,
                obligation.entity || '',
                obligation.paymentMethodName || '',
                obligation.obligationNumber || '',
                obligation.duesPaid || 0,
                obligation.outstandingDues || 0,
            ].join(',');

            return {
                propertyName: "FinancialObligation",
                propertyValue: propertyValue,
            };
        });
        borrowerProperties.push(...financialObligations);
    }


    if (formData.sourcesOfIncome) {
        for (const [key, value] of Object.entries(formData.sourcesOfIncome)) {
            borrowerProperties.push({
                propertyName: key,
                propertyValue: String(value),
            });
        }
    }

    borrowerProperties.push(
        { propertyName: "name", propertyValue: "personalDetails.name" },
        { propertyName: "surname", propertyValue: "personalDetails.surname" },
        { propertyName: "email", propertyValue: "personalDetails.email" },
        { propertyName: "biological_sex", propertyValue: "personalDetails.biological_sex" },
        { propertyName: "phone_number", propertyValue: "personalDetails.phone_number" },
        { propertyName: "birth_date", propertyValue: "personalDetails.birth_date" },
        { propertyName: "relationship", propertyValue: "personalDetails.relationship" },
        { propertyName: "Dividends", propertyValue: `${formData.sourcesOfIncome?.Dividends}` || "0" },
        { propertyName: "FinancialIncome", propertyValue: `${formData.sourcesOfIncome?.FinancialIncome}` || "0" },
        { propertyName: "Leases", propertyValue: `${formData.sourcesOfIncome?.Leases}` || "0" },
        { propertyName: "OtherNonSalaryEmoluments", propertyValue: `${formData.sourcesOfIncome?.OtherNonSalaryEmoluments}` || "0" },
        { propertyName: "PensionAllowances", propertyValue: `${formData.sourcesOfIncome?.PensionAllowances}` || "0" },
        { propertyName: "PeriodicSalary", propertyValue: `${formData.sourcesOfIncome?.PeriodicSalary}` || "0" },
        { propertyName: "PersonalBusinessUtilities", propertyValue: `${formData.sourcesOfIncome?.PersonalBusinessUtilities}` || "0" },
        { propertyName: "ProfessionalFees", propertyValue: `${formData.sourcesOfIncome?.ProfessionalFees}` || "0" }
    );

    const mainBorrower: IBorrower = {
        borrowerName: `${"personalDetails.name"} ${"personalDetails.surname"}`,
        borrowerType: "Deudor principal",
        borrowerIdentificationType: "personalDetails.identificationType",
        borrowerIdentificationNumber: "personalDetails.identificationNumber",
        borrowerProperties: borrowerProperties,
    };

    console.log("mainBorrower: ", mainBorrower);

    return mainBorrower;
}