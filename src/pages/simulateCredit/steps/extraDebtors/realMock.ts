import { IBorrower } from "@services/prospect/types";

export const mockServiceResponse: IBorrower[] =  [
    {
      borrowerName: "Andres Giraldo Hurtado",
      borrowerType: "MainBorrower",
      borrowerIdentificationType: "CitizenshipID",
      borrowerIdentificationNumber: "16378491",
      borrowerProperties: [
        { propertyName: "FinancialObligation", propertyValue: "consumo, 8000000, 550000, Bancolombia, Activa, 12546, 5, 60" },
        { propertyName: "FinancialObligation", propertyValue: "tarjeta, 3000000, 150000, Davivienda, Activa, 9876, 10, 36" },
        { propertyName: "name", propertyValue: "Andrés" },
        { propertyName: "surname", propertyValue: "Giraldo Hurtado" },
        { propertyName: "email", propertyValue: "andres.giraldo@gmail.com" },
        { propertyName: "biological_sex", propertyValue: "male" },
        { propertyName: "phone_number", propertyValue: "3102330109" },
        { propertyName: "birth_date", propertyValue: "1987-01-02T15:04:05Z" },
        { propertyName: "relationship", propertyValue: "brother" },
        { propertyName: "PensionAllowances", propertyValue: "1700360" },
        { propertyName: "PersonalBusinessUtilities", propertyValue: "640900" },
        { propertyName: "Dividends", propertyValue: "1716460" },
        { propertyName: "Leases", propertyValue: "1216010" },
        { propertyName: "PeriodicSalary", propertyValue: "0" },
        { propertyName: "ProfessionalFees", propertyValue: "0" },
        { propertyName: "FinancialIncome", propertyValue: "0" },
        { propertyName: "OtherNonSalaryEmoluments", propertyValue: "0" },
      ],
    },
    {
      borrowerName: "Luisa Martinez",
      borrowerType: "Borrower", // Cambiado de 'Test' a un tipo más realista
      borrowerIdentificationType: "CitizenshipID",
      borrowerIdentificationNumber: "1010477949",
      borrowerProperties: [
        { propertyName: "FinancialObligation", propertyValue: "vehiculo, 45000000, 1200000, Sufi, Activa, 5544, 24, 72" },
        { propertyName: "FinancialObligation", propertyValue: "hipotecario, 150000000, 1800000, BBVA, Activa, 7788, 120, 240" },
        { propertyName: "FinancialObligation", propertyValue: "hipotecario, 150000000, 1800000, BBVA, Activa, 7788, 120, 240" },
        { propertyName: "FinancialObligation", propertyValue: "hipotecario, 150000000, 1800000, BBVA, Activa, 7788, 120, 240" },
        { propertyName: "FinancialObligation", propertyValue: "hipotecario, 150000000, 1800000, BBVA, Activa, 7788, 120, 240" },
        { propertyName: "FinancialObligation", propertyValue: "hipotecario, 150000000, 1800000, BBVA, Activa, 7788, 120, 240" },
        { propertyName: "name", propertyValue: "Luisa Fernanda" },
        { propertyName: "surname", propertyValue: "Martinez Rojas" },
        { propertyName: "email", propertyValue: "luisa.martinez@example.com" },
        { propertyName: "biological_sex", propertyValue: "female" },
        { propertyName: "phone_number", propertyValue: "3208559632" },
        { propertyName: "birth_date", propertyValue: "1992-05-15T08:00:00Z" },
        { propertyName: "relationship", propertyValue: "spouse" },
        { propertyName: "PeriodicSalary", propertyValue: "4500000" },
        { propertyName: "ProfessionalFees", propertyValue: "1200000" },
        { propertyName: "PensionAllowances", propertyValue: "0" },
        { propertyName: "PersonalBusinessUtilities", propertyValue: "0" },
        { propertyName: "Dividends", propertyValue: "0" },
        { propertyName: "FinancialIncome", propertyValue: "0" },
        { propertyName: "Leases", propertyValue: "0" },
        { propertyName: "OtherNonSalaryEmoluments", propertyValue: "0" },
      ]
    }
  ];