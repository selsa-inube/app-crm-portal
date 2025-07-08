import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Icon, Stack, ITextSize, Text } from "@inubekit/inubekit";

import { StyledContainerText } from "./styles";

interface ITitle {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  navigatePage?: string;
  sizeTitle?: ITextSize;
}

const Title = (props: ITitle) => {
  const {
    title,
    sizeTitle = "medium",
    description,
    icon,
    navigatePage,
  } = props;

  const navigate = useNavigate();

  return (
    <>
      <Stack gap={"8px"} direction="column">
        <Stack gap={"8px"} alignItems="center">
          {icon ? (
            <Icon
              appearance="dark"
              cursorHover={true}
              icon={icon}
              spacing="narrow"
              size="20px"
            />
          ) : (
            <Icon
              appearance="dark"
              cursorHover={true}
              icon={<MdArrowBack />}
              spacing="narrow"
              size="20px"
              onClick={() =>
                navigatePage ? navigate(navigatePage) : navigate(-1)
              }
            />
          )}
          <StyledContainerText>
            <Text type="title" size={sizeTitle} weight="bold">
              {title}
            </Text>
          </StyledContainerText>
        </Stack>
        <Text appearance="gray" size="medium">
          {description}
        </Text>
      </Stack>
    </>
  );
};

export { Title };
export type { ITitle };
