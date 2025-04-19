import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Nav, Stack, Grid, Header, useMediaQuery, Icon } from "@inubekit/inubekit";
import { MdOutlineChevronRight } from "react-icons/md";

import { useNavConfig, userMenu, actions } from "@config/nav.config";
import { useAppContext } from "@context/AppContext/useAppContext";
import { VinculationBanner } from "@components/layout/Banner";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { IBusinessUnit } from "@ptypes/employeePortalBusiness.types";
import { spacing } from "@design/tokens/spacing";

import {
  StyledAppPage,
  StyledContainer,
  StyledContentImg,
  StyledLogo,
  StyledMain,
  StyledCollapseIcon,
  StyledCollapse,
} from "./styles";

interface AppPageProps {
  withNav?: boolean;
  withBanner?: boolean;
}

const renderLogo = (imgUrl: string, clientName: string) => {
  return imgUrl ? (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} alt={clientName} />
    </StyledContentImg>
  ) : (
    <StyledContentImg to="/">{clientName}</StyledContentImg>
  );
};

function AppPage(props: AppPageProps) {
  const { withNav = true, withBanner = true } = props;
  const { user, logoUrl, selectedClient, businessUnits, setSelectedClient, selectedEmployee } =
    useAppContext();
  const isTablet = useMediaQuery("(max-width: 944px)");
  const navigate = useNavigate();

  const navConfig = useNavConfig();

  const [collapse, setCollapse] = useState(false);
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      collapseMenuRef.current &&
      !collapseMenuRef.current.contains(event.target as Node) &&
      businessUnitChangeRef.current &&
      !businessUnitChangeRef.current.contains(event.target as Node)
    ) {
      setCollapse(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoClick = (businessUnit: IBusinessUnit) => {
    setSelectedClient({
      id: businessUnit.businessUnitPublicCode,
      name: businessUnit.descriptionUse,
      sigla: businessUnit.abbreviatedName,
      logo: businessUnit.urlLogo,
    });

    setCollapse(false);
    navigate("/employees/select-employee");
  };

  return (
    <StyledAppPage>
      <Grid templateRows="auto 1fr" height="100vh" justifyContent="unset">
        <Header
          portalId="portal"
          navigation={{ items: navConfig, breakpoint: "800px" }}
          logoURL={renderLogo(
            selectedClient?.logo || logoUrl,
            selectedClient?.name || "Sin unidad seleccionada",
          )}
          user={{
            username: user?.username || "Nombre de usuario",
            client: selectedClient?.name || "Sin unidad seleccionada",
            breakpoint: "800px",
          }}
          menu={userMenu}
        />

        <StyledCollapseIcon
          $collapse={collapse}
          ref={collapseMenuRef}
          $isTablet={isTablet}
          onClick={() => setCollapse(!collapse)}
        >
          <Icon icon={<MdOutlineChevronRight />} appearance="primary" size="24px" cursorHover />
        </StyledCollapseIcon>
        {collapse && (
          <StyledCollapse ref={businessUnitChangeRef}>
            <BusinessUnitChange
              businessUnits={businessUnits}
              selectedClient={selectedClient?.name || ""}
              onLogoClick={handleLogoClick}
            />
          </StyledCollapse>
        )}
        <StyledContainer>
          {withBanner && (
            <Stack padding={spacing.s075}>
              <VinculationBanner
                key={selectedEmployee ? selectedEmployee.employeeId : "no-employee"}
                name={
                  selectedEmployee
                    ? `${selectedEmployee.names} ${selectedEmployee.surnames}`
                    : "Empleado no seleccionado"
                }
                status={selectedEmployee ? selectedEmployee.employeeStatus : "estado-desconocido"}
                imageUrl={logoUrl}
                redirectUrl="/employees/select-employee"
              />
            </Stack>
          )}
          <Grid
            templateColumns={withNav && !isTablet ? "auto 1fr" : "1fr"}
            alignContent="unset"
            height="95vh"
          >
            {withNav && !isTablet && (
              <Nav navigation={navConfig} actions={actions} collapse={true} />
            )}
            <StyledMain>
              <Outlet />
            </StyledMain>
          </Grid>
        </StyledContainer>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };
