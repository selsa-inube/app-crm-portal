import { Stack, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { IProspect } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum/useEnum";

export interface ReportCreditsModalProps {
  handleClose: () => void;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  lang: EnumType;
  prospectData?: IProspect[];
  showAddButton?: boolean;
  onProspectUpdate?: () => void;
}

export function ReportCreditsModal({
  handleClose,
  onProspectUpdate,
  lang,
  prospectData,
  showAddButton,
}: ReportCreditsModalProps) {
  const isMobile = useMediaQuery("(max-width:880px)");

  return (
    <BaseModal
      title={dataReport.title.i18n[lang]}
      nextButton={dataReport.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "290px" : "1050px"}
      initialDivider={false}
    >
      <Stack direction="column" gap="16px">
        <>
          <TableFinancialObligations
            showActions
            initialValues={prospectData}
            onProspectUpdate={onProspectUpdate}
            showAddButton={showAddButton}
          />
        </>
      </Stack>
    </BaseModal>
  );
}
