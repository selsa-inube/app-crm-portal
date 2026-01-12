import { Stack, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { IBorrower } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { DataEditBorrower } from "./config";

interface IDataDebtorProps {
  data: IBorrower;
  lang: EnumType;
  onDataChange: (fieldName: string, value: string) => void;
}

export function DataDebtor(props: IDataDebtorProps) {
  const { data, lang, onDataChange } = props;

  return (
    <Fieldset>
      <Stack direction="column" gap="16px" padding="10px 16px">
        <Textfield
          name="email"
          id="email"
          label={DataEditBorrower.email.i18n[lang]}
          value={getPropertyValue(data.borrowerProperties, "email")}
          onChange={(event) => onDataChange("email", event.target.value)}
          size="compact"
          fullwidth
        />
        <Textfield
          name="phone"
          id="phone"
          label={DataEditBorrower.phone.i18n[lang]}
          value={getPropertyValue(data.borrowerProperties, "phone_number")}
          onChange={(event) => onDataChange("phone", event.target.value)}
          size="compact"
          fullwidth
        />
        <Textfield
          name="relation"
          id="relation"
          label={DataEditBorrower.relation.i18n[lang]}
          value={getPropertyValue(data.borrowerProperties, "relationship")}
          onChange={(event) => onDataChange("relation", event.target.value)}
          size="compact"
          fullwidth
        />
      </Stack>
    </Fieldset>
  );
}
