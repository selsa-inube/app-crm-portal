import { IBorrower } from "@services/prospect/types";
import { transformFinancialObligations } from "@pages/prospect/components/modals/DebtorEditModal/utils";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types.ts";
import { ICustomerData } from "@src/context/CustomerContext/types";
import { unformatCurrency } from "@pages/prospect/components/modals/DebtorEditModal/utils";

import {
  INCOME_PROPERTY_KEYS,
  GENDER_DISPLAY_MAP,
  GENDER_CODE_MAP,
  EBorrowerProperty,
  EFinancialObligationIndex,
  EBorrowerType,
  ITransformedBorrower,
  Delimiters,
  RelationshipType,
} from "./config";
import { IFormData } from "./../../../simulateCredit/types";

export const transformServiceData = (
  serviceData: IBorrower[],
): ITransformedBorrower[] => {
  if (!serviceData || !Array.isArray(serviceData)) {
    return [];
  }
  return serviceData.map((serviceBorrower) => {
    const properties = serviceBorrower.borrowerProperties.reduce(
      (collector, property) => {
        collector[property.propertyName] = property.propertyValue;
        return collector;
      },
      {} as Record<string, string>,
    );

    const totalIncome = INCOME_PROPERTY_KEYS.reduce(
      (sum, key) => sum + (parseFloat(properties[key]) || 0),
      0,
    );

    const totalObligations = serviceBorrower.borrowerProperties
      .filter(
        (property) =>
          property.propertyName === EBorrowerProperty.FinancialObligation,
      )
      .reduce((sum, property) => {
        const parts = property.propertyValue
          .split(Delimiters.Obligation)
          .map((part) => part.trim());
        const installmentAmount =
          parseFloat(parts[EFinancialObligationIndex.InstallmentAmount]) || 0;
        return sum + installmentAmount;
      }, 0);

    const calculateAge = (birthDateString?: string): string => {
      if (!birthDateString) return "";
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age.toString();
    };

    const transformed: ITransformedBorrower = {
      id: serviceBorrower.borrowerIdentificationNumber,
      name:
        properties[EBorrowerProperty.Name] ||
        serviceBorrower.borrowerName.split(Delimiters.Name)[0],
      lastName: properties[EBorrowerProperty.Surname] || "",
      email: properties[EBorrowerProperty.Email] || "",
      income: totalIncome.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }),
      obligations: totalObligations.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }),
      borrowerType: serviceBorrower.borrowerType,
      debtorDetail: {
        document: serviceBorrower.borrowerIdentificationType,
        documentNumber: serviceBorrower.borrowerIdentificationNumber,
        name: properties[EBorrowerProperty.Name] || "",
        lastName: properties[EBorrowerProperty.Surname] || "",
        email: properties[EBorrowerProperty.Email] || "",
        number: properties[EBorrowerProperty.PhoneNumber] || "",
        sex:
          GENDER_DISPLAY_MAP[properties[EBorrowerProperty.BiologicalSex]] || "",
        age: calculateAge(properties[EBorrowerProperty.BirthDate]),
        relation: properties[EBorrowerProperty.Relationship] || "",
        type: serviceBorrower.borrowerType,
      },
      originalData: serviceBorrower,
    };

    return transformed;
  });
};

export const createMainBorrowerFromFormData = (
  formData: Partial<IFormData>,
  customerData: ICustomerData,
): IBorrower => {
  const borrowerProperties: { propertyName: string; propertyValue: string }[] =
    [];
  if (Array.isArray(formData.obligationsFinancial)) {
    const financialObligations = formData.obligationsFinancial.map(
      (obligation) => {
        const propertyValue = [
          obligation.productName || "",
          obligation.entity || "",
          unformatCurrency(obligation.nextPaymentValueTotal),
          unformatCurrency(obligation.balanceObligationTotal),
          obligation.paymentMethodName || "",
          obligation.obligationNumber || "",
          obligation.duesPaid || 0,
          obligation.outstandingDues || 0,
        ].join(Delimiters.Obligation);

        return {
          propertyName: EBorrowerProperty.FinancialObligation,
          propertyValue: propertyValue,
        };
      },
    );
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

  const naturalPersonDetails =
    customerData?.generalAttributeClientNaturalPersons?.[0] || {};

  borrowerProperties.push(
    {
      propertyName: EBorrowerProperty.Name,
      propertyValue: naturalPersonDetails.firstNames || "",
    },
    {
      propertyName: EBorrowerProperty.Surname,
      propertyValue: naturalPersonDetails.lastNames || "",
    },
    {
      propertyName: EBorrowerProperty.Email,
      propertyValue: naturalPersonDetails.emailContact || "",
    },
    {
      propertyName: EBorrowerProperty.BiologicalSex,
      propertyValue: mapGender(naturalPersonDetails.gender),
    },
    {
      propertyName: EBorrowerProperty.PhoneNumber,
      propertyValue: naturalPersonDetails.cellPhoneContact || "",
    },
    {
      propertyName: EBorrowerProperty.BirthDate,
      propertyValue: naturalPersonDetails.dateBirth || "",
    },
    {
      propertyName: EBorrowerProperty.Relationship,
      propertyValue: RelationshipType.Holder,
    },
  );

  const mainBorrower: IBorrower = {
    borrowerName: customerData.fullName || "",
    borrowerType: EBorrowerType.Main,
    borrowerIdentificationType: naturalPersonDetails.typeIdentification || "",
    borrowerIdentificationNumber: customerData.publicCode || "",
    borrowerProperties: borrowerProperties,
  };

  return mainBorrower;
};

const mapGender = (genderString?: string): string => {
  if (!genderString) return "";
  const code = genderString.charAt(0).toUpperCase();
  return GENDER_CODE_MAP[code] || "";
};

export const updateFinancialObligationsFormData = (borrowers: IBorrower[]) => {
  let transformedObligations: IObligations[] = [];

  borrowers.forEach((borrower) => {
    if (borrower.borrowerType === EBorrowerType.Main) {
      const obligations = transformFinancialObligations(
        borrower.borrowerProperties,
      );

      transformedObligations = obligations.map((obligation) => ({
        ...obligation,
        nextPaymentValueTotal: Number(obligation.nextPaymentValueTotal) || 0,
      }));
    }
  });

  return transformedObligations;
};
