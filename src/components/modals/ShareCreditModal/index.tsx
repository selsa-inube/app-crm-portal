import { Formik } from "formik";
import * as Yup from "yup";
import { MdInfoOutline } from "react-icons/md";
import { Text, Stack, Icon, Textfield } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { dataShareModal } from "./config";
import { patchshareCreditProspect } from "@services/iProspect/shareCreditProspect";

export interface IShareCreditModalProps {
  handleClose: () => void;
  isMobile: boolean;
}

export function ShareCreditModal(props: IShareCreditModalProps) {
  const { handleClose, isMobile } = props;

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

  const urlToFile = async (
    url: string,
    filename: string,
    mimeType: string,
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const file = await urlToFile(
      "../../../assets/images/linpar.png",
      "jh-image.jpg",
      "image/jpeg",
    );
    const payload = {
      clientName: values.name,
      email: values.email,
      optionalEmail: values.aditionalEmail,
      prospectId: "67ec4f9115ddc25b00d3df14",
      file: file,
    };

    try {
      await patchshareCreditProspect("text", payload);
      handleClose();
    } catch (error) {
      console.error("Error sharing credit prospect:", error);
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
