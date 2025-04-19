import React from "react";

import {
  IStaffPortalByBusinessManager,
  IStaffUserAccount,
} from "@ptypes/staffPortalBusiness.types";
import { IBusinessUnit } from "@ptypes/employeePortalBusiness.types";
import { Employee } from "@ptypes/employeePortalConsultation.types";

interface BusinessManager {
  id: string;
  publicCode: string;
  language: string;
  abbreviatedName: string;
  description: string;
  urlBrand: string;
  urlLogo: string;
  customerId: string;
}

export interface IPreferences {
  boardOrientation: "vertical" | "horizontal";
  showPinnedOnly: boolean;
}

export interface IClient {
  id: string;
  name: string;
  sigla: string;
  logo: string;
}

export interface IUser {
  username: string;
  id: string;
  company: string;
  urlImgPerfil: string;
  email: string;
}

export interface IAppContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IAppContextType["user"]>>;
  preferences: IPreferences;
  updatePreferences: (newPreferences: Partial<IPreferences>) => void;
  logoUrl: string;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  handleClientChange: (client: IClient) => void;
  businessUnitSigla?: string;
  provisionedPortal: IStaffPortalByBusinessManager;
  setProvisionedPortal: React.Dispatch<React.SetStateAction<IStaffPortalByBusinessManager>>;
  staffUser: IStaffUserAccount;
  setStaffUser: React.Dispatch<React.SetStateAction<IStaffUserAccount>>;
  businessManagers: BusinessManager | null;
  setBusinessManagers: React.Dispatch<React.SetStateAction<BusinessManager>>;
  businessUnits: IBusinessUnit[];
  setBusinessUnits: React.Dispatch<React.SetStateAction<IBusinessUnit[]>>;
  businessUnitsIsFetching: boolean;
  setBusinessUnitsIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClient: IClient | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<IClient | null>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  selectedEmployee: Employee;
  setSelectedEmployee: (employee: Employee) => void;
}
