import {
  Icon,
  Stack,
  Text,
  useMediaQuery,
  Blanket,
  Divider,
  Button,
  Select,
  IOption,
} from "@inubekit/inubekit";
import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";

import { spacing } from "@design/tokens/spacing";
import { isRequired } from "@utils/forms";
import { validationMessages } from "@validations/validationMessages";

import { StyledModal, StyledContainerClose } from "./styles";
import { FormValues } from "./types";

export interface SelectModalProps {
  title: string;
  description: string;
  portalId?: string;
  loading?: boolean;
  selectionOptions?: IOption[];
  onCloseModal?: () => void;
  onSubmit?: (values: FormValues) => void;
}

export function SelectModal(props: SelectModalProps) {
  const {
    title = "default title",
    description = "default description",
    portalId = "portal",
    loading = false,
    selectionOptions = [],
    onCloseModal,
    onSubmit,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const portalNode = document.getElementById(portalId);

  const validationSchema = Yup.object({
    selection: Yup.string().required(validationMessages.required),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      selection: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
  });

  const isButtonDisabled = () => {
    const hasEmptyFields = !formik.values.selection;
    const hasErrors = Object.keys(formik.errors).length > 0;
    return hasEmptyFields || hasErrors || loading;
  };

  if (!portalNode) {
    throw new Error("The portal node is not defined. Ensure the specific node exists in the DOM.");
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small" ellipsis={isMobile}>
            {title}
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack
              alignItems="center"
              gap={spacing.s100}
              padding={isMobile ? "0px 0px 0px 90px" : "0px"}
            >
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />

        <Text size="medium" appearance="gray">
          {description}
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <Stack justifyContent="flex-end" gap={spacing.s250} direction="column">
            <Select
              placeholder="Selecciónalo de la lista"
              name="selection"
              id="selection"
              value={formik.values.selection}
              message={formik.touched.selection ? formik.errors.selection : undefined}
              size="compact"
              fullwidth
              required={isRequired(validationSchema, "selection")}
              onChange={(name, value) => void formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              options={selectionOptions}
            />
            <Stack justifyContent="flex-end" gap={spacing.s250}>
              <Button type="button" onClick={onCloseModal} appearance="gray" variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" disabled={isButtonDisabled()}>
                Confirmar
              </Button>
            </Stack>
          </Stack>
        </form>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
