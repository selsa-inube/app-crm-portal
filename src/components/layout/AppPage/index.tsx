import { useContext, useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { MdLogout, MdOutlineChevronRight } from "react-icons/md";
import {
  Nav,
  Icon,
  Grid,
  useFlag,
  useMediaQuery,
  Header,
} from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";
import { MenuSection } from "@components/navigation/MenuSection";
import { MenuUser } from "@components/navigation/MenuUser";
import { LogoutModal } from "@components/feedback/LogoutModal";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";
import { useNavConfig, actions } from "@config/nav.config";
import { userMenu } from "@config/menuMainConfiguration";

import {
  StyledAppPage,
  StyledContainer,
  StyledContentImg,
  StyledLogo,
  StyledMain,
  StyledMenuContainer,
  StyledHeaderContainer,
  StyledCollapseIcon,
  StyledCollapse,
  StyledPrint,
  StyledFooter,
} from "./styles";

import { useNavigationConfig } from "./config/apps.config";

const renderLogo = (imgUrl: string) => {
  return (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} />
    </StyledContentImg>
  );
};

interface IAppPage {
  showNav?: boolean;
}

function AppPage(props: IAppPage) {
  const { showNav = true } = props;

  const { eventData, businessUnitsToTheStaff, setBusinessUnitSigla } =
    useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node) &&
      event.target !== userMenuRef.current
    ) {
      setShowUserMenu(false);
    }

    if (
      collapseMenuRef.current &&
      !collapseMenuRef.current.contains(event.target as Node) &&
      event.target !== collapseMenuRef.current &&
      businessUnitChangeRef.current &&
      !businessUnitChangeRef.current.contains(event.target as Node)
    ) {
      setCollapse(false);
    }
  };

  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");
  const navConfig = useNavConfig();
  const [selectedClient, setSelectedClient] = useState<string>(
    eventData.businessUnit.abbreviatedName,
  );
  useEffect(() => {
    const selectUser = document.querySelector("header div div:nth-child(0)");
    const handleToggleuserMenu = () => {
      setShowUserMenu(!showUserMenu);
    };

    document.addEventListener("mousedown", handleClickOutside);
    selectUser?.addEventListener("mouseup", handleToggleuserMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleToggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
    setShowUserMenu(false);
  };

  const handleLogoClick = (businessUnit: IBusinessUnitsPortalStaff) => {
    const selectJSON = JSON.stringify(businessUnit);
    setBusinessUnitSigla(selectJSON);
    setSelectedClient(businessUnit.abbreviatedName);
    setCollapse(false);
  };

  const { addFlag } = useFlag();

  const handleFlag = () => {
    const errorData = mockErrorBoard[0].business;
    addFlag({
      title: errorData[0],
      description: errorData[1],
      appearance: "danger",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (!businessUnitsToTheStaff || businessUnitsToTheStaff.length === 0) {
      handleFlag();
    }
  }, [businessUnitsToTheStaff]);

  return (
    <StyledAppPage>
      <Grid templateRows="auto 1fr" height="100vh" justifyContent="unset">
        <StyledPrint>
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
        </StyledPrint>
        {collapse && (
          <StyledCollapse ref={businessUnitChangeRef}>
            <BusinessUnitChange
              businessUnits={businessUnitsToTheStaff}
              selectedClient={selectedClient}
              onLogoClick={handleLogoClick}
            />
          </StyledCollapse>
        )}
        <StyledContainer>
          {showUserMenu && (
            <StyledMenuContainer ref={userMenuRef}>
              <MenuUser
                userName={eventData.user.userName}
                businessUnit={eventData.businessUnit.abbreviatedName}
              />
              <MenuSection
                sections={[
                  {
                    links: [
                      {
                        title: "Cerrar sesión",
                        iconBefore: <MdLogout />,
                        onClick: handleToggleLogoutModal,
                      },
                    ],
                  },
                ]}
                divider={true}
              />
            </StyledMenuContainer>
          )}

          {showLogoutModal && (
            <LogoutModal
              logoutPath="/logout"
              handleShowBlanket={handleToggleLogoutModal}
            />
          )}

          <Grid
            templateColumns={!isTablet ? (showNav ? "auto 1fr" : "1fr") : "1fr"}
            alignContent="unset"
            height={isTablet ? "81vh" : "92vh"}
          >
            {!isTablet && showNav && (
              <Nav
                navigation={navConfig}
                actions={actions}
                collapse={true}
                footerLogo={eventData.businessManager.urlLogo}
              />
            )}
            <StyledMain>
              <Outlet />
            </StyledMain>
          </Grid>
          {isTablet && (
            <StyledFooter>
              {renderLogo(eventData.businessManager.urlBrand)}
            </StyledFooter>
          )}
        </StyledContainer>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };
