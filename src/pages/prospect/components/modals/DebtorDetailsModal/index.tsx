import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";

import { dataDetails, dataTabs } from "./config";
import { DataDebtor } from "./dataDebtor";
import { IncomeDebtor } from "./incomeDebtor";
import { IBorrower } from "@src/services/prospect/types";
import { IDebtorDetail } from "@src/pages/applyForCredit/types";

interface IDebtorDetailsModalProps {
  handleClose: () => void;
  initialValues: IDebtorDetail;
  allDetails: IBorrower | null;
  isMobile?: boolean;
}

export function DebtorDetailsModal(props: IDebtorDetailsModalProps) {
  const { handleClose, initialValues, isMobile, allDetails } = props;

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
      width={isMobile ? "290px" : "704px"}
      height="645px"
    >
      <Stack direction="column" height="475px" gap="24px">
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={dataTabs}
          onChange={onChange}
        />
        {currentTab === "data" && <DataDebtor initialValues={initialValues} />}
        {currentTab === "sources" && (
          <IncomeDebtor initialValues={allDetails as IBorrower} />
        )}
        {currentTab === "obligations" && (
          <TableFinancialObligations
            initialValues={allDetails as IBorrower}
            showButtons={false}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
