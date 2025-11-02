import { Formik, Form, Field } from "formik";
import { Stack, Text, Divider, Toggle, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import { ITermSelectionUI, loanData } from "../config";

export function TermSelectionUI(props: ITermSelectionUI) {
  const {
    isMobile,
    initialValues,
    validationSchema,
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
      {({ values, handleBlur, setFieldValue }) => (
        <Form>
          <Stack
            direction="column"
            gap="16px"
            padding="0px 16px"
            height="300px"
          >
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
                    {loanData.quotaCapTitle}
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
                        disabled={values.toggles.maximumTermToggle}
                        checked={values.toggles.quotaCapToggle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleQuotaCapToggleChange(
                            e.target.checked,
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
                          ? loanData.yes
                          : loanData.no}
                      </Text>
                    </Stack>

                    <Stack width={isMobile ? "100%" : "auto"}>
                      <Textfield
                        id="quotaCap"
                        name="quotaCapValue"
                        label={loanData.quotaCapLabel}
                        placeholder={loanData.quotaCapPlaceholder}
                        size="compact"
                        type="text"
                        disabled={!values.toggles.quotaCapToggle}
                        fullwidth={isMobile}
                        value={values.quotaCapValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleQuotaCapValueChange(
                            e.target.value,
                            setFieldValue,
                          );
                        }}
                        onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleBlur(e)
                        }
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="column" gap="16px">
                  <Divider dashed />
                  <Text
                    type="body"
                    size="medium"
                    appearance={
                      !values.toggles.quotaCapToggle ? "dark" : "gray"
                    }
                  >
                    {loanData.maximumTermTitle}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleMaximumTermToggleChange(
                            e.target.checked,
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
                          ? loanData.yes
                          : loanData.no}
                      </Text>
                    </Stack>

                    <Stack width={isMobile ? "100%" : "auto"}>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleMaximumTermValueChange(
                            Number(e.target.value),
                            setFieldValue,
                          );
                        }}
                        onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleBlur(e)
                        }
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Fieldset>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
