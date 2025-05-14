import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { Stack, inube, useMediaQuery, Textfield } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

interface FormValues {
  field1: string;
  field2: string;
  field3: string;
}

export interface PromissoryNotesModalProps {
  handleClose: () => void;
  onSubmit: () => void;
  title: string;
  buttonText: string;
  formValues: FormValues;
}

export function PromissoryNotesModal(props: PromissoryNotesModalProps) {
  const { handleClose, onSubmit, title, buttonText, formValues } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <BaseModal
      title={title}
      nextButton={buttonText}
      handleNext={onSubmit}
      handleClose={handleClose}
      width={isMobile ? "280px" : "443px"}
      initialDivider={false}
    >
      <Stack gap="24px" direction="column">
        <Textfield
          id="field1"
          value={formValues.field1}
          label="Correo"
          iconBefore={<MdOutlineEmail color={inube.palette.neutral.N900} />}
          placeholder="usuario@inube.com"
          disabled
          fullwidth
        />
        <Textfield
          id="field2"
          value={formValues.field2}
          label="Teléfono"
          iconBefore={<MdOutlinePhone color={inube.palette.neutral.N900} />}
          placeholder="3122638128"
          disabled
          fullwidth
        />
        <Textfield
          id="field3"
          value={formValues.field3}
          label="Whatsapp"
          iconBefore={<MdOutlinePhone color={inube.palette.neutral.N900} />}
          placeholder="3122638128"
          disabled
          fullwidth
        />
      </Stack>
    </BaseModal>
  );
}
