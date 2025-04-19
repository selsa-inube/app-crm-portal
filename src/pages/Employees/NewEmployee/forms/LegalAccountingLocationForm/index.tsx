import { FormikProps, useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import * as Yup from "yup";

import { validationMessages } from "@validations/validationMessages";

import { LegalAccountingLocationRequiredFields } from "./config/formConfig";
import { LegalAccountingLocationFormUI } from "./interface";
import { ILegalAccountingLocation } from "./types";

const createValidationSchema = () =>
  Yup.object().shape({
    proyect: LegalAccountingLocationRequiredFields.proyect
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    zonalSegmentation: LegalAccountingLocationRequiredFields.zonalSegmentation
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    costCenter: LegalAccountingLocationRequiredFields.costCenter
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
  });

const validationSchema = createValidationSchema();

interface LegalAccountingLocationFormProps {
  initialValues: ILegalAccountingLocation;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  onFormValid?: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (values: ILegalAccountingLocation) => void;
}

const LegalAccountingLocationForm = forwardRef<
  FormikProps<ILegalAccountingLocation>,
  LegalAccountingLocationFormProps
>(
  (
    {
      initialValues,
      onFormValid,
      onSubmit,
      handleNextStep,
      handlePreviousStep,
      loading,
      withNextButton = false,
    },
    ref,
  ) => {
    const formik = useFormik({
      initialValues,
      validationSchema,
      validateOnBlur: false,
      onSubmit: onSubmit ?? (() => true),
    });

    useImperativeHandle(ref, () => formik);

    useEffect(() => {
      if (onFormValid) {
        formik.validateForm().then((errors) => {
          const isFormValid = Object.keys(errors).length === 0;
          onFormValid(isFormValid);
        });
      }
    }, [formik.values, onFormValid]);

    return (
      <LegalAccountingLocationFormUI
        loading={loading}
        formik={formik}
        withNextButton={withNextButton}
        validationSchema={validationSchema}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
      />
    );
  },
);

LegalAccountingLocationForm.displayName = "LegalAccountingLocationForm";

export { LegalAccountingLocationForm };
export type { LegalAccountingLocationFormProps };
