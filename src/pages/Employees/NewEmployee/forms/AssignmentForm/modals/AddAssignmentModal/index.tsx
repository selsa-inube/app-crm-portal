import { createPortal } from "react-dom";
import { MdClear, MdAttachMoney } from "react-icons/md";
import {
  Icon,
  Stack,
  Text,
  useMediaQuery,
  Blanket,
  Divider,
  Button,
  Select,
  Textfield,
  IOption,
} from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";

import { spacing } from "@design/tokens/spacing";
import { isRequired } from "@utils/forms";
import { parseCurrencyString, currencyFormat } from "@utils/forms/currency";
import { validationMessages } from "@validations/validationMessages";

import { StyledModal, StyledContainerClose } from "./styles";
import { FormValues } from "./types";

export interface AddAssignmentModalProps {
  portalId?: string;
  loading?: boolean;
  assignmentOptions?: IOption[];
  onCloseModal?: () => void;
  onSubmit?: (values: FormValues) => void;
}

export function AddAssignmentModal(props: AddAssignmentModalProps) {
  const {
    portalId = "portal",
    onCloseModal,
    onSubmit,
    loading = false,
    assignmentOptions = [],
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const portalNode = document.getElementById(portalId);

  const validationSchema = Yup.object({
    assignment: Yup.string().required(validationMessages.required),
    value: Yup.number().required(validationMessages.required).min(1, "El valor debe ser mayor a 0"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      assignment: "",
      value: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
  });

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseCurrencyString(e.target.value);
    formik.setFieldValue("value", parsedValue);
  };

  const isButtonDisabled = () => {
    const hasEmptyFields = !formik.values.assignment || formik.values.value <= 0;
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
          <Text type="headline" size="small">
            Agregar asignación
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Stack justifyContent="flex-end" gap={spacing.s250} direction="column">
            <Select
              label="Asignación"
              placeholder="Selecciona una opción"
              name="assignment"
              id="assignment"
              value={formik.values.assignment}
              message={formik.touched.assignment ? formik.errors.assignment : undefined}
              size="compact"
              fullwidth
              required={isRequired(validationSchema, "assignment")}
              onChange={(name, value) => void formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              options={assignmentOptions}
            />
            <Textfield
              label="Valor"
              placeholder="Valor de la asignación"
              name="value"
              id="value"
              value={formik.values.value ? currencyFormat(formik.values.value, false) : ""}
              message={formik.touched.value ? formik.errors.value : undefined}
              disabled={loading}
              size="compact"
              fullwidth
              onBlur={formik.handleBlur}
              onChange={handleValueChange}
              required={isRequired(validationSchema, "value")}
              iconBefore={<Icon icon={<MdAttachMoney />} appearance="success" size="22px" />}
            />
            <Stack justifyContent="flex-end" gap={spacing.s250}>
              <Button type="button" onClick={onCloseModal} appearance="gray" variant="outlined">
                Cerrar
              </Button>
              <Button type="submit" disabled={isButtonDisabled()}>
                Agregar
              </Button>
            </Stack>
          </Stack>
        </form>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
