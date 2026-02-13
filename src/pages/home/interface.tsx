import { Stack, Text } from "@inubekit/inubekit";

import { Title } from "@components/layout/Title";
import { InteractiveBox } from "@components/cards/interactiveBox";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import userImage from "@assets/images/userImage.jpeg";
import {
  getIconByName,
  OptionStaffPortal,
} from "@services/enum/isaas/catalogOfOptionsForStaffPortal";
import { ErrorPage } from "@components/layout/ErrorPage";
import { ErrorModal } from "@components/modals/ErrorModal";

import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";
import {
  StyledContainerCards,
  StyledGeneralHeader,
  StyledTitle,
} from "./styles";
import { IHomeUIProps } from "./types";
import { errorDataCredit, homeTitleConfig } from "./config/home.config";

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
    isMobile,
    username,
    dataHeader,
    loading,
    dataOptions,
    codeError,
    addToFix,
    showErrorModal,
    messageError,
    user,
    navigate,
    setShowErrorModal,
    setMessageError,
    lang,
  } = props;

  const mergeStaffOptions = (
    backendOptions: IOptionStaff[],
  ): IEnhancedOption[] => {
    return OptionStaffPortal.map((configItem) => {
      const match = backendOptions.find(
        (opt) => opt.publicCode === configItem.id,
      );

      return {
        id: match?.optionStaffId ?? "",
        abbreviatedName: match?.abbreviatedName ?? "",
        descriptionUse: match?.descriptionUse ?? "",
        icon: getIconByName(match?.iconReference || ""),
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
      {codeError ? (
        <ErrorPage
          onClick={() => {
            codeError === 1003
              ? navigate(
                  `/login/${user.username}/business-units/select-business-unit`,
                )
              : navigate("/clients/select-client/");
          }}
          errorCode={codeError}
          addToFix={addToFix}
        />
      ) : (
        <Stack
          direction="column"
          width={isMobile ? "calc(100% - 20px)" : "min(100% - 20px, 1064px)"}
          margin="0 auto"
          gap="16px"
          padding="32px 0 0 0"
        >
          <Stack direction="column" alignItems={isMobile ? "normal" : "center"}>
            <Stack gap="24px" direction="column" height="100%" width="100%">
              <StyledGeneralHeader>
                <GeneralHeader
                  buttonText="Agregar vinculación"
                  descriptionStatus={dataHeader.status}
                  name={dataHeader.name ?? ""}
                  profileImageUrl={dataHeader.image || userImage}
                />
              </StyledGeneralHeader>
              <StyledTitle $smallScreen={smallScreen}>
                <Title
                  title={homeTitleConfig(username).title.i18n[lang]}
                  description={homeTitleConfig(username).description.i18n[lang]}
                  icon={homeTitleConfig(username).icon}
                  sizeTitle={"large"}
                />
              </StyledTitle>
              {options.length === 0 ? (
                <Text type="title" size="large">
                  {errorDataCredit.noData.i18n[lang]}
                </Text>
              ) : (
                <StyledContainerCards $smallScreen={smallScreen}>
                  {loading ? (
                    <>
                      <InteractiveBox isMobile={smallScreen} isLoading />
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
                        isMobile={smallScreen}
                        onInvalidUrl={() => {
                          setMessageError(errorDataCredit.noUrl.i18n[lang]);
                          setShowErrorModal(true);
                        }}
                      />
                    ))
                  )}
                </StyledContainerCards>
              )}
            </Stack>
          </Stack>
          {showErrorModal && (
            <ErrorModal
              handleClose={() => setShowErrorModal(false)}
              isMobile={isMobile}
              message={messageError}
            />
          )}
        </Stack>
      )}
    </>
  );
};

export { HomeUI };
