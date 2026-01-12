import { useMemo, useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IBorrower } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataDetails, dataTabs } from "./config";
import { DataDebtor } from "./dataDebtor";
import { IncomeDebtor } from "./incomeDebtor";

interface IDebtorDetailsModalProps {
  handleClose: () => void;
  initialValues: IDebtorDetail;
  properties: IBorrower | null;
  isMobile?: boolean;
  lang: EnumType;
}

export function DebtorDetailsModal(props: IDebtorDetailsModalProps) {
  const { handleClose, initialValues, isMobile, properties, lang } = props;

  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const translatedTabs = useMemo(() => {
    return dataTabs.map((tab) => ({
      ...tab,
      label: tab.label.i18n[lang],
    }));
  }, [lang]);

  return (
    <BaseModal
      title={dataDetails.title.i18n[lang]}
      nextButton={dataDetails.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      finalDivider={true}
      width={isMobile ? "290px" : "912px"}
      height={isMobile ? "auto" : "750px"}
    >
      <Stack direction="column" height={isMobile ? "auto" : "590px"} gap="24px">
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={translatedTabs}
          onChange={onChange}
        />
        {currentTab === "data" && (
          <DataDebtor initialValues={initialValues} lang={lang} />
        )}
        {currentTab === "sources" && (
          <IncomeDebtor initialValues={properties as IBorrower} />
        )}
        {currentTab === "obligations" && (
          <TableFinancialObligations
            initialValues={properties as IBorrower}
            showButtons={false}
            handleOnChangeExtraBorrowers={() => {}}
            showOnlyEdit={true}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
