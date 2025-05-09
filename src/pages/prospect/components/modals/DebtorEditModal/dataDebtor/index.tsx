import { Stack, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@pages/SubmitCreditApplication/util";

import { DataEditBorrower } from "./config";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataDebtor(initialValues: any) {
  const { data } = initialValues;

  return (
    <Fieldset>
      <Stack direction="column" gap="16px" padding="10px 16px">
        <Textfield
          name="email"
          id="email"
          label={DataEditBorrower.email}
          value={getPropertyValue(data.borrower_properties, "email")}
          size="compact"
          fullwidth
        />
        <Textfield
          name="phone"
          id="phone"
          label={DataEditBorrower.phone}
          value={getPropertyValue(data.borrower_properties, "phone_number")}
          size="compact"
          fullwidth
        />
        <Textfield
          name="relation"
          id="relation"
          label={DataEditBorrower.relation}
          value={getPropertyValue(data.borrower_properties, "relationship")}
          size="compact"
          fullwidth
        />
      </Stack>
    </Fieldset>
  );
}
