import { Tag, Text, Stack, Button, Divider, useMediaQueries } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";
import selsaLogo from "@assets/images/logoInube.png";
import errorImage from "@assets/images/img-team-building-68.png";
import { errorCodes } from "@config/errorCodes.tsx";

import {
  StyledCompanyLogo,
  StyledErrorImage,
  StyledFooter,
  StyledCertificationsContainer,
  VerticalDivider,
  StyledMainContent,
  StyledContainer,
  StyledDiv,
} from "./styles";

interface ErrorPageProps {
  logo?: string;
  logoAlt?: string;
  heading?: string;
  image?: string;
  imageAlt?: string;
  nameButton?: string;
  errorCode?: number;
  onClick?: () => void;
}

const ListContent = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

function ErrorPage(props: ErrorPageProps) {
  const {
    logo = selsaLogo,
    logoAlt = "Sistemas Enlinea",
    heading = "¡Ups! Algo salió mal...",
    image = errorImage,
    imageAlt = "Ha surgido un error. Revisa la descripción",
    nameButton = "Regresar",
    errorCode = 0,
    onClick,
  } = props;

  const mediaQueries = ["(max-width: 600px)"];
  const matches = useMediaQueries(mediaQueries);
  const isMobile = matches["(max-width: 600px)"];

  const errorDetail = errorCodes[errorCode] || {
    whatWentWrong: ["No se proporcionó información sobre el error."],
    howToFix: ["Intenta nuevamente más tarde."],
  };

  return (
    <StyledContainer>
      <StyledMainContent>
        <Stack justifyContent="center">
          <Stack gap={spacing.s800} direction="column" alignItems="center" width="100%">
            <Stack width="100%">
              <StyledCompanyLogo
                src={logo}
                alt={logoAlt}
                width={isMobile ? "40px" : "54px"}
                height={isMobile ? "40px" : "54px"}
              />
            </Stack>
            <Stack direction="column" alignItems="center">
              <Stack
                direction="column"
                alignItems="center"
                gap={isMobile ? spacing.s300 : spacing.s400}
              >
                <Text
                  type="headline"
                  textAlign="center"
                  weight="bold"
                  size={isMobile ? "small" : "large"}
                >
                  {heading}
                </Text>
                <Tag appearance="gray" label={`Código de error: ${errorCode}`} weight="strong" />
                <StyledErrorImage
                  src={image}
                  alt={imageAlt}
                  width={isMobile ? "180px" : "256px"}
                  height={isMobile ? "160px" : "240px"}
                />
              </Stack>
            </Stack>
            <StyledCertificationsContainer $isMobile={isMobile}>
              <Stack
                direction={isMobile ? "column" : "row"}
                gap={spacing.s400}
                justifyContent="space-between"
                width="100%"
              >
                <Stack direction="column" gap={spacing.s300} width="100%">
                  <Text type="headline" size="medium" weight="bold">
                    ¿Qué salió mal?
                  </Text>
                  <StyledDiv>
                    <ListContent items={errorDetail.whatWentWrong} />
                  </StyledDiv>
                </Stack>
                <VerticalDivider $isVertical={!isMobile} />
                {isMobile && <Divider dashed />}
                <Stack direction="column" gap={spacing.s300} width="100%">
                  <Text type="headline" size="medium" weight="bold">
                    ¿Cómo solucionarlo?
                  </Text>
                  <StyledDiv>
                    <ListContent items={errorDetail.howToFix} />
                  </StyledDiv>
                  <Stack justifyContent="center">
                    <Button appearance="primary" fullwidth={isMobile} onClick={onClick}>
                      {nameButton}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </StyledCertificationsContainer>
          </Stack>
        </Stack>
      </StyledMainContent>
      <StyledFooter>
        <Text appearance="gray" textAlign="center" size="small" weight="bold">
          © 2024 Inube
        </Text>
      </StyledFooter>
    </StyledContainer>
  );
}

export { ErrorPage };
export type { ErrorPageProps };
