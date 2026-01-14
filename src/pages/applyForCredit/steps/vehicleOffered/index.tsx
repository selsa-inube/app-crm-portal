import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Grid, Select, Textarea, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { optionsOfferedstate } from "@mocks/filing-application/property-offered/propertyoffered.mock";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { EnumType } from "@hooks/useEnum/useEnum";

import { IVehicleOffered } from "../../types";
import { dataVehicule } from "./config";

interface IVehicleOfferedProps {
  isMobile: boolean;
  initialValues: IVehicleOffered;
  lang: EnumType;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IVehicleOffered) => void;
}

export function VehicleOffered(props: IVehicleOfferedProps) {
  const { isMobile, initialValues, lang, onFormValid, handleOnChange } = props;

  const validationSchema = Yup.object({
    state: Yup.string().required(),
    model: Yup.lazy((_, { parent }) =>
      parent.state === "nuevo" ? Yup.number() : Yup.number().required(),
    ),
    value: Yup.number().required(),
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
          {optionsOfferedstate.length === 1 ? (
            <Textfield
              name="state"
              id="state"
              label={dataVehicule.labelState.i18n[lang]}
              placeholder={dataVehicule.placeHolderState.i18n[lang]}
              size="compact"
              value={optionsOfferedstate[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              name="state"
              id="state"
              label={dataVehicule.labelState.i18n[lang]}
              placeholder={dataVehicule.placeHolderState.i18n[lang]}
              size="compact"
              options={optionsOfferedstate}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.state}
              fullwidth
            />
          )}
          <Textfield
            name="model"
            id="model"
            label={dataVehicule.labelModel.i18n[lang]}
            placeholder={dataVehicule.placeHolderModel.i18n[lang]}
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
            label={dataVehicule.labelValue.i18n[lang]}
            placeholder={dataVehicule.placeHolderValue.i18n[lang]}
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
          label={dataVehicule.labelDescription.i18n[lang]}
          placeholder={dataVehicule.placeDescription.i18n[lang]}
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
