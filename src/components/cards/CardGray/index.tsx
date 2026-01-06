import { ReactNode } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { StyledContainer } from "./styles";

export interface ICardGrayProps {
  label: string;
  placeHolder?: string | ReactNode;
  data?: string | number;
  apparencePlaceHolder?: "dark" | "gray";
  height?: string;
  isMobile?: boolean;
  placeHolderTag?: boolean;
}

export function CardGray(props: ICardGrayProps) {
  const {
    label,
    placeHolder = "",
    data = "",
    isMobile = false,
    apparencePlaceHolder = "dark",
    placeHolderTag = false,
  } = props;

  return (
    <StyledContainer $isMobile={isMobile}>
      <Stack direction="column">
        <Text
          type="label"
          weight="normal"
          size="medium"
          appearance="gray"
          ellipsis={true}
        >
          {label}
        </Text>
        {!placeHolderTag ? (
          <Text
            type="body"
            size="medium"
            weight="bold"
            appearance={apparencePlaceHolder}
            ellipsis={true}
          >
            {placeHolder}
          </Text>
        ) : (
          <Stack>{placeHolder}</Stack>
        )}
      </Stack>
      <Text
        type="body"
        size={isMobile ? "large" : "medium"}
        appearance={isMobile ? "dark" : "gray"}
        ellipsis={true}
      >
        {data}
      </Text>
    </StyledContainer>
  );
}
