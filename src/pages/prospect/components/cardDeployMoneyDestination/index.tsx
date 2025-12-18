import { ReactNode, useRef, useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { Divider, Icon, Stack, Text } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import { StyledCardContainer, StyledCollapseIcon } from "./styles";

interface ICardDeployMoneyDestinationProps {
  title: string;
  children?: ReactNode;
}

export function CardDeployMoneyDestination(
  props: ICardDeployMoneyDestinationProps,
) {
  const { title, children } = props;

  const [collapse, setCollapse] = useState(false);
  const collapseMenuRef = useRef<HTMLDivElement>(null);

  return (
    <Fieldset padding="0" hasTable={true}>
      <StyledCardContainer onClick={() => setCollapse(!collapse)}>
        <Stack
          padding="0 8px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text type="label" weight="bold" size="large">
            {title}
          </Text>
          <StyledCollapseIcon $collapse={collapse} ref={collapseMenuRef}>
            <Icon
              icon={<MdOutlineChevronRight />}
              appearance="dark"
              size="24px"
              cursorHover
            />
          </StyledCollapseIcon>
        </Stack>
        <>
          {collapse && (
            <Stack padding="12px 8px">
              <Divider dashed />
            </Stack>
          )}
        </>
      </StyledCardContainer>
      <Stack>{collapse && children}</Stack>
    </Fieldset>
  );
}
