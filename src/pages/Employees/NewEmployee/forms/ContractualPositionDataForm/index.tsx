import { FormikProps, useFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import * as Yup from "yup";

import { validationMessages } from "@validations/validationMessages";

import { contractualPositionDataRequiredFields } from "./config/formConfig";
import { ContractualPositionDataFormUI } from "./interface";
import { IContractualPositionData } from "./types";

const createValidationSchema = () =>
  Yup.object().shape({
    normativeFramework: contractualPositionDataRequiredFields.normativeFramework
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    contractType: contractualPositionDataRequiredFields.contractType
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    startDate: contractualPositionDataRequiredFields.startDate
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    endDate: contractualPositionDataRequiredFields.endDate
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    company: contractualPositionDataRequiredFields.company
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    workingShift: contractualPositionDataRequiredFields.workingShift
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    team: contractualPositionDataRequiredFields.team
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    position: contractualPositionDataRequiredFields.position
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    salaryProfile: contractualPositionDataRequiredFields.salaryProfile
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
    jobMode: contractualPositionDataRequiredFields.jobMode
      ? Yup.string().required(validationMessages.required)
      : Yup.string(),
  });

const validationSchema = createValidationSchema();

interface ContractualPositionDataFormProps {
  initialValues: IContractualPositionData;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  onFormValid?: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (values: IContractualPositionData) => void;
}

const ContractualPositionDataForm = forwardRef<
  FormikProps<IContractualPositionData>,
  ContractualPositionDataFormProps
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
      <ContractualPositionDataFormUI
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

ContractualPositionDataForm.displayName = "ContractualPositionDataForm";

export { ContractualPositionDataForm };
export type { ContractualPositionDataFormProps };
