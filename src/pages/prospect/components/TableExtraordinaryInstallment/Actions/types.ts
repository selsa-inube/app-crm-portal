import { IIconAppearance } from "@inubekit/inubekit";
interface IAction {
  icon: React.ReactNode;
  appearance: IIconAppearance;
  label: string;
  onClick?: () => void;
}
export type { IAction };
