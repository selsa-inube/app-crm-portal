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
  isMobile: boolean;
  choiceMoneyDestination: string;
  allRules: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lineOfCredit: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PercentagePayableViaExtraInstallments: any[];
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
      setSelectedProducts([]);
    }
  }, [generalToggleChecked, setSelectedProducts]);

  const uniqueServerResponse = removeDuplicates(allRules.lineOfCredit, "value");

  const shouldShowPrograming = (
    allRules.PercentagePayableViaExtraInstallments || []
  ).some((value) => Number(value) > 0);

  const filteredQuestions = Object.entries(electionData.data).filter(
    ([key]) => key !== "programing" || shouldShowPrograming,
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
                          index.toString(),
                        )}
                        onSelect={() => {
                          const newSelected = values.selectedProducts.includes(
                            index.toString(),
                          )
                            ? values.selectedProducts.filter(
                                (id) => id !== index.toString(),
                              )
                            : [...values.selectedProducts, index.toString()];
                          setFieldValue("selectedProducts", newSelected);
                          setSelectedProducts(newSelected);
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
            <Fieldset>
              {filteredQuestions.map(([key, question], index) => (
                <Stack
                  direction="column"
                  key={key}
                  gap="16px"
                  padding="4px 10px"
                >
                  <Text type="body" size="medium">
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
                  {index !== Object.entries(filteredQuestions).length - 1 && (
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
