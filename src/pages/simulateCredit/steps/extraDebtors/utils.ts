import { IBorrower } from "@services/prospect/types";
import { transformFinancialObligations } from "@pages/prospect/components/modals/DebtorEditModal/utils";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types.ts";
import { ICustomerData } from "@context/CustomerContext/types";
import { unformatCurrency } from "@pages/prospect/components/modals/DebtorEditModal/utils";
import { IFormData } from "@pages/simulateCredit/types.tsx";
import { getClientPortfolioObligationsById } from "@services/creditRequest/getClientPortfolioObligations";
import { searchPortfolioObligationsById } from "@services/portfolioObligation/SearchGeneralInformationObligation";

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
  if (
    formData.obligationsFinancial &&
    formData.obligationsFinancial.obligations
  ) {
    const financialObligations = formData.obligationsFinancial.obligations.map(
      (obligation) => {
        const propertyValue = [
          obligation.productName || "",
          unformatCurrency(obligation.balanceObligationTotal),
          unformatCurrency(obligation.nextPaymentValueTotal),
          obligation.entity || "",
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

export const getFinancialObligations = async (
  publicCode: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  authorizationToken: string,
) => {
  const obligations = await getClientPortfolioObligationsById(
    businessUnitPublicCode || "",
    businessManagerCode,
    publicCode,
    authorizationToken,
  );

  if (!obligations || !obligations.obligations) return;

  const results = await Promise.all(
    obligations.obligations.map(async (obligation) => {
      const obligationGeneralInformation = await searchPortfolioObligationsById(
        businessUnitPublicCode || "",
        businessManagerCode,
        obligations.customerIdentificationNumber,
        obligation.obligationNumber,
        authorizationToken,
      );

      if (!obligationGeneralInformation) return null;

      return {
        balanceObligationTotal:
          obligationGeneralInformation[0].balanceObligation.total,
        duesPaid: obligationGeneralInformation[0].paidQuotas,
        entity: obligation.entity,
        nextPaymentValueTotal:
          obligationGeneralInformation[0].nextPaymentValue.total,
        obligationNumber: obligation.obligationNumber,
        outstandingDues: obligationGeneralInformation[0].pendingQuotas,
        paymentMethodName: obligationGeneralInformation[0].paymentMethodName,
        productName: obligationGeneralInformation[0].productName,
      };
    }),
  );

  const allTransformedObligations: IObligations[] = results.filter(
    (item): item is IObligations => item !== null,
  );

  return allTransformedObligations;
};
