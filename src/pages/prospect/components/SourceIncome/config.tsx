import { IncomeCard } from "@components/cards/IncomeCard";
import { ICustomerData } from "@context/CustomerContext/types";

import { IIncome } from "./types";

interface IncomeProps {
  values: string[];
  ShowSupport?: boolean;
  disabled?: boolean;
  onValueChange?: (index: number, newValue: string) => void;
}

function IncomeCapital({
  values,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  return (
    <IncomeCard
      title="Rentas de capital"
      labels={[
        "Arrendamientos",
        "Dividendos o participaciones",
        "Rendimientos financieros",
      ]}
      placeholders={["Arrendamiento/mes", "Utilidades/mes", "Rendimientos/mes"]}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}

function IncomeEmployment({
  values,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  return (
    <IncomeCard
      title="Rentas de trabajo"
      labels={[
        "Salario mensual",
        "Otros pagos mensuales",
        "Mesadas pensionales",
      ]}
      placeholders={[
        "Salario percibido/mes",
        "Subsidios, utilidades, propinas, etc.",
        "Pensión/mes",
      ]}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}

function MicroBusinesses({
  values,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  return (
    <IncomeCard
      title="Otros ingresos variables"
      labels={["Honorarios profesionales", "Ganancias en micronegocios"]}
      placeholders={["Honorarios/mes", "Ganancias/mes"]}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}

function getInitialValues(customerData: ICustomerData) {
  return {
    borrower_id: customerData?.publicCode ?? "",
    borrower: customerData?.fullName ?? "",
    capital: ["0", "0", "0"],
    employment: ["0", "0", "0"],
    businesses: ["0", "0"],
  } as IIncome;
}

export { IncomeCapital, IncomeEmployment, MicroBusinesses, getInitialValues };
