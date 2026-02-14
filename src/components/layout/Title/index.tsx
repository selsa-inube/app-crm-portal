import { Stack, ITextSize, Text } from "@inubekit/inubekit";

import { StyledContainerText } from "./styles";

interface ITitle {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  navigatePage?: string;
  sizeTitle?: ITextSize;
}

const Title = (props: ITitle) => {
  const { title, sizeTitle = "medium", description } = props;

  return (
    <>
      <Stack gap={"16px"} direction="column">
        <Stack gap={"8px"} alignItems="center">
          <StyledContainerText>
            <Text type="headline" size={sizeTitle} weight="normal">
              {title}
            </Text>
          </StyledContainerText>
        </Stack>
        <Text type="title" appearance="gray" size="medium" weight="normal">
          {description}
        </Text>
      </Stack>
    </>
  );
};

export { Title };
export type { ITitle };
