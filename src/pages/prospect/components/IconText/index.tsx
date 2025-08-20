import { ReactElement } from "react";
import * as MdIcons from "react-icons/md";

interface IconTextProps {
  icon: string;
}

export function IconText(props: IconTextProps): ReactElement | null {
  const { icon } = props;

  const IconComponent = (MdIcons as Record<string, React.ElementType>)[icon];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent />;
}
