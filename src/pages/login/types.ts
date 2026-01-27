import { ICRMPortalData } from "@context/AppContext/types";

interface IUser {
  id: string;
  username: string;
  code: string;
  userID: string;
  position: string;
  active: boolean;
  email: string;
  phone: string;
  clients: number[];
}

interface ILoginUI {
  eventData: ICRMPortalData;
  screenMobile: boolean;
  screenDesktop: boolean;
}

export type { IUser, ILoginUI };
