import * as Yup from "yup";
import { FormikValues } from "formik";

const isRequired = (schema: Yup.ObjectSchema<Yup.AnyObject>, fieldName: string): boolean => {
  const fields = schema.describe().fields as Record<
    string,
    { nullable?: boolean; optional?: boolean }
  >;

  const fieldDescription = fields[fieldName];
  if (!fieldDescription) return false;
  return !fieldDescription.nullable && !fieldDescription.optional;
};

const getFieldState = (
  formik: FormikValues,
  fieldName: string,
): "invalid" | "pending" | undefined => {
  const { touched, errors } = formik;

  if (!touched[fieldName]) return undefined;
  if (errors[fieldName]) return "invalid";
  return "pending";
};

export { isRequired, getFieldState };
