import { useEffect, useRef } from "react";
import { Stack, Text, Textarea } from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Fieldset } from "@components/data/Fieldset";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataObservations } from "./config";

interface IObservationsProps {
  initialValues: {
    relevantObservations: string;
  };
  isMobile: boolean;
  lang: EnumType;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: { relevantObservations: string }) => void;
}

export function Observations(props: IObservationsProps) {
  const { initialValues, isMobile, lang, onFormValid, handleOnChange } = props;

  const validationSchema = Yup.object({
    relevantObservations: Yup.string().required().max(200),
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
      prevValues.current.relevantObservations !==
      formik.values.relevantObservations
    ) {
      handleOnChange(formik.values);
      prevValues.current = formik.values;
    }
  }, [formik.values, handleOnChange]);

  return (
    <Fieldset>
      <Stack direction="column" padding="8px 16px">
        {isMobile && (
          <Stack>
            <Text type="label" size="large" weight="bold">
              {dataObservations.relevantObservations.i18n[lang]}
            </Text>
          </Stack>
        )}
        <Textarea
          id="relevantObservations"
          name="relevantObservations"
          label={
            !isMobile ? dataObservations.relevantObservations.i18n[lang] : ""
          }
          placeholder={
            dataObservations.placeHolderRelevantObservations.i18n[lang]
          }
          value={formik.values.relevantObservations}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          required={true}
          maxLength={200}
        />
      </Stack>
    </Fieldset>
  );
}
