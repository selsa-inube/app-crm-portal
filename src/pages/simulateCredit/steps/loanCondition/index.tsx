import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Stack, Text, Divider, Toggle, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";

import { loanData } from "./config";
import { LoanConditionState } from "../../types/forms.types";

interface ILoanCondition {
  initialValues: LoanConditionState;
  handleOnChange: (newState: LoanConditionState) => void;
  onFormValid: (isValid: boolean) => void;
  isMobile: boolean;
}

export function LoanCondition(props: ILoanCondition) {
  const { initialValues, handleOnChange, onFormValid, isMobile } = props;

  const validationSchema = Yup.object().shape({
    quotaCapValue: Yup.string().when(
      "toggles.quotaCapToggle",
      (quotaCapToggle, schema) =>
        quotaCapToggle ? schema.required("") : schema,
    ),
    maximumTermValue: Yup.string().when(
      "toggles.maximumTermToggle",
      (maximumTermToggle, schema) =>
        maximumTermToggle ? schema.required("") : schema,
    ),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={(values) => {
        const quotaCapNumericValue =
          parseFloat(String(values.quotaCapValue).replace(/[^0-9]/g, "")) || 0;
        const maximumTermNumericValue =
          parseFloat(String(values.maximumTermValue).replace(/[^0-9]/g, "")) ||
          0;
        const isValid =
          (!values.toggles.quotaCapToggle || quotaCapNumericValue > 0) &&
          (!values.toggles.maximumTermToggle || maximumTermNumericValue > 0);
        onFormValid(isValid);
      }}
      validateOnMount={true}
      onSubmit={() => {}}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          <Stack>
            <Fieldset>
              <Stack
                direction="column"
                gap="16px"
                padding={isMobile ? "16px" : "0px 16px"}
              >
                <Text>{loanData.quotaCapTitle}</Text>
                <Stack
                  alignItems={isMobile ? "initial" : "center"}
                  direction={isMobile ? "column" : "row"}
                >
                  <Stack gap="8px">
                    <Field
                      name="toggles.quotaCapToggle"
                      type="checkbox"
                      as={Toggle}
                      checked={values.toggles.quotaCapToggle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const isChecked = e.target.checked;
                        handleChange(e);
                        const updatedState = {
                          ...values,
                          toggles: {
                            ...values.toggles,
                            quotaCapToggle: isChecked,
                          },
                          quotaCapValue: isChecked ? values.quotaCapValue : "",
                        };
                        handleOnChange(updatedState);
                        if (!isChecked) {
                          handleChange({
                            target: {
                              name: "quotaCapValue",
                              value: "",
                            },
                          });
                        }
                      }}
                    />
                    <Text
                      type="label"
                      size="large"
                      weight="bold"
                      appearance={
                        values.toggles.quotaCapToggle ? "success" : "danger"
                      }
                    >
                      {values.toggles.quotaCapToggle
                        ? loanData.yes
                        : loanData.no}
                    </Text>
                  </Stack>
                  <Stack padding={isMobile ? "0px" : "0px 40px"}>
                    <Textfield
                      id="quotaCap"
                      name="quotaCapValue"
                      label={loanData.quotaCapLabel}
                      placeholder={loanData.quotaCapPlaceholder}
                      size="compact"
                      type="text"
                      disabled={!values.toggles.quotaCapToggle}
                      fullwidth={isMobile}
                      value={
                        values.quotaCapValue
                          ? currencyFormat(
                              Number(
                                String(values.quotaCapValue).replace(
                                  /[^0-9]/g,
                                  "",
                                ),
                              ),
                            )
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const formattedValue = currencyFormat(
                          Number(e.target.value.replace(/[^0-9]/g, "")),
                        );
                        handleChange({
                          target: {
                            name: "quotaCapValue",
                            value: formattedValue,
                          },
                        });
                        handleOnChange({
                          ...values,
                          quotaCapValue: Number(
                            e.target.value.replace(/[^0-9]/g, ""),
                          ),
                        });
                      }}
                      onBlur={handleBlur}
                    />
                  </Stack>
                </Stack>
                {!values.toggles.quotaCapToggle && (
                  <Stack direction="column" gap="8px">
                    <Divider dashed />
                    <Text>{loanData.maximumTermTitle}</Text>
                    <Stack
                      gap="8px"
                      alignItems={isMobile ? "initial" : "center"}
                      direction={isMobile ? "column" : "row"}
                    >
                      <Stack>
                        <Field
                          name="toggles.maximumTermToggle"
                          type="checkbox"
                          as={Toggle}
                          checked={values.toggles.maximumTermToggle}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const isChecked = e.target.checked;
                            handleChange(e);
                            const updatedState = {
                              ...values,
                              toggles: {
                                ...values.toggles,
                                maximumTermToggle: isChecked,
                              },
                              maximumTermValue: isChecked
                                ? values.maximumTermValue
                                : "",
                            };
                            handleOnChange(updatedState);
                            if (!isChecked) {
                              handleChange({
                                target: {
                                  name: "maximumTermValue",
                                  value: "",
                                },
                              });
                            }
                          }}
                        />
                        <Text
                          type="label"
                          size="large"
                          weight="bold"
                          appearance={
                            values.toggles.maximumTermToggle
                              ? "success"
                              : "danger"
                          }
                        >
                          {values.toggles.maximumTermToggle
                            ? loanData.yes
                            : loanData.no}
                        </Text>
                      </Stack>
                      <Stack padding={isMobile ? "0px" : "0px 40px"}>
                        <Textfield
                          id="maximumTerm"
                          name="maximumTermValue"
                          label={loanData.maximumTermLabel}
                          placeholder={loanData.maximumTermPlaceholder}
                          size="compact"
                          type="number"
                          disabled={!values.toggles.maximumTermToggle}
                          fullwidth={isMobile}
                          value={values.maximumTermValue}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            handleChange(e);
                            handleOnChange({
                              ...values,
                              maximumTermValue: Number(e.target.value),
                            });
                          }}
                          onBlur={handleBlur}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Fieldset>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
