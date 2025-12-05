import { useMediaQuery, Stack } from "@inubekit/inubekit";
import { useState } from "react";

import { currencyFormat } from "@utils/formatData/currency";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IIncomeSources } from "@services/creditLimit/types";
import { IProspect } from "@services/prospect/types";

import { IAttributes, IDataVerificationStep } from "./types";
import { PersonalInfo } from "../../types";
import { VerificationDebtorAddModalUI } from "./interface";
import { verificationDebtorAddModalConfig } from "./config";

export interface IControllerAccordionProps {
  steps: {
    personalInfo: PersonalInfo;
    incomeData: IIncomeSources | undefined;
    financialObligations: IProspect;
  };
  setCurrentStep: (step: number) => void;
  totalCapitalIncome: number;
  totalEmploymentIncome: number;
  totalBusinessesIncome: number;
}

function createAttribute(
  attributeName: string,
  attributeValue: string,
): IAttributes {
  return { attribute: attributeName, value: attributeValue };
}

export const VerificationDebtorAddModal = (
  props: IControllerAccordionProps,
) => {
  const {
    steps,
    setCurrentStep,
    totalCapitalIncome,
    totalEmploymentIncome,
    totalBusinessesIncome,
  } = props;
  const isMobile = useMediaQuery("(max-width: 740px)");
  const [refreshKey, setRefreshKey] = useState(0);

  const personalInfoAttributes = [
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.documentType,
      steps.personalInfo?.tipeOfDocument,
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.documentNumber,
      steps.personalInfo?.documentNumber || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.firstName,
      steps.personalInfo?.firstName || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.lastName,
      steps.personalInfo?.lastName || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.email,
      steps.personalInfo?.email || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.phone,
      steps.personalInfo?.phone || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.biologicalSex,
      steps.personalInfo?.sex || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.age,
      steps.personalInfo?.age || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.relationship,
      steps.personalInfo?.relation || "",
    ),
  ].filter((attr) => attr.value);

  const incomeAttributes = [];

  if (steps.incomeData) {
    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields
          .totalEmploymentIncome,
        currencyFormat(totalEmploymentIncome),
      ),
    );

    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields.totalCapitalIncome,
        currencyFormat(totalCapitalIncome),
      ),
    );

    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields.totalBusinessIncome,
        currencyFormat(totalBusinessesIncome),
      ),
    );
  }

  const dataVerificationStep: IDataVerificationStep[] = [
    {
      sections: {
        generalInformation: {
          title: verificationDebtorAddModalConfig.personalInfo.title,
          attributes: personalInfoAttributes,
          stepNumber: 1,
        },
        incomeInformation: {
          title: verificationDebtorAddModalConfig.incomeInfo.title,
          attributes:
            incomeAttributes.length > 0
              ? incomeAttributes
              : [
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalEmploymentIncome,
                    currencyFormat(0),
                  ),
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalCapitalIncome,
                    currencyFormat(0),
                  ),
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalBusinessIncome,
                    currencyFormat(0),
                  ),
                ],
          stepNumber: 2,
        },
        financialObligations: {
          title: verificationDebtorAddModalConfig.financialObligations.title,
          customComponent: (
            <Stack direction="column" gap="16px" padding="16px 0">
              <TableFinancialObligations
                initialValues={steps.financialObligations || []}
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
                showActions={false}
                showButtons={false}
                showAddButton={false}
                showOnlyEdit={true}
                services={false}
              />
            </Stack>
          ),
          attributes: [],
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
