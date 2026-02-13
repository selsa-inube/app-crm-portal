import { useEffect, useState, useMemo } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Stack,
  Text,
  Toggle,
  Divider,
  Icon,
  SkeletonLine,
} from "@inubekit/inubekit";

import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";
import { EnumType } from "@hooks/useEnum/useEnum";

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
  loadingQuestions: boolean;
  lang: EnumType;
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
    loadingQuestions,
    lang,
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

  const productKeys = useMemo(
    () => Object.keys(creditLineTerms),
    [creditLineTerms],
  );
  const isSingleProduct = productKeys.length === 1;

  useEffect(() => {
    if (isSingleProduct) {
      const singleProduct = productKeys[0];
      if (!selectedProducts.includes(singleProduct)) {
        setSelectedProducts([singleProduct]);
        handleFormDataChange("selectedProducts", [singleProduct]);
      }
    }
  }, [
    isSingleProduct,
    productKeys,
    selectedProducts,
    setSelectedProducts,
    handleFormDataChange,
  ]);

  useEffect(() => {
    const isValid =
      isSingleProduct || generalToggleChecked || selectedProducts.length > 0;
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
      const currentValue = fullRules.financialObligation;
      if (currentValue.includes("N")) {
        state = "enabled";
      } else if (currentValue.includes("Y")) {
        state = "hidden";
      }
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
            {!isSingleProduct && (
              <Stack direction="column" gap="16px">
                <Text type="label" size="large" weight="bold">
                  {electionData.title.i18n[lang]}
                </Text>
                <Stack gap="8px">
                  <Field name="generalToggleChecked">
                    {({
                      field,
                    }: {
                      field: { value: boolean; name: string };
                    }) => (
                      <Toggle
                        {...field}
                        value={field.value.toString()}
                        checked={field.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            "generalToggleChecked",
                            e.target.checked,
                          );
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
                    {generalToggleChecked
                      ? electionData.yes.i18n[lang]
                      : electionData.no.i18n[lang]}
                  </Text>
                </Stack>
              </Stack>
            )}
            {isSingleProduct ? (
              <Stack padding={isMobile ? "0px 6px" : "0px 12px"}>
                {Object.entries(creditLineTerms).map(([name, terms]) => (
                  <CardProductSelection
                    key={name}
                    amount={terms.LoanAmountLimit}
                    rate={terms.RiskFreeInterestRate}
                    term={terms.LoanTermLimit}
                    description={name}
                    isSelected={true}
                    onSelect={() => {}}
                    isMobile={isMobile}
                    lang={lang}
                    withCheckbox={false}
                  />
                ))}
              </Stack>
            ) : (
              !values.generalToggleChecked && (
                <Fieldset>
                  <Stack
                    gap="16px"
                    padding={isMobile ? "0px 6px" : "0px 12px"}
                    wrap="wrap"
                  >
                    {productKeys.length > 0 ? (
                      Object.entries(creditLineTerms)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([name, terms]) => (
                          <CardProductSelection
                            key={name}
                            amount={terms.LoanAmountLimit}
                            rate={terms.RiskFreeInterestRate}
                            term={terms.LoanTermLimit}
                            description={name}
                            disabled={generalToggleChecked}
                            isSelected={values.selectedProducts.includes(name)}
                            onSelect={() => {
                              const newSelected =
                                values.selectedProducts.includes(name)
                                  ? values.selectedProducts.filter(
                                      (id) => id !== name,
                                    )
                                  : [...values.selectedProducts, name];
                              setFieldValue("selectedProducts", newSelected);
                              setSelectedProducts(newSelected);
                              handleFormDataChange(
                                "selectedProducts",
                                newSelected,
                              );
                            }}
                            isMobile={isMobile}
                            lang={lang}
                          />
                        ))
                    ) : (
                      <Text type="body" size="medium">
                        {electionData.load.i18n[lang]}
                      </Text>
                    )}
                  </Stack>
                </Fieldset>
              )
            )}
            {filteredQuestions.length > 0 && !loadingQuestions ? (
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
                        {question.i18n[lang]}
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
                            ? electionData.yes.i18n[lang]
                            : electionData.no.i18n[lang]}
                        </Text>
                      </Stack>
                      {filteredIndex !== filteredQuestions.length - 1 && (
                        <Divider dashed />
                      )}
                    </Stack>
                  ),
                )}
              </Fieldset>
            ) : (
              <>
                <SkeletonLine animated={true} />
                <SkeletonLine animated={true} />
                <SkeletonLine animated={true} />
              </>
            )}
          </Stack>
          {showInfoModal && (
            <BaseModal
              title={electionData.information.i18n[lang]}
              nextButton={electionData.understood.i18n[lang]}
              handleNext={() => setShowInfoModal(false)}
              handleClose={() => setShowInfoModal(false)}
              width={isMobile ? "280px" : "450px"}
            >
              <Stack>
                <Text>
                  {
                    electionData.informationDescription[
                      currentDisabledQuestion as keyof typeof electionData.informationDescription
                    ].i18n[lang]
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
