import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MdLogout, MdOutlineChevronRight } from "react-icons/md";
import {
  Nav,
  Icon,
  Grid,
  useFlag,
  useMediaQuery,
  Header,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { AppContext } from "@context/AppContext";
import { MenuSection } from "@components/navigation/MenuSection";
import { MenuUser } from "@components/navigation/MenuUser";
import { LogoutModal } from "@components/feedback/LogoutModal";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";
import { useNavConfig, actions } from "@config/nav.config";
import { userMenu } from "@config/menuMainConfiguration";
import { useEnum } from "@hooks/useEnum/useEnum";

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

const renderLogo = (imgUrl: string, onTheFooter: boolean = false) => {
  if (!imgUrl && !onTheFooter) return undefined;

  return (
    <StyledContentImg to="/home">
      <StyledLogo src={imgUrl} $onTheFooter={onTheFooter} />
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
  const location = useLocation();
  const { user } = useIAuth();
  const { lang } = useEnum();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [showMenuOnHeader, setShowMenuOnHeader] = useState(true);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
  const navConfig = useNavConfig(lang);
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
    if (
      businessUnit.abbreviatedName !== eventData.businessUnit.abbreviatedName
    ) {
      navigate("/clients/select-client/");
    }
  };

  const { addFlag } = useFlag();

  const translatedActions = useMemo(() => {
    return actions.map((action) => ({
      ...action,
      label: action.label.i18n[lang],
    }));
  }, [lang]);

  const translatedUserMenu = useMemo(() => {
    return userMenu.map((section) => ({
      ...section,
      title: section.title.i18n[lang],
      links: section.links.map((link) => ({
        ...link,
        title: link.title.i18n[lang],
      })),
    }));
  }, [lang]);

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

  useEffect(() => {
    if (location.pathname.toString().includes("clients/select-client")) {
      setShowMenuOnHeader(false);
    } else {
      setShowMenuOnHeader(true);
    }
  });

  if (
    eventData.businessUnit.businessUnitPublicCode === "" ||
    eventData.businessUnit.businessUnitPublicCode === undefined
  ) {
    navigate(`/login/${user.username}/business-units/select-business-unit`);
  }

  return (
    <StyledAppPage>
      <Grid templateRows="auto 1fr" height="100vh" justifyContent="unset">
        <StyledPrint>
          <StyledHeaderContainer>
            <Header
              logoURL={renderLogo(eventData.businessUnit.urlLogo)}
              {...(showMenuOnHeader && { navigation: useNavigationConfig() })}
              user={{
                username: eventData.user.userAccount,
                breakpoint: "848px",
              }}
              menu={translatedUserMenu}
            />
          </StyledHeaderContainer>
          {businessUnitsToTheStaff && businessUnitsToTheStaff.length > 1 && (
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
          )}
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
            height="100%"
          >
            {!isTablet && showNav && (
              <StyledPrint>
                <Nav
                  navigation={navConfig}
                  actions={translatedActions}
                  collapse={true}
                />
              </StyledPrint>
            )}
            <StyledMain>
              <Outlet />
            </StyledMain>
          </Grid>
        </StyledContainer>

        <StyledFooter $nav={isTablet} $showNav={showNav}>
          {renderLogo(eventData.businessManager.urlBrand, true)}
        </StyledFooter>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };
