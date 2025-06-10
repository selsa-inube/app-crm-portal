import {
  MdOutlinePayments,
  MdOutlineMonetizationOn,
  MdOutlineBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Stack, Text } from "@inubekit/inubekit";

import { Schedule } from "@services/enums";
import { IOptions } from "@components/navigation/MenuProspect/types";

export const titlesCommercialManagementAccordion = [
  {
    id: "obligacion",
    titleName: "",
    priority: 1,
  },
  {
    id: "Compra primera Vivienda",
    titleName: "",
    priority: 2,
  },
  {
    id: "Libre Inversion",
    titleName: "",
    priority: 3,
  },
];

export const titlesCommercialManagement = [
  {
    id: "obligacion",
    titleName: "",
    priority: 1,
  },
  {
    id: "Compra primera Vivienda",
    titleName: "Compra primera Vivienda",
    priority: 2,
  },
  {
    id: "Libre Inversion",
    titleName: "Libre Inversion",
    priority: 3,
  },
];

export const entriesCommercialManagementAccordeon = [
  {
    id: "1",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Junio 30/2023</Text>
        <Text type="label">Nómina</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$1.500.000",
    "Libre Inversion": "",
  },
  {
    id: "2",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Junio 30/2023</Text>
        <Text type="label">Nómina</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$1.000.000",
    "Libre Inversion": "",
  },
  {
    id: "3",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Junio 30/2023</Text>
        <Text type="label">Nómina</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$1.000.000",
    "Libre Inversion": "",
  },
];

export const entriesAppliedDiscounts = [
  {
    id: "1",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Intereces de Ajuste al Ciclo</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$150.000",
    "Libre Inversion": "",
  },
  {
    id: "2",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Seguro de Cartera</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$20.000",
    "Libre Inversion": "",
  },
  {
    id: "3",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Comisión por Fianza</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$-",
    "Libre Inversion": "",
  },
];

export const entriesCreditsCollected = [
  {
    id: "1",
    obligacion: (
      <Stack gap="20px">
        <Text type="label">Neto a Girar</Text>
      </Stack>
    ),
    "Compra primera Vivienda": "$49.500.000",
    "Libre Inversion": "$5.200.000",
  },
];

export const titlesCommercialManagementPRueba = [
  {
    id: "obligacion",
    titleName: "",
    priority: 1,
  },
  {
    id: "Compra primera Vivienda",
    titleName: "Compra primera Vivienda",
    priority: 2,
  },
  {
    id: "Libre Inversion",
    titleName: "Libre Inversión",
    priority: 3,
  },
];

export const entriesCommercialManagement = [
  {
    id: "1",
    obligacion: <Text type="label">Medio de Pago</Text>,
    "Compra primera Vivienda": "Nómina",
    "Libre Inversion": "Nómina",
  },
  {
    id: "2",
    obligacion: <Text type="label">Tpo de Garantía</Text>,
    "Compra primera Vivienda": "Hipoteca",
    "Libre Inversion": "Sin Garantía",
  },
  {
    id: "3",
    obligacion: <Text type="label">Monto del Crédito</Text>,
    "Compra primera Vivienda": "$50.000.000",
    "Libre Inversion": "$5.250.000",
  },
  {
    id: "4",
    obligacion: <Text type="label">Número de Coutas</Text>,
    "Compra primera Vivienda": "24",
    "Libre Inversion": "24",
  },
  {
    id: "5",
    obligacion: <Text type="label">Valor de la Couta</Text>,
    "Compra primera Vivienda": "$1.120.000",
    "Libre Inversion": "$200.000",
  },
];

export const entriesCommercialManagementCard = [
  {
    lineOfCredit: "Crédito Vacacional",
    paymentMethod: "Nómina mensual éxito Bancolombia",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Vehículo",
    paymentMethod: "Nómina mensual éxito",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Libre Inversión",
    paymentMethod: "Nómina mensual éxito Bancolombia",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Educativo",
    paymentMethod: "Nómina mensual éxito",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Rotativo",
    paymentMethod: "Nómina mensual éxito Bancolombia",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Libre Inversión",
    paymentMethod: "Nómina mensual éxito",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Educativo",
    paymentMethod: "Nómina mensual éxito Bancolombia",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
  {
    lineOfCredit: "Crédito Rotativo",
    paymentMethod: "Nómina mensual éxito",
    loanAmount: 100000000,
    interestRate: 123456789012,
    termMonths: 48,
    periodicFee: 1000,
    schedule: Schedule.Biweekly,
  },
];

export const SummaryProspectCredit = [
  {
    item: [
      {
        id: "requestedAmount",
        title: "Monto solicitado",
        miniIcon: false,
        operation: "-",
      },
      {
        id: "totalConsolidatedAmount",
        title: "Obligaciones recogidas",
        miniIcon: true,
        icon: <MdOutlineEdit />,
        modal: "edit",
        operation: "-",
      },
      {
        id: "deductibleExpenses",
        title: "Gastos descontables",
        miniIcon: true,
        icon: <MdOutlineRemoveRedEye />,
        modal: "view",
        operation: "=",
      },
      {
        id: "netAmountToDisburse",
        title: "Neto a girar",
        miniIcon: false,
        operation: "|",
      },
      {
        id: "totalRegularInstallment",
        title: "Cuota ordinaria",
        miniIcon: true,
        icon: <MdOutlineRemoveRedEye />,
        operation: "",
      },
    ],
    iconEdit: false,
  },
];

export const incomeOptions = [
  { id: "user1", label: "Camilo Rincón", value: "camilo-rincon" },
  {
    id: "user2",
    label: "Juan Carlos Pérez Gómez",
    value: "juan-carlos-perez-gomez",
  },
  {
    id: "user3",
    label: "Sofía Alejandra Romero Ruiz",
    value: "sofia-alejandra-romero-ruiz",
  },
];

export const menuOptions = (
  handleOpenModal: (modalName: string) => void,
  visibleExtraPayments: boolean,
): IOptions[] => [
  {
    title: "Origen de cupo",
    onClick: () => handleOpenModal("creditLimit"),
    icon: <MdOutlineBalance />,
    visible: true,
  },
  {
    title: "Fuentes de ingreso",
    onClick: () => handleOpenModal("IncomeModal"),
    icon: <MdOutlineAccountBalanceWallet />,
    visible: true,
  },
  {
    title: "Obligaciones financieras",
    onClick: () => handleOpenModal("reportCreditsModal"),
    icon: <MdOutlineMonetizationOn />,
    visible: true,
  },
  {
    title: "Pagos extras",
    onClick: () => {
      handleOpenModal("extraPayments");
    },
    icon: <MdOutlinePayments />,
    visible: visibleExtraPayments,
  },
];

export const tittleOptions = {
  titleCreditId: "No. Rad.: ",
  titleDestination: "Destino: ",
  tittleAmount: "Valor: ",
  titleProfile: "Ver perfil crediticio",
  titleDisbursement: "Medios de desembolso",
  titleCall: "Llamada",
  titleVideoCall: "Videollamada",
  titleAddProduct: "Agregar producto",
  titleExtraPayments: "Pagos extras",
  titleError: "¡Uy, algo ha salido mal!",
  descriptionError: "No se han podido guardar los cambios.",
  deductibleExpensesErrorTitle: "Error al cargar gastos descontables",
};
