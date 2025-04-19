import { FormikProps } from "formik";
import * as Yup from "yup";
import { Stack, Button, Grid, useMediaQuery, Select } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";
import { isRequired } from "@utils/forms";

import { ILegalAccountingLocation } from "./types";
import { StyledContainer } from "./styles";

interface LegalAccountingLocationFormUIProps {
  formik: FormikProps<ILegalAccountingLocation>;
  validationSchema: Yup.ObjectSchema<Yup.AnyObject>;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

function LegalAccountingLocationFormUI(props: LegalAccountingLocationFormUIProps) {
  const { formik, loading, withNextButton, validationSchema, handleNextStep, handlePreviousStep } =
    props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <form>
      <Stack direction="column" gap={isMobile ? spacing.s300 : spacing.s400}>
        <StyledContainer $isMobile={isMobile}>
          <Stack direction="column" width="100%" gap={spacing.s250}>
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              gap={spacing.s200}
              width="100%"
              autoRows="unset"
            >
              <Select
                label="Proyecto"
                placeholder="Selecciona una opción"
                name="proyect"
                id="proyect"
                value={formik.values.proyect}
                message={formik.errors.proyect}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "proyect")}
                onChange={(value) => {
                  void formik.setFieldValue("proyect", value);
                }}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Segmentación zonal"
                placeholder="Selecciona una opción"
                name="zonalSegmentation"
                id="zonalSegmentation"
                value={formik.values.zonalSegmentation}
                message={formik.errors.zonalSegmentation}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "zonalSegmentation")}
                onChange={(value) => {
                  void formik.setFieldValue("zonalSegmentation", value);
                }}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Centro de costo"
                placeholder="Selecciona una opción"
                name="costCenter"
                id="costCenter"
                value={formik.values.costCenter}
                message={formik.errors.costCenter}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "costCenter")}
                onChange={(value) => void formik.setFieldValue("costCenter", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />
            </Grid>
          </Stack>
        </StyledContainer>

        {withNextButton && (
          <Stack justifyContent="flex-end" gap={spacing.s250}>
            <Button onClick={handlePreviousStep} appearance="gray" variant="outlined">
              Anterior
            </Button>
            <Button onClick={handleNextStep} disabled={loading ?? !formik.isValid}>
              Siguiente
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
}

export { LegalAccountingLocationFormUI };
