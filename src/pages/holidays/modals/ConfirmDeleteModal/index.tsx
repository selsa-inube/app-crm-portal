import { TextAreaModal, TextAreaModalProps } from "@components/modals/TextAreaModal";

interface ConfirmDeleteModalProps
  extends Omit<
    TextAreaModalProps,
    "title" | "buttonText" | "inputLabel" | "inputPlaceholder" | "maxLength"
  > {
  onConfirmDelete: (justification: string) => void;
}

export function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  const { onConfirmDelete, onCloseModal, ...rest } = props;

  return (
    <TextAreaModal
      {...rest}
      title="Eliminación"
      buttonText="Eliminar"
      inputLabel="Justificación"
      inputPlaceholder="¿Por qué eliminarás el registro?"
      maxLength={120}
      secondaryButtonText="Cancelar"
      onSubmit={(values) => {
        onConfirmDelete(values.textarea);
      }}
      onCloseModal={onCloseModal}
    />
  );
}
