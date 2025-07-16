import { action } from "@storybook/addon-actions";
import { CardConsolidatedCredit, ICardConsolidatedCreditProps } from "./index";

const story = {
  components: [CardConsolidatedCredit],
  title: "pages/simulateCredit/components/CardConsolidatedCredit",
  argTypes: {
    onUpdateTotal: {
      action: "onUpdateTotal",
      description: "Función llamada cuando se actualiza el total seleccionado.",
    },
    title: {
      control: { type: "text" },
      description: "Título del card.",
    },
    code: {
      control: { type: "text" },
      description: "Código asociado al card.",
    },
    expiredValue: {
      control: { type: "number" },
      description: "Valor de vencimiento.",
    },
    nextDueDate: {
      control: { type: "number" },
      description: "Valor de la próxima fecha de vencimiento.",
    },
    fullPayment: {
      control: { type: "number" },
      description: "Valor del pago completo.",
    },
    arrears: {
      control: { type: "boolean" },
      description: "Indica si hay atrasos.",
    },
    date: {
      control: { type: "date" },
      description: "Fecha asociada a la próxima fecha de vencimiento.",
    },
  },
};

const Default = (args: ICardConsolidatedCreditProps) => (
  <CardConsolidatedCredit {...args} />
);

Default.args = {
  onUpdateTotal: action("onUpdateTotal"),
  title: "Crédito Consolidado",
  code: "CC123",
  expiredValue: 5000,
  nextDueDate: 3000,
  fullPayment: 8000,
  arrears: false,
  date: new Date(),
} satisfies ICardConsolidatedCreditProps;

export default story;

export { Default };
