import { ChangeEvent } from "react";
import { IOption } from "@inubekit/inubekit";

interface IICon {
  icon: JSX.Element;
  onClick?: (e?: ChangeEvent) => void;
}

interface IButton {
  label: string;
  onClick: (e?: ChangeEvent) => void;
  disabled: boolean;
  loading?: boolean;
}

interface ITaskDecisionOption extends IOption {
  code?: string;
  originalLabel?: string;
}

interface DecisionItem {
  decision: string;
  value: string;
  I18nAttribute: string;
  I18n: {
    es: string;
    en: string;
  };
}

export type { IICon, IButton, ITaskDecisionOption, DecisionItem };
