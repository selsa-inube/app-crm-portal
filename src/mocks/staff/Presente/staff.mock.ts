import { IStaff } from "../types";

export const mockAnalyst: IStaff[] = [
  {
    userId: "12345678",
    userName: "Juan Carlos Pérez Gómez",
    identificationType: "C",
    identificationNumber: "3001234567",
    role: "Analyst",
  },
  {
    userId: "23456789",
    userName: "María Fernanda López Rodríguez",
    identificationType: "C",
    identificationNumber: "3002345678",
    role: "Analyst",
  },
];

export const mockAccountManager: IStaff[] = [
  {
    userId: "90123456",
    userName: "Ricardo José Fernández Muñoz",
    identificationType: "C",
    identificationNumber: "3009012345",
    role: "Account_manager",
  },
];
