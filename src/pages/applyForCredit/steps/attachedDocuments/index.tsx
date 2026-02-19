import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { IFile } from "@components/modals/ListModal";
import { IValidateRequirement } from "@services/creditRequest/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

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
  enums: IAllEnumsResponse;
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
    enums,
  } = props;

  const documentsRequiredByBorrower =
    validDocumentsRequiredByCreditRequest.length
      ? validDocumentsRequiredByCreditRequest
          .filter(
            (item) =>
              item.borrowerName &&
              item.documentalRequirement &&
              item.documentalRequirement.length > 0,
          )
          .flatMap((item) =>
            item.documentalRequirement.map((doc) => ({
              borrower: item.borrowerName,
              value:
                (enums?.Requirement ?? []).find((e) => e.code === doc)?.i18n[
                  lang
                ] ?? doc,
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
