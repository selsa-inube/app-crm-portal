import { isValidElement } from "react";
import {
  MdAddCircleOutline,
  MdCheck,
  MdClose,
  MdOutlineCheckCircle,
  MdOutlineHowToReg,
  MdOutlineRemoveRedEye,
  MdRemove,
} from "react-icons/md";
import { Stack, Icon, Tag } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";
import { IEntries } from "@components/data/TableBoard/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { MappedRequirements } from "./types";

export const dataButton = (
  onClick: () => void,
  onClickSistemValidation: () => void,
) => ({
  onClick,
  onClickSistemValidation,
});

const receiveData = (data: IEntries) => {
  console.log(data, "function que recibe data");
};

export const titlesRequirements = [
  [
    {
      id: "Validaciones del sistema",
      titleName: "Validaciones del sistema",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
  [
    {
      id: "Requisitos documentales",
      titleName: "Requisitos documentales",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
  [
    {
      id: "Validaciones humanas",
      titleName: "Validaciones humanas",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
];
export const textFlagsRequirements = {
  titleSuccess: "Cambios guardados con éxito!",
  descriptionSuccess: `Hemos creado el campo exitosamente.`,
  titleError: "¡Uy, algo ha salido mal!",
  descriptionError: "No se han podido guardar los cambios.",
};

export const dataAddRequirement = {
  title: "Agregar requisito a esta solicitud",
  titleJustification: "Descripción del requisito",
  descriptionJustification:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit, primis turpis a donec dictum ad, urna eu sem malesuada mauris ac.",
  close: "Cerrar",
  cancel: "Cancelar",
  add: "Agregar",
  labelPaymentMethod: "Tipo de requisito",
  labelName: "Nombre del requisito",
  labelAmount: "Cantidad",
  labelValue: "Valor",
  labelTextarea: "Descripción",
  labelJustification: "Justificacion",
  labelFrequency: "Frecuencia de pago",
  labelDate: "Primer pago",
  placeHolderSelect: "Selecciona una opción",
  placeHolderAmount: "Número de pagos",
  placeHolderValue: "Valor a pagar",
  placeHolderDate: "Seleccione un requisito",
  placeHolderTextarea: "¿Qué hace necesario incluir este requisito?",
  placeHolderJustification: "Justificación del requisito",
};

export const justificationDescriptions: Record<string, string> = {
  edad: "Se valida la edad mínima para el requisito",
  antiguedad: "Se valida la antigüedad mínima para el requisito",
};

export const infoItems = [
  { icon: <MdOutlineRemoveRedEye />, text: "Ver Detalles", appearance: "help" },
  {
    icon: <MdOutlineHowToReg />,
    text: "Forzar Aprobación",
    appearance: "help",
  },
];
export const questionToBeAskedInModalText = {
  notEvaluated: "aaaaaaa",
  notCompliant: "No Cumple",
  questionForUnvalidated: "Pudo evaluar?",
  questionForNotCompliant: "Cumple?",
};
export const actionsRequirements = [
  [
    {
      id: "agregar",
      content: (data: IEntries) => (
        <Stack justifyContent="center">
          <Icon
            icon={<MdAddCircleOutline />}
            appearance="primary"
            onClick={() => receiveData(data)}
            spacing="narrow"
            size="22px"
            cursorHover
          />
        </Stack>
      ),
    },
    {
      id: "aprobar",
      content: (data: IEntries) => (
        <Stack justifyContent="center">
          <Icon
            icon={<MdOutlineCheckCircle />}
            appearance="primary"
            spacing="narrow"
            cursorHover
            size="22px"
            onClick={() => receiveData(data)}
            disabled={
              isValidElement(data?.tag) &&
              data?.tag?.props?.label === "No Cumple"
            }
          />
        </Stack>
      ),
    },
  ],
];

const iconActionsMobile = (tag: string) => {
  if (tag === "Cumple") {
    return <MdCheck />;
  } else if (tag === "Sin Eaaaaaaaaavaluar") {
    return <MdRemove />;
  } else {
    return <MdClose />;
  }
};

interface TagProps {
  appearance?: string;
  label?: string;
}

interface TagElement {
  props: TagProps;
}

const isValidTagElement = (element: unknown): element is TagElement => {
  return isValidElement(element) && element.props !== undefined;
};

const actionsMobile = [
  {
    id: "tags",
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={
          isValidElement(data?.tag) &&
          iconActionsMobile(data?.tag?.props?.label)
        }
        appearance={
          isValidTagElement(data?.tag)
            ? data?.tag?.props?.appearance
            : undefined
        }
        cursorHover
        variant="filled"
        shape="circle"
        size="16px"
      />
    ),
  },
  {
    id: "agregar",
    content: (data: IEntries) => (
      <Stack justifyContent="center">
        <Icon
          icon={<MdAddCircleOutline />}
          appearance="primary"
          onClick={() => receiveData(data)}
          spacing="narrow"
          variant="empty"
          size="22px"
          cursorHover
        />
      </Stack>
    ),
  },
  {
    id: "aprobar",
    content: (data: IEntries) => (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineCheckCircle />}
          appearance="primary"
          spacing="narrow"
          variant="empty"
          cursorHover
          size="22px"
          onClick={() => receiveData(data)}
          disabled={
            isValidElement(data?.tag) && data?.tag?.props?.label === "No Cumple"
          }
        />
      </Stack>
    ),
  },
];

export const requirementLabelsEnum = {
  compliant: {
    id: "compliant",
    i18n: { en: "Compliant", es: "Cumple" },
  },
  notCompliant: {
    id: "notCompliant",
    i18n: { en: "Not Compliant", es: "No Cumple" },
  },
  notEvaluated: {
    id: "notEvaluated",
    i18n: { en: "Not Evaluated", es: "Sin Evaluar" },
  },
};

const generateTag = (value: string, lang: EnumType): JSX.Element => {
  const isPassed = [
    "PASSED_WITH_SYSTEM_VALIDATION",
    "DOCUMENT_STORED_WITHOUT_VALIDATION",
    "PASSED_WITH_HUMAN_VALIDATION",
    "DOCUMENT_VALIDATED_BY_THE_USER",
    "IGNORED_BY_THE_USER",
    "PASSED_HUMAN_VALIDATION",
    "DOCUMENT_STORED_AND_VALIDATED",
    "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
    "DOCUMENT_IGNORED_BY_THE_USER",
    "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
  ].includes(value);

  const isFailed = [
    "FAILED_SYSTEM_VALIDATION",
    "FAILED_DOCUMENT_VALIDATION",
    "FAILED_HUMAN_VALIDATION",
  ].includes(value);

  if (isPassed)
    return (
      <Tag
        label={requirementLabelsEnum.compliant.i18n[lang]}
        appearance="success"
      />
    );
  if (isFailed)
    return (
      <Tag
        label={requirementLabelsEnum.notCompliant.i18n[lang]}
        appearance="danger"
      />
    );
  return (
    <Tag
      label={requirementLabelsEnum.notEvaluated.i18n[lang]}
      appearance="warning"
    />
  );
};

export const maperEntries = (
  data: MappedRequirements,
  lang: EnumType,
): IEntries[][] => {
  return [
    Object.entries(data.SYSTEM_VALIDATION).map(([key, value], index) => ({
      id: `sistema-${index + 1}`,
      "Validaciones del sistema": key,
      tag: generateTag(value, lang),
    })),
    Object.entries(data.DOCUMENT).map(([key, value], index) => ({
      id: `documento-${index + 1}`,
      "Requisitos documentales": key,
      tag: generateTag(value, lang),
    })),
    Object.entries(data.HUMAN_VALIDATION).map(([key, value], index) => ({
      id: `humano-${index + 1}`,
      "Validaciones humanas": key,
      tag: generateTag(value, lang),
    })),
  ];
};

export const maperDataRequirements = (processedEntries: IEntries[][]) => {
  return [
    {
      id: "tableApprovalSystem",
      titlesRequirements: titlesRequirements[0],
      entriesRequirements: processedEntries[0],
      actionsMovile: actionsMobile,
    },
    {
      id: "tableDocumentValues",
      titlesRequirements: titlesRequirements[1],
      entriesRequirements: processedEntries[1],
      actionsMovile: actionsMobile,
    },
    {
      id: "tableApprovalHuman",
      titlesRequirements: titlesRequirements[2],
      entriesRequirements: processedEntries[2],
      actionsMovile: actionsMobile,
    },
  ];
};

const getIconByTagStatus = (tagElement: React.ReactElement) => {
  const label = tagElement.props.label;

  if (label === "Cumple") {
    return <img src={check} alt="Cumple" width={14} height={14} />;
  } else if (label === "Sin Evalaaaaauar") {
    return <img src={remove} alt="Sin Evalaaaaauar" width={14} height={14} />;
  } else if (label === "No Cumple") {
    return <img src={close} alt="No Cumple" width={14} height={14} />;
  } else {
    return null;
  }
};

export const getActionsMobileIcon = () => {
  return [
    {
      id: "estado",
      actionName: "",
      content: (entry: IEntries) => {
        const tagElement = entry.tag as React.ReactElement;
        return (
          <Stack>
            <Icon
              icon={getIconByTagStatus(tagElement)}
              appearance={tagElement.props.appearance}
              cursorHover
              size="20px"
            />
          </Stack>
        );
      },
    },
  ];
};
