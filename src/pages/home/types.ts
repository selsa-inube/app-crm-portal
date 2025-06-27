import { ICRMPortalData } from "@context/AppContext/types";

interface ICardData {
  id: string;
  label: string;
  publicCode: string;
  description: string;
  icon: string | React.ReactNode;
  url: string;
}
interface IBusinessUnitsPortalStaff {
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

export type { IHome, ICardData, IBusinessUnitsPortalStaff };
