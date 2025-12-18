import { useMediaQuery } from "@inubekit/inubekit";
import { currencyFormat } from "@utils/formatData/currency";

import { IAttributes, IDataVerificationStep } from "./types";
import { VerificationDebtorAddModalUI } from "./interface";
import { verificationDebtorAddModalConfig } from "./config";

export interface IPersonalInfoRequirement {
  requirementName: string;
  descriptionEvaluationRequirement: string;
}

export interface IPersonalInfo {
  requirements: IPersonalInfoRequirement[];
}

export interface IInternalAccount {
  amount: number;
  accountNumber: string;
  description: string;
  bank?: string;
}

export interface IMethodOfDisbursement {
  Internal_account: IInternalAccount;
  External_account: IInternalAccount;
}

export interface IAdvanceType {
  type: string;
  description?: string;
}

export interface ISteps {
  personalInfo: IPersonalInfo;
  destinations: string;
  methodOfDisbursement: IMethodOfDisbursement;
  advanceType?: IAdvanceType;
}

export interface IControllerAccordionProps {
  steps: ISteps;
  setCurrentStep: (step: number) => void;
  destinationOfMoney: number;
}

function createAttribute(
  attributeName: string,
  attributeValue: string,
): IAttributes {
  return { attribute: attributeName, value: attributeValue };
}

export const VerificationPayrollOrnBonus = (
  props: IControllerAccordionProps,
) => {
  const { steps, setCurrentStep, destinationOfMoney } = props;
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
    createAttribute("Nómina o prima", "Adelanto de prima"),
  ].filter((attr) => attr.value);

  const methodOfDisbursement = [
    ...(steps.methodOfDisbursement.Internal_account.amount > 0 ||
    steps.methodOfDisbursement.Internal_account.accountNumber
      ? [
          createAttribute("Tipo de cuenta", "Cuenta interna"),
          ...(steps.methodOfDisbursement.Internal_account.amount > 0
            ? [
                createAttribute(
                  "Valor a girar con esta forma de desembolso",
                  currencyFormat(
                    steps.methodOfDisbursement.Internal_account.amount,
                  ),
                ),
              ]
            : []),
          ...(steps.methodOfDisbursement.Internal_account.accountNumber
            ? [
                createAttribute(
                  "Cuenta para desembolsar el dinero",
                  steps.methodOfDisbursement.Internal_account.accountNumber,
                ),
              ]
            : []),
          ...(steps.methodOfDisbursement.Internal_account.description
            ? [
                createAttribute(
                  "Observaciones",
                  steps.methodOfDisbursement.Internal_account.description,
                ),
              ]
            : []),
        ]
      : []),
    ...(steps.methodOfDisbursement.External_account.amount > 0 ||
    steps.methodOfDisbursement.External_account.accountNumber
      ? [
          createAttribute("Tipo de cuenta", "Cuenta externa"),
          ...(steps.methodOfDisbursement.External_account.amount > 0
            ? [
                createAttribute(
                  "Valor a girar con esta forma de desembolso",
                  currencyFormat(
                    steps.methodOfDisbursement.External_account.amount,
                  ),
                ),
              ]
            : []),
          ...(steps.methodOfDisbursement.External_account.bank &&
          steps.methodOfDisbursement.External_account.accountNumber
            ? [
                createAttribute(
                  "Cuenta para desembolsar el dinero",
                  steps.methodOfDisbursement.External_account.bank +
                    " - " +
                    steps.methodOfDisbursement.External_account.accountNumber,
                ),
              ]
            : []),
          ...(steps.methodOfDisbursement.External_account.description
            ? [
                createAttribute(
                  "Observaciones",
                  steps.methodOfDisbursement.External_account.description,
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
          title: "Tipo de adelanto",
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
    />
  );
};
