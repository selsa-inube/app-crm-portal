import { ICRMPortalData } from "@context/AppContext/types";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import { useNavigate } from "react-router-dom";
import { IUser } from "../login/types";
import { EnumType } from "@src/hooks/useEnum/useEnum";

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
  dataHeader: IDataHeader;
  loading: boolean;
  dataOptions: IOptionStaff[];
  codeError: number | null;
  addToFix: string[];
  showErrorModal: boolean;
  messageError: string;
  user: IUser;
  navigate: ReturnType<typeof useNavigate>;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  lang: EnumType;
}

export type { IHome, ICardData, IBusinessUnitsPortalStaffs, IHomeUIProps };
