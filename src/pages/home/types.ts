import { RefObject } from "react";

import { ICRMPortalData } from "@context/AppContext/types";
import { ICardInteractiveBox } from "@mocks/home/mockData";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

interface ICardData {
  id: string;
  label: string;
  publicCode: string;
  description: string;
  icon: string | React.ReactNode;
  url: string;
}
interface IBusinessUnitsPortalStaffs {
  publicCode: string;
  languageId: string;
  abbreviatedName: string;
  descriptionUse: string;
  urlLogo: string;
  firstMonthOfFiscalYear?: string;
  [key: string]: string | undefined;
}

interface IHome {
  smallScreen: boolean;
  username: string;
  eventData: ICRMPortalData;
  loading?: boolean;
}

interface IDataHeader {
  name?: string;
  status?: string;
}

interface IHomeUIProps {
  smallScreen: boolean;
  isTablet: boolean;
  isMobile: boolean;
  username: string;
  eventData: ICRMPortalData;
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  collapseMenuRef: RefObject<HTMLDivElement>;
  businessUnitChangeRef: RefObject<HTMLDivElement>;
  businessUnitsToTheStaff: IBusinessUnitsPortalStaff[];
  selectedClient: string;
  handleLogoClick: (businessUnit: IBusinessUnitsPortalStaff) => void;
  dataHeader: IDataHeader;
  loading: boolean;
  mockData: ICardInteractiveBox[];
}

export type { IHome, ICardData, IBusinessUnitsPortalStaffs, IHomeUIProps };
