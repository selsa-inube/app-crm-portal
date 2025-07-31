import { useEffect, useState } from "react";
import { useFlag, Stack, Icon, Tag, Text, Spinner } from "@inubekit/inubekit";
import { MdCheckCircleOutline, MdOutlineRemoveRedEye } from "react-icons/md";

import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect } from "@services/prospect/types";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IValidateRequirement } from "@services/requirement/types";
import { BaseModal } from "@components/modals/baseModal";
import { TableBoard } from "@components/data/TableBoard";
import { Fieldset } from "@components/data/Fieldset";
import { TraceDetailsModal } from "@components/modals/TraceDetailsModal";

import {
  dataError,
  dataRequirementsNotMet,
  getActionsMobileIcon,
  titlesRequirementsModal,
} from "./config";

export interface IRequirementsModalProps {
  handleClose: () => void;
  isMobile: boolean;
  customerData: ICustomerData;
  prospectData: IProspect;
}

export function RequirementsModal(props: IRequirementsModalProps) {
  const { isMobile, customerData, prospectData, handleClose } = props;

  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState<{
    evaluation: string;
    description: string;
  } | null>(null);

  const { addFlag } = useFlag();

  useEffect(() => {
    if (!customerData?.customerId || !prospectData) return;

    const payload = {
      clientIdentificationNumber: customerData.customerId,
      prospect: { ...prospectData },
    };

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await patchValidateRequirements(payload);
        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        addFlag({
          title: dataError.titleError,
          description: dataError.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [customerData, prospectData]);

  const entries = validateRequirements.map((item, idx) => ({
    id: `${item.requirementName}-${idx}`,
    requierement: item.requirementName,
    tag: (
      <Tag
        label={item.requirementStatus}
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
            <Icon
              icon={<MdCheckCircleOutline />}
              appearance={"success"}
              size="54px"
            />
            <Text type="title" size="medium" appearance="dark">
              {dataError.noData}
            </Text>
          </Stack>
        )}
      </Fieldset>
    </BaseModal>
  );
}
