import { MdOutlineChevronRight } from "react-icons/md";
import { Header, Icon, Stack } from "@inubekit/inubekit";

import { Title } from "@components/layout/Title";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { InteractiveBox } from "@components/cards/interactiveBox";
import { useNavigationConfig } from "@components/layout/AppPage/config/apps.config";
import { userMenu } from "@config/menuMainConfiguration";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import { OptionStaffPortal } from "@services/enum/isaas/catalogOfOptionsForStaffPortal";

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

export interface IEnhancedOption {
  id: string;
  abbreviatedName: string;
  descriptionUse: string;
  icon: React.ReactNode;
  url: string;
  isDisabled: boolean;
}

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
    dataOptions,
  } = props;

  const renderLogo = (imgUrl: string) => (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} />
    </StyledContentImg>
  );

  const mergeStaffOptions = (
    backendOptions: IOptionStaff[],
  ): IEnhancedOption[] => {
    return OptionStaffPortal.map((configItem) => {
      const match = backendOptions.find(
        (opt) => opt.publicCode === configItem.id,
      );

      return {
        id: configItem.id,
        abbreviatedName: match?.abbreviatedName || configItem.id,
        descriptionUse: match?.descriptionUse || configItem.descriptionUse,
        icon: configItem.icon,
        url: configItem.url,
        isDisabled: !match,
      };
    });
  };

  const options = mergeStaffOptions(
    Array.isArray(dataOptions) ? dataOptions : [dataOptions],
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
                </>
              ) : (
                options.map((item, index) => (
                  <InteractiveBox
                    key={index}
                    label={item.abbreviatedName}
                    description={item.descriptionUse}
                    icon={item.icon}
                    url={item.url}
                    isDisabled={item.isDisabled}
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
