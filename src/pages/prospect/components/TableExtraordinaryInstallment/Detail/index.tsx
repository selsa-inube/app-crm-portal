import { Stack, Icon } from "@inubekit/inubekit";

import { icons } from "./config";

interface IDetailprops {
  handleDelete: () => void;
}

export function Detail(props: IDetailprops) {
  const { handleDelete } = props;

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
            if (item.id === "delete") {
              handleDelete();
            }
          }}
        />
      ))}
    </Stack>
  );
}
