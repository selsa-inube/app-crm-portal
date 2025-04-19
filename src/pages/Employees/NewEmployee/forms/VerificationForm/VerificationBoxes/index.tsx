import { Grid } from "@inubekit/inubekit";

import { BoxAttribute } from "@components/cards/BoxAttribute";
import { spacing } from "@design/tokens/spacing";
import { AlertCardProps } from "@components/data/AlertCard";

import { IFormsUpdateData } from "../../../types";
import { IPersonalDataEntry } from "../../PersonalDataForm/types";
import { IContractualPositionData } from "../../ContractualPositionDataForm/types";
import { ILegalAccountingLocation } from "../../LegalAccountingLocationForm/types";
import { IAssignment } from "../../../types";

const renderPersonalInfoVerification = (values: IPersonalDataEntry, isTablet: boolean) => (
  <Grid
    templateColumns={`repeat(${isTablet ? 1 : 2}, 1fr)`}
    autoRows="auto"
    gap={spacing.s100}
    width="100%"
  >
    <BoxAttribute label="Nombres" value={values.names} direction="column" />
    <BoxAttribute label="Apellidos" value={values.lastNames} direction="column" />
    <BoxAttribute
      label="Número de identificación"
      value={values.identificationNumber}
      direction="column"
    />
    <BoxAttribute label="Hoja de vida" value={values.attachedFile?.name} direction="column" />
  </Grid>
);

const renderContractualPositionVerification = (
  values: IContractualPositionData,
  isTablet: boolean,
) => (
  <Grid
    templateColumns={`repeat(${isTablet ? 1 : 2}, 1fr)`}
    autoRows="auto"
    gap={spacing.s100}
    width="100%"
  >
    <BoxAttribute label="Marco normativo" value={values.normativeFramework} direction="column" />
    <BoxAttribute label="Tipo de contrato" value={values.contractType} direction="column" />
    <BoxAttribute label="Fecha de inicio" value={values.startDate} direction="column" />
    <BoxAttribute label="Fecha de finalización" value={values.endDate} direction="column" />
    <BoxAttribute label="Empresa" value={values.company} direction="column" />
    <BoxAttribute label="Jornada laboral" value={values.workingShift} direction="column" />
    <BoxAttribute label="Equipo de trabajo" value={values.team} direction="column" />
    <BoxAttribute label="Cargo" value={values.position} direction="column" />
    <BoxAttribute label="Perfil salarial" value={values.salaryProfile} direction="column" />
    <BoxAttribute label="Modalidad" value={values.jobMode} direction="column" />
  </Grid>
);

const renderLegalAccountingLocationVerification = (
  values: ILegalAccountingLocation,
  isTablet: boolean,
) => (
  <Grid
    templateColumns={`repeat(${isTablet ? 1 : 2}, 1fr)`}
    autoRows="auto"
    gap={spacing.s100}
    width="100%"
  >
    <BoxAttribute label="Proyecto" value={values.proyect} direction="column" />
    <BoxAttribute label="Segmentación zonal" value={values.zonalSegmentation} direction="column" />
    <BoxAttribute label="Centro de costos" value={values.costCenter} direction="column" />
  </Grid>
);

const renderAssignmentsVerification = (assignments: IAssignment[], isTablet: boolean) => (
  <Grid
    templateColumns={`repeat(${isTablet ? 1 : 2}, 1fr)`}
    autoRows="auto"
    gap={spacing.s100}
    width="100%"
  >
    {assignments.map((assignment, index) => (
      <BoxAttribute
        key={index}
        label={assignment.assignment}
        value={assignment.value}
        direction="column"
      />
    ))}
  </Grid>
);

const renderUnmetRequirementsVerification = (
  unmetRequirements: AlertCardProps[],
  isTablet: boolean,
) => (
  <Grid
    templateColumns={`repeat(${isTablet ? 1 : 2}, 1fr)`}
    autoRows="auto"
    gap={spacing.s100}
    width="100%"
  >
    {unmetRequirements.map((requirement, index) => (
      <BoxAttribute
        key={index}
        label={`Requisito: ${requirement.requirement}`}
        value={requirement.cause}
        direction="column"
      />
    ))}
  </Grid>
);

interface VerificationBoxesProps {
  updatedData: IFormsUpdateData;
  stepKey: number;
  isTablet: boolean;
}

function VerificationBoxes({ updatedData, stepKey, isTablet }: VerificationBoxesProps) {
  return (
    <>
      {stepKey === 1 &&
        renderPersonalInfoVerification(updatedData.personalInformation.values, isTablet)}
      {stepKey === 2 &&
        renderContractualPositionVerification(updatedData.contractualPositionData.values, isTablet)}
      {stepKey === 3 &&
        renderLegalAccountingLocationVerification(
          updatedData.legalAccountingLocation.values,
          isTablet,
        )}
      {stepKey === 4 && renderAssignmentsVerification(updatedData.assignmentForm.values, isTablet)}
      {stepKey === 5 &&
        renderUnmetRequirementsVerification(updatedData.unmetRequirements.values, isTablet)}
    </>
  );
}

export { VerificationBoxes };
