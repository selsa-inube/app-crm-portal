import {
  MdOutlineAccountBalance,
  MdOutlineSavings,
  MdOutlinePayments,
  MdCreditCard,
  MdOutlineSupport,
  MdCompareArrows,
} from "react-icons/md";
import { ReactNode } from "react";

export interface ICardInteractiveBox {
  id: string;
  label: string;
  description: string;
  icon: () => ReactNode;
  url: string;
}

export const mockData: ICardInteractiveBox[] = [
  {
    id: "1",
    label: "Crédito",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: () => MdOutlineAccountBalance({}),
    url: "/credit/simulate-credit",
  },
  {
    id: "2",
    label: "Ahorros",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc metus, volutpat molestie sagittis id, ullamcorper id diam.",
    icon: () => MdOutlineSavings({}),
    url: "/",
  },
  {
    id: "3",
    label: "Pagos",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc metus, volutpat molestie sagittis id, ullamcorper id diam.",
    icon: () => MdOutlinePayments({}),
    url: "/",
  },
  {
    id: "4",
    label: "Tarjetas",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc metus, volutpat molestie sagittis id, ullamcorper id diam.",
    icon: () => MdCreditCard({}),
    url: "/",
  },
  {
    id: "5",
    label: "Auxilios",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: () => MdOutlineSupport({}),
    url: "/",
  },
  {
    id: "6",
    label: "Transferencias",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc metus, volutpat molestie sagittis id, ullamcorper id diam.",
    icon: () => MdCompareArrows({}),
    url: "/",
  },
];
