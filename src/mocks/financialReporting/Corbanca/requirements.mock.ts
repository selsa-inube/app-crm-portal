import { CreditRequest } from "../types";

export const requirementsMock: CreditRequest[] = [
  {
    credit_request_id: "999990",
    system_validations: {
      "Que el asociado sea activo": "N",
      "Que este al día con las obligaciones": "N",
      "Que tenga más de 30 años": "Y",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "",
      "Declaración de renta": "Y",
    },
    human_validations: {
      "Referencias laborales": "",
      "Proponer un codeudor": "N",
    },
  },
  {
    credit_request_id: "999991",
    system_validations: {
      "Que el asociado sea activo": "",
      "Que este al día con las obligaciones": "Y",
      "Que tenga más de 30 años": "N",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "N",
      "Declaración de renta": "N",
    },
    human_validations: {
      "Referencias laborales": "N",
      "Proponer un codeudor": "Y",
    },
  },
  {
    credit_request_id: "999992",
    system_validations: {
      "Que el asociado sea activo": "",
      "Que este al día con las obligaciones": "Y",
      "Que tenga más de 30 años": "N",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "N",
      "Desprendible de pago": "Y",
      "Declaración de renta": "",
    },
    human_validations: {
      "Referencias laborales": "Y",
      "Proponer un codeudor": "Y",
    },
  },
  {
    credit_request_id: "999993",
    system_validations: {
      "Que el asociado sea activo": "N",
      "Que este al día con las obligaciones": "Y",
      "Que tenga más de 30 años": "",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "",
      "Declaración de renta": "Y",
    },
    human_validations: {
      "Referencias laborales": "",
      "Proponer un codeudor": "Y",
    },
  },
  {
    credit_request_id: "999994",
    system_validations: {
      "Que el asociado sea activo": "Y",
      "Que este al día con las obligaciones": "",
      "Que tenga más de 30 años": "",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "N",
      "Declaración de renta": "",
    },
    human_validations: {
      "Referencias laborales": "Y",
      "Proponer un codeudor": "N",
    },
  },
  {
    credit_request_id: "999995",
    system_validations: {
      "Que el asociado sea activo": "",
      "Que este al día con las obligaciones": "Y",
      "Que tenga más de 30 años": "N",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "N",
      "Declaración de renta": "",
    },
    human_validations: {
      "Referencias laborales": "Y",
      "Proponer un codeudor": "",
    },
  },
  {
    credit_request_id: "999996",
    system_validations: {
      "Que el asociado sea activo": "Y",
      "Que este al día con las obligaciones": "N",
      "Que tenga más de 30 años": "N",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "Y",
      "Declaración de renta": "N",
    },
    human_validations: {
      "Referencias laborales": "Y",
      "Proponer un codeudor": "",
    },
  },
  {
    credit_request_id: "999997",
    system_validations: {
      "Que el asociado sea activo": "N",
      "Que este al día con las obligaciones": "",
      "Que tenga más de 30 años": "Y",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "N",
      "Desprendible de pago": "Y",
      "Declaración de renta": "",
    },
    human_validations: {
      "Referencias laborales": "N",
      "Proponer un codeudor": "Y",
    },
  },
  {
    credit_request_id: "999998",
    system_validations: {
      "Que el asociado sea activo": "Y",
      "Que este al día con las obligaciones": "Y",
      "Que tenga más de 30 años": "N",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "Y",
      "Desprendible de pago": "N",
      "Declaración de renta": "Y",
    },
    human_validations: {
      "Referencias laborales": "Y",
      "Proponer un codeudor": "N",
    },
  },
  {
    credit_request_id: "999999",
    system_validations: {
      "Que el asociado sea activo": "N",
      "Que este al día con las obligaciones": "N",
      "Que tenga más de 30 años": "",
    },
    documentary_requirements: {
      "Imagenes de la Cédula de ciudadanía": "N",
      "Desprendible de pago": "Y",
      "Declaración de renta": "Y",
    },
    human_validations: {
      "Referencias laborales": "",
      "Proponer un codeudor": "N",
    },
  },
];
