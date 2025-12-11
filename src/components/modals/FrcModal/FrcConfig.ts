export const frcConfig = {
  title: "Endeudamiento máximo x FRC",
  subTitle: "Score de riesgo",
  totalScoreLabel: "Puntaje total",
  totalScoreMax: "/1000",
  seniorityLabel: "Antigüedad",
  seniorityMax: "/200",
  centralRiskLabel: "Central de riesgo",
  centralRiskMax: "/200",
  employmentStabilityLabel: "Índice de estabilidad laboral",
  employmentStabilityMax: "/300",
  maritalStatusLabel: "Estado civil - Casado",
  maritalStatusMax: "/50",
  economicActivityLabel: "Actividad economica - Pensionado",
  economicActivityMax: "/200",
  incomesLabel: "(+) Ingresos mensuales",
  timesIncome: "(x) No. de veces el ingreso para este score",
  maxIndebtedness: "Endeudamiento máximo",
  closeBtn: "Cerrar",
  loading: "Cargando...",
  intercept: "Intercepto",
  maxLimit: "(=) Tope máximo",
  totalPortafolio: "(-) Cartera total vigente",
  scoreLabel: "749",
  loremIpsum:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  infoTexts: {
    intercept:
      "El intercepto es el valor base inicial del análisis de riesgo crediticio. Representa el punto de partida del score antes de aplicar otras variables.",
    seniority:
      "La antigüedad evalúa el tiempo de relación del cliente con la entidad. Mayor antigüedad generalmente indica mayor estabilidad y confianza.",
    centralRisk:
      "La central de riesgo verifica el historial crediticio del cliente en el sistema financiero. Un buen comportamiento mejora el puntaje.",
    employmentStability:
      "Este índice mide la estabilidad laboral del cliente. Considera tiempo en el empleo actual y tipo de vinculación laboral.",
    maritalStatus:
      "El estado civil puede influir en la capacidad de pago. Algunos estados civiles se consideran de mayor estabilidad financiera.",
    economicActivity:
      "La actividad económica clasifica la fuente de ingresos. Diferentes actividades tienen distintos niveles de riesgo asociados.",
  },
  error: {
    title: "Error cargando datos",
    message:
      "No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.",
  },
};

export type InfoModalType =
  | "intercept"
  | "seniority"
  | "centralRisk"
  | "employmentStability"
  | "maritalStatus"
  | "economicActivity";
