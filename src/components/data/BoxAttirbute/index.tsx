import { Text } from "@inubekit/inubekit";
import { StyledBoxAttribute } from "./styles";

export interface IBoxAttributeProps {
  attribute: string;
  value: string | number;
}

export function BoxAttribute(props: IBoxAttributeProps) {
  const { attribute, value } = props;

  return (
    <StyledBoxAttribute>
      <Text type="label" size="medium" appearance="dark" weight="bold">
        {attribute}
      </Text>
      <Text appearance="gray" size="medium">
        {value}
      </Text>
    </StyledBoxAttribute>
  );
}
