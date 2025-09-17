import { IBorrower } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";

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
  if (!serviceData || !serviceData) {
    return [];
  }

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