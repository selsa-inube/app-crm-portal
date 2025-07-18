import { MdOutlineChevronRight } from "react-icons/md";
import { Header, Icon, Stack } from "@inubekit/inubekit";

import { Title } from "@components/layout/Title";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { InteractiveBox } from "@components/cards/interactiveBox";
import { useNavigationConfig } from "@components/layout/AppPage/config/apps.config";
import { userMenu } from "@config/menuMainConfiguration";

import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import {
  StyledCollapse,
  StyledCollapseIcon,
  StyledContainerCards,
  StyledContentImg,
  StyledGeneralHeader,
  StyledHeaderContainer,
  StyledLogo,
  StyledTitle,
} from "./styles";
import { IHomeUIProps } from "./types";
import { homeTitleConfig } from "./config/home.config";

const HomeUI = (props: IHomeUIProps) => {
  const {
    smallScreen,
    isTablet,
    isMobile,
    username,
    eventData,
    collapse,
    setCollapse,
    collapseMenuRef,
    businessUnitChangeRef,
    businessUnitsToTheStaff,
    selectedClient,
    handleLogoClick,
    dataHeader,
    loading,
    mockData,
  } = props;

  const renderLogo = (imgUrl: string) => (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} />
    </StyledContentImg>
  );

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
      </StyledHeaderContainer>

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
          padding="64px"
        >
          <Stack gap="24px" direction="column" height="100%" width="100%">
            <StyledGeneralHeader>
              <GeneralHeader
                buttonText="Agregar vinculación"
                descriptionStatus={dataHeader.status}
                name={dataHeader.name ?? ""}
                profileImageUrl="…"
              />
            </StyledGeneralHeader>

            <StyledTitle $smallScreen={smallScreen}>
              <Title
                title={homeTitleConfig(username).title}
                description={homeTitleConfig(username).description}
                icon={homeTitleConfig(username).icon}
                sizeTitle={homeTitleConfig(username).sizeTitle}
              />
            </StyledTitle>

            <StyledContainerCards $smallScreen={smallScreen}>
              {loading ? (
                <>
                  <InteractiveBox isLoading />
                  <InteractiveBox isLoading />
                </>
              ) : (
                mockData.map((item) => (
                  <InteractiveBox
                    key={item.id}
                    label={item.label}
                    description={item.description}
                    icon={item.icon()}
                    url={item.url}
                    isDisabled={item.id !== "1"}
                  />
                ))
              )}
            </StyledContainerCards>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export { HomeUI };
