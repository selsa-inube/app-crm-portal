import { Stack, Text, useMediaQuery, Button } from "@inubekit/inubekit";

import { StyledImage } from "./styles";

interface ItemNotFoundProps {
  image: string;
  title: string;
  description: string;
  buttonDescription: string;
  route?: string;
  onRetry?: () => void;
}

function ItemNotFound(props: ItemNotFoundProps) {
  const { image, title, description, buttonDescription, route, onRetry } =
    props;
  const smallScreen = useMediaQuery("(max-width: 720px)");

  return (
    <Stack
      direction={smallScreen ? "column" : "row"}
      gap="30px"
      alignItems="center"
      padding={smallScreen ? "20px" : "30px"}
      justifyContent="center"
    >
      <StyledImage
        src={image}
        alt="ItemNotFoundAlt"
        $smallScreen={smallScreen}
      />

      <Stack direction="column" gap="8px" alignItems="normal" width="100%">
        <Text type="title" size="large" appearance="primary">
          {title}
        </Text>

        <Text size="large" appearance="gray" textAlign="start">
          {description}
        </Text>

        <Stack
          justifyContent={smallScreen ? "center" : "flex-end"}
          width="100%"
          padding="10px 0px"
        >
          <Button
            type="button"
            spacing="compact"
            variant="outlined"
            onClick={onRetry}
            path={route}
            fullwidth={smallScreen}
          >
            {buttonDescription}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export { ItemNotFound };
export type { ItemNotFoundProps };
