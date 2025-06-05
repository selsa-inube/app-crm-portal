import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Input,
  Fieldset as FieldsetInube,
  Phonefield,
  Stack,
  Toggle,
  Text,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { IContactInformation } from "@pages/SubmitCreditApplication/types";
import { ICustomerData } from "@context/CustomerContext/types";

import { dataContactInformation } from "./config";

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
      .required(""),
    phone: Yup.string()
      .matches(/^(\+\d{1,3})?\d{10,14}$/, "")
      .required(""),
    toggleChecked: Yup.boolean(),
    whatsAppPhone: Yup.string()
      .matches(/^(\+\d{1,3})?\d{10,14}$/, "")
      .when("toggleChecked", {
        is: false,
        then: (schema) => schema.required(""),
        otherwise: (schema) => schema.notRequired(),
      }),
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
    toggleChecked: initialValues.toggleChecked,
    whatsAppPhone: initialValues.whatsAppPhone,
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
      prevValues.current.phone !== formik.values.phone ||
      prevValues.current.whatsAppPhone !== formik.values.whatsAppPhone ||
      prevValues.current.toggleChecked !== formik.values.toggleChecked;

    if (hasChanged) {
      const updatedData = {
        document: formik.values.document,
        documentNumber: formik.values.documentNumber,
        name: formik.values.name,
        lastName: formik.values.lastName,
        email: formik.values.email,
        phone: formik.values.phone,
        toggleChecked: formik.values.toggleChecked,
        whatsAppPhone: formik.values.whatsAppPhone,
      };

      handleOnChange(updatedData);
      prevValues.current = { ...formik.values };
    }
  }, [formik.values, handleOnChange]);

  useEffect(() => {
    handleOnChange(formik.values);
  }, []);

  return (
    <Fieldset>
      <Stack direction="column" padding="24px">
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
        <FieldsetInube legend="Móvil" type="body" size="medium">
          <Stack wrap="wrap" width="100%" gap="16px">
            <Stack width={isMobile ? "100%" : "25vw"}>
              <Phonefield
                name="phone"
                id="phone"
                type="number"
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
                fullwidth={isMobile ? true : true}
              />
            </Stack>
            <Stack
              direction={isMobile ? "column" : "initial"}
              width={isMobile ? "50vw" : "auto"}
              gap="16px"
            >
              <Stack direction="column" gap="16px">
                <Text>{dataContactInformation.useWhatsApp}</Text>
                <Stack>
                  <Toggle
                    checked={formik.values.toggleChecked}
                    onChange={() => {
                      const newValue = !formik.values.toggleChecked;
                      formik.setFieldValue("toggleChecked", newValue);
                      if (newValue) {
                        formik.setFieldValue("whatsAppPhone", "");
                      }
                    }}
                  />
                  <Text
                    type="label"
                    size="large"
                    weight="bold"
                    appearance={
                      formik.values.toggleChecked ? "success" : "danger"
                    }
                  >
                    {formik.values.toggleChecked
                      ? dataContactInformation.yes
                      : dataContactInformation.no}
                  </Text>
                </Stack>
              </Stack>
              {!formik.values.toggleChecked && (
                <Stack width={isMobile ? "80%" : "25vw"}>
                  <Phonefield
                    name="whatsAppPhone"
                    id="whatsAppPhone"
                    type="number"
                    placeholder={dataContactInformation.placeWhatsApp}
                    label={dataContactInformation.cardWhatsApp}
                    size="compact"
                    value={formik.values.whatsAppPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={
                      formik.touched.whatsAppPhone &&
                      formik.values.whatsAppPhone !== "" &&
                      formik.errors.whatsAppPhone
                        ? "invalid"
                        : undefined
                    }
                    message={dataContactInformation.failedPhone}
                    fullwidth={isMobile ? false : true}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
        </FieldsetInube>
      </Stack>
    </Fieldset>
  );
}
