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
import { IContactInformation } from "@pages/applyForCredit/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataContactInformation } from "./config";

interface IContactInformationProps {
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IContactInformation) => void;
  isMobile: boolean;
  initialValues: IContactInformation;
  customerData: ICustomerData;
  lang: EnumType;
}

export function ContactInformation(props: IContactInformationProps) {
  const {
    onFormValid,
    handleOnChange,
    isMobile,
    initialValues,
    customerData,
    lang,
  } = props;

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
      .required(""),
    phone: Yup.string()
      .matches(/^(\+\d{1,3})?\d{10,14}$/, "invlid phone number")
      .required(""),
    toggleChecked: Yup.boolean(),
    whatsAppPhone: Yup.string()
      .matches(/^(\+\d{1,3})?\d{10,14}$/, "invlid phone number")
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
    phoneDial: initialValues.phoneDial,
    whatsAppDial: initialValues.whatsAppDial,
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
        ...formik.values,
      };

      handleOnChange(updatedData);
      prevValues.current = { ...formik.values };
    }
  }, [formik.values, handleOnChange]);

  useEffect(() => {
    handleOnChange(formik.values);
  }, []);

  useEffect(() => {
    formik.validateForm();
  }, [formik.values.toggleChecked]);

  return (
    <Fieldset hasOverflow={true}>
      <Stack direction="column" padding="24px">
        <Input
          name="email"
          id="email"
          type="email"
          placeholder={dataContactInformation.placeEmail.i18n[lang]}
          label={dataContactInformation.cardEmail.i18n[lang]}
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
          message={dataContactInformation.failedEmail.i18n[lang]}
          fullwidth
        />
        <FieldsetInube legend="Móvil">
          <Stack wrap="wrap" width="100%" gap="16px">
            <Stack width={isMobile ? "100%" : "40%"}>
              <Phonefield
                name="phone"
                id="phone"
                placeholder={dataContactInformation.placePhone.i18n[lang]}
                label={dataContactInformation.cardPhone.i18n[lang]}
                size="compact"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                initialCountryCode="COL"
                onDialValueChange={(dial) => {
                  if (formik.values.phoneDial !== dial) {
                    formik.setFieldValue("phoneDial", dial);
                  }
                }}
                status={
                  formik.touched.phone &&
                  formik.values.phone !== "" &&
                  formik.errors.phone
                    ? "invalid"
                    : undefined
                }
                message={dataContactInformation.failedPhone.i18n[lang]}
                fullwidth={isMobile ? true : true}
              />
            </Stack>
            <Stack
              direction={isMobile ? "column" : "initial"}
              width={isMobile ? "50vw" : "auto"}
              gap="16px"
            >
              <Stack direction="column" gap="16px">
                <Text>{dataContactInformation.useWhatsApp.i18n[lang]}</Text>
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
                      ? dataContactInformation.yes.i18n[lang]
                      : dataContactInformation.no.i18n[lang]}
                  </Text>
                </Stack>
              </Stack>
              {!formik.values.toggleChecked && (
                <Stack width={isMobile ? "80%" : "320px"}>
                  <Phonefield
                    name="whatsAppPhone"
                    id="whatsAppPhone"
                    placeholder={
                      dataContactInformation.placeWhatsApp.i18n[lang]
                    }
                    label={dataContactInformation.cardWhatsApp.i18n[lang]}
                    size="compact"
                    value={formik.values.whatsAppPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    initialCountryCode="COL"
                    onDialValueChange={(dial) => {
                      if (formik.values.whatsAppDial !== dial) {
                        formik.setFieldValue("whatsAppDial", dial);
                      }
                    }}
                    status={
                      formik.touched.whatsAppPhone &&
                      formik.values.whatsAppPhone !== "" &&
                      formik.errors.whatsAppPhone
                        ? "invalid"
                        : undefined
                    }
                    message={dataContactInformation.failedPhone.i18n[lang]}
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
