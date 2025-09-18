import { IBorrower } from "@services/prospect/types";
import { transformFinancialObligations } from "@pages/prospect/components/modals/DebtorEditModal/utils";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types.ts"

import { IFormData } from "./../../../simulateCredit/types";
import { IDebtorDetail } from "./../../../applyForCredit/types";

export interface ITransformedBorrower {
  id: string;
  name: string;
  lastName: string;
  email: string;
  income: string;
  obligations: string;
  borrowerType: string;
  debtorDetail: IDebtorDetail;
  originalData: IBorrower;
}

export function transformServiceData(serviceData: IBorrower[]): ITransformedBorrower[] {
  if (!serviceData || !Array.isArray(serviceData)) {
    return [];
  }
  console.log("serviceData: ", serviceData);
  return serviceData.map((serviceBorrower) => {

    const properties = serviceBorrower.borrowerProperties.reduce((acc, prop) => {
      acc[prop.propertyName] = prop.propertyValue;
      return acc;
    }, {} as Record<string, string>); 

    const incomeProperties = [
      "PensionAllowances", "PeriodicSalary", "PersonalBusinessUtilities",
      "ProfessionalFees", "Dividends", "FinancialIncome", "Leases", "OtherNonSalaryEmoluments"
    ];
    const totalIncome = incomeProperties.reduce((sum, key) => sum + (parseFloat(properties[key]) || 0), 0);

    const totalObligations = serviceBorrower.borrowerProperties
      .filter(prop => prop.propertyName === "FinancialObligation")
      .reduce((sum, prop) => {
        const parts = prop.propertyValue.split(',').map(p => p.trim());
        const installmentAmount = parseFloat(parts[2]) || 0;
        return sum + installmentAmount;
      }, 0);

    const calculateAge = (birthDateString?: string): string => {
      if (!birthDateString) return "";
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    };

    const transformed: ITransformedBorrower = {
      id: serviceBorrower.borrowerIdentificationNumber,
      name: properties.name || serviceBorrower.borrowerName.split(' ')[0],
      lastName: properties.surname || "",
      email: properties.email || "",
      income: totalIncome.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }),
      obligations: totalObligations.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }),
      borrowerType: serviceBorrower.borrowerType,

      debtorDetail: {
        document: serviceBorrower.borrowerIdentificationType,
        documentNumber: serviceBorrower.borrowerIdentificationNumber,
        name: properties.name || "",
        lastName: properties.surname || "",
        email: properties.email || "",
        number: properties.phone_number || "",
        sex: properties.biological_sex === 'male' ? 'Masculino' : (properties.biological_sex ? 'Femenino' : ''),
        age: calculateAge(properties.birth_date),
        relation: properties.relationship || "",
        type: serviceBorrower.borrowerType,
      },

      originalData: serviceBorrower
    };

    return transformed;
  });
}

export function createMainBorrowerFromFormData(formData: Partial<IFormData>): IBorrower {
  const borrowerProperties: { propertyName: string; propertyValue: string }[] = [];

  if (Array.isArray(formData.obligationsFinancial)) {
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
    { propertyName: "relationship", propertyValue: "personalDetails.relationship" }
  );

  const mainBorrower: IBorrower = {
    borrowerName: `${"personalDetails.name"} ${"personalDetails.surname"}`,
    borrowerType: "MainBorrower",
    borrowerIdentificationType: "personalDetails.identificationType",
    borrowerIdentificationNumber: "personalDetails.identificationNumber",
    borrowerProperties: borrowerProperties,
  };

  return mainBorrower;
}

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
