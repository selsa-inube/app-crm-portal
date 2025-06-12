import { useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Stack, Text, Toggle, Divider } from "@inubekit/inubekit";

import { CardProductSelection } from "@pages/addProspect/components/CardProductSelection";
import { Fieldset } from "@components/data/Fieldset";
import { removeDuplicates } from "@utils/mappingData/mappings";

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
  handleFormDataChange: (key: string, value: unknown) => void;
  isMobile: boolean;
  choiceMoneyDestination: string;
  allRules: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lineOfCredit: any[];
    PercentagePayableViaExtraInstallments: string[];
    IncomeSourceUpdateAllowed: string[];
  };
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

  useEffect(() => {
    const isValid = generalToggleChecked || selectedProducts.length > 0;
    onFormValid(isValid);
  }, [generalToggleChecked, selectedProducts, onFormValid]);

  useEffect(() => {
    if (generalToggleChecked) {
      const allProductValues = uniqueServerResponse.map((item) => item.value);
      setSelectedProducts(allProductValues);
      handleFormDataChange("selectedProducts", allProductValues);
    } else {
      setSelectedProducts([]);
      handleFormDataChange("selectedProducts", []);
    }
  }, [generalToggleChecked]);

  const uniqueServerResponse = removeDuplicates(allRules.lineOfCredit, "value");

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
                  {uniqueServerResponse.length > 0 ? (
                    uniqueServerResponse.map((item, index) => (
                      <Stack key={index} direction="column">
                        <CardProductSelection
                          key={index}
                          amount={item.loan_amount_limit}
                          rate={item.interest_rate}
                          term={item.loan_term_limit}
                          description={item.value}
                          disabled={generalToggleChecked}
                          isSelected={values.selectedProducts.includes(
                            item.value,
                          )}
                          onSelect={() => {
                            const newSelected =
                              values.selectedProducts.includes(item.value)
                                ? values.selectedProducts.filter(
                                    (id) => id !== item.value,
                                  )
                                : [...values.selectedProducts, item.value];
                            setFieldValue("selectedProducts", newSelected);
                            setSelectedProducts(newSelected);
                            handleFormDataChange(
                              "selectedProducts",
                              newSelected,
                            );
                          }}
                        />
                      </Stack>
                    ))
                  ) : (
                    <Text type="body" size="medium">
                      {electionData.load}
                    </Text>
                  )}
                </Stack>
              </Fieldset>
            )}
            <Fieldset>
              {allQuestions.map(({ key, question, index }, filteredIndex) => (
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
                  {filteredIndex !== allQuestions.length - 1 && (
                    <Divider dashed />
                  )}
                </Stack>
              ))}
            </Fieldset>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
