import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Stack, Text, Icon, useMediaQuery } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface PageTitleProps {
  title: string;
  icon?: JSX.Element;
  description?: string;
  navigatePage?: string;
}

function PageTitle(props: PageTitleProps) {
  const { title, description, navigatePage } = props;

  const smallScreen = useMediaQuery("(max-width:490px)");
  const navigate = useNavigate();

  return (
    <>
      <Stack gap={spacing.s100} direction="column">
        <Stack gap={spacing.s100} alignItems="center">
          <Icon
            appearance="dark"
            cursorHover={true}
            icon={<MdArrowBack />}
            size={spacing.s250}
            onClick={() => (navigatePage ? navigate(navigatePage) : navigate(-1))}
          />
          <Text as="h1" type="title" size={smallScreen ? "medium" : "large"}>
            {title}
          </Text>
        </Stack>
        <Text appearance="gray" size={smallScreen ? "small" : "medium"}>
          {description}
        </Text>
      </Stack>
    </>
  );
}

export { PageTitle };
export type { PageTitleProps };
