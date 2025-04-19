import { FormikProps } from "formik";
import { ObjectSchema, AnyObject } from "yup";
import { Stack, Button, Select, Textarea, Textfield, useMediaQuery } from "@inubekit/inubekit";

import { isRequired } from "@utils/forms/forms";
import { spacing } from "@design/tokens/spacing";
import { getFieldState } from "@utils/forms/forms";
import {
  certificationOptions,
  contractOptions,
} from "@pages/holidays/RequestPayment/config/assisted.config";

import { IGeneralInformationEntry } from "./types";
import { StyledContainer } from "./styles";

function getDisabledState(loading: boolean | undefined, isValid: boolean) {
  return loading ? true : !isValid;
}

interface GeneralInformationFormUIProps {
  formik: FormikProps<IGeneralInformationEntry>;
  validationSchema: ObjectSchema<AnyObject>;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
}

function GeneralInformationFormUI(props: GeneralInformationFormUIProps) {
  const { formik, loading, withNextButton, validationSchema, handleNextStep } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <form>
      <Stack direction="column" gap={isMobile ? spacing.s300 : spacing.s400}>
        <StyledContainer $isMobile={isMobile}>
          <Stack direction="column" width="100%" gap={spacing.s250}>
            <Stack direction={isMobile ? "column" : "row"} gap={spacing.s250}>
              <Textfield
                label="Días hábiles a pagar"
                placeholder="Ej: 2"
                name="daysToPay"
                id="daysToPay"
                type="number"
                value={formik.values.daysToPay}
                status={getFieldState(formik, "daysToPay")}
                message={formik.errors.daysToPay}
                disabled={loading}
                size="compact"
                fullwidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required={isRequired(validationSchema, "daysToPay")}
              />

              <Select
                label="Contrato"
                name="contract"
                id="contract"
                options={certificationOptions}
                placeholder="Selecciona un contrato"
                value={formik.values.contract}
                message={formik.errors.contract}
                disabled={getDisabledState(
                  loading,
                  contractOptions.length !== 1 || !formik.values.contract,
                )}
                size="compact"
                fullwidth
                onBlur={formik.handleBlur}
                onChange={(name, value) => {
                  formik.setFieldValue(name, value);
                }}
                required={isRequired(validationSchema, "contract")}
              />
            </Stack>

            <Textarea
              label="Observaciones"
              placeholder="Detalles a tener en cuenta."
              name="observations"
              id="observations"
              value={formik.values.observations}
              maxLength={120}
              disabled={loading}
              status={getFieldState(formik, "observations")}
              message={formik.errors.observations}
              fullwidth
              required={isRequired(validationSchema, "observations")}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Stack>
        </StyledContainer>

        {withNextButton && (
          <Stack justifyContent="flex-end">
            <Button
              fullwidth={isMobile}
              onClick={handleNextStep}
              disabled={getDisabledState(loading, formik.isValid)}
            >
              Siguiente
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
}

export { GeneralInformationFormUI };
