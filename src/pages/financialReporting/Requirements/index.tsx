import { useState, isValidElement, useEffect } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Stack, Icon } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { IAction, IEntries, ITitle } from "@components/data/TableBoard/types";
import { getAllPackagesOfRequirementsById } from "@services/requirementsPackages/packagesOfRequirements";
import { TraceDetailModal } from "@components/modals/TraceDetailModal";

import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  getActionsMobileIcon,
} from "./config";
import { MappedRequirements, RequirementType } from "./types";
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
}

export const Requirements = (props: IRequirementsProps) => {
  const {
    isMobile,
    user,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
  } = props;
  const [showSeeDetailsModal, setShowSeeDetailsModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const [dataRequirements, setDataRequirements] = useState<IRequirementsData[]>(
    [],
  );
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

      data.forEach((item) => {
        item.requirementsByPackage.forEach((req) => {
          const type = req.typeOfRequirementToEvaluate;
          const key = req.descriptionUse;
          const value = req.requirementStatus;

          if (
            type &&
            key &&
            Object.prototype.hasOwnProperty.call(mapped, type)
          ) {
            (mapped as MappedRequirements)[type as RequirementType][key] =
              value;
          }
        });
      });

      const processedEntries = maperEntries(mapped);
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
          disabled={!isDisabled}
        />
      </Stack>
    );
  };

  return (
    <>
      <Fieldset
        title={errorMessages.Requirements.titleCard}
        heightFieldset="100%"
        hasTable={!error}
        hasOverflow={isMobile}
      >
        {error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.Requirements.title}
            description={errorMessages.Requirements.description}
            buttonDescription={errorMessages.Requirements.button}
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
              answer: "",
              observations: "",
            }}
            businessManagerCode={businessManagerCode}
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
              answer: "",
              observations: "",
            }}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tableApprovalHuman" &&
        selectedEntryId && (
          <TraceDetailModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: "",
              observations: "",
            }}
            businessManagerCode={businessManagerCode}
          />
        )}
    </>
  );
};
