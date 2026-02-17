import { Formik, Form, Field } from "formik";
import { Stack, Text, Divider, Toggle, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { loanData } from "@pages/simulateCredit/steps/loanCondition/config";

import { ITermSelectionUI } from "../config";

export function TermSelectionUI(props: ITermSelectionUI) {
  const {
    isMobile,
    initialValues,
    validationSchema,
    lang,
    handleValidationsForm,
    handleQuotaCapToggleChange,
    handleQuotaCapValueChange,
    handleMaximumTermToggleChange,
    handleMaximumTermValueChange,
  } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={(values) => {
        handleValidationsForm(values);
      }}
      validateOnMount={true}
      onSubmit={() => {}}
    >
      {({ values, handleBlur, setFieldValue, errors }) => (
        <Form>
          <Stack direction="column" gap="16px" padding="0px 16px">
            <Fieldset>
              <Stack direction="column" gap="16px" padding="16px">
                <Stack direction="column" gap="16px">
                  <Text
                    type="body"
                    size="medium"
                    appearance={
                      !values.toggles.maximumTermToggle ? "dark" : "gray"
                    }
                  >
                    {loanData.quotaCapTitle.i18n[lang]}
                  </Text>
                  <Stack
                    alignItems={isMobile ? "initial" : "center"}
                    direction={isMobile ? "column" : "row"}
                    gap="16px"
                  >
                    <Stack gap="8px" alignItems="center">
                      <Field
                        name="toggles.quotaCapToggle"
                        type="checkbox"
                        as={Toggle}
                        checked={values.toggles.quotaCapToggle}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleQuotaCapToggleChange(
                            event.target.checked,
                            setFieldValue,
                            values,
                          );
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

                    <Stack width={isMobile ? "100%" : "auto"}>
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
                        value={values.quotaCapValue}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleQuotaCapValueChange(
                            event.target.value,
                            setFieldValue,
                          );
                        }}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
                          handleBlur(event)
                        }
                      />
                    </Stack>
                  </Stack>
                </Stack>
                {!values.toggles.quotaCapToggle && (
                  <Stack direction="column" gap="16px">
                    <Divider dashed />
                    <Text
                      type="body"
                      size="medium"
                      appearance={
                        !values.toggles.quotaCapToggle ? "dark" : "gray"
                      }
                    >
                      {loanData.maximumTermTitle.i18n[lang]}
                    </Text>
                    <Stack
                      gap="16px"
                      alignItems={isMobile ? "initial" : "center"}
                      direction={isMobile ? "column" : "row"}
                    >
                      <Stack gap="8px" alignItems="center">
                        <Field
                          name="toggles.maximumTermToggle"
                          type="checkbox"
                          as={Toggle}
                          checked={values.toggles.maximumTermToggle}
                          disabled={values.toggles.quotaCapToggle}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            handleMaximumTermToggleChange(
                              event.target.checked,
                              setFieldValue,
                              values,
                            );
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

                      <Stack width={isMobile ? "100%" : "auto"}>
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
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            handleMaximumTermValueChange(
                              Number(event.target.value),
                              setFieldValue,
                            );
                          }}
                          onBlur={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => handleBlur(event)}
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
