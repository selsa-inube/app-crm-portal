import { useEffect, useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataDisbursement, dataTabs } from "./config";
import { DisbursementInternal } from "./Internal";
import { DisbursementExternal } from "./External";
import { DisbursementCheckEntity } from "./CheckEntity";
import { DisbursementChequeManagement } from "./ChequeManagement";
import { DisbursementCash } from "./Cash";
import { dataTabsDisbursement } from "./types";

export interface IDisbursementModalProps {
  handleClose: () => void;
  isMobile: boolean;
  loading?: boolean;
  data: {
    internal: dataTabsDisbursement;
    external: dataTabsDisbursement;
    CheckEntity: dataTabsDisbursement;
    checkManagementData: dataTabsDisbursement;
    cash: dataTabsDisbursement;
  };
  lang: EnumType;
}

export function DisbursementModal(
  props: IDisbursementModalProps,
): JSX.Element | null {
  const { handleClose, isMobile, data, lang } = props;

  const availableTabs = dataTabs
    .filter((tab) => {
      const hasValidData = (tabData: dataTabsDisbursement) =>
        tabData && Object.values(tabData).some((value) => value !== "");

      switch (tab.id) {
        case "Internal_account":
          return hasValidData(data.internal);
        case "External_account":
          return hasValidData(data.external);
        case "Certified_check":
          return hasValidData(data.CheckEntity);
        case "Business_check":
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

  const [currentTab, setCurrentTab] = useState(() =>
    availableTabs.length > 0 ? availableTabs[0].id : "",
  );

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.some((tab) => tab.id === currentTab)
    ) {
      setCurrentTab(availableTabs[0].id);
    }
  }, [availableTabs, currentTab]);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <BaseModal
      title={dataDisbursement.title.i18n[lang]}
      finalDivider={true}
      handleClose={handleClose}
      handleNext={handleClose}
      nextButton={dataDisbursement.close.i18n[lang]}
      width={isMobile ? "300px" : "652px"}
      height={isMobile ? "566px" : "662px"}
    >
      <Stack>
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={availableTabs}
          onChange={onChange}
        />
      </Stack>
      <Fieldset heightFieldset="469px">
        <>
          {currentTab === "Internal" && (
            <DisbursementInternal
              isMobile={isMobile}
              data={data.internal}
              lang={lang}
            />
          )}
          {currentTab === "External" && (
            <DisbursementExternal
              isMobile={isMobile}
              data={data.external}
              lang={lang}
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
      </Fieldset>
    </BaseModal>
  );
}
