import { createPortal } from "react-dom";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { MdClear } from "react-icons/md";
import {
  Textarea,
  Icon,
  Stack,
  Text,
  Button,
  useMediaQuery,
  Blanket,
  Divider,
} from "@inubekit/inubekit";

import { StyledModal, StyledContainerClose } from "./styles";

interface FormValues {
  textarea: string;
}

export interface TextAreaModalProps {
  title: string;
  buttonText: string;
  inputLabel: string;
  inputPlaceholder: string;
  maxLength?: number;
  portalId?: string;
  readOnly?: boolean;
  hideCharCount?: boolean;
  disableTextarea?: boolean;
  secondaryButtonText?: string;
  onSubmit?: (values: { textarea: string }) => void;
  onCloseModal?: () => void;
  onSecondaryButtonClick?: () => void;
}

export function TextAreaModal(props: TextAreaModalProps) {
  const {
    title,
    buttonText,
    inputLabel,
    inputPlaceholder,
    maxLength = 200,
    portalId = "portal",
    readOnly = false,
    disableTextarea = false,
    secondaryButtonText = "Cancelar",
    onSubmit,
    onCloseModal,
    onSecondaryButtonClick,
  } = props;

  const validationSchema = Yup.object({
    textarea: readOnly
      ? Yup.string()
      : Yup.string()
          .max(maxLength, "El número de caracteres es demasiado largo")
          .required("Este campo es obligatorio"),
  });

  const isMobile = useMediaQuery("(max-width: 700px)");
  const portalNode = document.getElementById(portalId);

  if (!portalNode) {
    throw new Error("The portal node is not defined. Ensure the specific node exists in the DOM.");
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            {title}
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap="8px">
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <Formik
          initialValues={{ textarea: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => {
            onSubmit?.(values);
            setSubmitting(false);
            onCloseModal?.();
          }}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Field name="textarea">
                {({ field }: FieldProps) => (
                  <Textarea
                    {...field}
                    id="textarea"
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    maxLength={maxLength}
                    status={touched.textarea && errors.textarea ? "invalid" : "pending"}
                    message={touched.textarea && errors.textarea ? errors.textarea : ""}
                    fullwidth
                    disabled={disableTextarea}
                  />
                )}
              </Field>
              <Stack justifyContent="end" margin="12px 0" gap="12px">
                <Button
                  type="button"
                  variant="outlined"
                  appearance="gray"
                  onClick={() => {
                    onSecondaryButtonClick?.();
                    onCloseModal?.();
                  }}
                >
                  {secondaryButtonText}
                </Button>
                <Button
                  type="submit"
                  disabled={!values.textarea || disableTextarea}
                  appearance={values.textarea ? "primary" : "gray"}
                >
                  {buttonText}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
