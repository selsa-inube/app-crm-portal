import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { StyledDetails, StyledSummary, StyledCollapseIcon } from "./styles";

export interface IAccordionProps {
  name: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  isOpen?: boolean;
}

export const Accordion = (props: IAccordionProps) => {
  const { name, title, content, isOpen } = props;

  const [collapse, setCollapse] = useState(false);

  return (
    <Stack width="100%">
      <StyledDetails name={name} open={isOpen}>
        <StyledSummary onClick={() => setCollapse(!collapse)}>
          <StyledCollapseIcon
            onClick={() => setCollapse(!collapse)}
            $collapse={collapse}
          >
            <Icon
              icon={<MdOutlineChevronRight />}
              appearance="dark"
              size="24px"
              cursorHover
              onClick={() => setCollapse(!collapse)}
            />
          </StyledCollapseIcon>
          {typeof title === "string" || typeof title === "number" ? (
            <Text>{title}</Text>
          ) : (
            title
          )}
        </StyledSummary>
        {typeof content === "string" || typeof content === "number" ? (
          <Text>{content}</Text>
        ) : (
          content
        )}
      </StyledDetails>
    </Stack>
  );
};
