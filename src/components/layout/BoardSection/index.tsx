import { MdOutlineChevronRight } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";
import { StyledBoardSection, StyledCollapseIcon } from "./styles";
import { useBoardSectionLogic } from "./interface";
import { ICreditRequest, IBoardSectionProps } from "./types";

function BoardSection(props: IBoardSectionProps) {
  const {
    sectionTitle,
    sectionBackground = "light",
    orientation = "vertical",
    sectionInformation,
    CardComponent,
  } = props;

  const { collapse, handleCollapse, getNoDataMessage, isTablet, isMobile } =
    useBoardSectionLogic(props);

  const disabledCollapse = sectionInformation.length === 0;

  return (
    <StyledBoardSection
      $sectionBackground={sectionBackground}
      $orientation={orientation}
      $isTablet={isTablet}
    >
      <Stack
        justifyContent={orientation === "vertical" ? "space-between" : "flex-start"}
        alignItems="end"
        gap="24px"
      >
        <Stack alignItems="end" gap="8px">
          {orientation !== "vertical" && (
            <StyledCollapseIcon
              $collapse={collapse}
              $disabledCollapse={disabledCollapse}
              onClick={handleCollapse}
            >
              <Icon
                icon={<MdOutlineChevronRight />}
                disabled={disabledCollapse}
                appearance="dark"
                size="26px"
                cursorHover
              />
            </StyledCollapseIcon>
          )}
          <Text
            type={orientation === "vertical" || isMobile ? "title" : "headline"}
            size={orientation === "vertical" || isMobile ? "large" : "medium"}
          >
            {sectionTitle}
          </Text>
        </Stack>
        <Text type="title" size="medium">
          {sectionInformation.length}/{sectionInformation.length || 0}
        </Text>
      </Stack>
      {(collapse || orientation === "vertical") && (
        <Stack
          wrap="wrap"
          alignItems="center"
          direction={orientation === "vertical" ? "column" : "row"}
          justifyContent={isMobile ? "center" : "flex-start"}
          gap="20px"
        >
          {sectionInformation.length > 0 ? (
            sectionInformation.map((request, index) => (
              <CardComponent key={index} request={request} />
            ))
          ) : (
            <Stack
              gap="24px"
              alignItems="center"
              justifyContent="center"
              height="533px"
              width="100%"
            >
              <Text type="title" size="small" appearance="gray">
                {getNoDataMessage()}
              </Text>
            </Stack>
          )}
        </Stack>
      )}
    </StyledBoardSection>
  );
}

export { BoardSection };
export type { IBoardSectionProps, ICreditRequest };
