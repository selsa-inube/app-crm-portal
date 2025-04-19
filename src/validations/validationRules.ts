import * as Yup from "yup";
import { validationMessages } from "./validationMessages";

const validationRules = {
  daysOff: Yup.number()
    .min(1, validationMessages.minNumbers(1))
    .max(15, validationMessages.maxDays(15))
    .required(validationMessages.required),

  startDate: Yup.date()
    .required(validationMessages.required)
    .typeError(validationMessages.date)
    .min(new Date(), validationMessages.notPastDate),

  observations: Yup.string().max(120, validationMessages.maxCharacters(120)),

  certification: Yup.string()
    .required(validationMessages.required)
    .max(100, validationMessages.maxCharacters(100)),

  addressee: Yup.string()
    .required(validationMessages.required)
    .max(100, validationMessages.maxCharacters(100)),

  contract: Yup.string()
    .required(validationMessages.required)
    .max(100, validationMessages.maxCharacters(100)),

  names: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, validationMessages.onlyLetters)
    .required(validationMessages.required)
    .max(50, validationMessages.maxCharacters(50)),

  lastNames: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, validationMessages.onlyLetters)
    .required(validationMessages.required)
    .max(50, validationMessages.maxCharacters(50)),

  identificationNumber: Yup.string()
    .matches(/^[0-9]+$/, validationMessages.onlyNumbers)
    .required(validationMessages.required)
    .min(6, validationMessages.minNumbers(6))
    .max(15, validationMessages.maxNumbers(15)),
};

export { validationRules };
