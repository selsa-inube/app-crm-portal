import { IOption } from "@inubekit/inubekit";

export interface ICycleOption extends IOption {
  paymentDates: string[];
  extraordinaryCycleType: string;
  cycleName?: string;
}
