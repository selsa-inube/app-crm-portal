import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";

interface IAttachedDocumentsProps {
  isMobile: boolean;
  initialValues: {
    [key: string]: { id: string; name: string; file: File }[];
  };
  handleOnChange: (files: {
    [key: string]: { id: string; name: string; file: File }[];
  }) => void;
  customerData: ICustomerData;
}

export function AttachedDocuments(props: IAttachedDocumentsProps) {
  const { isMobile, initialValues, handleOnChange, customerData } = props;

  return (
    <Fieldset>
      <Stack padding="16px">
        <TableAttachedDocuments
          isMobile={isMobile}
          uploadedFilesByRow={initialValues}
          setUploadedFilesByRow={handleOnChange}
          customerData={customerData}
        />
      </Stack>
    </Fieldset>
  );
}
