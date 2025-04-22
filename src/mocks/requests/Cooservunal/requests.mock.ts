import { ICreditRequest } from "@services/types";

export const mockRequests: ICreditRequest[] = [
  {
    creditRequestCode: "999994",
    creditRequestDateOfCreation: "2021-11-15T00:00:00-05:00",
    loanAmount: 60000000,
    clientId: "212754",
    moneyDestinationId: "LIBRE",
    stage: "VERIFICACION_APROBACION",
    moneyDestinationAbreviatedName: "LIBRE GNR TEST",
    clientIdentificationNumber: "1000970874",
    clientName: "ANA SOFIA MARTINEZ LOPEZ",
    taskToBeDone: "Confirmar que la Verificación y aprobación se ha efectuado",
  },
  {
    creditRequestCode: "999995",
    creditRequestDateOfCreation: "2022-01-20T00:00:00-05:00",
    loanAmount: 55000000,
    clientId: "212755",
    moneyDestinationId: "LIBRE",
    stage: "VERIFICACION_APROBACION",
    moneyDestinationAbreviatedName: "LIBRE GNR TEST",
    clientIdentificationNumber: "1000970875",
    clientName: "JULIANA HERNANDEZ CASTRO",
    taskToBeDone: "Confirmar que la Verificación y aprobación se ha efectuado",
  },
];
