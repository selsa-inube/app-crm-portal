import { useContext, useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Stack, Text, useFlag, Toggle, Divider } from "@inubekit/inubekit";

import { CardProductSelection } from "@pages/addProspect/components/CardProductSelection";
import { Fieldset } from "@components/data/Fieldset";
import { mockGetMoneyDestinations } from "@mocks/add-prospect/money-destinations/moneydestinations.mock";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
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
    choiceMoneyDestination,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [creditLines, setCreditLines] = useState<any[]>([]);

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: "Error",
      description: `Error al enviar la solicitud: ${error}`,
      appearance: "danger",
      duration: 5000,
    });
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

  const selectedQuestions =
    mockGetMoneyDestinations.find((item) => item.id === choiceMoneyDestination)
      ?.question || [];

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { customerData } = useContext(CustomerContext);

  const rulesData = {
    ruleName: "LineOfCredit",
    conditions: [
      {
        condition: "MoneyDestination",
        value: choiceMoneyDestination,
      },
      {
        condition: "ClientType",
        value:
          customerData.generalAttributeClientNaturalPersons[0].associateType.substring(
            0,
            1,
          ),
      },
      {
        condition: "EmploymentContractTermType",
        value:
          customerData.generalAttributeClientNaturalPersons[0].employmentType.substring(
            0,
            2,
          ),
      },
    ],
  };

  const handleSubmit = async () => {
    try {
      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        rulesData,
      );

      if (response) {
        setCreditLines(Array.isArray(response) ? response : [response]);
      }
    } catch (error) {
      handleFlag(error);
      console.error("Error al enviar la solicitud:", error);
    }
  };

  handleSubmit();

  const uniqueServerResponse = removeDuplicates(creditLines, "value");

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
              {selectedQuestions.map((questionIndex, index) => {
                const question = Object.entries(electionData.data)[
                  questionIndex - 1
                ];
                return (
                  <Stack
                    direction="column"
                    key={question[0]}
                    gap="16px"
                    padding="4px 10px"
                  >
                    <Text type="body" size="medium">
                      {question[1]}
                    </Text>
                    <Stack gap="8px">
                      <Field name={`togglesState[${questionIndex - 1}]`}>
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
                              onToggleChange(questionIndex - 1);
                              setFieldValue(
                                `togglesState[${questionIndex - 1}]`,
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
                          values.togglesState[questionIndex - 1]
                            ? "success"
                            : "danger"
                        }
                      >
                        {values.togglesState[questionIndex - 1]
                          ? electionData.yes
                          : electionData.no}
                      </Text>
                    </Stack>
                    {index !== selectedQuestions.length - 1 && (
                      <Divider dashed />
                    )}
                  </Stack>
                );
              })}
            </Fieldset>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
