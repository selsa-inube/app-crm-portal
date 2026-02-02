import { Stack } from "@inubekit/inubekit";
import { useContext, useEffect, useState } from "react";

import { Fieldset } from "@components/data/Fieldset";
import { TableAttachedDocuments } from "@pages/prospect/components/tableAttachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { AppContext } from "@context/AppContext";
import { IProspect } from "@services/prospect/types";
import { IFile } from "@components/modals/ListModal";
import { postDocumentsRequiredByCreditRequest } from "@services/creditRequest/getDocumentsRequiredByCreditRequest";
import {
  IPatchValidateRequirementsPayload,
  IValidateRequirement,
} from "@services/creditRequest/types";
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
  prospectData: IProspect;
  businessUnitPublicCode: string;
  lang: EnumType;
  onDocumentsLoad?: (documents: IValidateRequirement[]) => void;
}

export function AttachedDocuments(props: IAttachedDocumentsProps) {
  const {
    isMobile,
    initialValues,
    handleOnChange,
    customerData,
    prospectData,
    businessUnitPublicCode,
    lang,
    onDocumentsLoad,
  } = props;
  const { eventData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [
    validDocumentsRequiredByCreditRequest,
    setValidDocumentsRequiredByCreditRequest,
  ] = useState<IValidateRequirement[]>([]);

  const businessManagerCode = eventData.businessManager.publicCode;

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!prospectData) return;
    const payload =
      prospectData as unknown as IPatchValidateRequirementsPayload;
    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await postDocumentsRequiredByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
          eventData?.user?.identificationDocumentNumber || "",
          eventData.token,
        );
        if (data && Array.isArray(data) && data.length > 0) {
          setValidDocumentsRequiredByCreditRequest(data);
          onDocumentsLoad?.(data);
        } else {
          setValidDocumentsRequiredByCreditRequest([]);
          onDocumentsLoad?.([]);
        }
      } catch (error) {
        setShowErrorModal(true);
        setValidDocumentsRequiredByCreditRequest([]);
        onDocumentsLoad?.([]);
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [prospectData, businessUnitPublicCode, onDocumentsLoad]);

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
          isLoading={isLoading}
          showErrorModal={showErrorModal}
          lang={lang}
        />
      </Stack>
    </Fieldset>
  );
}
