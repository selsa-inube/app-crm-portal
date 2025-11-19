import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IBorrower } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";

import { dataDetails, dataTabs } from "./config";
import { DataDebtor } from "./dataDebtor";
import { IncomeDebtor } from "./incomeDebtor";

interface IDebtorDetailsModalProps {
  handleClose: () => void;
  initialValues: IDebtorDetail;
  properties: IBorrower | null;
  isMobile?: boolean;
}

export function DebtorDetailsModal(props: IDebtorDetailsModalProps) {
  const { handleClose, initialValues, isMobile, properties } = props;

  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <BaseModal
      title={dataDetails.title}
      nextButton={dataDetails.close}
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
          tabs={dataTabs}
          onChange={onChange}
        />
        {currentTab === "data" && <DataDebtor initialValues={initialValues} />}
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
