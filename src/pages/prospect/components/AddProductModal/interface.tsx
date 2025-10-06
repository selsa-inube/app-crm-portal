import { Formik, FormikHelpers } from "formik";

import { Stack, Text, Grid } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";

import { ScrollableContainer } from "./styles";
import {
  messageNotFound,
  IFormValues,
  IAddProductModalUIProps,
} from "./config";

export const AddProductModalUI = (props: IAddProductModalUIProps) => {
  const {
    title,
    confirmButtonText,
    initialValues,
    validationSchema,
    onConfirm,
    onCloseModal,
    iconBefore,
    iconAfter,
    creditLineTerms,
    isMobile,
  } = props;

  return (
    <Formik
      initialValues={{
        ...initialValues,
        selectedProducts: [] as string[],
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: IFormValues,
        formikHelpers: FormikHelpers<IFormValues>,
      ) => {
        onConfirm(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <BaseModal
          title={truncateTextToMaxLength(title, 25)}
          backButton="Cancelar"
          nextButton={confirmButtonText}
          handleNext={formik.submitForm}
          handleBack={onCloseModal}
          disabledNext={!formik.dirty || !formik.isValid}
          iconBeforeNext={iconBefore}
          iconAfterNext={iconAfter}
          finalDivider={true}
          width="auto"
        >
          <ScrollableContainer $smallScreen={isMobile}>
            <Grid
              gap="16px"
              padding={isMobile ? "0px 6px" : "0px 12px"}
              templateColumns={`repeat(1, ${isMobile ? "auto" : "455px"})`}
              autoRows="200px"
              justifyContent="center"
              alignContent="center"
            >
              {Object.keys(creditLineTerms).length > 0 ? (
                Object.entries(creditLineTerms).map(
                  ([lineName, terms], index) => (
                    <Stack key={index} direction="row" width="auto">
                      <CardProductSelection
                        isMobile={isMobile}
                        typeCheck="radio"
                        key={lineName}
                        amount={terms.LoanAmountLimit}
                        rate={terms.RiskFreeInterestRate}
                        term={terms.LoanTermLimit}
                        description={lineName}
                        disabled={false}
                        isSelected={formik.values.selectedProducts.includes(
                          lineName,
                        )}
                        onSelect={() => {
                          formik.setFieldValue("selectedProducts", [lineName]);
                        }}
                      />
                    </Stack>
                  ),
                )
              ) : (
                <Text type="body" size="medium">
                  {messageNotFound}
                </Text>
              )}
            </Grid>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
};
