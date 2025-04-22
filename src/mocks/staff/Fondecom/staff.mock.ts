import { IStaff } from "@services/types";

export const mockAnalyst: IStaff[] = [
  {
    userId: "12345678",
    userName: "Juan Carlos Pérez Gómez",
    identificationType: "C",
    identificationNumber: "3001234567",
    role: "Analyst",
  },
  {
    userId: "34567890",
    userName: "Carlos Andrés Martínez Torres",
    identificationType: "C",
    identificationNumber: "3003456789",
    role: "Analyst",
  },
];

export const mockAccountManager: IStaff[] = [
  {
    userId: "78901234",
    userName: "Jorge Enrique Díaz Vargas",
    identificationType: "C",
    identificationNumber: "3007890123",
    role: "Account_manager",
  },
];
