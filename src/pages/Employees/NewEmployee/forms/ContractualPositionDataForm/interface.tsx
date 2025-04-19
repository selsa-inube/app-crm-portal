import { FormikProps } from "formik";
import * as Yup from "yup";
import { Stack, Button, Date, Grid, useMediaQuery, Select } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";
import { getFieldState, isRequired } from "@utils/forms";

import { IContractualPositionData } from "./types";
import { StyledContainer } from "./styles";

interface ContractualPositionDataFormUIProps {
  formik: FormikProps<IContractualPositionData>;
  validationSchema: Yup.ObjectSchema<Yup.AnyObject>;
  loading?: boolean;
  withNextButton?: boolean;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

function ContractualPositionDataFormUI(props: ContractualPositionDataFormUIProps) {
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
                label="Marco normativo"
                placeholder="Selecciona una opción"
                name="normativeFramework"
                id="normativeFramework"
                value={formik.values.normativeFramework}
                message={formik.errors.normativeFramework}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "normativeFramework")}
                onChange={(value) => {
                  void formik.setFieldValue("normativeFramework", value);
                }}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Tipo de contrato"
                placeholder="Selecciona una opción"
                name="contractType"
                id="contractType"
                value={formik.values.contractType}
                message={formik.errors.contractType}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "contractType")}
                onChange={(value) => {
                  void formik.setFieldValue("contractType", value);
                }}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Date
                label="Fecha de inicio"
                name="startDate"
                id="startDate"
                value={formik.values.startDate}
                status={getFieldState(formik, "startDate")}
                message={formik.errors.startDate}
                disabled={loading}
                size="compact"
                fullwidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required={isRequired(validationSchema, "startDate")}
              />

              <Date
                label="Fecha de finalización"
                name="endDate"
                id="endDate"
                value={formik.values.endDate}
                status={getFieldState(formik, "endDate")}
                message={formik.errors.endDate}
                disabled={true}
                size="compact"
                fullwidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required={isRequired(validationSchema, "endDate")}
              />

              <Select
                label="Empresa"
                placeholder="Selecciona una opción"
                name="company"
                id="company"
                value={formik.values.company}
                message={formik.errors.company}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "company")}
                onChange={(value) => void formik.setFieldValue("company", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Jornada laboral"
                placeholder="Selecciona una opción"
                name="workingShift"
                id="workingShift"
                value={formik.values.workingShift}
                message={formik.errors.workingShift}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "workingShift")}
                onChange={(value) => void formik.setFieldValue("workingShift", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Equipo de trabajo"
                placeholder="Selecciona una opción"
                name="team"
                id="team"
                value={formik.values.team}
                message={formik.errors.team}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "team")}
                onChange={(value) => void formik.setFieldValue("team", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Cargo"
                placeholder="Selecciona una opción"
                name="position"
                id="position"
                value={formik.values.position}
                message={formik.errors.position}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "position")}
                onChange={(value) => void formik.setFieldValue("position", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Perfil salarial"
                placeholder="Selecciona una opción"
                name="salaryProfile"
                id="salaryProfile"
                value={formik.values.salaryProfile}
                message={formik.errors.salaryProfile}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "salaryProfile")}
                onChange={(value) => void formik.setFieldValue("salaryProfile", value)}
                onBlur={formik.handleBlur}
                options={[]}
              />

              <Select
                label="Modalidad"
                placeholder="Selecciona una opción"
                name="jobMode"
                id="jobMode"
                value={formik.values.jobMode}
                message={formik.errors.jobMode}
                disabled={loading}
                size="compact"
                fullwidth
                required={isRequired(validationSchema, "jobMode")}
                onChange={(value) => void formik.setFieldValue("jobMode", value)}
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

export { ContractualPositionDataFormUI };
