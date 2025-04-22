import { Outlet } from "react-router-dom";
import { Stack, Text, Grid, useMediaQueries } from "@inubekit/inubekit";

import selsaLogo from "@assets/images/selsa.png";

import {
  StyledWelcomeContainer,
  StyledOutletContainer,
  StyledImage,
} from "./styles";

function LoginUI() {
  const {
    "(max-width: 768px)": screenMobile,
    "(min-width: 993px) and (max-width: 2200px)": screenDesktop,
  }: { [key: string]: boolean } = useMediaQueries([
    "(max-width: 768px)",
    "(min-width: 993px) and (max-width: 2200px)",
  ]);

  return (
    <Grid
      templateColumns={screenMobile ? "1fr" : "repeat(2, 1fr)"}
      templateRows={screenMobile ? "minmax(150px, 20vh) 1fr" : "100vh"}
    >
      <StyledWelcomeContainer>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          gap={screenMobile ? "16px" : "32px"}
        >
          <Stack direction="column">
            <Text type="headline" size="small" textAlign="center">
              Bienvenido
            </Text>
            <Text as="h1" type="headline" size="large">
              Crediboard Portal
            </Text>
          </Stack>
          <StyledImage
            src={selsaLogo}
            alt="Sistemas Enlinea"
            width={screenDesktop ? "240px" : "160px"}
          />
        </Stack>
      </StyledWelcomeContainer>
      <StyledOutletContainer>
        <Stack
          alignItems="center"
          justifyContent="center"
          height={screenMobile ? "70vh" : "-webkit-fill-available"}
          padding="32px 16px"
        >
          <Outlet />
        </Stack>
      </StyledOutletContainer>
    </Grid>
  );
}

export { LoginUI };
