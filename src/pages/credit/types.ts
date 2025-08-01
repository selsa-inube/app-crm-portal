import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";

interface ICreditUIProps {
  isMobile: boolean;
  dataOptions: IOptionStaff[];
  dataHeader: {
    name: string;
    status: string;
  };
}
export type { ICreditUIProps };
