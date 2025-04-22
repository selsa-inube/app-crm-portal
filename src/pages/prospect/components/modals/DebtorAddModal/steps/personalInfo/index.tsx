import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Grid, useMediaQuery } from "@inubekit/inubekit";
import { Select } from "@inubekit/select";
import { Textfield } from "@inubekit/textfield";

import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  MockTipeOfDocument,
  MockTipeOfFamily,
  MockTipeOfSex,
} from "@mocks/filing-application/add-borrower/addborrower.mock";

import { IAddBorrowed } from "./types";
import { dataAddModal } from "./config";

export interface IAddBorrowedProps {
  title: string;
  initialValues: IAddBorrowed;
  portalId?: string;
  handleClose?: () => void;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IAddBorrowed) => void;
}
export const AddBorrower = (props: IAddBorrowedProps) => {
  const { initialValues, onFormValid, handleOnChange } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const validationSchema = Yup.object({
    tipeOfDocument: Yup.string().required(""),
    documentNumber: Yup.number().required(""),
    firstName: Yup.string().required(""),
    lastName: Yup.string().required(""),
    email: Yup.string().email("").required(""),
    phone: Yup.number().required(""),
    sex: Yup.string().required(""),
    age: Yup.number().min(0, "").required(""),
    relation: Yup.string().required(""),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
    enableReinitialize: true,
  });

  const prevValues = useRef(formik.values);

  useEffect(() => {
    if (
      prevValues.current.tipeOfDocument !== formik.values.tipeOfDocument ||
      prevValues.current.documentNumber !== formik.values.documentNumber ||
      prevValues.current.firstName !== formik.values.firstName ||
      prevValues.current.lastName !== formik.values.lastName ||
      prevValues.current.email !== formik.values.email ||
      prevValues.current.phone !== formik.values.phone ||
      prevValues.current.sex !== formik.values.sex ||
      prevValues.current.age !== formik.values.age ||
      prevValues.current.relation !== formik.values.relation
    ) {
      handleOnChange(formik.values);
      prevValues.current = formik.values;
    }
  }, [formik.values, handleOnChange]);

  useEffect(() => {
    onFormValid(formik.isValid);
  }, [formik.isValid, onFormValid]);

  return (
    <Stack direction="column">
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        autoRows="auto"
        gap="20px"
      >
        <Select
          name="tipeOfDocument"
          id="tipeOfDocument"
          label={dataAddModal.labelTypeDocument}
          placeholder={dataAddModal.placeHolderSelect}
          options={MockTipeOfDocument}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          onBlur={formik.handleBlur}
          value={formik.values.tipeOfDocument}
          size="compact"
          fullwidth
        />
        <Textfield
          name="documentNumber"
          id="documentNumber"
          type="text"
          label={dataAddModal.labelNumberDocument}
          placeholder={dataAddModal.placeNumberDocument}
          onChange={(e) => handleChangeWithCurrency(formik, e)}
          onBlur={formik.handleBlur}
          value={validateCurrencyField("documentNumber", formik, false, "")}
          size="compact"
          fullwidth
        />
        <Textfield
          name="firstName"
          id="firstName"
          type="text"
          label={dataAddModal.labelName}
          placeholder={dataAddModal.placeHolderName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          size="compact"
          fullwidth
        />
        <Textfield
          name="lastName"
          id="lastName"
          type="text"
          label={dataAddModal.labelLastName}
          placeholder={dataAddModal.placeHolderLastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          size="compact"
          fullwidth
        />
        <Textfield
          name="email"
          id="email"
          type="email"
          label={dataAddModal.labelEmail}
          placeholder={dataAddModal.placeHolderEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          size="compact"
          fullwidth
        />
        <Textfield
          name="phone"
          id="phone"
          type="number"
          label={dataAddModal.labelNumber}
          placeholder={dataAddModal.placeHolderNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          size="compact"
          fullwidth
        />
        <Select
          name="sex"
          id="sex"
          label={dataAddModal.labelSex}
          placeholder={dataAddModal.placeHolderSelect}
          options={MockTipeOfSex}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          onBlur={formik.handleBlur}
          value={formik.values.sex}
          size="compact"
          fullwidth
        />
        <Textfield
          name="age"
          id="age"
          type="number"
          label={dataAddModal.labelAge}
          placeholder={dataAddModal.placeHolderAge}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.age}
          size="compact"
          fullwidth
        />
        <Select
          name="relation"
          id="relation"
          label={dataAddModal.labelRelation}
          placeholder={dataAddModal.placeHolderSelect}
          options={MockTipeOfFamily}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          onBlur={formik.handleBlur}
          value={formik.values.relation}
          size="compact"
          fullwidth
        />
      </Grid>
    </Stack>
  );
};
