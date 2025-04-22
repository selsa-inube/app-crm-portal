import { Icon, Text } from "@inubekit/inubekit";

import { StyledLi } from "./styles";
import { InfoItem } from "./index";

interface InfoItemComponentProps {
  item: InfoItem;
}

export const InfoItemComponent: React.FC<InfoItemComponentProps> = ({
  item,
}) => {
  const size = item.shape === "circle" ? "20px" : "20px";
  const variant = item.shape === "circle" ? "filled" : "empty";

  return (
    <StyledLi>
      <Icon
        icon={item.icon}
        appearance={item.appearance || "primary"}
        size={size}
        shape={item.shape}
        variant={variant}
        spacing="narrow"
      />
      <Text size="medium">{item.text}</Text>
    </StyledLi>
  );
};
