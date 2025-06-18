import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IDebtorDetail } from "@pages/SubmitCreditApplication/types";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";

import { dataDetails, dataTabs } from "./config";
import { DataDebtor } from "./dataDebtor";
import { IncomeDebtor } from "./incomeDebtor";

interface IDebtorDetailsModalProps {
  handleClose: () => void;
  initialValues: IDebtorDetail;
  isMobile?: boolean;
}

export function DebtorDetailsModal(props: IDebtorDetailsModalProps) {
  const { handleClose, initialValues, isMobile } = props;

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
          <IncomeDebtor initialValues={initialValues} />
        )}
        {currentTab === "obligations" && (
          <TableFinancialObligations
            initialValues={initialValues}
            showButtons={false}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
