import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Stack, Text, Textarea, useFlag } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { requirementStatus } from "../DocumentValidationApprovalModal/config";
import { dataFlags } from "../DocumentValidationApprovalModal/config";

import { IApprovalHuman } from "../types";
import { approvalsConfig, optionsAnswer } from "./config";

interface IHumanValidationApprovalModalProps {
  isMobile: boolean;
  initialValues: IApprovalHuman;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IPackagesOfRequirementsById[];
  onConfirm?: (values: IApprovalHuman) => void;
  onCloseModal?: () => void;
}

export function HumanValidationApprovalModal(
  props: IHumanValidationApprovalModalProps,
) {
  const {
    isMobile,
    initialValues,
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
    answer: Yup.string().required(),
    observations: Yup.string()
      .max(approvalsConfig.maxLength, validationMessages.limitedTxt)
      .required(validationMessages.required),
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

        let nextStatusValue = "";
        if (formik.values.answer === optionsAnswer[0].label) {
          nextStatusValue = getRequirementCode("PASSED_HUMAN_VALIDATION");
        } else if (formik.values.answer === optionsAnswer[1].label) {
          nextStatusValue = getRequirementCode("FAILED_HUMAN_VALIDATION");
        } else if (formik.values.answer === optionsAnswer[3].label) {
          nextStatusValue = getRequirementCode(
            "VALIDATION_FAILED_CANCELS_REQUEST",
          );
        } else if (formik.values.answer === optionsAnswer[2].label) {
          nextStatusValue = getRequirementCode(
            "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
          );
        }

        const payload = {
          modifyJustification: "Status change",
          nextStatusValue,
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
          <Text>{approvalsConfig.approval}</Text>
          <Select
            name="answer"
            id="answer"
            options={optionsAnswer}
            label={approvalsConfig.answer}
            placeholder={approvalsConfig.answerPlaceHoleder}
            value={formik.values.answer}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            onBlur={formik.handleBlur}
            size="compact"
            fullwidth
          />
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
          fullwidth
        />
      </Stack>
    </BaseModal>
  );
}
