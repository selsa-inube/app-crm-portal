import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Grid, Phonefield } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { IContactInformation } from "@pages/SubmitCreditApplication/types";

import { dataContactInformation } from "./config";
import { ICustomerData } from "@context/CustomerContext/types";

interface IContactInformationProps {
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IContactInformation) => void;
  isMobile: boolean;
  initialValues: IContactInformation;
  customerData: ICustomerData;
}

export function ContactInformation(props: IContactInformationProps) {
  const { onFormValid, handleOnChange, isMobile, initialValues, customerData } =
    props;

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
      .required(),
    phone: Yup.string()
      .matches(/^(\+\d{1,3})?\d{10,14}$/)
      .required(""),
  });

  const getInitialFormValues = () => ({
    document:
      customerData?.generalAttributeClientNaturalPersons?.[0]
        ?.typeIdentification ?? "",
    documentNumber: customerData?.publicCode ?? "",
    name:
      customerData?.generalAttributeClientNaturalPersons?.[0]?.firstNames ?? "",
    lastName:
      customerData?.generalAttributeClientNaturalPersons?.[0]?.lastNames ?? "",
    email:
      initialValues?.email && initialValues.email.trim() !== ""
        ? initialValues.email
        : (customerData?.generalAttributeClientNaturalPersons?.[0]
            ?.emailContact ?? ""),

    phone:
      initialValues?.phone !== null && `${initialValues.phone}`.trim() !== ""
        ? `${initialValues.phone}`
        : (customerData?.generalAttributeClientNaturalPersons?.[0]
            ?.cellPhoneContact ?? ""),
  });

  const [formValues] = useState(getInitialFormValues);

  const formik = useFormik({
    initialValues: formValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const prevValues = useRef(formik.values);

  useEffect(() => {
    onFormValid(formik.isValid);
  }, [formik.isValid, onFormValid]);

  useEffect(() => {
    const hasChanged =
      prevValues.current.email !== formik.values.email ||
      prevValues.current.phone !== formik.values.phone;

    if (hasChanged) {
      const updatedData = {
        document: formik.values.document,
        documentNumber: formik.values.documentNumber,
        name: formik.values.name,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.phone,
      };

      handleOnChange(updatedData);
      prevValues.current = { ...formik.values };
    }
  }, [formik.values, handleOnChange]);

  useEffect(() => {
    handleOnChange(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fieldset>
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        autoRows="auto"
        padding={isMobile ? "4px 10px" : "10px 16px"}
        gap="20px"
      >
        <CardGray
          label={dataContactInformation.cardDocument}
          placeHolder={formik.values.document}
        />
        <CardGray
          label={dataContactInformation.cardDocumentNumber}
          placeHolder={formik.values.documentNumber}
        />
        <CardGray
          label={dataContactInformation.cardName}
          placeHolder={formik.values.name}
        />
        <CardGray
          label={dataContactInformation.cardLastName}
          placeHolder={formik.values.lastName}
        />
        <Input
          name="email"
          id="email"
          type="email"
          placeholder={dataContactInformation.placeEmail}
          label={dataContactInformation.cardEmail}
          size="compact"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          status={
            formik.touched.email &&
            formik.values.email !== "" &&
            formik.errors.email
              ? "invalid"
              : undefined
          }
          message={dataContactInformation.failedEmail}
          fullwidth
        />
        <Phonefield
          name="phone"
          id="phone"
          placeholder={dataContactInformation.placePhone}
          label={dataContactInformation.cardPhone}
          size="compact"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          status={
            formik.touched.phone &&
            formik.values.phone !== "" &&
            formik.errors.phone
              ? "invalid"
              : undefined
          }
          message={dataContactInformation.failedPhone}
          fullwidth
        />
      </Grid>
    </Fieldset>
  );
}
