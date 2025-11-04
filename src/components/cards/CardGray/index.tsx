import { ReactNode } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { StyledContainer, StyledTextField } from "./styles";

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
    height = "",
    apparencePlaceHolder = "dark",
    placeHolderTag = false,
  } = props;

  return (
    <StyledContainer>
      <Stack justifyContent="space-between" padding="6px 16px" height={height}>
        <Stack direction="column">
          <Text type="label" weight="bold" size="medium" appearance="dark">
            {label}
          </Text>
          {!placeHolderTag ? (
            <Text type="body" size="medium" appearance={apparencePlaceHolder}>
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
      </Stack>
    </StyledContainer>
  );
}
