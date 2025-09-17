import { Stack, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { IBorrower } from "@services/prospect/types";

import { DataEditBorrower } from "./config";

interface IDataDebtorProps {
  data: IBorrower;
  onDataChange: (fieldName: string, value: string) => void;
}

export function DataDebtor(props: IDataDebtorProps) {

  const { data, onDataChange } = props;

  return (
    <Fieldset>
      <Stack direction="column" gap="16px" padding="10px 16px">
        <Textfield
          name="email"
          id="email"
          label={DataEditBorrower.email}
          value={getPropertyValue(data.borrowerProperties, "email")}
          onChange={(e) => onDataChange("email", e.target.value)}
          size="compact"
          fullwidth
        />
        <Textfield
          name="phone"
          id="phone"
          label={DataEditBorrower.phone}
          value={getPropertyValue(data.borrowerProperties, "phone_number")}
          onChange={(e) => onDataChange("phone", e.target.value)}
          size="compact"
          fullwidth
        />
        <Textfield
          name="relation"
          id="relation"
          label={DataEditBorrower.relation}
          value={getPropertyValue(data.borrowerProperties, "relationship")}
          onChange={(e) => onDataChange("relation", e.target.value)}
          size="compact"
          fullwidth
        />
      </Stack>
    </Fieldset>
  );
}
