import { useState, useRef, useEffect } from "react";
import { Text, useMediaQuery } from "@inubekit/inubekit";
import { useEnum } from "@hooks/useEnum/useEnum";

import { BaseModal } from "../baseModal";
import { StyledContainer } from "./styles";
import { dataTruncatedText } from "./config";

interface TruncatedTextProps {
  text: string;
  maxLength?: number | "auto";
  appearance?: TextAppearance;
  type?: TextType;
  size?: TextSize;
  weight?: TextWeight;
  transformFn?: (transform: string) => string;
}

export const TruncatedText = ({
  text,
  maxLength = "auto",
  appearance,
  type,
  size,
  weight,
  transformFn,
}: TruncatedTextProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const { lang } = useEnum();

  const displayText = transformFn ? transformFn(text) : text;

  useEffect(() => {
    if (maxLength === "auto" && textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [displayText, maxLength]);

  const isTruncated =
    maxLength === "auto" ? isOverflowing : text.length > (maxLength as number);

  const finalContent =
    maxLength === "auto"
      ? displayText
      : text.length > (maxLength as number)
        ? displayText.slice(0, maxLength as number) + "..."
        : displayText;

  const handleOpen = (event: React.MouseEvent) => {
    if (isTruncated) {
      event.stopPropagation();
      setShowModal(true);
    }
  };

  const handleClose = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setShowModal(false);
  };

  return (
    <>
      <StyledContainer
        ref={textRef}
        onClick={handleOpen}
        $isTruncated={isTruncated}
      >
        <Text appearance={appearance} type={type} size={size} weight={weight}>
          {finalContent}
        </Text>
      </StyledContainer>

      {showModal && (
        <BaseModal
          title={dataTruncatedText.info.i18n[lang]}
          nextButton="Cerrar"
          handleNext={handleClose}
          handleClose={handleClose}
          width={isMobile ? "290px" : "450px"}
        >
          <Text type="body" size="medium">
            {displayText}
          </Text>
        </BaseModal>
      )}
    </>
  );
};
