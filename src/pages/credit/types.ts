import { useNavigate } from "react-router-dom";

import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import { IUser } from "../login/types";

interface ICreditUIProps {
  isMobile: boolean;
  dataOptions: IOptionStaff[];
  dataHeader: {
    name: string;
    status: string;
    image?: string;
  };
  codeError: number | null;
  addToFix: string[];
  user: IUser;
  navigate: ReturnType<typeof useNavigate>;
}
export type { ICreditUIProps };
