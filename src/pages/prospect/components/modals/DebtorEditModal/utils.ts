import { IBorrower, IBorrowerProperty } from "@services/creditLimit/types";

import { IObligations } from "../../TableObligationsFinancial/types";
import { IFormData } from "../../../../simulateCredit/types";

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

    return mainBorrower;
}

export const transformFinancialObligations = (borrowerProperties: IBorrowerProperty[]) => {

    const obligationProperties = borrowerProperties.filter(
        (prop) => prop.propertyName === 'FinancialObligation'
    );

    const transformedObligations = obligationProperties.map((prop) => {
        const parts = prop.propertyValue.split(',').map(part => part.trim());

        const [
            productName,
            balanceObligationTotalStr,
            nextPaymentValueTotal,
            entity,
            paymentMethodName,
            obligationNumber,
            duesPaidStr,
            outstandingDuesStr,
        ] = parts;

        return {
            productName: productName,
            balanceObligationTotal: parseFloat(balanceObligationTotalStr) || 0,
            nextPaymentValueTotal: nextPaymentValueTotal,
            entity: entity,
            paymentMethodName: paymentMethodName,
            obligationNumber: obligationNumber,
            duesPaid: parseInt(duesPaidStr, 10) || 0,
            outstandingDues: parseInt(outstandingDuesStr, 10) || 0,
        };
    });

    return transformedObligations;
}

export const updateBorrowerPropertiesWithNewObligations = (newObligations: IObligations[], originalBorrowerProperties: IBorrowerProperty[]) => {
    const otherProperties = originalBorrowerProperties.filter(
        (prop) => prop.propertyName !== 'FinancialObligation'
    );

    const newFinancialObligationProperties = newObligations.map((obligation: IObligations) => {

        const unformatCurrency = (value: any): string => {
            if (value === undefined || value === null) return "0";
            return String(value).replace(/\D/g, "");
        };

        const propertyValue = [
            obligation.productName,
            unformatCurrency(obligation.balanceObligationTotal),
            unformatCurrency(obligation.nextPaymentValueTotal),
            obligation.entity,
            obligation.paymentMethodName,
            obligation.obligationNumber,
            obligation.duesPaid,
            obligation.outstandingDues
        ].join(',');

        return {
            propertyName: 'FinancialObligation',
            propertyValue: propertyValue,
        };
    });

    console.log("newFinancialObligationProperties: ", [...newFinancialObligationProperties, ...otherProperties]);

    return [...newFinancialObligationProperties, ...otherProperties];
}