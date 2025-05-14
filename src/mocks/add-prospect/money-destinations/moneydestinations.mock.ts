import { IMoneyDestination } from "@services/types";

const mockMoneyDestinations: IMoneyDestination[] = [
  {
    money_destination_id: "vacations",
    money_destination_unique_reference: "moneyDestination",
    abbreviated_name: "Vacaciones",
    description_use: "Uso para vacaciones",
    icon: "MdOutlineBeachAccess",
  },
  {
    money_destination_id: "vehicle",
    money_destination_unique_reference: "moneyDestination",
    abbreviated_name: "Compra de vehículo",
    description_use: "Uso para compra de vehículo",
    icon: "MdOutlineDirectionsCarFilled",
  },
  {
    money_destination_id: "house",
    money_destination_unique_reference: "moneyDestination",
    abbreviated_name: "Compra de vivienda",
    description_use: "Uso para compra de vivienda",
    icon: "MdOutlineHouse",
  },
  {
    money_destination_id: "investment",
    money_destination_unique_reference: "moneyDestination",
    abbreviated_name: "Libre inversión",
    description_use: "Uso para libre inversión",
    icon: "MdOutlineAttachMoney",
  },
];

export { mockMoneyDestinations };
