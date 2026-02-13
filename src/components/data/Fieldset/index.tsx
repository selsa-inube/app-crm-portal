import { useState } from "react";
import { MdAdd } from "react-icons/md";
import {
  Stack,
  Text,
  useMediaQuery,
  Button,
  SkeletonLine,
} from "@inubekit/inubekit";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

import { StyledContainerFieldset, StyledPrint } from "./styles";

interface IOptionsButton {
  title: string;
  onClick?: () => void;
}

interface IFieldsetProps {
  onSelectionChange?: () => void;
  children: JSX.Element | JSX.Element[];
  title?: string;
  aspectRatio?: string;
  heightFieldset?: string;
  descriptionTitle?: string;
  activeButton?: IOptionsButton;
  hasTable?: boolean;
  hasOverflow?: boolean;
  isMobile?: boolean;
  isClickable?: boolean;
  selectedState?: boolean;
  width?: string;
  borderColor?: string;
  showFieldset?: boolean;
  padding?: string;
  alignContent?: boolean;
  loading?: boolean;
  maxHeight?: string;
  maxLength?: number;
  gap?: string;
}

export const Fieldset = (props: IFieldsetProps) => {
  const {
    onSelectionChange,
    children,
    title,
    aspectRatio,
    heightFieldset,
    descriptionTitle,
    activeButton,
    hasTable = false,
    hasOverflow = false,
    isClickable = false,
    selectedState = false,
    width = "-webkit-fill-available",
    borderColor = "normal",
    showFieldset = true,
    padding = "0 0 16px 0",
    gap = "8px",
    alignContent,
    loading,
    maxHeight,
    maxLength = 30,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const [isSelected, setIsSelected] = useState(selectedState || false);

  const handleOnClick = () => {
    if (isClickable) {
      setIsSelected(!isSelected);
      if (onSelectionChange) {
        onSelectionChange();
      }
    }
  };

  return (
    <Stack
      direction="column"
      gap={gap}
      width={width}
      height={!isMobile ? heightFieldset : "auto"}
      padding={padding}
    >
      <Stack justifyContent={activeButton && "space-between"}>
        {loading ? (
          <Stack width="50%">
            <SkeletonLine animated />
          </Stack>
        ) : (
          <Stack gap={isMobile ? "12px" : "8px"}>
            <Text
              type="title"
              appearance="gray"
              size={isMobile ? "medium" : "large"}
            >
              {title}
            </Text>
            {descriptionTitle && (
              <TruncatedText
                text={descriptionTitle}
                maxLength={maxLength}
                type="title"
                size={isMobile ? "medium" : "large"}
              />
            )}
          </Stack>
        )}
        {activeButton && (
          <Stack>
            <StyledPrint>
              <Button
                iconBefore={<MdAdd />}
                spacing="compact"
                onClick={activeButton.onClick}
              >
                {activeButton.title}
              </Button>
            </StyledPrint>
          </Stack>
        )}
      </Stack>
      <StyledContainerFieldset
        $aspectRatio={aspectRatio}
        $isMobile={isMobile}
        $hasOverflow={hasOverflow}
        $hasTable={hasTable}
        onClick={handleOnClick}
        $isSelected={selectedState ?? isSelected}
        $height={isMobile ? "auto" : heightFieldset}
        $isClickable={isClickable}
        $borderColor={borderColor}
        $showFieldset={showFieldset}
        $alignContent={alignContent}
        $maxHeight={maxHeight}
      >
        {children}
      </StyledContainerFieldset>
    </Stack>
  );
};
