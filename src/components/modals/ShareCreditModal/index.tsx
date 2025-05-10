import { Formik } from "formik";
import * as Yup from "yup";
import { MdInfoOutline } from "react-icons/md";
import { Text, Stack, Icon, Textfield } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { dataShareModal } from "./config";

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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
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
