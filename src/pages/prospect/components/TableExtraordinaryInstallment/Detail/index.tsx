import { Stack, Icon } from "@inubekit/inubekit";

import { icons } from "./config";

interface IDetailprops {
  handleEdit: () => void;
  handleDelete: () => void;
}

export function Detail(props: IDetailprops) {
  const { handleEdit, handleDelete } = props;

  return (
    <Stack justifyContent="space-around">
      {icons.map((item, index) => (
        <Icon
          key={index}
          icon={item.icon}
          size="16px"
          cursorHover
          appearance={item.appearance}
          onClick={() => {
            if (item.id === "edit") {
              handleEdit();
            } else if (item.id === "delete") {
              handleDelete();
            }
          }}
        />
      ))}
    </Stack>
  );
}
