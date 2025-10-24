import { FormikValues, useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { MdOutlineAttachMoney, MdOutlineTag } from "react-icons/md";
import {
  Icon,
  Grid,
  useMediaQuery,
  Textfield,
  Select,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { ScrollableContainer } from "./styles";
import {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
} from "./config";

export interface FinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

function FinancialObligationModal({
  onCloseModal,
  onConfirm,
  title,
  confirmButtonText,
  iconBefore,
  iconAfter,
}: FinancialObligationModalProps) {
  const isMobile = useMediaQuery("(max-width: 880px)");

  const validationSchema = Yup.object({
    type: Yup.string().required(""),
    entity: Yup.string().required(""),
    fee: Yup.number().required(""),
    balance: Yup.number().required(""),
    payment: Yup.string().required(""),
    feePaid: Yup.number()
      .required("")
      .test(function (value) {
        const { term } = this.parent;
        return value !== undefined && term !== undefined ? value < term : true;
      }),
    term: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues: {
      type: "",
      entity: "",
      fee: "",
      balance: "",
      payment: "",
      idUser: "",
      feePaid: "",
      term: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      await handleFormSubmit(values);
      helpers.setSubmitting(false);
      onCloseModal();
    },
  });

  const handleFormSubmit = async (values: FormikValues) => {
    onConfirm(values);
  };

  useEffect(() => {
    if (obligationTypeOptions.length === 1) {
      const onlyOption = obligationTypeOptions[0];
      formik.setFieldValue("type", onlyOption.value);
    }
  }, [obligationTypeOptions]);

  useEffect(() => {
    if (entityOptions.length === 1) {
      const onlyOption = entityOptions[0];
      formik.setFieldValue("entity", onlyOption.value);
    }
  }, [entityOptions]);

  useEffect(() => {
    if (meansPaymentOptions.length === 1) {
      const onlyOption = meansPaymentOptions[0];
      formik.setFieldValue("payment", onlyOption.value);
    }
  }, [meansPaymentOptions]);

  return (
    <BaseModal
      title={truncateTextToMaxLength(title, 25)}
      nextButton={confirmButtonText}
      backButton={dataInputs.cancel}
      handleNext={formik.submitForm}
      handleBack={onCloseModal}
      disabledNext={!formik.dirty || !formik.isValid}
      iconAfterNext={iconAfter}
      iconBeforeNext={iconBefore}
      width={isMobile ? "300px" : "600px"}
      finalDivider
    >
      <ScrollableContainer $smallScreen={isMobile}>
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
          width={isMobile ? "280px" : "100%"}
        >
          {obligationTypeOptions.length === 1 ? (
            <Textfield
              label={dataInputs.labelType}
              name="type"
              id="type"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              value={obligationTypeOptions[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelType}
              name="type"
              id="type"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              options={obligationTypeOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.type}
              fullwidth
            />
          )}
          {entityOptions.length === 1 ? (
            <Textfield
              label={dataInputs.labelEntity}
              name="entity"
              id="entity"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              value={entityOptions[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelEntity}
              name="entity"
              id="entity"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              options={entityOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.entity}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputs.labelFee}
            name="fee"
            id="fee"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputs.placeHolderFee}
            value={validateCurrencyField("fee", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />

          <Textfield
            label={dataInputs.labelBalance}
            name="balance"
            id="balance"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputs.placeHolderBalance}
            value={validateCurrencyField("balance", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />
          {meansPaymentOptions.length === 1 ? (
            <Textfield
              label={dataInputs.labelPayment}
              name="payment"
              id="payment"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              value={meansPaymentOptions[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelPayment}
              name="payment"
              id="payment"
              size="compact"
              placeholder={dataInputs.placeHolderSelect}
              options={meansPaymentOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.payment}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputs.labelId}
            name="idUser"
            id="idUser"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.placeHolderId}
            value={formik.values.idUser}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            fullwidth
          />

          <Textfield
            label={dataInputs.labelFeePaid}
            name="feePaid"
            id="feePaid"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.palaceHolderFeePaid}
            value={formik.values.feePaid}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />

          <Textfield
            label={dataInputs.labelterm}
            name="term"
            id="term"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.palaceHolderterm}
            value={formik.values.term}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />
        </Grid>
      </ScrollableContainer>
    </BaseModal>
  );
}

export { FinancialObligationModal };
