import { useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Stack, Text, Toggle, Divider, Icon } from "@inubekit/inubekit";

import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";
import { IIncomeSources } from "@services/creditLimit/types";
import { currencyFormat } from "@utils/formatData/currency";

import { electionData } from "./config";
import { ICreditLineTerms } from "../../types";

interface IProductSelectionProps {
  initialValues: {
    selectedProducts: string[];
    generalToggleChecked: boolean;
    togglesState: boolean[];
  };
  handleOnChange: {
    setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
    onGeneralToggleChange: () => void;
    onToggleChange: (index: number) => void;
  };
  onFormValid: (isValid: boolean) => void;
  handleFormDataChange: (key: string, value: unknown) => void;
  isMobile: boolean;
  choiceMoneyDestination: string;
  allRules: {
    PercentagePayableViaExtraInstallments: string[];
    IncomeSourceUpdateAllowed: string[];
  };
  creditLimitData?: IIncomeSources;
  creditLineTerms: ICreditLineTerms;
}

export function ProductSelection(props: IProductSelectionProps) {
  const {
    initialValues: { selectedProducts, generalToggleChecked, togglesState },
    handleOnChange: {
      setSelectedProducts,
      onGeneralToggleChange,
      onToggleChange,
    },
    onFormValid,
    handleFormDataChange,
    isMobile,
    allRules,
    choiceMoneyDestination,
    creditLimitData,
    creditLineTerms,
  } = props;

  const validationSchema = Yup.object().shape({
    selectedProducts: Yup.array().when("generalToggleChecked", {
      is: (value: boolean) => value === false,
      then: (schema) => schema.min(1, ""),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const initialValues = {
    selectedProducts,
    generalToggleChecked,
    togglesState,
  };

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentDisabledQuestion, setCurrentDisabledQuestion] = useState("");

  useEffect(() => {
    const isValid = generalToggleChecked || selectedProducts.length > 0;
    onFormValid(isValid);
  }, [generalToggleChecked, selectedProducts, onFormValid]);

  useEffect(() => {
    if (generalToggleChecked) {
      const allProductValues = Object.keys(creditLineTerms);
      setSelectedProducts(allProductValues);
      handleFormDataChange("selectedProducts", allProductValues);
    } else {
      setSelectedProducts([]);
      handleFormDataChange("selectedProducts", []);
    }
  }, [generalToggleChecked]);

  const shouldShowPrograming = (
    allRules.PercentagePayableViaExtraInstallments || []
  ).some((value) => Number(value) > 0);

  const shouldShowIncomeUpdate =
    (allRules.IncomeSourceUpdateAllowed || []).length > 0 &&
    allRules.IncomeSourceUpdateAllowed.every((value) => value === "Y");

  const isQuestionDisabled = (key: string) => {
    if (key === "includeExtraordinaryInstallments") {
      return !shouldShowPrograming;
    }
    if (key === "updateIncomeSources" || key === "updateFinancialObligations") {
      return !shouldShowIncomeUpdate;
    }
    return false;
  };

  const allQuestions = Object.entries(electionData.questions).map(
    ([key, question], index) => ({ key, question, index }),
  );

  const [fullRules, setFullRules] = useState(allRules);

  useEffect(() => {
    setFullRules(allRules);
  }, [choiceMoneyDestination]);

  const filteredQuestions = allQuestions.filter(({ key }) => {
    if (
      key === "includeExtraordinaryInstallments" &&
      fullRules.PercentagePayableViaExtraInstallments.every(
        (value) => Number(value) <= 0,
      )
    ) {
      return false;
    }
    if (
      (key === "updateIncomeSources" || key === "updateFinancialObligations") &&
      fullRules.IncomeSourceUpdateAllowed.every((value) => value !== "Y")
    ) {
      return false;
    }
    return true;
  });

  const totalIncome =
    (creditLimitData?.Dividends ?? 0) +
    (creditLimitData?.FinancialIncome ?? 0) +
    (creditLimitData?.Leases ?? 0) +
    (creditLimitData?.OtherNonSalaryEmoluments ?? 0) +
    (creditLimitData?.PensionAllowances ?? 0) +
    (creditLimitData?.PeriodicSalary ?? 0) +
    (creditLimitData?.PersonalBusinessUtilities ?? 0) +
    (creditLimitData?.ProfessionalFees ?? 0);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Stack direction="column" gap="20px">
            <Stack direction="column" gap="16px">
              <Text type="label" size="large" weight="bold">
                {electionData.title}
              </Text>
              <Stack gap="8px">
                <Field name="generalToggleChecked">
                  {({ field }: { field: { value: boolean; name: string } }) => (
                    <Toggle
                      {...field}
                      value={field.value.toString()}
                      checked={field.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("generalToggleChecked", e.target.checked);
                        onGeneralToggleChange();
                      }}
                    />
                  )}
                </Field>
                <Text
                  type="label"
                  size="large"
                  weight="bold"
                  appearance={generalToggleChecked ? "success" : "danger"}
                >
                  {generalToggleChecked ? electionData.yes : electionData.no}
                </Text>
              </Stack>
            </Stack>
            {!initialValues.generalToggleChecked && (
              <Fieldset>
                <Stack
                  gap="16px"
                  padding={isMobile ? "0px 6px" : "0px 12px"}
                  wrap="wrap"
                >
                  {Object.keys(creditLineTerms).length > 0 ? (
                    Object.entries(creditLineTerms).map(
                      ([lineName, terms], index) => (
                        <Stack key={index} direction="column">
                          <CardProductSelection
                            key={lineName}
                            amount={terms.LoanAmountLimit}
                            rate={terms.RiskFreeInterestRate}
                            term={terms.LoanTermLimit}
                            description={lineName}
                            disabled={generalToggleChecked}
                            isSelected={values.selectedProducts.includes(
                              lineName,
                            )}
                            onSelect={() => {
                              const newSelected =
                                values.selectedProducts.includes(lineName)
                                  ? values.selectedProducts.filter(
                                      (id) => id !== lineName,
                                    )
                                  : [...values.selectedProducts, lineName];

                              setFieldValue("selectedProducts", newSelected);
                              setSelectedProducts(newSelected);
                              handleFormDataChange(
                                "selectedProducts",
                                newSelected,
                              );
                            }}
                          />
                        </Stack>
                      ),
                    )
                  ) : (
                    <Text type="body" size="medium">
                      {electionData.load}
                    </Text>
                  )}
                </Stack>
              </Fieldset>
            )}
            <Fieldset>
              {filteredQuestions.map(
                ({ key, question, index }, filteredIndex) => (
                  <Stack
                    direction="column"
                    key={key}
                    gap="16px"
                    padding="4px 10px"
                  >
                    <Text
                      type="body"
                      size="medium"
                      appearance={isQuestionDisabled(key) ? "gray" : "dark"}
                    >
                      {key === "updateIncomeSources"
                        ? question.replace(
                            "$valor",
                            `${currencyFormat(totalIncome)}`,
                          )
                        : question}
                    </Text>
                    <Stack gap="8px">
                      <Stack>
                        <Field name={`togglesState[${index}]`}>
                          {({
                            field,
                          }: {
                            field: { value: boolean; name: string };
                          }) => (
                            <Toggle
                              {...field}
                              value={field.value.toString()}
                              checked={field.value}
                              disabled={isQuestionDisabled(key)}
                              onChange={() => {
                                onToggleChange(index);
                                setFieldValue(
                                  `togglesState[${index}]`,
                                  !field.value,
                                );
                              }}
                            />
                          )}
                        </Field>
                        {isQuestionDisabled(key) && (
                          <Stack margin="2px 0">
                            <Icon
                              icon={<MdInfoOutline />}
                              appearance="primary"
                              size="16px"
                              onClick={() => {
                                setCurrentDisabledQuestion(key);
                                setShowInfoModal(true);
                              }}
                              cursorHover
                            />
                          </Stack>
                        )}
                      </Stack>
                      <Text
                        type="label"
                        size="large"
                        weight="bold"
                        appearance={
                          values.togglesState[index] ? "success" : "danger"
                        }
                      >
                        {values.togglesState[index]
                          ? electionData.yes
                          : electionData.no}
                      </Text>
                    </Stack>
                    {filteredIndex !== filteredQuestions.length - 1 && (
                      <Divider dashed />
                    )}
                  </Stack>
                ),
              )}
            </Fieldset>
          </Stack>
          {showInfoModal && (
            <BaseModal
              title={electionData.information}
              nextButton={electionData.understood}
              handleNext={() => setShowInfoModal(false)}
              handleClose={() => setShowInfoModal(false)}
              width={isMobile ? "280px" : "450px"}
            >
              <Stack>
                <Text>
                  {
                    electionData.informationDescription[
                      currentDisabledQuestion as keyof typeof electionData.informationDescription
                    ]
                  }
                </Text>
              </Stack>
            </BaseModal>
          )}
        </Form>
      )}
    </Formik>
  );
}
