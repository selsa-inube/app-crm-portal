import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { MdOutlineAttachMoney, MdOutlineInfo } from "react-icons/md";
import { Icon, Grid, useMediaQuery, Textfield } from "@inubekit/inubekit";
import { useState } from "react";

import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
import { BaseModal } from "@components/modals/baseModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
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

function EditFinancialObligationModal({
  onCloseModal,
  onConfirm,
  title,
  confirmButtonText,
  initialValues,
  iconBefore,
  iconAfter,
}: IEditFinancialObligationModalProps) {
  const isMobile = useMediaQuery("(max-width: 880px)");

  const validationSchema = Yup.object({
    fee: Yup.number().required(""),
    balance: Yup.number().required(""),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      onConfirm(values);
      helpers.setSubmitting(false);
      onCloseModal();
    },
  });
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <BaseModal
      title={title}
      backButton={dataInputs.cancel}
      nextButton={confirmButtonText}
      handleBack={onCloseModal}
      handleNext={formik.submitForm}
      disabledNext={!formik.dirty || !formik.isValid || canEditCreditRequest}
      iconAfterNext={iconAfter}
      iconBeforeNext={
        canEditCreditRequest ? (
          <Icon
            icon={<MdOutlineInfo />}
            appearance="primary"
            size="16px"
            cursorHover
            onClick={handleInfo}
          />
        ) : (
          iconBefore
        )
      }
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
          placeholder={dataInputs.palaceHolderBalance}
          value={validateCurrencyField("balance", formik, false, "")}
          size="compact"
          onBlur={formik.handleBlur}
          onChange={(e) => handleChangeWithCurrency(formik, e)}
          fullwidth
        />
      </Grid>
      {isModalOpen ? (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </BaseModal>
  );
}

export { EditFinancialObligationModal };
export type { IEditFinancialObligationModalProps };
