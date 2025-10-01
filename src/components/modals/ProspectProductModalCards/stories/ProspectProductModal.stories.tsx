import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/inubekit";
import { MdCheckCircle } from "react-icons/md";
import { action } from "@storybook/addon-actions";

import { IEditProductModalProps, IFormValues } from "../config";
import { EditProductModalCards } from "..";
import { ICustomerData } from "@context/CustomerContext/types";

const meta: Meta<typeof EditProductModalCards> = {
  title: "components/modals/EditProductModal/SelectProduct",
  component: EditProductModalCards,
  parameters: {
    docs: {
      description: {
        component:
          "Modal para seleccionar productos de crédito basado en líneas de crédito disponibles.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título del modal",
    },
    confirmButtonText: {
      control: "text",
      description: "Texto del botón de confirmación",
    },
    moneyDestination: {
      control: "text",
      description: "Destino del dinero para filtrar líneas de crédito",
    },
    businessUnitPublicCode: {
      control: "text",
      description: "Código público de la unidad de negocio",
    },
    onCloseModal: {
      action: "onCloseModal",
      description: "Función ejecutada al cerrar el modal",
    },
    onConfirm: {
      action: "onConfirm",
      description: "Función ejecutada al confirmar la selección",
    },
  },
};

type Story = StoryObj<typeof EditProductModalCards>;

const mockCustomerData: ICustomerData = {
  customerId: "123456",
  publicCode: "CUST-001",
  fullName: "Juan Pérez",
  natureClient: "Natural",
  generalAttributeClientNaturalPersons: [
    {
      associateType: "Asociado",
      employmentType: "Indefinido",
    },
  ],
  generalAssociateAttributes: [
    {
      affiliateSeniorityDate: "2020-01-15",
    },
  ],
} as ICustomerData;

export const SelectProduct: Story = (args: IEditProductModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: Partial<IFormValues> = {
    selectedProducts: [],
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Seleccionar Producto</Button>
      {showModal && (
        <EditProductModalCards
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")(values);
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

SelectProduct.args = {
  title: "Seleccionar producto de crédito",
  confirmButtonText: "Continuar",
  iconAfter: <MdCheckCircle />,
  moneyDestination: "education",
  businessUnitPublicCode: "fondecom",
  customerData: mockCustomerData,
};

export const WithPreselection: Story = (args: IEditProductModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: Partial<IFormValues> = {
    selectedProducts: ["Vivienda"],
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Seleccionar Producto (Con Preselección)
      </Button>
      {showModal && (
        <EditProductModalCards
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")(values);
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

WithPreselection.args = {
  title: "Editar selección de producto",
  confirmButtonText: "Actualizar",
  iconAfter: <MdCheckCircle />,
  moneyDestination: "education",
  businessUnitPublicCode: "fondecom",
  customerData: mockCustomerData,
};

export const DifferentMoneyDestination: Story = (
  args: IEditProductModalProps,
) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: Partial<IFormValues> = {
    selectedProducts: [],
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Productos para Vehículo
      </Button>
      {showModal && (
        <EditProductModalCards
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")(values);
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

DifferentMoneyDestination.args = {
  title: "Seleccionar producto para vehículo",
  confirmButtonText: "Seleccionar",
  iconAfter: <MdCheckCircle />,
  moneyDestination: "vehicle",
  businessUnitPublicCode: "fondecom",
  customerData: mockCustomerData,
};

export const MobileView: Story = (args: IEditProductModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: Partial<IFormValues> = {
    selectedProducts: [],
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Vista Móvil</Button>
      {showModal && (
        <EditProductModalCards
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")(values);
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

MobileView.args = {
  title: "Seleccionar producto",
  confirmButtonText: "Continuar",
  iconAfter: <MdCheckCircle />,
  moneyDestination: "education",
  businessUnitPublicCode: "fondecom",
  customerData: mockCustomerData,
};

MobileView.parameters = {
  viewport: {
    defaultViewport: "mobile1",
  },
};

export default meta;
