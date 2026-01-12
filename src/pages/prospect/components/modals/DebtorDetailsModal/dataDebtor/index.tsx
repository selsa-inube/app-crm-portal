import { Stack } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { CardGray } from "@components/cards/CardGray";

import { dataDebtor } from "./config";
import { EnumType } from "@hooks/useEnum/useEnum";

interface IDataDebtor {
  initialValues: FormikValues;
  lang: EnumType;
}

export function DataDebtor(props: IDataDebtor) {
  const { initialValues, lang } = props;

  return (
    <Stack direction="column" gap="12px">
      <CardGray
        label={dataDebtor.labelTypeDocument.i18n[lang]}
        data={initialValues.document}
      />
      <CardGray
        label={dataDebtor.labelNumberDocument.i18n[lang]}
        data={initialValues.documentNumber}
      />
      <CardGray
        label={dataDebtor.labelName.i18n[lang]}
        data={initialValues.name}
      />
      <CardGray
        label={dataDebtor.labelLastName.i18n[lang]}
        data={initialValues.lastName}
      />
      <CardGray
        label={dataDebtor.labelEmail.i18n[lang]}
        data={initialValues.email}
        apparencePlaceHolder="gray"
      />
      <CardGray
        label={dataDebtor.labelNumber.i18n[lang]}
        data={initialValues.number}
      />
      <CardGray
        label={dataDebtor.labelSex.i18n[lang]}
        data={initialValues.sex}
      />
      <CardGray
        label={dataDebtor.labelAge.i18n[lang]}
        data={initialValues.age}
      />
      <CardGray
        label={dataDebtor.labelRelation.i18n[lang]}
        data={initialValues.relation}
      />
    </Stack>
  );
}
