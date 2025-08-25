import { Stack, Textfield } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@utils/mappingData/mappings";

import { DataEditBorrower } from "./config";

export function DataDebtor(initialValues: FormikValues) {
  const { data } = initialValues;

  return (
    <Fieldset>
      <Stack direction="column" gap="16px" padding="10px 16px">
        <Textfield
          name="email"
          id="email"
          label={DataEditBorrower.email}
          value={getPropertyValue(data.borrowerProperties, "email")}
          size="compact"
          fullwidth
        />
        <Textfield
          name="phone"
          id="phone"
          label={DataEditBorrower.phone}
          value={getPropertyValue(data.borrowerProperties, "phone_number")}
          size="compact"
          fullwidth
        />
        <Textfield
          name="relation"
          id="relation"
          label={DataEditBorrower.relation}
          value={getPropertyValue(data.borrowerProperties, "relationship")}
          size="compact"
          fullwidth
        />
      </Stack>
    </Fieldset>
  );
}
