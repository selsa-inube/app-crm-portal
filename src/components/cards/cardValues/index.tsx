import { Stack, Icon, Text } from "@inubekit/inubekit";

import { parseCunstomFormat } from "@utils/formatData/currency";

import { Container, IconWrapper, ContentWrapper, StyledPrint } from "./styles";

export interface CardValuesProps {
  items: {
    title: string;
    amount: string;
    operation?: string;
    miniIcon?: boolean;
    icon?: React.ReactNode;
    modal?: string;
  }[];
  isMobile: boolean;
  onIconClick?: () => void;
  handleView?: () => void;
  handleEdit?: () => void;
  firstIcon?: React.ReactNode;
  showIcon?: boolean;
  showMiniIcons?: boolean;
  showSummaryFirstItem?: boolean;
}

export function CardValues(props: CardValuesProps) {
  const {
    items,
    isMobile,
    firstIcon,
    onIconClick = () => {},
    handleEdit = () => {},
    handleView = () => {},
    showIcon = true,
    showMiniIcons = true,
    showSummaryFirstItem = false,
  } = props;

  return (
    <Container $showIcon={showIcon}>
      <ContentWrapper>
        {items.map((item, index) => (
          <Stack
            alignItems="center"
            key={index}
            gap={showSummaryFirstItem ? "2vw" : "3vw"}
          >
            <Stack
              direction="column"
              margin="4px"
              padding="0px 12px"
              gap="2px"
              alignItems={showIcon ? "start" : "center"}
            >
              <Text
                size="small"
                weight="bold"
                type="body"
                appearance="gray"
                padding="0px 0px 4px"
                ellipsis
              >
                {item.title}
              </Text>
              <Stack gap="8px" alignItems="center">
                <Text size="large" weight="bold" appearance="dark" type="body">
                  {parseCunstomFormat(item.amount)}
                </Text>
                {item.miniIcon && showMiniIcons && (
                  <StyledPrint>
                    <Icon
                      appearance="primary"
                      icon={item.icon}
                      cursorHover
                      size="16px"
                      onClick={() => {
                        if (item.modal === "edit") {
                          handleEdit();
                        } else if (item.modal === "view") {
                          handleView();
                        }
                      }}
                    />
                  </StyledPrint>
                )}
              </Stack>
            </Stack>
            <StyledPrint>
              {!isMobile && (
                <Text type="title" size="large" appearance="gray">
                  {item.operation}
                </Text>
              )}
            </StyledPrint>
          </Stack>
        ))}
      </ContentWrapper>
      {showIcon && (
        <IconWrapper onClick={onIconClick}>
          <Icon appearance="primary" icon={firstIcon} cursorHover size="24px" />
        </IconWrapper>
      )}
    </Container>
  );
}
