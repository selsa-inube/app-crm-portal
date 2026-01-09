import { useMediaQuery } from "@inubekit/inubekit";
import { currencyFormat } from "@utils/formatData/currency";

import {
  IAttributes,
  IControllerAccordionProps,
  IDataVerificationStep,
} from "./types";
import { VerificationDebtorAddModalUI } from "./interface";
import {
  verificatioModalConfig,
  verificationDebtorAddModalConfig,
} from "./config";

function createAttribute(
  attributeName: string,
  attributeValue: string,
): IAttributes {
  return { attribute: attributeName, value: attributeValue };
}

export const VerificationPayrollOrnBonus = (
  props: IControllerAccordionProps,
) => {
  const { steps, setCurrentStep, destinationOfMoney, advanceType } = props;
  const isMobile = useMediaQuery("(max-width: 740px)");

  const personalInfoAttributes = [
    createAttribute(
      steps.personalInfo.requirements[1].requirementName,
      steps.personalInfo.requirements[1].descriptionEvaluationRequirement,
    ),
    createAttribute(
      steps.personalInfo.requirements[2].requirementName,
      steps.personalInfo.requirements[2].descriptionEvaluationRequirement,
    ),
    createAttribute(
      steps.personalInfo.requirements[3].requirementName,
      steps.personalInfo.requirements[3].descriptionEvaluationRequirement,
    ),
  ].filter((attr) => attr.value);

  const advanceTypeAttributes = [
    createAttribute(
      verificatioModalConfig.receive.payroll,
      advanceType === "payroll"
        ? verificatioModalConfig.receive.pay
        : verificatioModalConfig.receive.bonus,
    ),
  ].filter((attr) => attr.value);

  const methodOfDisbursement = [
    ...(steps.methodOfDisbursement.Internal_account.amount > 0 ||
    steps.methodOfDisbursement.Internal_account.accountNumber
      ? [
          createAttribute(
            verificatioModalConfig.methodOfDisbursement.amount,
            verificatioModalConfig.methodOfDisbursement.placeAmount,
          ),
          ...(steps.methodOfDisbursement.Internal_account.accountNumber
            ? [
                createAttribute(
                  verificatioModalConfig.methodOfDisbursement.title,
                  steps.methodOfDisbursement.Internal_account.accountLabel ||
                    "",
                ),
              ]
            : []),
          ...(steps.methodOfDisbursement.Internal_account.description
            ? [
                createAttribute(
                  verificatioModalConfig.methodOfDisbursement.obervervation,
                  steps.methodOfDisbursement.Internal_account.description,
                ),
              ]
            : []),
        ]
      : []),
  ].filter((attr) => attr.value);
  const incomeAttributes: IAttributes[] = [];

  if (steps.destinations) {
    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.destination.fields.destinationOfMoney,
        currencyFormat(destinationOfMoney),
      ),
    );
  }

  const dataVerificationStep: IDataVerificationStep[] = [
    {
      sections: {
        advanceType: {
          title: verificatioModalConfig.advanceType.title,
          attributes: advanceTypeAttributes,
          stepNumber: 0,
        },
        generalInformation: {
          title: verificationDebtorAddModalConfig.personalInfo.title,
          attributes: personalInfoAttributes,
          stepNumber: 1,
        },
        destinations: {
          title: verificationDebtorAddModalConfig.destination.title,
          attributes:
            incomeAttributes.length > 0
              ? incomeAttributes
              : [
                  createAttribute(
                    verificationDebtorAddModalConfig.destination.fields
                      .destinationOfMoney,
                    currencyFormat(0),
                  ),
                ],
          stepNumber: 2,
        },
        methodOfDisbursement: {
          title: verificationDebtorAddModalConfig.methodOfDisbursement.title,
          attributes: methodOfDisbursement,
          stepNumber: 3,
        },
      },
    },
  ];

  const keySections = dataVerificationStep.flatMap((step) =>
    Object.keys(step.sections),
  );

  return (
    <VerificationDebtorAddModalUI
      dataVerificationStep={dataVerificationStep}
      keySections={keySections}
      isMobile={isMobile}
      setCurrentStep={setCurrentStep}
      steps={steps}
    />
  );
};
