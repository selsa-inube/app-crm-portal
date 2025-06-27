import { useContext, useRef, useState } from "react";
import { MdOutlineChevronRight, MdOutlineDoorFront } from "react-icons/md";
import { Header, Icon, Stack, useMediaQuery } from "@inubekit/inubekit";

import { Title } from "@components/layout/Title";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { AppContext } from "@context/AppContext";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { useNavigationConfig } from "@components/layout/AppPage/config/apps.config";
import { userMenu } from "@config/menuMainConfiguration";
import { CustomerContext } from "@context/CustomerContext";
import {
  StyledCollapse,
  StyledCollapseIcon,
  StyledContentImg,
  StyledHeaderContainer,
  StyledLogo,
  StyledTitle,
} from "./styles";
import { IHome } from "./types";
import { GeneralHeader } from "../addProspect/components/GeneralHeader";

const HomeUI = (props: IHome) => {
  const { smallScreen, username, eventData } = props;
  const [collapse, setCollapse] = useState(false);
  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width:880px)");
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);
  const { businessUnitsToTheStaff, setBusinessUnitSigla } =
    useContext(AppContext);
  const [selectedClient, setSelectedClient] = useState<string>(
    eventData.businessUnit.abbreviatedName,
  );

  const handleLogoClick = (businessUnit: IBusinessUnitsPortalStaff) => {
    const selectJSON = JSON.stringify(businessUnit);
    setBusinessUnitSigla(selectJSON);
    setSelectedClient(businessUnit.abbreviatedName);
    setCollapse(false);
  };
  const renderLogo = (imgUrl: string) => {
    return (
      <StyledContentImg to="/">
        <StyledLogo src={imgUrl} />
      </StyledContentImg>
    );
  };

  const { customerData } = useContext(CustomerContext);
  console.log("customerData", customerData);
  const dataHeader = {
    name: "aa",
    status: "aa",
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

      <StyledCollapseIcon
        $collapse={collapse}
        onClick={() => setCollapse(!collapse)}
        $isTablet={isTablet}
        ref={collapseMenuRef}
      >
        <Icon
          icon={<MdOutlineChevronRight />}
          appearance="primary"
          size="24px"
          cursorHover
        />
      </StyledCollapseIcon>
      {collapse && (
        <StyledCollapse ref={businessUnitChangeRef}>
          <BusinessUnitChange
            businessUnits={businessUnitsToTheStaff}
            selectedClient={selectedClient}
            onLogoClick={handleLogoClick}
          />
        </StyledCollapse>
      )}
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
              descriptionStatus={dataHeader.status}
              name={dataHeader.name}
              profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
            />
            <StyledTitle $smallScreen={smallScreen}>
              <Title
                title={`Bienvenido, ${username}`}
                description="Aquí tienes las funcionalidades disponibles."
                icon={<MdOutlineDoorFront />}
                sizeTitle="large"
              />
            </StyledTitle>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export { HomeUI };
