import { FileUI } from "./interface";

interface FileProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete?: () => void;
}

function File(props: FileProps) {
  const { withBorder = true, name, size, onDelete } = props;
  return (
    <FileUI
      withBorder={withBorder}
      name={name}
      size={size}
      onDelete={onDelete}
    />
  );
}

export { File };
