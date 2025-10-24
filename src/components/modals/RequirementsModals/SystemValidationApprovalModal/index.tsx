import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Text, Textarea, Toggle, useFlag } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { requirementStatus } from "../DocumentValidationApprovalModal/config";
import { dataFlags } from "../DocumentValidationApprovalModal/config";

import { IApprovalSystem } from "../types";
import { approvalsConfig } from "./config";

interface ISystemValidationApprovalModalProps {
  isMobile: boolean;
  initialValues: IApprovalSystem;
  questionToBeAskedInModal: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IPackagesOfRequirementsById[];
  onConfirm?: (values: IApprovalSystem) => void;
  onCloseModal?: () => void;
}

export function SystemValidationApprovalModal(
  props: ISystemValidationApprovalModalProps,
) {
  const {
    isMobile,
    initialValues,
    questionToBeAskedInModal,
    businessUnitPublicCode,
    businessManagerCode,
    entryId,
    entryIdToRequirementMap,
    rawRequirements,
    onConfirm,
    onCloseModal,
  } = props;

  const { addFlag } = useFlag();

  const validationSchema = Yup.object({
    toggleChecked: Yup.boolean(),
    observations: Yup.string()
      .max(approvalsConfig.maxLength, validationMessages.limitedTxt)
      .required(validationMessages.required),
    labelText: Yup.string(),
  });

  const getRequirementCode = (codeKey: string) => {
    return requirementStatus.find((item) => item.Code === codeKey)?.Code || "";
  };

  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    validateOnMount: true,
    onSubmit: async () => {
      try {
        const requirementByPackageId = entryIdToRequirementMap[entryId];

        if (!requirementByPackageId) return;

        const payload = {
          modifyJustification: "Status change",
          nextStatusValue: formik.values.toggleChecked
            ? getRequirementCode("UNVALIDATED_SYSTEM_VALIDATION")
            : getRequirementCode("IGNORED_BY_THE_USER_SYSTEM_VALIDATION"),
          packageId: rawRequirements[0].packageId,
          requirementByPackageId: requirementByPackageId,
          statusChangeJustification: formik.values.observations,
          transactionOperation: "PartialUpdate",
          documentsByRequirement: [
            {
              documentCode: "",
              requirementByPackageId: "",
              transactionOperation: "PartialUpdate",
            },
          ],
        };

        await approveRequirementById(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        if (onConfirm) {
          onConfirm(formik.values);
        }

        if (onCloseModal) {
          onCloseModal();
        }
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");
        addFlag({
          title: approvalsConfig.titleError,
          description,
          appearance: "danger",
          duration: dataFlags.duration,
        });
      }
    },
  });

  useEffect(() => {
    const label = formik.values.toggleChecked
      ? approvalsConfig.approveRequirementLabel
      : approvalsConfig.rejectRequirementLabel;

    formik.setFieldValue("labelText", label);
  }, [formik.values.toggleChecked]);

  return (
    <BaseModal
      title={approvalsConfig.title}
      handleNext={formik.handleSubmit}
      width={isMobile ? "300px" : "432px"}
      handleBack={onCloseModal}
      backButton={approvalsConfig.Cancel}
      nextButton={approvalsConfig.confirm}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Stack direction="column" gap="8px">
          <Text>{`${approvalsConfig.approval} ${questionToBeAskedInModal}`}</Text>
          <Stack>
            <Toggle
              checked={formik.values.toggleChecked}
              onChange={(event) => {
                const checked = event.target.checked;
                formik.setFieldValue("toggleChecked", checked);
                formik.setFieldValue(
                  "labelText",
                  checked
                    ? approvalsConfig.approveRequirementLabel
                    : approvalsConfig.rejectRequirementLabel,
                );
              }}
            />
            <Text type="label" size="large" weight="bold">
              {formik.values.labelText}
            </Text>
          </Stack>
        </Stack>
        <Textarea
          id="observations"
          name="observations"
          label={approvalsConfig.observations}
          placeholder={approvalsConfig.observationdetails}
          maxLength={approvalsConfig.maxLength}
          value={formik.values.observations}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          fullwidth
        />
      </Stack>
    </BaseModal>
  );
}
