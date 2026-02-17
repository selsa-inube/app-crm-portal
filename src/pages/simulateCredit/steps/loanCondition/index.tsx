import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Stack, Text, Divider, Toggle, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { VALIDATED_NUMBER_REGEX } from "@components/modals/ProspectProductModal/config";
import { currencyFormat } from "@utils/formatData/currency";
import { EnumType } from "@hooks/useEnum/useEnum";

import { loanData } from "./config";
import { LoanConditionState } from "../../types/forms.types";

interface ILoanCondition {
  initialValues: LoanConditionState;
  handleOnChange: (newState: LoanConditionState) => void;
  onFormValid: (isValid: boolean) => void;
  isMobile: boolean;
  lang: EnumType;
  maxLoanTerm: number;
  paymentCapacity: number;
}

export function LoanCondition(props: ILoanCondition) {
  const {
    initialValues,
    handleOnChange,
    onFormValid,
    isMobile,
    lang,
    maxLoanTerm,
    paymentCapacity,
  } = props;

  const validationSchema = Yup.object().shape({
    quotaCapValue: Yup.number().when(
      "toggles.quotaCapToggle",
      (quotaCapToggle, schema) =>
        quotaCapToggle
          ? schema
              .required("")
              .max(
                paymentCapacity,
                `El valor no puede exceder ${currencyFormat(paymentCapacity)} de capacidad de pago`,
              )
          : schema,
    ),
    maximumTermValue: Yup.number().when(
      "toggles.maximumTermToggle",
      (maximumTermToggle, schema) =>
        maximumTermToggle
          ? schema
              .required("")
              .positive(loanData.valueGreater.i18n[lang])
              .max(
                maxLoanTerm,
                `El valor no puede exceder ${maxLoanTerm} meses`,
              )
          : schema,
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
      {({ values, errors, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Stack>
            <Fieldset>
              <Stack
                direction="column"
                gap="16px"
                padding={isMobile ? "16px" : "0px 16px"}
              >
                <Text>{loanData.quotaCapTitle.i18n[lang]}</Text>
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
                        setFieldValue("toggles.quotaCapToggle", isChecked);
                        setFieldValue("toggles.maximumTermToggle", !isChecked);

                        const updatedState: LoanConditionState = {
                          ...values,
                          toggles: {
                            ...values.toggles,
                            quotaCapToggle: isChecked,
                            maximumTermToggle: !isChecked,
                          },
                          quotaCapValue: isChecked ? values.quotaCapValue : "",
                          maximumTermValue: !isChecked
                            ? values.maximumTermValue
                            : "",
                        };
                        handleOnChange(updatedState);

                        if (!isChecked) {
                          setFieldValue("quotaCapValue", "");
                        } else {
                          setFieldValue("maximumTermValue", "");
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
                        ? loanData.yes.i18n[lang]
                        : loanData.no.i18n[lang]}
                    </Text>
                  </Stack>
                  <Stack padding={isMobile ? "0px" : "0px 40px"}>
                    {values.toggles.quotaCapToggle ? (
                      <Textfield
                        id="quotaCap"
                        name="quotaCapValue"
                        label={loanData.quotaCapLabel.i18n[lang]}
                        placeholder={loanData.quotaCapPlaceholder.i18n[lang]}
                        size="compact"
                        type="text"
                        status={errors.quotaCapValue ? "invalid" : "pending"}
                        message={errors.quotaCapValue}
                        disabled={!values.toggles.quotaCapToggle}
                        fullwidth={isMobile}
                        value={
                          values.quotaCapValue
                            ? currencyFormat(
                                Number(
                                  String(values.quotaCapValue).replace(
                                    VALIDATED_NUMBER_REGEX,
                                    "",
                                  ),
                                ),
                              )
                            : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const numericValue = Number(
                            e.target.value.replace(/[^0-9]/g, ""),
                          );

                          setFieldValue("quotaCapValue", numericValue);

                          handleOnChange({
                            ...values,
                            quotaCapValue: numericValue,
                          });
                        }}
                        onBlur={handleBlur}
                      />
                    ) : (
                      <Stack margin="32px 0" />
                    )}
                  </Stack>
                </Stack>
                {!values.toggles.quotaCapToggle && (
                  <Stack direction="column" gap="8px">
                    <Divider dashed />
                    <Text>{loanData.maximumTermTitle.i18n[lang]}</Text>
                    <Stack
                      gap="8px"
                      alignItems={isMobile ? "initial" : "center"}
                      direction={isMobile ? "column" : "row"}
                    >
                      <Stack gap="8px">
                        <Field
                          name="toggles.maximumTermToggle"
                          type="checkbox"
                          as={Toggle}
                          checked={values.toggles.maximumTermToggle}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const isChecked = e.target.checked;
                            setFieldValue(
                              "toggles.maximumTermToggle",
                              isChecked,
                            );
                            setFieldValue("toggles.quotaCapToggle", !isChecked);

                            const updatedState: LoanConditionState = {
                              ...values,
                              toggles: {
                                ...values.toggles,
                                maximumTermToggle: isChecked,
                                quotaCapToggle: !isChecked,
                              },
                              maximumTermValue: isChecked
                                ? values.maximumTermValue
                                : "",
                              quotaCapValue: !isChecked
                                ? values.quotaCapValue
                                : "",
                            };
                            handleOnChange(updatedState);

                            if (!isChecked) {
                              setFieldValue("maximumTermValue", "");
                            } else {
                              setFieldValue("quotaCapValue", "");
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
                            ? loanData.yes.i18n[lang]
                            : loanData.no.i18n[lang]}
                        </Text>
                      </Stack>
                      <Stack padding={isMobile ? "0px" : "0px 40px"}>
                        <Textfield
                          id="maximumTerm"
                          name="maximumTermValue"
                          label={loanData.maximumTermLabel.i18n[lang]}
                          placeholder={
                            loanData.maximumTermPlaceholder.i18n[lang]
                          }
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
                          status={
                            errors.maximumTermValue ? "invalid" : "pending"
                          }
                          message={errors.maximumTermValue}
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
