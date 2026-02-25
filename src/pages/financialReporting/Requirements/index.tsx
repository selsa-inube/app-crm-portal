import { useState, isValidElement, useEffect, useContext } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Stack, Icon } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { IAction, IEntries, ITitle } from "@components/data/TableBoard/types";
import { getAllPackagesOfRequirementsById } from "@services/requirementsPackages/packagesOfRequirements";
import { TraceDetailModal } from "@components/modals/TraceDetailModal";
import { EnumType } from "@hooks/useEnum/useEnum";
import { AppContext } from "@context/AppContext";

import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  getActionsMobileIcon,
} from "./config";
import { DocumentItem, MappedRequirements, RequirementType } from "./types";
import { errorMessages } from "../config";

interface IRequirementsData {
  id: string;
  titlesRequirements: ITitle[];
  entriesRequirements: IEntries[];
  actionsMovile: IAction[];
}

export interface IRequirementsProps {
  id: string;
  user: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  creditRequestCode: string;
  isMobile: boolean;
  lang: EnumType;
}

export const Requirements = (props: IRequirementsProps) => {
  const {
    isMobile,
    user,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    lang,
  } = props;

  const { eventData } = useContext(AppContext);

  const [showSeeDetailsModal, setShowSeeDetailsModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [dataRequirements, setDataRequirements] = useState<IRequirementsData[]>(
    [],
  );
  const [approvalSystemValues, setApprovalSystemValues] = useState<
    Record<
      string,
      {
        observations: string;
        toggleChecked: boolean;
        labelText: string;
      }
    >
  >({});

  const [approvalDocumentValues, setApprovalDocumentValues] = useState<
    Record<
      string,
      {
        answer: string;
        observations: string;
        selectedDocuments?: DocumentItem[];
      }
    >
  >({});
  const [approvalHumanValues, setApprovalHumanValues] = useState<
    Record<
      string,
      {
        answer: string;
        observations: string;
      }
    >
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRequirements = async () => {
    setLoading(true);
    setError(false);

    try {
      if (!creditRequestCode) {
        return;
      }

      const data = await getAllPackagesOfRequirementsById(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestCode,
        eventData.token,
      );

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No hay requisitos disponibles.");
      }

      const mapped: MappedRequirements = {
        credit_request_id: data[0].uniqueReferenceNumber,
        SYSTEM_VALIDATION: {},
        DOCUMENT: {},
        HUMAN_VALIDATION: {},
      };

      const systemVals: Record<
        string,
        { observations: string; toggleChecked: boolean; labelText: string }
      > = {};
      const documentVals: Record<
        string,
        { answer: string; observations: string }
      > = {};
      const humanVals: Record<
        string,
        { answer: string; observations: string }
      > = {};

      const getAnswerFromStatus = (status: string): string => {
        const passedStatuses = [
          "PASSED_WITH_SYSTEM_VALIDATION",
          "DOCUMENT_STORED_WITHOUT_VALIDATION",
          "PASSED_WITH_HUMAN_VALIDATION",
          "DOCUMENT_VALIDATED_BY_THE_USER",
          "IGNORED_BY_THE_USER",
          "PASSED_HUMAN_VALIDATION",
          "DOCUMENT_STORED_AND_VALIDATED",
          "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
          "DOCUMENT_IGNORED_BY_THE_USER",
        ];
        const failedStatuses = [
          "FAILED_SYSTEM_VALIDATION",
          "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
          "FAILED_DOCUMENT_VALIDATION",
          "FAILED_HUMAN_VALIDATION",
        ];
        if (passedStatuses.includes(status)) return "Cumple";
        if (failedStatuses.includes(status)) return "No Cumple";
        return "";
      };

      const typeCounters = {
        SYSTEM_VALIDATION: 0,
        DOCUMENT: 0,
        HUMAN_VALIDATION: 0,
      };

      data.forEach((item) => {
        item.requirementsByPackage.forEach((req) => {
          const type = req.typeOfRequirementToEvaluate;
          const key = req.descriptionUse;
          const value = req.requirementStatus;
          const answer = getAnswerFromStatus(req.requirementStatus || "");
          const observations =
            req.statusChangeJustification ||
            req.descriptionEvaluationRequirement ||
            "";

          if (
            type &&
            key &&
            Object.prototype.hasOwnProperty.call(mapped, type)
          ) {
            (mapped as MappedRequirements)[type as RequirementType][key] =
              value;
          }

          if (type === "SYSTEM_VALIDATION") {
            typeCounters.SYSTEM_VALIDATION += 1;
            const entryId = `sistema-${typeCounters.SYSTEM_VALIDATION}`;
            systemVals[entryId] = {
              observations,
              toggleChecked: answer === "Cumple",
              labelText: answer,
            };
          } else if (type === "DOCUMENT") {
            typeCounters.DOCUMENT += 1;
            const entryId = `documento-${typeCounters.DOCUMENT}`;
            documentVals[entryId] = { answer, observations };
          } else if (type === "HUMAN_VALIDATION") {
            typeCounters.HUMAN_VALIDATION += 1;
            const entryId = `humano-${typeCounters.HUMAN_VALIDATION}`;
            humanVals[entryId] = { answer, observations };
          }
        });
      });

      setApprovalSystemValues(systemVals);
      setApprovalDocumentValues(documentVals);
      setApprovalHumanValues(humanVals);

      const processedEntries = maperEntries(mapped, lang);
      const processedRequirements = maperDataRequirements(processedEntries);
      setDataRequirements(processedRequirements);
    } catch (error) {
      console.error("Error fetching requirements:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [creditRequestCode]);
  const handleToggleSeeDetailsModal = (tableId?: string, entryId?: string) => {
    if (tableId && entryId) {
      setSelectedTableId(tableId);
      setSelectedEntryId(entryId);
    }
    setShowSeeDetailsModal((prevState) => !prevState);
  };

  const renderAddIcon = (entry: IEntries, tableId: string) => {
    let isDisabled = false;

    const label = isValidElement(entry?.tag) ? entry?.tag?.props?.label : "";

    if (label === "Cumple") {
      isDisabled = false;
    }

    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineRemoveRedEye />}
          appearance="primary"
          onClick={() => handleToggleSeeDetailsModal(tableId, entry.id)}
          spacing="compact"
          variant="empty"
          size="32px"
          cursorHover
          disabled={isDisabled}
        />
      </Stack>
    );
  };

  return (
    <>
      <Fieldset
        title={errorMessages.Requirements.titleCard.i18n[lang]}
        heightFieldset="100%"
        hasTable
        hasOverflow={isMobile || error}
      >
        {error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.Requirements.title.i18n[lang]}
            description={errorMessages.Requirements.description.i18n[lang]}
            buttonDescription={errorMessages.Requirements.button.i18n[lang]}
            onRetry={() => fetchRequirements()}
          />
        ) : (
          dataRequirements.map((item, index) => (
            <TableBoard
              key={item.id}
              id={item.id}
              titles={item.titlesRequirements}
              entries={item.entriesRequirements}
              actions={[
                {
                  id: "agregar",
                  content: (entry: IEntries) => renderAddIcon(entry, item.id),
                },
              ]}
              actionMobile={[
                {
                  id: "agregar",
                  content: (entry: IEntries) => renderAddIcon(entry, item.id),
                },
              ]}
              actionMobileIcon={getActionsMobileIcon()}
              appearanceTable={{
                widthTd: !isMobile ? "75%" : "70%",
                efectzebra: true,
                title: "primary",
                isStyleMobile: true,
              }}
              isFirstTable={index === 0}
              infoItems={infoItems}
              loading={loading}
            />
          ))
        )}
      </Fieldset>
      {showSeeDetailsModal &&
        selectedTableId === "tableApprovalSystem" &&
        selectedEntryId && (
          <TraceDetailModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalSystemValues[selectedEntryId]?.labelText || "",
              observations:
                approvalSystemValues[selectedEntryId]?.observations || "",
            }}
            businessManagerCode={businessManagerCode}
            lang={lang}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tableDocumentValues" &&
        selectedEntryId && (
          <TraceDetailModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            user={user}
            data={{
              documents:
                approvalDocumentValues[selectedEntryId]?.selectedDocuments,
              answer: approvalDocumentValues[selectedEntryId]?.answer || "",
              observations:
                approvalDocumentValues[selectedEntryId]?.observations || "",
            }}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            lang={lang}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tableApprovalHuman" &&
        selectedEntryId && (
          <TraceDetailModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalHumanValues[selectedEntryId]?.answer || "",
              observations:
                approvalHumanValues[selectedEntryId]?.observations || "",
            }}
            businessManagerCode={businessManagerCode}
            lang={lang}
          />
        )}
    </>
  );
};
