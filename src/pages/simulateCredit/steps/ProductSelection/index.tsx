import { useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Stack, Text, Toggle, Divider, Icon } from "@inubekit/inubekit";

import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";

import {
  ICreditLineTerms,
  IServicesProductSelection,
  IFormData,
} from "../../types";
import { electionData } from "./config";

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
  handleFormDataChange: (
    field: keyof IFormData,
    newValue: string | number | boolean | string[] | object | null | undefined,
  ) => void;
  isMobile: boolean;
  choiceMoneyDestination: string;
  servicesQuestion: IServicesProductSelection;
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
    servicesQuestion,
    choiceMoneyDestination,
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

  const allQuestions = Object.entries(electionData.questions).map(
    ([key, question], index) => ({ key, question, index }),
  );

  const [fullRules, setFullRules] = useState(servicesQuestion);
  useEffect(() => {
    setFullRules(servicesQuestion);
  }, [servicesQuestion, choiceMoneyDestination]);

  const getQuestionState = (values: string[]) => {
    const hasY = values.includes("Y");
    const hasN = values.includes("N");

    if (hasY && !hasN) return "enabled";
    if (hasY && hasN) return "disabled";
    return "hidden";
  };

  const filteredQuestions = allQuestions.filter(({ key }) => {
    let state = "hidden";

    if (key === "includeExtraordinaryInstallments") {
      state = getQuestionState(fullRules.extraInstallement);
    }
    if (key === "updateFinancialObligations") {
      state = getQuestionState(fullRules.financialObligation);
    }
    if (key === "includeAditionalBorrowers") {
      state = getQuestionState(fullRules.aditionalBorrowers);
    }

    return state !== "hidden";
  });

  const isQuestionDisabled = (key: string) => {
    if (key === "includeExtraordinaryInstallments") {
      return getQuestionState(fullRules.extraInstallement) === "disabled";
    }
    if (key === "updateFinancialObligations") {
      return getQuestionState(fullRules.financialObligation) === "disabled";
    }
    if (key === "includeAditionalBorrowers") {
      return getQuestionState(fullRules.aditionalBorrowers) === "disabled";
    }
    return false;
  };

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
                            isMobile={isMobile}
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
            {filteredQuestions.length > 0 && (
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
                        {question}
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
            )}
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
