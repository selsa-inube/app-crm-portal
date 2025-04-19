import { Outlet } from "react-router-dom";
import { useMediaQueries, Grid, Stack, Text } from "@inubekit/inubekit";

import selsaLogo from "@assets/images/logoInube.png";
import { spacing } from "@design/tokens/spacing";

import { StyledWelcomeContainer, StyledOutletContainer, StyledLogo } from "./styles";

function LoginUI() {
  const { "(max-width: 768px)": screenMobile }: Record<string, boolean> = useMediaQueries([
    "(max-width: 768px)",
  ]);

  return (
    <Grid
      templateColumns={screenMobile ? "1fr" : "repeat(2, 1fr)"}
      templateRows={screenMobile ? "minmax(360px, 20vh) 1fr" : "100vh"}
    >
      <StyledWelcomeContainer>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          padding={screenMobile ? spacing.s1000 : spacing.s0}
          height={screenMobile ? "auto" : "100%"}
        >
          <Stack direction="column" alignItems="center" gap={spacing.s200}>
            <Stack direction="column" alignItems="center">
              <Text type="headline" size="small" weight="bold">
                ¡Bienvenido!
              </Text>
              <Text as="h1" type="headline" size={screenMobile ? "medium" : "large"}>
                Portal-ERM
              </Text>
            </Stack>
            <StyledLogo src={selsaLogo} $screenMobile={screenMobile} alt="Logo Inube" />
          </Stack>
        </Stack>
      </StyledWelcomeContainer>
      <StyledOutletContainer>
        <Stack
          alignItems={screenMobile ? "flex-start" : "center"}
          justifyContent="center"
          height="-webkit-fill-available"
          padding={`${spacing.s400} ${spacing.s300} ${spacing.s0}`}
        >
          <Outlet />
        </Stack>
      </StyledOutletContainer>
    </Grid>
  );
}

export { LoginUI };
