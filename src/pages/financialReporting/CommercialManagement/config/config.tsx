import {
  MdOutlinePayments,
  MdOutlineMonetizationOn,
  MdOutlineBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdOutlineMessage,
} from "react-icons/md";
import { Stack, Text } from "@inubekit/inubekit";

import { TableBoard } from "@components/data/TableBoard";
import { IOptions } from "@components/navigation/MenuProspect/types";
import { Schedule } from "@src/services/enum/schedule";

export const titlesCommercialManagementAccordion = [
  { id: "obligacion", titleName: "", priority: 1 },
  { id: "Compra primera Vivienda", titleName: "", priority: 2 },
  { id: "Libre Inversion", titleName: "", priority: 3 },
];

export const titlesCommercialManagement = [
  { id: "obligacion", titleName: "", priority: 1 },
  {
    id: "Compra primera Vivienda",
    titleName: "Compra primera Vivienda",
    priority: 2,
  },
  { id: "Libre Inversion", titleName: "Libre Inversion", priority: 3 },
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

export const dataAccordeon = [
  {
    name: "Pagos Extra Pactados",
    title: (
      <Stack width="100%">
        <div style={{ flex: "1" }}>
          <Text type="label">Pagos Extra Pactados</Text>
        </div>
        <div style={{ flex: "1 1 3.5%" }}>
          <Text size="medium">$10.000.000</Text>
        </div>
        <div style={{ flex: "1 1 2.5%" }}>
          <Text size="medium">$0</Text>
        </div>
      </Stack>
    ),
    content: (
      <TableBoard
        id="dataAcordeon"
        titles={titlesCommercialManagementAccordion}
        entries={entriesCommercialManagementAccordeon}
        appearanceTable={{
          title: "dark",
          efectzebra: false,
          borderTable: true,
          background: true,
          widthTd: "190px",
        }}
      />
    ),
  },
  {
    name: "Descuentos Aplicados",
    title: (
      <Stack width="100%">
        <div style={{ flex: "1" }}>
          <Text type="label">Descuentos Aplicados</Text>
        </div>
        <div style={{ flex: "1 1 3.5%" }}>
          <Text size="medium">$49.500.000</Text>
        </div>
        <div style={{ flex: "1 1 2.5%" }}>
          <Text size="medium">$50.000</Text>
        </div>
      </Stack>
    ),
    content: (
      <TableBoard
        id="Descuentos"
        titles={titlesCommercialManagementAccordion}
        entries={entriesAppliedDiscounts}
        appearanceTable={{
          title: "dark",
          efectzebra: false,
          borderTable: true,
          background: true,
          widthTd: "190px",
        }}
      />
    ),
  },
  {
    name: "Creditos Recogidos",
    title: (
      <Stack width="100%">
        <div style={{ flex: "1" }}>
          <Text type="label">Créditos Recogidos</Text>
        </div>
        <div style={{ flex: "1 1 3.5%" }}>
          <Text size="medium">$49.500.000</Text>
        </div>
        <div style={{ flex: "1 1 2.5%" }}>
          <Text size="medium">$50.000</Text>
        </div>
      </Stack>
    ),
    content: (
      <TableBoard
        id="dataAcordeon"
        titles={titlesCommercialManagementAccordion}
        entries={entriesCreditsCollected}
        appearanceTable={{
          title: "dark",
          efectzebra: false,
          borderTable: false,
          background: false,
          widthTd: "190px",
        }}
      />
    ),
  },
];

export const titlesCommercialManagementPRueba = [
  { id: "obligacion", titleName: "", priority: 1 },
  {
    id: "Compra primera Vivienda",
    titleName: "Compra primera Vivienda",
    priority: 2,
  },
  { id: "Libre Inversion", titleName: "Libre Inversión", priority: 3 },
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
    visible: !visibleExtraPayments,
  },
  {
    title: "Observaciones de preaprobación",
    onClick: () => {
      handleOpenModal("observationsModal");
    },
    icon: <MdOutlineMessage />,
    visible: true,
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

export const titlesModal = {
  title: "Información",
  subTitle: "¿Porque está deshabilitado?",
  description:
    "No cuentas con los privilegios necesarios para ejecutar esta acción.",
  textButtonNext: "Entendido",
};
