import { useMemo } from "react";
import { ICustomerData } from "@context/CustomerContext/types";
import { IFormData } from "@pages/simulateCredit/types";
import { textAddCongfig } from "@pages/payrollBenefits/payrollAdvanceCredit/config/addConfig";

interface UseBorrowerDataParams {
  customerData: ICustomerData;
  sourcesOfIncome: IFormData["sourcesOfIncome"];
  obligationsFinancial: IFormData["obligationsFinancial"];
  riskScore: IFormData["riskScore"];
}

export const useBorrowerData = ({
  customerData,
  sourcesOfIncome,
  obligationsFinancial,
  riskScore,
}: UseBorrowerDataParams) => {
  return useMemo(() => {
    const numericIncomeProperties = Object.entries(sourcesOfIncome)
      .filter(([_, value]) => typeof value === "number" && !isNaN(value))
      .map(([key, value]) => ({
        propertyName: key,
        propertyValue: String(value),
      }));

    const financialObligationProperties =
      obligationsFinancial?.obligations?.map((obligation) => ({
        propertyName: textAddCongfig.financialObligation,
        propertyValue: [
          obligation.productName,
          obligation.nextPaymentValueTotal,
          obligation.balanceObligationTotal,
          obligation.entity,
          obligation.paymentMethodName,
          obligation.obligationNumber,
          obligation.duesPaid || "0",
          obligation.outstandingDues || "0",
        ]
          .filter((x) => x !== undefined && x !== null)
          .join(", "),
      })) || [];

    return {
      borrowerIdentificationType:
        customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
      borrowerIdentificationNumber: customerData.publicCode,
      borrowerType: textAddCongfig.mainBorrower,
      borrowerName: customerData.fullName,

      borrowerProperties: [
        ...numericIncomeProperties,
        ...financialObligationProperties,
        {
          propertyName: "creditRiskScore",
          propertyValue: `${riskScore.value}, ${riskScore.date}`,
        },
      ],
    };
  }, [customerData, sourcesOfIncome, obligationsFinancial, riskScore]);
};
