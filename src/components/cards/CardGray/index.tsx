import { ReactNode } from "react";
import { Stack } from "@inubekit/inubekit";

import { TruncatedText } from "@components/modals/TruncatedTextModal";

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
        <TruncatedText
          text={label}
          type="label"
          weight="normal"
          size="medium"
          appearance="gray"
        />
        {!placeHolderTag ? (
          <TruncatedText
            text={placeHolder as string}
            type="body"
            size="medium"
            weight="bold"
            appearance={appearancePlaceHolder}
          />
        ) : (
          <Stack>{placeHolder}</Stack>
        )}
      </Stack>
      <TruncatedText
        text={data as string}
        type="body"
        size={isMobile ? "large" : "medium"}
        appearance={isMobile ? "dark" : "gray"}
      />
    </StyledContainer>
  );
}
