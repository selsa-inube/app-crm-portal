import { useState } from "react";
import {
  Text,
  Stack,
  Grid,
  Divider,
  useMediaQuery,
  Button,
} from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { InvestmentCreditCard } from "@pages/simulateCredit/components/InvestmentCreditCard";
import { BaseModal } from "@components/modals/baseModal";
import { CardConsolidatedCredit } from "@pages/simulateCredit/components/CardConsolidatedCredit";
import { mockConsolidatedCreditModal } from "@mocks/add-prospect/consolidated-credit-modal/consolidatedcreditmodal.mock";
import { IProspect } from "@services/prospect/types";

import { ScrollableContainer } from "./styles";
import { ModalConfig } from "./config";

export interface ConsolidatedCreditsProps {
  handleClose: () => void;
  loading?: boolean;
  prospectData?: IProspect;
}

export function ConsolidatedCredits(props: ConsolidatedCreditsProps) {
  const { loading, handleClose, prospectData } = props;
  const isMobile = useMediaQuery("(max-width:880px)");
  const debtorData = mockConsolidatedCreditModal[0];
  const [editOpen, setEditOpen] = useState(true);
  const consolidatedCredits = prospectData?.consolidatedCredits || [];
  return (
    <BaseModal
      title={ModalConfig.title}
      nextButton={ModalConfig.keep}
      disabledNext={true}
      handleNext={handleClose}
      width={isMobile ? "300px" : "640px"}
      height={isMobile ? "auto" : "688px"}
      handleBack={handleClose}
      finalDivider={true}
      backButton={ModalConfig.close}
    >
      <Stack direction="column" gap="24px">
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent={isMobile ? "center" : "space-between"}
          gap={isMobile ? "10px" : "0px"}
        >
          <Stack direction="column">
            <Text
              appearance="primary"
              weight="bold"
              type="headline"
              size="large"
            >
              $
              {loading
                ? ModalConfig.loading
                : currencyFormat(debtorData.collectedValue, false)}
            </Text>
            <Text type="body" appearance="gray" size="small" textAlign="center">
              {ModalConfig.collectedValue}
            </Text>
          </Stack>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            appearance="primary"
            spacing="wide"
            fullwidth={isMobile}
            disabled={!editOpen}
          >
            {ModalConfig.edit}
          </Button>
        </Stack>
        <Divider dashed />
        <ScrollableContainer>
          <Stack
            direction="column"
            gap="16px"
            height={isMobile ? "auto" : "420px"}
            padding="0px 0px 0px 2px"
          >
            {editOpen ? (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="0%"
                >
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                    />
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.newObligations}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="0%"
                >
                  {debtorData.dataNew_card.map((item) => (
                    <CardConsolidatedCredit
                      code={item.consolidated_credit_code}
                      date={new Date(item.date)}
                      expiredValue={item.expired_value}
                      fullPayment={item.full_payment}
                      nextDueDate={item.next_due_date}
                      onUpdateTotal={() => {}}
                      title={item.consolidated_credit_title}
                      description={""}
                      tags={[]}
                    />
                  ))}
                </Grid>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="0%"
                >
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Stack>
        </ScrollableContainer>
      </Stack>
    </BaseModal>
  );
}
