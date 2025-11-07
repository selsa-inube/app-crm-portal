export const verificationDebtorAddModalConfig = {
  personalInfo: {
    title: "Información personal",
    fields: {
      documentType: "Tipo de documento",
      documentNumber: "Número de documento",
      firstName: "Primer nombre",
      lastName: "Segundo nombre",
      email: "Correo electrónico",
      phone: "Número de teléfono",
      biologicalSex: "Sexo biológico",
      age: "Edad",
      relationship: "Parentesco",
    },
  },
  incomeInfo: {
    title: "Fuentes de ingreso",
    fields: {
      totalEmploymentIncome: "Total ingresos laborales",
      totalCapitalIncome: "Total ingresos de capital",
      totalBusinessIncome: "Total ingresos de negocios",
    },
  },
  financialObligations: {
    title: "Obligaciones financieras",
  },
  stepNumbers: {
    personalInfo: 1,
    incomeInfo: 2,
    financialObligations: 3,
  },
};
