import {
  MdArrowBack,
  MdArrowForwardIos,
  MdOutlinePriceChange,
} from "react-icons/md";
import {
  Breadcrumbs,
  Icon,
  Stack,
  useMediaQuery,
  Text,
} from "@inubekit/inubekit";

import { CreditCard } from "@components/cards/CreditCard";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import userImage from "@assets/images/userImage.jpeg";
import {
  getIconByName,
  OptionStaffPortal,
} from "@services/enum/isaas/catalogOfOptionsForStaffPortal";
import { ErrorPage } from "@components/layout/ErrorPage";
import { Fieldset } from "@components/data/Fieldset";
import { ErrorModal } from "@components/modals/ErrorModal";
import { InteractiveBox } from "@components/cards/interactiveBox";
import { BaseModal } from "@components/modals/baseModal";

import {
  addConfig,
  advancePaymentModal,
  errorDataCredit,
} from "./config/credit.config";
import { ICreditUIProps } from "./types";
import { StyledArrowBack } from "./styles";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";

type IEnhancedSubOption = {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  url: string;
  isDisabled: boolean;
};

const CreditUI = (props: ICreditUIProps) => {
  const {
    isMobile,
    dataOptions,
    dataHeader,
    codeError,
    addToFix,
    user,
    showErrorModal,
    messageError,
    loading,
    navigate,
    setShowErrorModal,
    setMessageError,
    isInfoModalOpen,
    handleOpenInfoModal,
    handleInfoModalClose,
  } = props;

  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");

  const mergeSubOptions = (
    backendOptions: IOptionStaff[],
  ): IEnhancedSubOption[] => {
    return backendOptions.flatMap((backendOption) => {
      const configOption = OptionStaffPortal.find(
        (item) => item.id === backendOption.publicCode,
      );

      if (!configOption || !Array.isArray(configOption.subOptions)) return [];

      const backendSubs = Array.isArray(backendOption.subOption)
        ? backendOption.subOption
        : [];

      return configOption.subOptions.map((sub) => {
        const match = backendSubs.find((opt) => opt.publicCode === sub.id);

        return {
          key: match?.optionStaffId,
          icon: getIconByName(match?.iconReference || ""),
          title: match?.abbreviatedName,
          subtitle: match?.descriptionUse,
          url: sub.url ?? "",
          isDisabled: !match,
        };
      });
    });
  };

  const options = mergeSubOptions(
    Array.isArray(dataOptions) ? dataOptions : [dataOptions],
  );

  const handleCardClick = (title: string, url: string) => {
    if (title === "Adelanto de nómina") {
      handleOpenInfoModal();
    } else if (url) {
      navigate(url);
    } else {
      setMessageError(errorDataCredit.noUrl);
      setShowErrorModal(true);
    }
  };

  const advanceOptions = [
    {
      icon: <MdOutlinePriceChange />,
      title: advancePaymentModal.titleRoster,
      subtitle: advancePaymentModal.subtitleRoster,
    },
    {
      icon: <MdOutlinePriceChange />,
      title: advancePaymentModal.titleAdvance,
      subtitle: advancePaymentModal.subtitleAdvance,
    },
  ];

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
          margin={`20px auto ${isMobile || isTablet ? "100px" : "50px"} auto`}
          width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
          direction="column"
          gap="24px"
        >
          <GeneralHeader
            descriptionStatus={dataHeader.status}
            name={dataHeader.name}
            profileImageUrl={dataHeader.image || userImage}
          />
          <Breadcrumbs crumbs={addConfig.crumbs} />
          <Stack gap="64px" direction="column">
            <StyledArrowBack
              $isMobile={isMobile}
              onClick={() => navigate(addConfig.route)}
            >
              <Stack gap="8px" alignItems="center" width="100%">
                <Icon icon={<MdArrowBack />} appearance="dark" size="20px" />
                <Text type="title" size={isMobile ? "small" : "large"}>
                  {addConfig.title}
                </Text>
              </Stack>
            </StyledArrowBack>
            {options.length === 0 && !loading ? (
              <Text type="title" size="large">
                {errorDataCredit.noData}
              </Text>
            ) : (
              <>
                {loading ? (
                  <Stack width="300px">
                    <InteractiveBox isMobile={isTablet} isLoading />
                  </Stack>
                ) : (
                  <Fieldset
                    maxHeight={"550px"}
                    showFieldset={options.length > 9}
                  >
                    <Stack
                      direction={isTablet ? "column" : "row"}
                      wrap="wrap"
                      alignItems={isTablet ? "center" : "flex-start"}
                    >
                      {options.map(
                        ({ key, icon, title, subtitle, url, isDisabled }) => (
                          <CreditCard
                            key={key}
                            icon={icon}
                            title={title}
                            subtitle={subtitle}
                            url={url}
                            isDisabled={isDisabled}
                            onClick={() => handleCardClick(title, url)}
                            onInvalidUrl={() => {
                              setMessageError(errorDataCredit.noUrl);
                              setShowErrorModal(true);
                            }}
                          />
                        ),
                      )}
                    </Stack>
                  </Fieldset>
                )}
              </>
            )}
          </Stack>
          {showErrorModal && (
            <ErrorModal
              handleClose={() => setShowErrorModal(false)}
              isMobile={isMobile}
              message={messageError}
            />
          )}
          {isInfoModalOpen && (
            <BaseModal
              title={advancePaymentModal.title}
              apparenceNext="danger"
              handleBack={handleInfoModalClose}
              width={isMobile ? "300px" : "450px"}
            >
              <Stack direction="column" gap="16px">
                <Text>{advancePaymentModal.description}</Text>

                {advanceOptions.map((option, index) => (
                  <Fieldset key={index} padding="0">
                    <Stack
                      justifyContent="space-between"
                      alignItems="center"
                      padding="0 10px"
                    >
                      <Stack
                        alignItems="center"
                        gap="12px"
                        width="calc(100% - 40px)"
                      >
                        <Icon
                          icon={option.icon}
                          appearance="primary"
                          size="28px"
                          spacing="compact"
                          variant="outlined"
                        />
                        <Stack direction="column" gap="4px">
                          <Text
                            type="title"
                            appearance="dark"
                            size="medium"
                            weight="bold"
                          >
                            {option.title}
                          </Text>
                          <Text size="small" appearance="gray">
                            {option.subtitle}
                          </Text>
                        </Stack>
                      </Stack>
                      <Icon
                        icon={<MdArrowForwardIos />}
                        appearance="primary"
                        size="18px"
                        onClick={() => {
                          const route =
                            option.title === "Prima"
                              ? "/credit/bonus"
                              : "/credit/payroll";
                          navigate(route);
                        }}
                        cursorHover
                      />
                    </Stack>
                  </Fieldset>
                ))}
              </Stack>
            </BaseModal>
          )}
        </Stack>
      )}
    </>
  );
};

export { CreditUI };
