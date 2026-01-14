import { useState } from "react";
import { Stack, Icon, Tag, Text, Spinner } from "@inubekit/inubekit";
import { MdCheckCircleOutline, MdOutlineRemoveRedEye } from "react-icons/md";

import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";
import { TableBoard } from "@components/data/TableBoard";
import { Fieldset } from "@components/data/Fieldset";
import { TraceDetailsModal } from "@components/modals/TraceDetailsModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { requirementStatusData } from "@services/enum/requirements";
import { IManageErrors } from "@pages/simulateCredit/types";
import { EnumType } from "@hooks/useEnum/useEnum";

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
  lang: EnumType;
}

export function RequirementsModal(props: IRequirementsModalProps) {
  const {
    isMobile,
    validateRequirements,
    isLoading,
    handleClose,
    errorsManager,
    lang,
  } = props;

  const [modalData, setModalData] = useState<{
    evaluation: string;
    description: string;
  } | null>(null);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const entries = validateRequirements.map((item, idx) => {
    return {
      id: `${item.requirementName}-${idx}`,
      requierement: item.requirementName,
      tag: (
        <Tag
          label={
            requirementStatusData.find(
              (status) => status.code === item.requirementStatus,
            )?.i18n[lang] || item.requirementStatus
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
    };
  });

  return (
    <>
      {!showErrorModal ? (
        <BaseModal
          title={dataRequirementsNotMet.title.i18n[lang]}
          nextButton={dataRequirementsNotMet.close.i18n[lang]}
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
                  {dataError.loadRequirements.i18n[lang]}
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
                    lang={lang}
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
                    ? dataError.descriptionError.i18n[lang]
                    : dataError.noData.i18n[lang]}
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
          message={dataError.descriptionError.i18n[lang]}
        />
      )}
    </>
  );
}
