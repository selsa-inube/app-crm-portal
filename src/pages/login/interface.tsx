import { Outlet } from "react-router-dom";
import { Stack, Text, Grid } from "@inubekit/inubekit";

import {
  StyledWelcomeContainer,
  StyledOutletContainer,
  StyledImage,
} from "./styles";
import { ILoginUI } from "./types";

function LoginUI(props: ILoginUI) {
  const { eventData, screenMobile, screenDesktop } = props;

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
              Portal CRM
            </Text>
          </Stack>
          <StyledImage
            src={eventData.businessManager.urlLogo}
            alt="Sistemas Enlinea"
            $maxWidth={screenDesktop ? "180px" : "160px"}
            $maxHeight="80px"
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
