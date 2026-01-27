import { FormikValues, useFormik } from "formik";
import { useEffect, useState } from "react";
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
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { EnumType } from "@hooks/useEnum/useEnum";
import { getAllBancks } from "@services/bank/SearchAllBank";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { useToken } from "@hooks/useToken";

import { ScrollableContainer } from "./styles";
import {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
} from "./config";
import { dataReport } from "../ReportCreditsModal/config";
import { TruncatedText } from "../TruncatedTextModal";
import { IOptionsSelect } from "../RequirementsModals/types";
import { ErrorModal } from "../ErrorModal";

export interface FinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  lang: EnumType;
  enums: IAllEnumsResponse;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

function FinancialObligationModal({
  onCloseModal,
  onConfirm,
  confirmButtonText,
  lang,
  enums,
  iconBefore,
  iconAfter,
}: FinancialObligationModalProps) {
  const isMobile = useMediaQuery("(max-width: 880px)");
  const { getAuthorizationToken } = useToken();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [banks, setBanks] = useState<IOptionsSelect[]>([]);

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

  const paymentTypeOptions =
    enums?.PaymentType?.map((item) => ({
      id: item.code,
      label: item.i18n[lang],
      value: item.code,
    })) || [];

  const obligationsTypeOptions =
    enums?.ObligationType?.map((item) => ({
      id: item.code,
      label: item.i18n[lang],
      value: item.code,
    })) || [];

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const authorizationToken = await getAuthorizationToken();

        const response = await getAllBancks(authorizationToken);
        const formattedBanks = response.map((bank) => ({
          id: bank.bankId,
          label: bank.bankName,
          value: bank.bankName,
        }));
        setBanks(formattedBanks);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(dataInputs.errorBanks.i18n[lang]);
      }
    };

    fetchBanks();
  }, []);

  const handleFormSubmit = async (values: FormikValues) => {
    onConfirm(values);
  };

  useEffect(() => {
    if (obligationsTypeOptions.length === 1) {
      formik.setFieldValue("type", obligationsTypeOptions[0].value);
    }
  }, [obligationsTypeOptions]);

  useEffect(() => {
    if (paymentTypeOptions.length === 1) {
      formik.setFieldValue("payment", paymentTypeOptions[0].value);
    }
  }, [paymentTypeOptions]);

  return (
    <BaseModal
      title={
        <TruncatedText
          text={dataReport.title.i18n[lang]}
          maxLength={25}
          size="small"
          type="headline"
        />
      }
      nextButton={confirmButtonText}
      backButton={dataInputs.cancel.i18n[lang]}
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
              label={dataInputs.labelType.i18n[lang]}
              name="type"
              id="type"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              value={obligationTypeOptions[0]?.label.i18n[lang] || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelType.i18n[lang]}
              name="type"
              id="type"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              options={obligationsTypeOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.type}
              fullwidth
            />
          )}
          {entityOptions.length === 1 ? (
            <Textfield
              label={dataInputs.labelEntity.i18n[lang]}
              name="entity"
              id="entity"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              value={entityOptions[0]?.label.i18n[lang] || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelEntity.i18n[lang]}
              name="entity"
              id="entity"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              options={banks}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.entity}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputs.labelFee.i18n[lang]}
            name="fee"
            id="fee"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputs.placeHolderFee.i18n[lang]}
            value={validateCurrencyField("fee", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />

          <Textfield
            label={dataInputs.labelBalance.i18n[lang]}
            name="balance"
            id="balance"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputs.placeHolderBalance.i18n[lang]}
            value={validateCurrencyField("balance", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />
          {meansPaymentOptions.length === 1 ? (
            <Textfield
              label={dataInputs.labelPayment.i18n[lang]}
              name="payment"
              id="payment"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              value={meansPaymentOptions[0]?.label.i18n[lang] || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              label={dataInputs.labelPayment.i18n[lang]}
              name="payment"
              id="payment"
              size="compact"
              placeholder={dataInputs.placeHolderSelect.i18n[lang]}
              options={paymentTypeOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.payment}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputs.labelId.i18n[lang]}
            name="idUser"
            id="idUser"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.placeHolderId.i18n[lang]}
            value={formik.values.idUser}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            fullwidth
          />

          <Textfield
            label={dataInputs.labelFeePaid.i18n[lang]}
            name="feePaid"
            id="feePaid"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.palaceHolderFeePaid.i18n[lang]}
            value={formik.values.feePaid}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />

          <Textfield
            label={dataInputs.labelterm.i18n[lang]}
            name="term"
            id="term"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputs.palaceHolderterm.i18n[lang]}
            value={formik.values.term}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />
        </Grid>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </ScrollableContainer>
    </BaseModal>
  );
}

export { FinancialObligationModal };
