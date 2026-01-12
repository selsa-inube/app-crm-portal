import { useMediaQuery, Stack } from "@inubekit/inubekit";
import { useState } from "react";

import { currencyFormat } from "@utils/formatData/currency";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IIncomeSources } from "@services/creditLimit/types";
import { IProspect } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum/useEnum";

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
  lang: EnumType;
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
    lang,
  } = props;
  const isMobile = useMediaQuery("(max-width: 740px)");
  const [refreshKey, setRefreshKey] = useState(0);

  const personalInfoAttributes = [
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.documentType.i18n[
        lang
      ],
      steps.personalInfo?.tipeOfDocument,
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.documentNumber.i18n[
        lang
      ],
      steps.personalInfo?.documentNumber || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.firstName.i18n[lang],
      steps.personalInfo?.firstName || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.lastName.i18n[lang],
      steps.personalInfo?.lastName || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.email.i18n[lang],
      steps.personalInfo?.email || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.phone.i18n[lang],
      steps.personalInfo?.phone || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.biologicalSex.i18n[
        lang
      ],
      steps.personalInfo?.sex || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.age.i18n[lang],
      steps.personalInfo?.age || "",
    ),
    createAttribute(
      verificationDebtorAddModalConfig.personalInfo.fields.relationship.i18n[
        lang
      ],
      steps.personalInfo?.relation || "",
    ),
  ].filter((attr) => attr.value);

  const incomeAttributes = [];

  if (steps.incomeData) {
    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields.totalEmploymentIncome
          .i18n[lang],
        currencyFormat(totalEmploymentIncome),
      ),
    );

    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields.totalCapitalIncome
          .i18n[lang],
        currencyFormat(totalCapitalIncome),
      ),
    );

    incomeAttributes.push(
      createAttribute(
        verificationDebtorAddModalConfig.incomeInfo.fields.totalBusinessIncome
          .i18n[lang],
        currencyFormat(totalBusinessesIncome),
      ),
    );
  }

  const dataVerificationStep: IDataVerificationStep[] = [
    {
      sections: {
        generalInformation: {
          title: verificationDebtorAddModalConfig.personalInfo.title.i18n[lang],
          attributes: personalInfoAttributes,
          stepNumber: 1,
        },
        incomeInformation: {
          title: verificationDebtorAddModalConfig.incomeInfo.title.i18n[lang],
          attributes:
            incomeAttributes.length > 0
              ? incomeAttributes
              : [
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalEmploymentIncome.i18n[lang],
                    currencyFormat(0),
                  ),
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalCapitalIncome.i18n[lang],
                    currencyFormat(0),
                  ),
                  createAttribute(
                    verificationDebtorAddModalConfig.incomeInfo.fields
                      .totalBusinessIncome.i18n[lang],
                    currencyFormat(0),
                  ),
                ],
          stepNumber: 2,
        },
        financialObligations: {
          title:
            verificationDebtorAddModalConfig.financialObligations.title.i18n[
              lang
            ],
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
      lang={lang}
    />
  );
};
