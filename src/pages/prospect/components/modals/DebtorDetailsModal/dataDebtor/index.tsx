import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { getPropertyValue } from "@pages/SubmitCreditApplication/util";
import { getMonthsElapsed } from "@utils/formatData/currency";

import { dataDebtor } from "./config";
interface IDataDebtor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
}

export function DataDebtor(props: IDataDebtor) {
  const { initialValues } = props;

  return (
    <Stack direction="column" gap="12px">
      <CardGray
        label={dataDebtor.labelTypeDocument}
        data={initialValues.borrower_identification_type}
      />
      <CardGray
        label={dataDebtor.labelNumberDocument}
        data={initialValues.borrower_identification_number}
      />
      <CardGray
        label={dataDebtor.labelName}
        data={getPropertyValue(initialValues.borrower_properties, "name")}
      />
      <CardGray
        label={dataDebtor.labelLastName}
        data={getPropertyValue(initialValues.borrower_properties, "surname")}
      />
      <CardGray
        label={dataDebtor.labelEmail}
        data={getPropertyValue(initialValues.borrower_properties, "email")}
        apparencePlaceHolder="gray"
      />
      <CardGray
        label={dataDebtor.labelNumber}
        data={getPropertyValue(
          initialValues.borrower_properties,
          "phone_number",
        )}
      />
      <CardGray
        label={dataDebtor.labelSex}
        data={getPropertyValue(
          initialValues.borrower_properties,
          "biological_sex",
        )}
      />
      <CardGray
        label={dataDebtor.labelAge}
        data={getMonthsElapsed(
          getPropertyValue(initialValues.borrower_properties, "birth_date"),
          0,
        )}
      />
      <CardGray
        label={dataDebtor.labelRelation}
        data={getPropertyValue(
          initialValues.borrower_properties,
          "relationship",
        )}
      />
    </Stack>
  );
}
