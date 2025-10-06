import { useNavigate } from "react-router-dom";

import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";

interface ICreditUIProps {
  isMobile: boolean;
  dataOptions: IOptionStaff[];
  dataHeader: {
    name: string;
    status: string;
  };
  navigate: ReturnType<typeof useNavigate>;
}
export type { ICreditUIProps };
