import { createPortal } from "react-dom";
import {
  Stack,
  Text,
  Spinner,
  useMediaQuery,
  Blanket,
} from "@inubekit/inubekit";

import { dataConsulting } from "./config";
import { StyledContainer } from "./styles";

export interface iConsultingProps {
  portalId?: string;
}

export function Consulting(props: iConsultingProps) {
  const { portalId = "portal" } = props;

  const node = document.getElementById(portalId ?? "portal");

  if (node) {
    node.style.position = "relative";
    node.style.zIndex = "3";
  }

  if (!node) {
    throw new Error(
      "The portal node is not defined. This can occur when the specific node used to render the portal has not been defined correctly.",
    );
  }

  const screenMovil = useMediaQuery("(max-width:880px)");

  return createPortal(
    <Blanket>
      <StyledContainer>
        <Stack
          width={screenMovil ? "270px" : "450px"}
          direction="column"
          alignItems="center"
          gap="24px"
          padding="24px"
        >
          <Spinner />
          <Text type="title" size="large">
            {dataConsulting.Consulting}
          </Text>
          <Text type="body" size="large" textAlign="center" appearance="gray">
            {dataConsulting.wait}
          </Text>
        </Stack>
      </StyledContainer>
    </Blanket>,
    node,
  );
}
