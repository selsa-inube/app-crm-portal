import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid } from "@inubekit/grid";
import { Select } from "@inubekit/select";
import { Stack } from "@inubekit/stack";
import { Textarea } from "@inubekit/textarea";
import { Textfield } from "@inubekit/textfield";

import { Fieldset } from "@components/data/Fieldset";
import { optionsOfferedstate } from "@mocks/filing-application/property-offered/propertyoffered.mock";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { IVehicleOffered } from "../../types";
import { dataVehicule } from "./config";

interface IVehicleOfferedProps {
  isMobile: boolean;
  initialValues: IVehicleOffered;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IVehicleOffered) => void;
}

export function VehicleOffered(props: IVehicleOfferedProps) {
  const { isMobile, initialValues, onFormValid, handleOnChange } = props;

  const validationSchema = Yup.object({
    state: Yup.string(),
    model: Yup.lazy((_, { parent }) =>
      parent.state === "nuevo" ? Yup.number() : Yup.number(),
    ),
    value: Yup.number(),
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
      prevValues.current.state !== formik.values.state ||
      prevValues.current.model !== formik.values.model ||
      prevValues.current.value !== formik.values.value ||
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
            name="state"
            id="state"
            label={dataVehicule.labelState}
            placeholder={dataVehicule.placeHolderState}
            size="compact"
            options={optionsOfferedstate}
            onBlur={formik.handleBlur}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            value={formik.values.state}
            fullwidth
          />
          <Textfield
            name="model"
            id="model"
            label={dataVehicule.labelModel}
            placeholder={dataVehicule.placeHolderModel}
            size="compact"
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.values.state === "nuevo"}
            fullwidth
          />
          <Textfield
            name="value"
            id="value"
            label={dataVehicule.labelValue}
            placeholder={dataVehicule.placeHolderValue}
            size="compact"
            value={validateCurrencyField("value", formik, true, "")}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            onBlur={formik.handleBlur}
            fullwidth
          />
        </Grid>
        <Textarea
          name="description"
          id="description"
          label={dataVehicule.labelDescription}
          placeholder={dataVehicule.placeDescription}
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
