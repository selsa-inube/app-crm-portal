import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { IFile } from "@components/modals/ListModal";
import { IValidateRequirement } from "@services/creditRequest/types";
import { EnumType } from "@hooks/useEnum/useEnum";

export interface IBorrowerDocumentRule {
  borrower: string;
  value: string;
}

interface IAttachedDocumentsProps {
  isMobile: boolean;
  initialValues: {
    [key: string]: IFile[];
  };
  handleOnChange: (files: {
    [key: string]: IFile[] | { id: string; name: string; file: File }[];
  }) => void;
  customerData: ICustomerData;
  lang: EnumType;
  loading: boolean;
  validDocumentsRequiredByCreditRequest: IValidateRequirement[];
  showErrorModal: boolean;
}

export function AttachedDocuments(props: IAttachedDocumentsProps) {
  const {
    isMobile,
    initialValues,
    handleOnChange,
    customerData,
    lang,
    loading,
    validDocumentsRequiredByCreditRequest,
    showErrorModal,
  } = props;

  const documentsRequiredByBorrower =
    validDocumentsRequiredByCreditRequest.length
      ? validDocumentsRequiredByCreditRequest.flatMap((item) =>
          item.documentalRequirement.map((doc) => ({
            borrower: item.borrowerName,
            value: doc,
          })),
        )
      : [];

  return (
    <Fieldset>
      <Stack padding="1px">
        <TableAttachedDocuments
          isMobile={isMobile}
          uploadedFilesByRow={initialValues}
          setUploadedFilesByRow={handleOnChange}
          customerData={customerData}
          ruleValues={documentsRequiredByBorrower}
          isLoading={loading}
          showErrorModal={showErrorModal}
          lang={lang}
        />
      </Stack>
    </Fieldset>
  );
}
