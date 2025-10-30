import { useState, useEffect } from "react";
import { Stack, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { IProspect } from "@services/prospect/types";

export interface ReportCreditsModalProps {
  handleClose: () => void;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  prospectData?: IProspect[];
  showAddButton?: boolean;
  onProspectUpdate?: () => void;
}

export function ReportCreditsModal({
  handleClose,
  onProspectUpdate,
  prospectData,
  showAddButton,
}: ReportCreditsModalProps) {
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:880px)");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <BaseModal
      title={dataReport.title}
      nextButton={dataReport.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "290px" : "1050px"}
      initialDivider={false}
    >
      <Stack direction="column" gap="16px">
        {!loading && (
          <>
            <TableFinancialObligations
              showActions
              initialValues={prospectData}
              onProspectUpdate={onProspectUpdate}
              showAddButton={showAddButton}
            />
          </>
        )}
      </Stack>
    </BaseModal>
  );
}
