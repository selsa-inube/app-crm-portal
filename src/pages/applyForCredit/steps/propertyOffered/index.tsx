import { useEffect, useRef, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Select,
  Stack,
  Textarea,
  Textfield,
  Text,
  Spinner,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import {
  optionsOfferedstate,
  optionsOfferedType,
} from "@mocks/filing-application/property-offered/propertyoffered.mock";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { IBusinessUnitRules } from "@services/businessUnitRules/types";

import { dataProperty } from "./config";
import { IPropertyOffered } from "../../types";
import { dataError } from "../requirementsNotMet/config";

interface IPropertyOfferedProps {
  isMobile: boolean;
  initialValues: IPropertyOffered;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IPropertyOffered) => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
}

export function PropertyOffered(props: IPropertyOfferedProps) {
  const {
    isMobile,
    initialValues,
    onFormValid,
    handleOnChange,
    businessUnitPublicCode,
    businessManagerCode,
  } = props;

  const [shouldRender, setShouldRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const checkGuaranteeRule = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        { ruleName: "GuaranteeRequirements" } as IBusinessUnitRules,
      );

      const values = response?.conditions || response;
      let extractedValues: string[] = [];

      if (Array.isArray(values)) {
        extractedValues = values
          .map((item) => {
            if (typeof item === "object" && item !== null && "value" in item) {
              return item.value;
            }
            if (typeof item === "string") {
              return item;
            }
            return null;
          })
          .filter((val): val is string => val !== null && val !== "");
      }

      const includesMortgage = extractedValues.some(
        (val) => val.toLowerCase() === "mortgage",
      );
      setShouldRender(includesMortgage);
      setIsLoading(false);
    } catch (error) {
      setShouldRender(false);
      setIsLoading(false);
    }
  }, [businessUnitPublicCode, businessManagerCode]);

  useEffect(() => {
    checkGuaranteeRule();
  }, [checkGuaranteeRule]);

  useEffect(() => {
    if (shouldRender) {
      onFormValid(formik.isValid);
    } else {
      onFormValid(true);
    }
  }, [formik.isValid, shouldRender, onFormValid]);

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

  // Auto-seleccionar opciones únicas
  useEffect(() => {
    if (optionsOfferedType.length === 1) {
      const onlyOption = optionsOfferedType[0];
      formik.setFieldValue("type", onlyOption.value);
    }
  }, [optionsOfferedType]);

  useEffect(() => {
    if (optionsOfferedstate.length === 1) {
      const onlyOption = optionsOfferedstate[0];
      formik.setFieldValue("state", onlyOption.value);
    }
  }, [optionsOfferedstate]);

  if (!shouldRender && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <Fieldset>
        <Stack
          gap="16px"
          padding="16px"
          margin={isMobile ? "8px" : "16px"}
          justifyContent="center"
          direction="column"
          alignItems="center"
        >
          <Spinner />
          <Text type="title" size="medium" appearance="dark">
            {dataError.loadRequirements}
          </Text>
        </Stack>
      </Fieldset>
    );
  }

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
          {optionsOfferedType.length === 1 ? (
            <Textfield
              name="type"
              id="type"
              label={dataProperty.labelType}
              placeholder={dataProperty.placeHolderType}
              size="compact"
              value={optionsOfferedType[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
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
          )}

          {optionsOfferedstate.length === 1 ? (
            <Textfield
              name="state"
              id="state"
              label={dataProperty.labelState}
              placeholder={dataProperty.placeHolderState}
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
              label={dataProperty.labelState}
              placeholder={dataProperty.placeHolderState}
              size="compact"
              options={optionsOfferedstate}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.state}
              fullwidth
            />
          )}

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
