import { RefObject } from "react";

import { ICRMPortalData } from "@context/AppContext/types";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";

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
  image?: string;
}

interface IHomeUIProps {
  smallScreen: boolean;
  isMobile: boolean;
  username: string;
  collapse: boolean;
  businessUnitChangeRef: RefObject<HTMLDivElement>;
  businessUnitsToTheStaff: IBusinessUnitsPortalStaff[];
  selectedClient: string;
  handleLogoClick: (businessUnit: IBusinessUnitsPortalStaff) => void;
  dataHeader: IDataHeader;
  loading: boolean;
  dataOptions: IOptionStaff[];
}

export type { IHome, ICardData, IBusinessUnitsPortalStaffs, IHomeUIProps };
