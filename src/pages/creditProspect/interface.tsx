import { MdArrowBack } from "react-icons/md";
import {
  Breadcrumbs,
  Grid,
  Header,
  Icon,
  Nav,
  Stack,
  useMediaQuery,
  Text,
} from "@inubekit/inubekit";

import { actions, useNavConfig } from "@config/nav.config";
import { useContext } from "react";
import { AppContext } from "@context/AppContext";
import { useNavigationConfig } from "@components/layout/AppPage/config/apps.config";
import { userMenu } from "@config/menuMainConfiguration";
import { CreditCard } from "@components/cards/CreditCard";

import { GeneralHeader } from "../addProspect/components/GeneralHeader";
import { addConfig, creditCards } from "./config/credit.config";
import { IHomeUIProps } from "./types";
import {
  StyledArrowBack,
  StyledContentImg,
  StyledHeaderContainer,
  StyledLogo,
} from "./styles";
const CreditUI = (props: IHomeUIProps) => {
  const { isMobile } = props;
  const navConfig = useNavConfig();
  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");
  const { eventData } = useContext(AppContext);
  const renderLogo = (imgUrl: string) => {
    return (
      <StyledContentImg to="/">
        <StyledLogo src={imgUrl} />
      </StyledContentImg>
    );
  };

  return (
    <>
      <StyledHeaderContainer>
        <Header
          logoURL={renderLogo(eventData.businessUnit.urlLogo)}
          navigation={useNavigationConfig()}
          user={{
            username: eventData.user.userName,
            breakpoint: "848px",
            client: eventData.businessUnit.abbreviatedName,
          }}
          menu={userMenu}
        />
      </StyledHeaderContainer>
      <Grid
        templateColumns={!isTablet ? "auto 1fr" : "1fr"}
        alignContent="unset"
        height={isTablet ? "81vh" : "92vh"}
      >
        <Nav
          navigation={navConfig}
          actions={actions}
          collapse={true}
          footerLogo={eventData.businessManager.urlLogo}
        />
        <Stack
          direction="column"
          width={isMobile ? "-webkit-fill-available" : "min(100%)"}
          margin="0 auto"
        >
          <Stack
            direction="column"
            alignItems={isMobile ? "normal" : "center"}
            margin="20px 0px"
            padding="24px 64px 0 64px"
          >
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <GeneralHeader
                buttonText="Agregar vinculación"
                descriptionStatus={"aaa"}
                name={"aaa"}
                profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
              />
              <Breadcrumbs crumbs={addConfig.crumbs} />
              <Stack gap="64px" direction="column">
                <StyledArrowBack>
                  <Stack gap="8px" alignItems="center" width="100%">
                    <Icon
                      icon={<MdArrowBack />}
                      appearance="dark"
                      size="20px"
                    />
                    <Text type="title" size={isMobile ? "small" : "large"}>
                      {addConfig.title}
                    </Text>
                  </Stack>
                </StyledArrowBack>
                <Stack direction={isTablet ? "column" : "row"} wrap="wrap">
                  {creditCards.map(
                    ({ key, icon, title, subtitle, onClick }) => (
                      <CreditCard
                        key={key}
                        icon={icon}
                        title={title}
                        subtitle={subtitle}
                        onClick={onClick}
                      />
                    ),
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

export { CreditUI };
