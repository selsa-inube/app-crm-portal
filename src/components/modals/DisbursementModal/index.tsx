import { useEffect, useState, Fragment } from "react";
import { Stack, Tabs, SkeletonLine, Grid } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { useEnum } from "@hooks/useEnum/useEnum";

import { DisbursementInternal } from "./Internal";
import { DisbursementExternal } from "./External";
import { DisbursementCheckEntity } from "./CheckEntity";
import { DisbursementChequeManagement } from "./ChequeManagement";
import { DisbursementCash } from "./Cash";
import { dataTabsDisbursement } from "./types";
import { dataDisbursementEnum, dataTabsEnum } from "./config";

export interface IDisbursementModalProps {
  handleClose: () => void;
  handleOpenEdit: () => void;
  isMobile: boolean;
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  data: {
    internal: dataTabsDisbursement;
    external: dataTabsDisbursement;
    CheckEntity: dataTabsDisbursement;
    checkManagementData: dataTabsDisbursement;
    cash: dataTabsDisbursement;
  };
  handleDisbursement?: () => void;
  loading?: boolean;
}

export function DisbursementModal(
  props: IDisbursementModalProps,
): JSX.Element | null {
  const {
    handleClose,
    isMobile,
    data,
    handleDisbursement,
    handleOpenEdit,
    setCurrentTab,
    currentTab,
    loading: loading = false,
  } = props;

  const [error] = useState(false);
  const { lang, enums } = useEnum();

  const availableTabs = dataTabsEnum
    .filter((tab) => {
      const hasValidData = (tabData: dataTabsDisbursement) =>
        tabData && Object.values(tabData).some((value) => value !== "");

      switch (tab.id) {
        case "Internal":
          return hasValidData(data.internal);
        case "External":
          return hasValidData(data.external);
        case "CheckEntity":
          return hasValidData(data.CheckEntity);
        case "CheckManagement":
          return hasValidData(data.checkManagementData);
        case "Cash":
          return hasValidData(data.cash);
        default:
          return false;
      }
    })
    .map((tab) => ({
      ...tab,
      label: tab.label.i18n[lang],
    }));

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.some((tab) => tab.id === currentTab)
    ) {
      setCurrentTab(availableTabs[0].id);
    }
  }, [availableTabs, currentTab, setCurrentTab]);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };
  const handleRetry = () => {
    handleDisbursement?.();
  };

  return (
    <BaseModal
      title={dataDisbursementEnum.title.i18n[lang]}
      finalDivider={true}
      handleClose={handleClose}
      handleNext={handleClose}
      nextButton={dataDisbursementEnum.close.i18n[lang]}
      handleBack={handleOpenEdit}
      width={isMobile ? "340px" : "682px"}
      height={isMobile ? "auto" : "700px"}
    >
      <Stack>
        {!loading && availableTabs.length > 0 ? (
          <Tabs
            scroll={isMobile}
            selectedTab={currentTab}
            tabs={availableTabs}
            onChange={onChange}
          />
        ) : (
          <></>
        )}
      </Stack>

      <Fieldset
        heightFieldset={isMobile ? "auto" : "490px"}
        alignContent={loading || error ? "center" : "start"}
      >
        {loading ? (
          <Stack
            direction="column"
            gap="16px"
            width={isMobile ? "100%" : "582px"}
            height="auto"
            padding="16px 10px"
          >
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              gap="16px 20px"
              autoRows="auto"
            >
              {Array.from({ length: 7 }).map((_, index) => (
                <Fragment key={`skeleton-${index}-disbursement`}>
                  <SkeletonLine
                    key={`skeleton-one${index}-disbursement`}
                    width="280px"
                    height="40px"
                    animated
                  />
                  <SkeletonLine
                    key={`skeleton-two${index}-disbursement`}
                    width="280px"
                    height="40px"
                    animated
                  />
                </Fragment>
              ))}
            </Grid>
          </Stack>
        ) : (
          <></>
        )}

        {!loading && error ? (
          <ItemNotFound
            image={userNotFound}
            title={dataDisbursementEnum.noDataTitle.i18n[lang]}
            description={dataDisbursementEnum.noDataDescription.i18n[lang]}
            buttonDescription={dataDisbursementEnum.retry.i18n[lang]}
            onRetry={handleRetry}
          />
        ) : (
          <></>
        )}

        {!loading && !error ? (
          <>
            {currentTab === "Internal" && (
              <DisbursementInternal
                isMobile={isMobile}
                data={data.internal}
                lang={lang}
                enums={enums}
              />
            )}
            {currentTab === "External" && (
              <DisbursementExternal
                isMobile={isMobile}
                data={data.external}
                lang={lang}
                enums={enums}
              />
            )}
            {currentTab === "CheckEntity" && (
              <DisbursementCheckEntity
                isMobile={isMobile}
                data={data.CheckEntity}
                lang={lang}
              />
            )}
            {currentTab === "CheckManagement" && (
              <DisbursementChequeManagement
                isMobile={isMobile}
                data={data.checkManagementData}
                lang={lang}
              />
            )}
            {currentTab === "Cash" && (
              <DisbursementCash
                isMobile={isMobile}
                data={data.cash}
                lang={lang}
              />
            )}
          </>
        ) : (
          <></>
        )}
      </Fieldset>
    </BaseModal>
  );
}
