import { useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { CardBorrower } from "@components/cards/CardBorrower";
import { mockGuaranteeBorrower } from "@mocks/guarantee/offeredguarantee.mock";

import { Mortgage } from "./Mortgage";
import { Pledge } from "./Pledge";
import { Bail } from "./bail";
import { dataGuarantee, dataTabs } from "./config";
import { ScrollableContainer } from "./styles";

export interface IOfferedGuaranteeModalProps {
  handleClose: () => void;
  isMobile: boolean;
}

export function OfferedGuaranteeModal(props: IOfferedGuaranteeModalProps) {
  const { handleClose, isMobile } = props;

  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <BaseModal
      title={dataGuarantee.title}
      nextButton={dataGuarantee.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px" : "630px"}
      finalDivider={true}
    >
      <Stack>
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={dataTabs}
          onChange={onChange}
        />
      </Stack>
      <Stack width="100%">
        {currentTab === "borrower" && (
          <ScrollableContainer>
            {mockGuaranteeBorrower.map((borrower, index) => (
              <Stack
                key={index}
                justifyContent="center"
                margin="8px 0px"
                width="100%"
              >
                <CardBorrower
                  key={borrower.id}
                  title={`${dataGuarantee.borrower} ${index + 1}`}
                  name={borrower.name}
                  lastName={borrower.lastName}
                  email={borrower.email}
                  income={borrower.income}
                  obligations={borrower.obligations}
                  showIcons={false}
                />
              </Stack>
            ))}
          </ScrollableContainer>
        )}
        {currentTab === "mortgage" && <Mortgage isMobile={isMobile} />}
        {currentTab === "pledge" && <Pledge isMobile={isMobile} />}
        {currentTab === "bail" && <Bail />}
      </Stack>
    </BaseModal>
  );
}
