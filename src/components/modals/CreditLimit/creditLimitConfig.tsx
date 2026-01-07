import { Stack, SkeletonLine } from "@inubekit/inubekit";

import { StyledList } from "./styles";

export const creditLimitTexts = {
  close: {
    code: "Close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  maxPaymentCapacity: {
    code: "Max_payment_capacity_vacation_credit",
    description: "Max payment capacity for vacation credit",
    i18n: {
      en: "Max cap for vacation credit",
      es: "Tope máx. para Crédito vacacional",
    },
  },
  maxReciprocity: {
    code: "Max_amount_by_reciprocity",
    description: "Max amount by reciprocity",
    i18n: {
      en: "Max amount by reciprocity",
      es: "Monto máx. según reciprocidad",
    },
  },
  maxDebtFRC: {
    code: "max_amount_by_payment_capacity",
    description: "Max amount by payment capacity",
    i18n: {
      en: "Max amount by payment capacity",
      es: "Monto máx. según capacidad de pago",
    },
  },
  maxIndebtedness: {
    code: "Max_indebtedness_risk_analysis",
    description: "Max indebtedness by risk analysis",
    i18n: {
      en: "Max indebtedness by risk analysis",
      es: "Endeudamiento máx. x análisis de riesgo",
    },
  },
  assignedLimit: {
    code: "Custom_assigned_limit",
    description: "Custom assigned limit",
    i18n: {
      en: "Custom limit assigned by business unit",
      es: "Monto máx. personalizado por U.N.",
    },
  },
  maxUsableLimit: {
    code: "Max_usable_limit",
    description: "Maximum usable limit",
    i18n: {
      en: "Maximum usable limit",
      es: "Cupo máximo utilizable",
    },
  },
  maxMount: {
    code: "Maximum_amount",
    description: "Maximum amount",
    i18n: {
      en: "Maximum amount",
      es: "Monto máximo",
    },
  },
  maxUsableQuote: {
    code: "Max_usable_limit_description",
    description: "Max usable limit description",
    i18n: {
      en: (
        <>
          The lowest of the above is your <strong>maximum</strong> usable limit.
        </>
      ),
      es: (
        <>
          El menor de los anteriores es su cupo <strong>máximo</strong>{" "}
          utilizable.
        </>
      ),
    },
  },
  currentPortfolio: {
    code: "Current_portfolio",
    description: "Current portfolio",
    i18n: {
      en: "(-) Current portfolio",
      es: "(-) Cartera vigente",
    },
  },
  availableLimitWithoutGuarantee: {
    code: "Available_limit_without_guarantee",
    description: "Available limit without guarantee",
    i18n: {
      en: "Available limit without guarantee",
      es: "Cupo disponible sin garantía",
    },
  },
  error: {
    title: {
      code: "Credit_limit_error_title",
      description: "Credit limit error title",
      i18n: {
        en: "Error loading data",
        es: "Error cargando datos",
      },
    },
    message: {
      code: "Credit_limit_error_message",
      description: "Credit limit error message",
      i18n: {
        en: "The data could not be loaded. Please try again later.",
        es: "No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.",
      },
    },
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
