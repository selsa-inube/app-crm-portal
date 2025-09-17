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
        data={initialValues.document}
      />
      <CardGray
        label={dataDebtor.labelNumberDocument}
        data={initialValues.documentNumber}
      />
      <CardGray
        label={dataDebtor.labelName}
        data={initialValues.name}
      />
      <CardGray
        label={dataDebtor.labelLastName}
        data={initialValues.lastName}
      />
      <CardGray
        label={dataDebtor.labelEmail}
        data={initialValues.email}
        apparencePlaceHolder="gray"
      />
      <CardGray
        label={dataDebtor.labelNumber}
        data={
          initialValues.number
        }
      />
      <CardGray
        label={dataDebtor.labelSex}
        data={
          initialValues.sex
        }
      />
      <CardGray
        label={dataDebtor.labelAge}
        data={
          initialValues.age
        }
      />
      <CardGray
        label={dataDebtor.labelRelation}
        data={
          initialValues.relation
        }
      />
    </Stack>
  );
}
