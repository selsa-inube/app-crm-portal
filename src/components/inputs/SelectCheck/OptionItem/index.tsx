import { Stack } from "@inubekit/inubekit";
import { Label } from "@inubekit/label";

import { StyledOptionItemChecked } from "./styles";

export interface IOptionItemCheckedProps {
  id: string;
  label: string;
  checked?: boolean;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OptionItemChecked = (props: IOptionItemCheckedProps) => {
  const { id, label, checked = false, onchange } = props;

  return (
    <StyledOptionItemChecked as="label" htmlFor={id}>
      <Stack>
        <input
          readOnly
          type="checkbox"
          id={id}
          name={id}
          onChange={onchange}
          checked={checked}
        />
        <Label htmlFor={id}>{label}</Label>
      </Stack>
    </StyledOptionItemChecked>
  );
};
