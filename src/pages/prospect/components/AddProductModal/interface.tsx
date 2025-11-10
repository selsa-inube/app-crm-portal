import {
  Stack,
  Text,
  Grid,
  Divider,
  Assisted,
  SkeletonLine,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";
import { ErrorModal } from "@components/modals/ErrorModal";

import { ScrollableContainer } from "./styles";
import {
  messageNotFound,
  IAddProductModalUIProps,
  titleButtonTextAssisted,
  stepsAddProduct,
  noAvailablePaymentMethods,
} from "./config";
import { PaymentConfiguration } from "./steps/PaymentConfiguration";
import { AmountCapture } from "./steps/AmountCapture";
import { TermSelection } from "./steps/TermSelection";

export const AddProductModalUI = (props: IAddProductModalUIProps) => {
  const {
    title,
    onCloseModal,
    iconBefore,
    iconAfter,
    creditLineTerms,
    isMobile,
    steps,
    currentStepsNumber,
    isCurrentFormValid,
    formData,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    setIsCurrentFormValid,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    errorMessage,
    setErrorModal,
    errorModal,
    loading,
  } = props;

  return (
    <>
      <BaseModal
        title={truncateTextToMaxLength(title, 25)}
        nextButton={
          currentStepsNumber.id === steps[steps.length - 1].id
            ? titleButtonTextAssisted.submitText
            : titleButtonTextAssisted.goNextText
        }
        backButton={titleButtonTextAssisted.goBackText}
        handleNext={
          currentStepsNumber.id === steps[steps.length - 1].id
            ? handleSubmitClick
            : handleNextStep
        }
        handleBack={handlePreviousStep}
        handleClose={onCloseModal}
        disabledNext={!isCurrentFormValid}
        disabledBack={currentStepsNumber.id === steps[0].id}
        iconBeforeNext={
          (currentStepsNumber.id === steps[steps.length - 1].id
            ? titleButtonTextAssisted.submitText
            : titleButtonTextAssisted.goNextText) ===
          titleButtonTextAssisted.submitText
            ? iconBefore
            : undefined
        }
        iconAfterNext={iconAfter}
        finalDivider={true}
        width="auto"
        height="100%"
      >
        <Stack direction="column" gap="16px">
          <Assisted
            step={currentStepsNumber}
            totalSteps={steps.length}
            onBackClick={handlePreviousStep}
            onNextClick={handleNextStep}
            controls={titleButtonTextAssisted}
            onSubmitClick={handleSubmitClick}
            disableNext={!isCurrentFormValid}
            disableSubmit={!isCurrentFormValid}
            size={isMobile ? "small" : "large"}
            showCurrentStepNumber={false}
          />

          <Divider />

          {currentStepsNumber.id === stepsAddProduct.creditLineSelection.id && (
            <ScrollableContainer $smallScreen={isMobile}>
              {loading ? (
                <SkeletonLine animated width="100%" height="160px" />
              ) : (
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
                            isSelected={formData.selectedProducts.includes(
                              lineName,
                            )}
                            onSelect={() => {
                              handleFormChange({
                                selectedProducts: [lineName],
                                creditLine: lineName,
                              });
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
              )}
            </ScrollableContainer>
          )}

          {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
            !loading &&
            formData.paymentConfiguration.paymentChannelData.length > 0 && (
              <PaymentConfiguration
                paymentConfig={formData.paymentConfiguration}
                onChange={(config) => {
                  handleFormChange({
                    paymentConfiguration: {
                      ...formData.paymentConfiguration,
                      ...config,
                    },
                  });
                }}
                onFormValid={setIsCurrentFormValid}
              />
            )}

          {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
            !loading &&
            formData.paymentConfiguration.paymentChannelData.length === 0 && (
              <Text
                type="body"
                size="medium"
                children={noAvailablePaymentMethods}
                margin="10px 0 0 10px"
              />
            )}

          {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
            loading && <SkeletonLine animated width="100%" height="60px" />}

          {currentStepsNumber.id === stepsAddProduct.amountCapture.id && (
            <AmountCapture
              creditLine={formData.creditLine}
              amount={formData.creditAmount}
              moneyDestination={prospectData.moneyDestination}
              businessUnitPublicCode={businessUnitPublicCode}
              businessManagerCode={businessManagerCode}
              onChange={(amount) => {
                handleFormChange({ creditAmount: amount });
              }}
              onFormValid={setIsCurrentFormValid}
            />
          )}

          {currentStepsNumber.id === stepsAddProduct.termSelection.id && (
            <TermSelection
              quotaCapValue={formData.quotaCapValue}
              maximumTermValue={formData.maximumTermValue}
              quotaCapEnabled={formData.quotaCapEnabled}
              maximumTermEnabled={formData.maximumTermEnabled}
              isMobile={isMobile}
              onChange={(values) => {
                handleFormChange({
                  quotaCapValue: values.quotaCapValue,
                  maximumTermValue: values.maximumTermValue,
                  quotaCapEnabled: values.quotaCapEnabled,
                  maximumTermEnabled: values.maximumTermEnabled,
                });
              }}
              onFormValid={setIsCurrentFormValid}
            />
          )}
        </Stack>
      </BaseModal>
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
};
