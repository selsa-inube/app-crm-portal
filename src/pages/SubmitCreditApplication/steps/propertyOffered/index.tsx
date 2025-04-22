import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid } from "@inubekit/grid";
import { Select } from "@inubekit/select";
import { Stack } from "@inubekit/stack";
import { Textarea } from "@inubekit/textarea";
import { Textfield } from "@inubekit/textfield";

import { Fieldset } from "@components/data/Fieldset";
import {
  optionsOfferedstate,
  optionsOfferedType,
} from "@mocks/filing-application/property-offered/propertyoffered.mock";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { dataProperty } from "./config";
import { IPropertyOffered } from "../../types";

interface IPropertyOfferedProps {
  isMobile: boolean;
  initialValues: IPropertyOffered;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IPropertyOffered) => void;
}

export function PropertyOffered(props: IPropertyOfferedProps) {
  const { isMobile, initialValues, onFormValid, handleOnChange } = props;

  const validationSchema = Yup.object({
    type: Yup.string(),
    state: Yup.string(),
    antique: Yup.lazy((_, { parent }) =>
      parent.state === "nuevo" ? Yup.number() : Yup.number(),
    ),
    estimated: Yup.number(),
    description: Yup.string().max(200),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const prevValues = useRef(formik.values);

  useEffect(() => {
    onFormValid(formik.isValid);
  }, [formik.isValid, onFormValid]);

  useEffect(() => {
    if (
      prevValues.current.type !== formik.values.type ||
      prevValues.current.state !== formik.values.state ||
      prevValues.current.antique !== formik.values.antique ||
      prevValues.current.estimated !== formik.values.estimated ||
      prevValues.current.description !== formik.values.description
    ) {
      handleOnChange(formik.values);
      prevValues.current = formik.values;
    }
  }, [formik.values, handleOnChange]);

  return (
    <Fieldset>
      <Stack
        direction="column"
        padding={isMobile ? "4px 10px" : "10px 16px"}
        gap="20px"
      >
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
        >
          <Select
            name="type"
            id="type"
            label={dataProperty.labelType}
            placeholder={dataProperty.placeHolderType}
            size="compact"
            options={optionsOfferedType}
            onBlur={formik.handleBlur}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            value={formik.values.type}
            fullwidth
          />
          <Select
            name="state"
            id="state"
            label={dataProperty.labelState}
            placeholder={dataProperty.placeHolderState}
            size="compact"
            options={optionsOfferedstate}
            onBlur={formik.handleBlur}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            value={formik.values.state}
            fullwidth
          />
          <Textfield
            name="antique"
            id="antique"
            type="number"
            label={dataProperty.labelAntique}
            placeholder={dataProperty.placeHolderAntique}
            size="compact"
            value={formik.values.antique}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.state === "nuevo"}
            fullwidth
          />
          <Textfield
            name="estimated"
            id="estimated"
            type="text"
            label={dataProperty.labelEstimated}
            placeholder={dataProperty.placeHolderEstimated}
            size="compact"
            value={validateCurrencyField("estimated", formik, true, "")}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            onBlur={formik.handleBlur}
            fullwidth
          />
        </Grid>
        <Textarea
          name="description"
          id="description"
          label={dataProperty.labelDescription}
          placeholder={dataProperty.placeHolderDescription}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxLength={200}
          fullwidth
        />
      </Stack>
    </Fieldset>
  );
}
