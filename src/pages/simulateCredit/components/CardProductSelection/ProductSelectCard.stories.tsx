import { CardProductSelection, ICardProductSelectionProps } from "./index";

const story = {
  components: [CardProductSelection],
  title: "pages/simulateCredit/components/CardProductSelection",
  argTypes: {
    amount: {
      control: { type: "number" },
      description: "Monto asociado al producto.",
    },
    rate: {
      control: { type: "number" },
      description: "Tasa de interés del producto.",
    },
    term: {
      control: { type: "number" },
      description: "Plazo del producto en meses.",
    },
    description: {
      control: { type: "text" },
      description: "Descripción del producto.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Indica si el componente está deshabilitado.",
    },
  },
};

const Default = (args: ICardProductSelectionProps) => (
  <CardProductSelection {...args} />
);

Default.args = {
  amount: 10000,
  rate: 5,
  term: 12,
  description: "Producto de Prueba",
  disabled: false,
} satisfies ICardProductSelectionProps;

export default story;

export { Default };
