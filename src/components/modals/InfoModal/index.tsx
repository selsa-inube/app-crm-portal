import { MdCheck, MdClose, MdRemove } from "react-icons/md";
import { Stack, Icon } from "@inubekit/inubekit";

import { StyledContainer, StyledUl } from "./styles";
import { InfoItemComponent } from "./interface";

export interface InfoItem {
  icon: JSX.Element;
  text: string;
  appearance?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
  shape?: "circle" | "rectangle";
}

interface InfoModalProps {
  onClose?: () => void;
  items?: InfoItem[];
}

const defaultItems: InfoItem[] = [
  { icon: <MdCheck />, text: "Cumple", appearance: "success", shape: "circle" },
  {
    icon: <MdClose />,
    text: "No Cumple",
    appearance: "danger",
    shape: "circle",
  },
  {
    icon: <MdRemove />,
    text: "Sin Evaluar",
    appearance: "warning",
    shape: "circle",
  },
];

const mergeItems = (
  defaultItems: InfoItem[],
  customItems: InfoItem[],
): InfoItem[] => {
  const mergedItems = defaultItems
    .flatMap((defaultItem) => {
      const matchingCustomItems = customItems.filter(
        (item) => item.icon.type === defaultItem.icon.type,
      );

      if (matchingCustomItems.length > 0) {
        return matchingCustomItems.map((customItem) => ({
          ...defaultItem,
          ...customItem,
        }));
      }
      return defaultItem;
    })
    .concat(
      customItems.filter(
        (item) =>
          !defaultItems.some(
            (defaultItem) => defaultItem.icon.type === item.icon.type,
          ),
      ),
    );

  return mergedItems;
};

export const InfoModal = ({ onClose, items = [] }: InfoModalProps) => {
  const mergedItems = mergeItems(defaultItems, items);
  return (
    <StyledContainer>
      <Stack padding="10px 20px">
        <Icon
          icon={<MdClose />}
          appearance="dark"
          size="24px"
          onClick={onClose}
        />
        <StyledUl>
          {mergedItems.map((item) => (
            <InfoItemComponent key={item.text} item={item} />
          ))}
        </StyledUl>
      </Stack>
    </StyledContainer>
  );
};
