import { Icon, Text, Stack, Button, Blanket, Divider, useMediaQuery } from "@inubekit/inubekit";
import {
  MdClear,
  MdAdd,
  MdAddCircleOutline,
  MdOutlineCheckCircle,
  MdCheck,
  MdClose,
  MdRemove,
} from "react-icons/md";
import { createPortal } from "react-dom";
import React from "react";

import { spacing } from "@design/tokens/spacing";
import { TableBoard } from "@components/data/TableBoard";
import { IEntries, IAction, Requirement } from "@components/data/TableBoard/types";

import {
  StyledContainerClose,
  StyledContainerContent,
  StyledModal,
  StyledContainerTitle,
  StyledTableContainer,
} from "./styles";

export interface RequirementsModalProps {
  title: string;
  buttonLabel: string;
  portalId?: string;
  requirements: Requirement[];
  handleClose: () => void;
}

function RequirementsModal(props: RequirementsModalProps) {
  const { title, buttonLabel, portalId = "portal", requirements, handleClose } = props;

  const node = document.getElementById(portalId);
  if (!node) {
    throw new Error(
      "The portal node is not defined. This can occur when the specific node used to render the portal has not been defined correctly.",
    );
  }

  const isMobile = useMediaQuery("(max-width: 730px)");

  const renderAddIcon = (entry: IEntries) => {
    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdAddCircleOutline />}
          appearance="primary"
          onClick={() => console.log("Add clicked", entry)}
          spacing="compact"
          variant="empty"
          size="26px"
          cursorHover
        />
      </Stack>
    );
  };

  const renderCheckIcon = (entry: IEntries) => {
    const isDisabled = React.isValidElement(entry.tag) && entry.tag.props.label === "No Cumple";

    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineCheckCircle />}
          appearance="primary"
          spacing="compact"
          cursorHover
          size="26px"
          onClick={() => console.log("Check clicked", entry)}
          disabled={isDisabled}
        />
      </Stack>
    );
  };

  const actionsRequirements: IAction[] = [
    { id: "agregar", content: renderAddIcon },
    { id: "aprobar", content: renderCheckIcon },
  ];

  const getIconByTagStatus = (tagElement: React.ReactElement) => {
    if (tagElement.props.label === "Cumple") {
      return <MdCheck />;
    } else if (tagElement.props.label === "Sin Evaluar") {
      return <MdRemove />;
    } else {
      return <MdClose />;
    }
  };

  const getActionsMobile = () => {
    return [
      {
        id: "tags",
        actionName: "",
        content: (entry: IEntries) => {
          const tagElement = entry.tag as React.ReactElement;
          return (
            <Stack alignItems="center" padding="4px">
              <Icon
                icon={getIconByTagStatus(tagElement)}
                appearance={tagElement.props.appearance}
                cursorHover
                variant="filled"
                shape="circle"
                size="20px"
              />
            </Stack>
          );
        },
      },
      {
        id: "agregar",
        content: (entry: IEntries) => renderAddIcon(entry),
      },
      {
        id: "aprobar",
        content: (entry: IEntries) => renderCheckIcon(entry),
      },
    ];
  };

  const infoItems = [
    { icon: <MdAddCircleOutline />, text: "Adjuntar", appearance: "help" },
    {
      icon: <MdOutlineCheckCircle />,
      text: "Forzar Aprobación",
      appearance: "help",
    },
  ];

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <StyledContainerTitle>
          <Text type="headline" size="small">
            {title}
          </Text>
          <StyledContainerClose onClick={handleClose}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </StyledContainerTitle>

        <Divider />
        <StyledContainerContent $smallScreen={isMobile}>
          <Stack direction="column" gap={spacing.s100}>
            <Stack width="100%" justifyContent="flex-end">
              <Button spacing="compact" iconBefore={<MdAdd />}>
                Agregar Requisito
              </Button>
            </Stack>

            <StyledTableContainer $smallScreen={isMobile}>
              {requirements.map((requirement, index) => (
                <TableBoard
                  key={requirement.id}
                  id={requirement.id}
                  titles={requirement.titles}
                  entries={requirement.entries}
                  actions={actionsRequirements}
                  actionMobile={getActionsMobile()}
                  appearanceTable={{
                    widthTd: "75%",
                    efectzebra: true,
                    title: "primary",
                    isStyleMobile: true,
                  }}
                  isFirstTable={index === 0}
                  infoItems={infoItems}
                />
              ))}
            </StyledTableContainer>
          </Stack>
          <Stack justifyContent="flex-end" gap={spacing.s100}>
            <Button onClick={handleClose}>{buttonLabel}</Button>
          </Stack>
        </StyledContainerContent>
      </StyledModal>
    </Blanket>,
    node,
  );
}

export { RequirementsModal };
