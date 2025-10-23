import { useState, useEffect } from "react";
import { Stack, Icon, Tag, Text, Spinner } from "@inubekit/inubekit";
import { MdCheckCircleOutline, MdOutlineRemoveRedEye } from "react-icons/md";

import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";
import { TableBoard } from "@components/data/TableBoard";
import { Fieldset } from "@components/data/Fieldset";
import { TraceDetailsModal } from "@components/modals/TraceDetailsModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnums } from "@context/EnumContext";
import { getEnumByCode } from "@src/config/enums/utils";
import { IManageErrors } from "@src/pages/simulateCredit/types";

import {
  dataError,
  dataRequirementsNotMet,
  getActionsMobileIcon,
  titlesRequirementsModal,
} from "./config";

export interface IRequirementsModalProps {
  handleClose: () => void;
  isMobile: boolean;
  validateRequirements: IValidateRequirement[];
  isLoading: boolean;
  errorsManager: IManageErrors;
}

export function RequirementsModal(props: IRequirementsModalProps) {
  const {
    isMobile,
    validateRequirements,
    isLoading,
    handleClose,
    errorsManager,
  } = props;

  const [modalData, setModalData] = useState<{
    evaluation: string;
    description: string;
  } | null>(null);

  const { enums, getEnums, language } = useEnums();
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    getEnums("requirementStatus");
  }, [getEnums]);

  const entries = validateRequirements.map((item, idx) => ({
    id: `${item.requirementName}-${idx}`,
    requierement: item.requirementName,
    tag: (
      <Tag
        label={
          getEnumByCode(
            item.requirementStatus,
            language,
            enums.requirementStatus,
          ) || item.requirementStatus
        }
        appearance={
          item.requirementStatus === "Aprobado"
            ? "success"
            : item.requirementStatus === "Rechazado"
              ? "danger"
              : "warning"
        }
      />
    ),
    action: (
      <Icon
        icon={<MdOutlineRemoveRedEye />}
        appearance="dark"
        cursorHover
        onClick={() =>
          setModalData({
            evaluation: item.requirementName,
            description: item.descriptionEvaluationRequirement,
          })
        }
        size="18px"
      />
    ),
  }));

  return (
    <>
      {!showErrorModal ? (
        <BaseModal
          title={dataRequirementsNotMet.title}
          nextButton={dataRequirementsNotMet.close}
          handleNext={handleClose}
          handleClose={handleClose}
          width={isMobile ? "300px " : "652px"}
          height={isMobile ? "auto" : "538px"}
        >
          <Fieldset>
            {isLoading ? (
              <Stack
                gap="16px"
                padding="16px"
                margin={isMobile ? "8px" : "16px"}
                justifyContent="center"
                direction="column"
                alignItems="center"
              >
                <Spinner />
                <Text type="title" size="medium" appearance="dark">
                  {dataError.loadRequirements}
                </Text>
              </Stack>
            ) : validateRequirements && validateRequirements.length > 0 ? (
              <Stack height="340px" direction="column">
                <TableBoard
                  id="requirements"
                  titles={titlesRequirementsModal}
                  entries={entries}
                  actionMobileIcon={getActionsMobileIcon()}
                />
                {modalData && (
                  <TraceDetailsModal
                    data={modalData}
                    handleClose={() => setModalData(null)}
                    isMobile={isMobile}
                  />
                )}
              </Stack>
            ) : (
              <Stack
                gap="16px"
                padding="16px"
                margin={isMobile ? "8px" : "16px"}
                justifyContent="center"
                direction="column"
                alignItems="center"
              >
                {!errorsManager.validateRequirements && (
                  <Icon
                    icon={<MdCheckCircleOutline />}
                    appearance={"success"}
                    size="54px"
                  />
                )}
                <Text type="title" size="medium" appearance="dark">
                  {errorsManager.validateRequirements
                    ? dataError.descriptionError
                    : dataError.noData}
                </Text>
              </Stack>
            )}
          </Fieldset>
        </BaseModal>
      ) : (
        <ErrorModal
          handleClose={() => {
            (setShowErrorModal(false), handleClose());
          }}
          isMobile={isMobile}
          message={dataError.descriptionError}
        />
      )}
    </>
  );
}
