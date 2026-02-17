import { Formik, FormikValues, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { MdAttachMoney, MdPercent } from "react-icons/md";
import {
  Stack,
  Icon,
  useMediaQuery,
  Select,
  Textfield,
} from "@inubekit/inubekit";
import { useState, useContext, useMemo, useEffect } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";

import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { CustomerContext } from "@context/CustomerContext";
import { validateIncrement } from "@services/prospect/validateIncrement";
import { IValidateIncrementRequest } from "@services/prospect/validateIncrement/types";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { CardGray } from "@components/cards/CardGray";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { validateCurrencyFieldTruncate } from "@utils/formatData/currency";
import { paymentCycleMap } from "@pages/prospect/outlets/CardCommercialManagement/config/config";
import { AppContext } from "@context/AppContext";
import { getCreditLineGeneralTerms } from "@services/lineOfCredit/generalTerms/getCreditLineGeneralTerms";
import { CreditLineGeneralTerms } from "@services/lineOfCredit/types";

import { ScrollableContainer } from "./styles";
import {
  VALIDATED_NUMBER_REGEX,
  fieldLabels,
  fieldPlaceholders,
  validationMessages,
  REPAYMENT_STRUCTURES_WITH_INCREMENT,
  simulationFormLabels,
  IBusinessUnitRuleResponse,
} from "./config";
import { TruncatedText } from "../TruncatedTextModal";

interface EditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  isProcessingServices: boolean;
  lang: EnumType;
  enums: IAllEnumsResponse;
  prospectData: {
    lineOfCredit: string;
    moneyDestination: string;
    paymentChannelType?: string;
  };
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
}

function EditProductModal(props: EditProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconAfter,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    enums,
    lang,
    setShowErrorModal,
    setMessageError,
    isProcessingServices,
  } = props;
  const { customerData } = useContext(CustomerContext);
  const { eventData } = useContext(AppContext);

  const [showIncrementField, setShowIncrementField] = useState<boolean>(false);
  const [incrementType, setIncrementType] = useState<
    "value" | "percentage" | null
  >(null);
  const [incrementValue, setIncrementValue] = useState<string>("");
  const [incrementError, setIncrementError] = useState<string>("");
  const [isValidatingIncrement, setIsValidatingIncrement] =
    useState<boolean>(false);
  const [termInMonthsModified, setTermInMonthsModified] =
    useState<boolean>(false);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [loanTermError, setLoanTermError] = useState<string>("");
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [allowedRateCodes, setAllowedRateCodes] = useState<string[]>([]);
  const [installmentAmountModified, setInstallmentAmountModified] =
    useState<boolean>(false);
  const [generalTerms, setGeneralTerms] =
    useState<CreditLineGeneralTerms | null>(null);

  const isMobile = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    const fetchAllowedOptions = async () => {
      try {
        const terms = await getCreditLineGeneralTerms(
          businessUnitPublicCode,
          businessManagerCode,
          customerData.publicCode,
          eventData.token,
          prospectData.lineOfCredit,
          prospectData.moneyDestination,
        );

        if (terms) {
          setGeneralTerms(terms);
        }

        const rateDecisions = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          {
            ruleName: "InterestRateType",
            conditions: [
              { condition: "LineOfCredit", value: prospectData.lineOfCredit },
            ],
          },
          eventData.token,
        );

        const rateList = Array.isArray(rateDecisions)
          ? (rateDecisions as IBusinessUnitRuleResponse[])
          : [];

        if (rateList?.[0]?.value && typeof rateList[0].value === "string") {
          setAllowedRateCodes(rateList[0].value.split(","));
        }
      } catch (error) {
        console.error("Error fetching filtered rules", error);
      }
    };

    fetchAllowedOptions();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    prospectData.lineOfCredit,
    eventData.token,
  ]);

  const amortizationTypesList = useMemo(() => {
    if (!enums?.RepaymentStructure || !generalTerms) return [];

    return enums.RepaymentStructure.filter((item) =>
      generalTerms.amortizationType.includes(item.code),
    ).map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang, generalTerms]);

  const rateTypesList = useMemo(() => {
    if (!enums?.InterestRateType) return [];

    return enums.InterestRateType.filter(
      (item) =>
        allowedRateCodes.length === 0 || allowedRateCodes.includes(item.code),
    ).map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang]);

  const isLoading = !enums;

  const isTermInMonthsDisabled = (): boolean => {
    return installmentAmountModified;
  };

  const isInstallmentAmountDisabled = (): boolean => {
    return termInMonthsModified;
  };

  const handleSelectChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);

    const initialValue = initialValues[name];
    if (fieldName === "termInMonths") {
      if (value === initialValue) {
        setTermInMonthsModified(false);
        setLoanTermError("");
      } else {
        setTermInMonthsModified(true);

        const numericValue = Number(value);
        const currentAmount = Number(formik.values.creditAmount) || 0;

        if (numericValue >= 0 && currentAmount >= 0) {
          validateLoanTerm(numericValue);
        } else {
          setLoanTermError("");
        }
      }
    }
  };

  const handleTextChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.handleChange(event);

    const newValue = event.target.value;
    const initialValue = initialValues[fieldName];

    const newNumericValue = Number(newValue);
    const initialNumericValue = Number(initialValue);

    if (fieldName === "interestRate") {
      if (newValue === "" || newNumericValue === initialNumericValue) {
        setInterestRateError("");
      } else {
        const numericValue = Number(newValue);
        const currentAmount = Number(formik.values.creditAmount) || 0;
        const currentTerm = Number(formik.values.termInMonths) || 0;

        if (numericValue >= 0 && currentAmount >= 0 && currentTerm >= 0) {
          validateInterestRate(numericValue);
        } else {
          setInterestRateError("");
        }
      }
    }
  };

  const validateLoanAmount = (amount: number): void => {
    if (!generalTerms) return;
    setLoanAmountError("");

    const { minAmount, maxAmount } = generalTerms;

    if (amount < minAmount || amount > maxAmount) {
      setLoanAmountError(
        validationMessages.loanAmountOutOfRange(amount, minAmount, maxAmount),
      );
    }
  };

  const validateLoanTerm = (term: number): void => {
    if (!generalTerms) return;
    setLoanTermError("");

    const { minTerm, maxTerm } = generalTerms;

    if (term < minTerm || term > maxTerm) {
      setLoanTermError(
        validationMessages.loanTermOutOfRange(term, minTerm, maxTerm),
      );
    }
  };

  const validateInterestRate = (rate: number): void => {
    if (!generalTerms) return;
    setInterestRateError("");

    const { minEffectiveInterestRate, maxEffectiveInterestRate } = generalTerms;

    if (rate < minEffectiveInterestRate || rate > maxEffectiveInterestRate) {
      setInterestRateError(
        validationMessages.interestRateOutOfRange(
          rate,
          minEffectiveInterestRate,
          maxEffectiveInterestRate,
        ),
      );
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);

    const rawValue = event.target.value.replace(VALIDATED_NUMBER_REGEX, "");
    const numericValue = Number(rawValue);

    const initialAmount = initialValues.creditAmount;

    if (numericValue === initialAmount || rawValue === "") {
      setLoanAmountError("");
    } else {
      if (numericValue > 0) {
        validateLoanAmount(numericValue);
      } else {
        setLoanAmountError("");
      }
    }
  };

  const handleInstallmentChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);
    const rawValue = event.target.value.replace(VALIDATED_NUMBER_REGEX, "");
    const numericValue = Number(rawValue);
    const initialInstallment = Number(initialValues.installmentAmount);

    if (numericValue !== initialInstallment && rawValue !== "") {
      setInstallmentAmountModified(true);
    } else {
      setInstallmentAmountModified(false);
    }
  };

  const handleSelectFocus = (fieldId: string) => {
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleAmortizationTypeChange = (
    formik: FormikProps<FormikValues>,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);

    if (value === REPAYMENT_STRUCTURES_WITH_INCREMENT.VALUE_INCREMENT) {
      setShowIncrementField(true);
      setIncrementType("value");
      setIncrementValue("");
      setIncrementError("");
    } else if (
      value === REPAYMENT_STRUCTURES_WITH_INCREMENT.PERCENTAGE_INCREMENT
    ) {
      setShowIncrementField(true);
      setIncrementType("percentage");
      setIncrementValue("");
      setIncrementError("");
    } else {
      setShowIncrementField(false);
      setIncrementType(null);
      setIncrementValue("");
      setIncrementError("");
    }
  };

  const validateIncrementValue = async (
    value: string,
    formik: FormikProps<FormikValues>,
  ): Promise<void> => {
    if (!incrementType || !value) {
      setIncrementError("");
      return;
    }

    setIsValidatingIncrement(true);

    try {
      const numericValue = Number(value.replace(/[^0-9.]/g, ""));

      if (isNaN(numericValue) || numericValue <= 0) {
        setIncrementError(validationMessages.incrementMustBePositive);
        return;
      }

      const payload: IValidateIncrementRequest = {
        lineOfCredit: prospectData.lineOfCredit,
        moneyDestination: prospectData.moneyDestination,
        amortizationType: formik.values.amortizationType,
        incrementType: incrementType,
        incrementValue: numericValue,
        loanAmount: Number(formik.values.creditAmount) || 0,
      };

      const response = await validateIncrement(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response.isValid) {
        if (incrementType === "value") {
          setIncrementError(
            validationMessages.incrementValueRange(
              response.minValue,
              response.maxValue,
            ),
          );
        } else {
          setIncrementError(
            validationMessages.incrementPercentageRange(
              response.minValue,
              response.maxValue,
            ),
          );
        }
      } else {
        setIncrementError("");
      }
    } catch (error) {
      setIncrementError(validationMessages.incrementValidationError);
    } finally {
      setIsValidatingIncrement(false);
    }
  };

  const onSubmitHandler = (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => {
    try {
      const submitValues = {
        ...values,
        ...(showIncrementField &&
          incrementValue && {
            incrementValue: Number(incrementValue.replace(/[^0-9.]/g, "")),
            incrementType: incrementType,
          }),
      };

      onConfirm(submitValues);
    } catch (error) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };

      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleTermChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    const numericValue = value === "" ? 0 : Number(value);

    formik.setFieldValue("termInMonths", value === "" ? "" : numericValue);

    const initialValue = Number(initialValues.termInMonths);

    if (numericValue === initialValue || value === "") {
      setTermInMonthsModified(false);
      setLoanTermError("");
    } else {
      setTermInMonthsModified(true);

      if (numericValue > 0) {
        validateLoanTerm(numericValue);
      } else {
        setLoanTermError("");
      }
    }
  };

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentMethod: Yup.string(),
    paymentCycle: Yup.string(),
    firstPaymentCycle: Yup.string(),
    termInMonths: Yup.number(),
    amortizationType: Yup.string(),
    interestRate: Yup.number().min(0, ""),
    rateType: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>,
      ) => {
        onConfirm(values);
        formikHelpers.setSubmitting(false);
        onSubmitHandler(values, formikHelpers);
      }}
    >
      {(formik) => (
        <BaseModal
          title={
            <TruncatedText
              text={title}
              maxLength={25}
              size="small"
              type="headline"
            />
          }
          backButton={simulationFormLabels.cancelButton.i18n[lang]}
          nextButton={confirmButtonText}
          handleNext={formik.submitForm}
          handleBack={onCloseModal}
          disabledNext={
            !formik.dirty ||
            !formik.isValid ||
            !!loanAmountError ||
            !!loanTermError ||
            !!interestRateError ||
            !!incrementError ||
            isValidatingIncrement ||
            (showIncrementField && !incrementValue)
          }
          iconAfterNext={iconAfter}
          finalDivider={true}
          width={isMobile ? "290px" : "500px"}
          isLoading={isProcessingServices}
        >
          <ScrollableContainer
            $smallScreen={isMobile}
            showIncrementField={showIncrementField}
          >
            <Stack
              direction="column"
              gap="24px"
              width="100%"
              height={isMobile ? "auto" : "600px"}
              margin="0px 0px 30px 0"
            >
              <Textfield
                label={fieldLabels.creditAmount.i18n[lang]}
                name="creditAmount"
                id="creditAmount"
                placeholder={
                  simulationFormLabels.creditAmountPlaceholder.i18n[lang]
                }
                value={validateCurrencyField("creditAmount", formik, false, "")}
                status={loanAmountError ? "invalid" : undefined}
                message={loanAmountError}
                iconBefore={
                  <Icon
                    icon={<MdAttachMoney />}
                    appearance="success"
                    size="18px"
                    spacing="narrow"
                  />
                }
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) => handleCurrencyChange(formik, event)}
                fullwidth
              />
              <CardGray
                label={simulationFormLabels.paymentMethod.i18n[lang]}
                placeHolder={capitalizeFirstLetter(
                  formik.values.paymentMethod.charAt(0).toUpperCase() +
                    formik.values.paymentMethod.slice(1),
                )}
              />
              <CardGray
                label={"Ciclo de pagos"}
                placeHolder={capitalizeFirstLetter(
                  paymentCycleMap[formik.values.paymentCycle] ||
                    formik.values.paymentCycle,
                )}
              />
              <Textfield
                label={simulationFormLabels.termInMonthsLabel.i18n[lang]}
                name="termInMonths"
                id="termInMonths"
                placeholder={
                  simulationFormLabels.termInMonthsLabel?.i18n[lang] || "0"
                }
                size="compact"
                type="number"
                value={
                  formik.values.termInMonths !== "" &&
                  formik.values.termInMonths !== undefined
                    ? Number(formik.values.termInMonths)
                    : ""
                }
                status={loanTermError ? "invalid" : undefined}
                message={loanTermError}
                onBlur={formik.handleBlur}
                onChange={(event) => handleTermChange(formik, event)}
                fullwidth
                disabled={isTermInMonthsDisabled()}
              />
              <Select
                label={simulationFormLabels.amortizationTypeLabel.i18n[lang]}
                name="amortizationType"
                id="amortizationType"
                size="compact"
                placeholder={simulationFormLabels.selectPlaceholder.i18n[lang]}
                options={amortizationTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleAmortizationTypeChange(formik, name, value)
                }
                value={formik.values.amortizationType}
                fullwidth
                disabled={isLoading}
              />
              {showIncrementField && (
                <Textfield
                  label={
                    incrementType === "value"
                      ? fieldLabels.incrementValue.i18n[lang]
                      : fieldLabels.incrementPercentage.i18n[lang]
                  }
                  name="incrementValue"
                  id="incrementValue"
                  placeholder={
                    incrementType === "value"
                      ? fieldPlaceholders.incrementValue
                      : fieldPlaceholders.incrementPercentage
                  }
                  value={incrementValue}
                  status={
                    incrementError
                      ? "invalid"
                      : isValidatingIncrement
                        ? "pending"
                        : undefined
                  }
                  message={
                    incrementError ||
                    (isValidatingIncrement
                      ? validationMessages.incrementValidating
                      : "")
                  }
                  iconBefore={
                    incrementType === "value" ? (
                      <Icon
                        icon={<MdAttachMoney />}
                        appearance="success"
                        size="18px"
                        spacing="narrow"
                      />
                    ) : (
                      <Icon
                        icon={<MdPercent />}
                        appearance="dark"
                        size="18px"
                        spacing="narrow"
                      />
                    )
                  }
                  type="number"
                  size="compact"
                  onChange={(event) => {
                    const value = event.target.value;
                    setIncrementValue(value);

                    const timeoutId = setTimeout(() => {
                      validateIncrementValue(value, formik);
                    }, 500);

                    return () => clearTimeout(timeoutId);
                  }}
                  onBlur={() => validateIncrementValue(incrementValue, formik)}
                  fullwidth
                />
              )}
              <Textfield
                label={simulationFormLabels.interestRateLabel.i18n[lang]}
                name="interestRate"
                id="interestRate"
                placeholder={
                  simulationFormLabels.interestRatePlaceholder.i18n[lang]
                }
                value={Number(formik.values.interestRate)}
                iconAfter={
                  <Icon
                    icon={<MdPercent />}
                    appearance="dark"
                    size="18px"
                    spacing="narrow"
                  />
                }
                type="number"
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) =>
                  handleTextChange(formik, "interestRate", event)
                }
                fullwidth
                message={interestRateError}
                status={interestRateError ? "invalid" : undefined}
              />
              <Select
                label={simulationFormLabels.rateTypeLabel.i18n[lang]}
                name="rateType"
                id="rateType"
                size="compact"
                placeholder={simulationFormLabels.selectPlaceholder.i18n[lang]}
                options={rateTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "rateType", name, value)
                }
                onFocus={() => handleSelectFocus("rateType")}
                value={formik.values.rateType}
                fullwidth
                disabled={isLoading}
              />
              <Textfield
                label={simulationFormLabels.installmentAmountLabel.i18n[lang]}
                name="installmentAmount"
                id="installmentAmount"
                placeholder={
                  simulationFormLabels.installmentAmountPlaceholder.i18n[lang]
                }
                value={validateCurrencyFieldTruncate(
                  "installmentAmount",
                  formik,
                  false,
                  "",
                )}
                iconBefore={
                  <Icon
                    icon={<MdAttachMoney />}
                    appearance="success"
                    size="18px"
                    spacing="narrow"
                  />
                }
                type="text"
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) => handleInstallmentChange(formik, event)}
                fullwidth
                disabled={isInstallmentAmountDisabled()}
              />
            </Stack>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
