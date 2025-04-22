import { Stack, Text, useMediaQuery } from "@inubekit/inubekit";
import { Button } from "@inubekit/button";

import { StyledImage } from "./styles";

interface UnfoundDataProps {
  title: string;
  description: string;
  buttonDescription: string;
  image?: string;
  onRetry?: () => void;
  route?: string;
}

function UnfoundData(props: UnfoundDataProps) {
  const { image, title, description, buttonDescription, route, onRetry } =
    props;
  const smallScreen = useMediaQuery("(max-width: 720px)");

  return (
    <Stack
      direction={smallScreen ? "column" : "row"}
      gap="8px"
      justifyContent="center"
      alignItems="center"
      padding={smallScreen ? "35px" : "12px"}
    >
      {smallScreen && image && (
        <StyledImage
          src={image}
          alt="UnfoundDataImage"
          $smallScreen={smallScreen}
        />
      )}
      <Stack direction="column" alignItems="normal" gap="8px">
        <Text type="title" size="large" appearance="primary">
          {title}
        </Text>

        <Text size="large" appearance="gray" textAlign="start">
          {description}
        </Text>

        <Stack
          justifyContent={smallScreen ? "center" : "flex-end"}
          width="100%"
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

export { UnfoundData };
export type { UnfoundDataProps };
