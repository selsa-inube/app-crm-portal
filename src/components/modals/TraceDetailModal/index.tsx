import { useState } from "react";
import { Divider, Stack, Text, useFlag } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { getSearchDocumentById } from "@services/creditRequest/SearchDocumentById";
import { EnumType } from "@hooks/useEnum/useEnum";

import { DocumentViewer } from "../DocumentViewer";
import { dataTrace } from "./config";
import { StyledScroll } from "./styles";
import { DocumentItem } from "./types";

export interface ITraceDetailsModalProps {
  handleClose: () => void;
  data: { answer: string; observations: string; documents?: DocumentItem[] };
  lang: EnumType;
  businessUnitPublicCode?: string;
  businessManagerCode?: string;
  isMobile?: boolean;
  user?: string;
}

export function TraceDetailModal(props: ITraceDetailsModalProps) {
  const {
    handleClose,
    data,
    lang,
    businessUnitPublicCode,
    businessManagerCode,
    isMobile,
    user,
  } = props;

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { addFlag } = useFlag();

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        user ?? "",
        businessUnitPublicCode ?? "",
        businessManagerCode ?? "",
      );
      const fileUrl = URL.createObjectURL(documentData);
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      addFlag({
        title: dataTrace.titleError.i18n[lang],
        description,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  return (
    <BaseModal
      title={dataTrace.title.i18n[lang]}
      nextButton={dataTrace.understood.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "287px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        {data.documents && (
          <Fieldset borderColor="gray" hasOverflow>
            <Stack direction="column" gap="12px">
              <Text>{dataTrace.documents.i18n[lang]}</Text>
              <Divider dashed />
              <StyledScroll>
                <Stack direction="column" gap="8px">
                  {data.documents.map((doc, index) => (
                    <Stack key={doc.documentId} direction="column" gap="8px">
                      <Stack justifyContent="space-between">
                        <Stack gap="4px">
                          <Text type="label" size="large">
                            {doc.abbreviatedName}
                          </Text>
                        </Stack>
                        <Text
                          type="label"
                          weight="bold"
                          size="large"
                          appearance="primary"
                          cursorHover
                          onClick={() =>
                            handlePreview(doc.documentId, doc.abbreviatedName)
                          }
                        >
                          {dataTrace.see.i18n[lang]}
                        </Text>
                      </Stack>
                      {index < (data.documents?.length ?? 0) - 1 && <Divider />}
                    </Stack>
                  ))}
                </Stack>
              </StyledScroll>
            </Stack>
          </Fieldset>
        )}
        <CardGray
          label={dataTrace.answer.i18n[lang]}
          placeHolder={data.answer}
          appearancePlaceHolder="gray"
        />
        <CardGray
          label={dataTrace.observations.i18n[lang]}
          placeHolder={data.observations}
          appearancePlaceHolder="gray"
          height="108px"
        />
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
