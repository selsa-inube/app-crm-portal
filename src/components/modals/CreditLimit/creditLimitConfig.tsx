import { Stack, SkeletonLine } from "@inubekit/inubekit";

import { StyledList } from "./styles";

export const creditLimitTexts = {
  close: "Cerrar",
  maxPaymentCapacity: "Tope máx. para Crédito vacacional",
  maxReciprocity: "Monto máx. según reciprocidad",
  maxDebtFRC: "Monto máx. según capacidad de pago",
  maxIndebtedness: "Endeudamiento máx. x análisis de riesgo",
  assignedLimit: "Monto máx. personalizado por U.N..",
  maxUsableLimit: "Cupo máximo utilizable",
  maxMount: "Monto máximo",
  maxUsableQuote: (
    <>
      El menor de los anteriores es su cupo <strong>máximo</strong> utilizable.
    </>
  ),
  currentPortfolio: "(-) Cartera vigente",
  availableLimitWithoutGuarantee: "Cupo disponible sin garantía",
  error: {
    title: "Error cargando datos",
    message:
      "No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.",
  },
};

export const renderSkeletons = () => (
  <StyledList>
    <Stack direction="column" gap="12px" height="160px">
      {Array.from({ length: 5 }).map(() => (
        <>
          <Stack justifyContent="space-between" alignItems="center">
            <SkeletonLine width="60%" height="24px" animated={true} />

            <Stack alignItems="center" gap="10px">
              <SkeletonLine width="80px" height="24px" animated={true} />
              <SkeletonLine width="16px" height="16px" animated={true} />
            </Stack>
          </Stack>
        </>
      ))}
    </Stack>
  </StyledList>
);
