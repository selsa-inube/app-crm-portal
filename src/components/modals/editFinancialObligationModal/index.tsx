import { Formik, FormikValues } from "formik";
import localforage from "localforage";
import * as Yup from "yup";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Icon, Grid, useMediaQuery, Textfield } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { ITableFinancialObligationsProps } from "@pages/prospect/components/TableObligationsFinancial";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { dataInputs } from "./config";

interface IEditFinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

function EditFinancialObligationModal(
  props: IEditFinancialObligationModalProps,
) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 880px)");

  const validationSchema = Yup.object({
    fee: Yup.number().required(""),
    balance: Yup.number().required(""),
  });

  const handleFormSubmit = async (values: FormikValues) => {
    const storedData =
      (await localforage.getItem<ITableFinancialObligationsProps[]>(
        "financial_obligation",
      )) || [];

    if (values.id) {
      const updatedData = storedData.map((item) =>
        item.id === values.id ? { ...item, ...values } : item,
      );
      await localforage.setItem("financial_obligation", updatedData);
    } else {
      const newItem = { ...values, id: Date.now() };
      await localforage.setItem("financial_obligation", [
        ...storedData,
        newItem,
      ]);
    }

    onConfirm(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, formikHelpers) => {
        await handleFormSubmit(values);
        formikHelpers.setSubmitting(false);
        onCloseModal();
      }}
    >
      {(formik) => (
        <BaseModal
          title={title}
          backButton={dataInputs.cancel}
          nextButton={confirmButtonText}
          handleBack={onCloseModal}
          handleNext={formik.submitForm}
          disabledNext={!formik.dirty || !formik.isValid}
          iconAfterNext={iconAfter}
          iconBeforeNext={iconBefore}
          finalDivider={true}
          width={isMobile ? "300px" : "410px"}
          height={isMobile ? "298px" : "auto"}
        >
          <Grid
            templateColumns="1fr"
            autoRows="auto"
            gap="20px"
            width={isMobile ? "280px" : "100%"}
          >
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
              placeholder={dataInputs.palaceHolderFee}
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
              placeholder={dataInputs.palaceHolderBalance}
              value={validateCurrencyField("balance", formik, false, "")}
              size="compact"
              onBlur={formik.handleBlur}
              onChange={(e) => handleChangeWithCurrency(formik, e)}
              fullwidth
            />
          </Grid>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditFinancialObligationModal };
export type { IEditFinancialObligationModalProps };
