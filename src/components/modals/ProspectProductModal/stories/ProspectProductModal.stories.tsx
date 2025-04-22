import { useState } from "react";
import { FormikValues } from "formik";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/button";
import { MdAdd, MdCached } from "react-icons/md";
import { action } from "@storybook/addon-actions";

import {
  Schedule,
  CreditLine,
  PaymentMethod,
  AmortizationType,
  RateType,
} from "@services/enums";

import { props, parameters } from "./props";
import { EditProductModal, EditProductModalProps } from "..";

const meta: Meta<typeof EditProductModal> = {
  title: "components/modals/EditProductModal",
  component: EditProductModal,
  parameters: parameters,
  argTypes: props,
};

type Story = StoryObj<typeof EditProductModal>;

export const Create: Story = (args: EditProductModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    creditLine: "",
    creditAmount: "",
    paymentMethod: "",
    paymentCycle: "",
    firstPaymentCycle: "",
    termInMonths: "",
    amortizationType: "",
    interestRate: "",
    rateType: "",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <EditProductModal
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

Create.args = {
  title: "Agregar producto",
  confirmButtonText: "Agregar",
  iconBefore: <MdAdd />,
};

export const Edit: Story = (args: EditProductModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    creditLine: CreditLine.Vacation,
    creditAmount: 10000000,
    paymentMethod: PaymentMethod.MonthlyPayroll,
    paymentCycle: Schedule.Biweekly,
    firstPaymentCycle: "ciclo1",
    termInMonths: "48",
    amortizationType: AmortizationType.FixedIntegralPayments,
    interestRate: 2.15,
    rateType: RateType.Fixed,
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <EditProductModal
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

Edit.args = {
  title: "Nombre de producto",
  confirmButtonText: "Actualizar",
  iconAfter: <MdCached />,
};

export default meta;
