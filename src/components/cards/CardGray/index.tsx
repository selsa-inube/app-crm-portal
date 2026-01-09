import { ReactNode } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { StyledContainer } from "./styles";

export interface ICardGrayProps {
  label: string;
  placeHolder?: string | ReactNode;
  data?: string | number;
  appearancePlaceHolder?: "dark" | "gray";
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
    appearancePlaceHolder = "dark",
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
            appearance={appearancePlaceHolder}
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
