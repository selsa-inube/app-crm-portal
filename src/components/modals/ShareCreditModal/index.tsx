import { Formik } from "formik";
import * as Yup from "yup";
import { MdInfoOutline } from "react-icons/md";
import { Text, Stack, Icon, Textfield, useFlag } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { patchShareCreditProspect } from "@services/prospect/shareCreditProspect";
import { pdfConverter } from "@utils/encrypt/encrypt";

import { dataShareModal } from "./config";

export interface IShareCreditModalProps {
  handleClose: () => void;
  isMobile: boolean;
  prospectId: string;
  pdf: string | null;
  businessUnitPublicCode: string;
}

export function ShareCreditModal(props: IShareCreditModalProps) {
  const { handleClose, isMobile, prospectId, pdf, businessUnitPublicCode } =
    props;

  const initialValues = {
    name: "",
    email: "",
    aditionalEmail: "",
    share: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(""),
    email: Yup.string().email().required(""),
    aditionalEmail: Yup.string().email(),
    share: Yup.boolean(),
  });

  const { addFlag } = useFlag();

  const handleFlag = (error: boolean, typeError?: unknown) => {
    if (!error) {
      addFlag({
        title: `${dataShareModal.share}`,
        description: `${dataShareModal.sharingCompleted}`,
        appearance: "success",
        duration: 5000,
      });
    } else {
      addFlag({
        title: `${dataShareModal.share}`,
        description: `${typeError}`,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const file = pdf ? pdfConverter(pdf, "prospect.pdf") : null;
    const payload = {
      clientName: values.name,
      email: values.email,
      optionalEmail: values.aditionalEmail,
      prospectId: prospectId,
      file: file,
    };

    try {
      await patchShareCreditProspect(businessUnitPublicCode, payload);
      handleClose();
      handleFlag(false);
    } catch (error) {
      console.error("Error sharing credit prospect:", error);
      handleFlag(true);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <BaseModal
          title={dataShareModal.title}
          nextButton={dataShareModal.share}
          backButton={dataShareModal.cancel}
          handleNext={() => {
            formik.submitForm();
            handleClose();
          }}
          handleBack={handleClose}
          disabledNext={!formik.dirty || !formik.isValid}
          width={isMobile ? "287px" : "402px"}
        >
          <Stack direction="column" gap="16px">
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModal.name}
                </Text>
                <Text type="body" size="small" appearance="danger">
                  {dataShareModal.required}
                </Text>
              </Stack>
              <Textfield
                name="name"
                id="name"
                placeholder={dataShareModal.placeHolderName}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullwidth={true}
              />
            </Stack>
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModal.email}
                </Text>
                <Text type="body" size="small" appearance="danger">
                  {dataShareModal.required}
                </Text>
              </Stack>
              <Textfield
                name="email"
                id="email"
                placeholder={dataShareModal.placeHolderEmail}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullwidth={true}
              />
            </Stack>
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModal.aditionalEmail}
                </Text>
              </Stack>
              <Stack direction="column" gap="4px">
                <Textfield
                  name="aditionalEmail"
                  id="aditionalEmail"
                  placeholder={dataShareModal.placeHolderAditionalEmail}
                  value={formik.values.aditionalEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullwidth={true}
                />
                <Stack gap="4px">
                  <Icon
                    icon={<MdInfoOutline />}
                    appearance="primary"
                    size="14px"
                  ></Icon>
                  <Text type="label" size="small">
                    {dataShareModal.optional}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </BaseModal>
      )}
    </Formik>
  );
}
