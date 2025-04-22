import { IncomeCard } from "@components/cards/IncomeCard";

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

export { IncomeCapital, IncomeEmployment, MicroBusinesses };
