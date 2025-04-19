import { FormikProps, useFormik } from "formik";
import { object } from "yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import { validationMessages } from "@validations/validationMessages";
import { validationRules } from "@validations/validationRules";

import { personalDataRequiredFields } from "./config/formConfig";
import { PersonalDataFormUI } from "./interface";
import { IPersonalDataEntry } from "./types";

import * as Yup from "yup";

const createValidationSchema = () =>
  object().shape({
    names: personalDataRequiredFields.names
      ? validationRules.names.required(validationMessages.required)
      : validationRules.names,
    lastNames: personalDataRequiredFields.lastNames
      ? validationRules.lastNames.required(validationMessages.required)
      : validationRules.lastNames,
    identificationNumber: personalDataRequiredFields.identificationNumber
      ? validationRules.identificationNumber.required(validationMessages.required)
      : validationRules.identificationNumber,
    attachedFile: Yup.mixed().required("Debe adjuntar un archivo"),
  });

const validationSchema = createValidationSchema();

interface PersonalDataFormProps {
  initialValues: IPersonalDataEntry;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
  onFormValid?: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (values: IPersonalDataEntry) => void;
}

const PersonalDataForm = forwardRef<FormikProps<IPersonalDataEntry>, PersonalDataFormProps>(
  (
    { initialValues, onFormValid, onSubmit, handleNextStep, loading, withNextButton = false },
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
      <PersonalDataFormUI
        loading={loading}
        formik={formik}
        withNextButton={withNextButton}
        validationSchema={validationSchema}
        handleNextStep={handleNextStep}
      />
    );
  },
);

PersonalDataForm.displayName = "PersonalDataForm";

export { PersonalDataForm };
export type { PersonalDataFormProps };
