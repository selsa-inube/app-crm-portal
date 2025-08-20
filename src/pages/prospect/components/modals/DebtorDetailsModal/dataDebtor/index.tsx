import { Stack } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { CardGray } from "@components/cards/CardGray";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { getMonthsElapsed } from "@utils/formatData/currency";

import { dataDebtor } from "./config";

interface IDataDebtor {
  initialValues: FormikValues;
}

export function DataDebtor(props: IDataDebtor) {
  const { initialValues } = props;

  return (
    <Stack direction="column" gap="12px">
      <CardGray
        label={dataDebtor.labelTypeDocument}
        data={initialValues.borrowerIdentificationType}
      />
      <CardGray
        label={dataDebtor.labelNumberDocument}
        data={initialValues.borrowerIdentificationNumber}
      />
      <CardGray
        label={dataDebtor.labelName}
        data={getPropertyValue(initialValues.borrowerProperties, "name")}
      />
      <CardGray
        label={dataDebtor.labelLastName}
        data={getPropertyValue(initialValues.borrowerProperties, "surname")}
      />
      <CardGray
        label={dataDebtor.labelEmail}
        data={getPropertyValue(initialValues.borrowerProperties, "email")}
        apparencePlaceHolder="gray"
      />
      <CardGray
        label={dataDebtor.labelNumber}
        data={getPropertyValue(
          initialValues.borrowerProperties,
          "phone_number",
        )}
      />
      <CardGray
        label={dataDebtor.labelSex}
        data={getPropertyValue(
          initialValues.borrowerProperties,
          "biological_sex",
        )}
      />
      <CardGray
        label={dataDebtor.labelAge}
        data={getMonthsElapsed(
          getPropertyValue(initialValues.borrowerProperties, "birth_date"),
          0,
        )}
      />
      <CardGray
        label={dataDebtor.labelRelation}
        data={getPropertyValue(
          initialValues.borrowerProperties,
          "relationship",
        )}
      />
    </Stack>
  );
}
