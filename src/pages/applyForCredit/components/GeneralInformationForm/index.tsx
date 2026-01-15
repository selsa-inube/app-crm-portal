import {
  Date as DateInube,
  Input,
  Select,
  Grid,
  Phonefield,
  Stack,
  Textfield,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";
import { useEffect } from "react";

import { disbursemenOptionAccount } from "@pages/applyForCredit/steps/disbursementGeneral/config";
import { useEnum } from "@hooks/useEnum/useEnum";
import {
  Sex,
  typesOfDocuments,
  City,
} from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
import { ICustomerData } from "@context/CustomerContext/types";

import { dataGeneralInformationForm } from "./config";

interface IGeneralInformationFormProps {
  formik: FormikValues;
  isMobile: boolean;
  optionNameForm: string;
  isReadOnly?: boolean;
  customerData?: ICustomerData;
}

export function GeneralInformationForm(props: IGeneralInformationFormProps) {
  const { formik, isMobile, optionNameForm, isReadOnly, customerData } = props;

  const { lang } = useEnum();

  useEffect(() => {
    if (typesOfDocuments.length === 1) {
      const onlyOption = typesOfDocuments[0];
      formik.setFieldValue(`${optionNameForm}.documentType`, onlyOption.value);
    }
  }, [typesOfDocuments, optionNameForm]);

  useEffect(() => {
    if (Sex.length === 1) {
      const onlyOption = Sex[0];
      formik.setFieldValue(`${optionNameForm}.sex`, onlyOption.value);
    }
  }, [Sex, optionNameForm]);

  useEffect(() => {
    if (City.length === 1) {
      const onlyOption = City[0];
      formik.setFieldValue(`${optionNameForm}.city`, onlyOption.value);
    }
  }, [City, optionNameForm]);

  return (
    <>
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap="16px"
        autoRows="auto"
      >
        {typesOfDocuments.length === 1 ? (
          <Textfield
            id={"documentType"}
            name={`${optionNameForm}.documentType`}
            label={disbursemenOptionAccount.labelDocumentType.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            value={typesOfDocuments[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"documentType"}
            name={`${optionNameForm}.documentType`}
            label={disbursemenOptionAccount.labelDocumentType.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            options={typesOfDocuments}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.documentType`, value)
            }
            value={formik.values[optionNameForm]?.documentType || ""}
            fullwidth
          />
        )}

        <Input
          id={"identification"}
          name={`${optionNameForm}.identification`}
          label={disbursemenOptionAccount.labelDocumentNumber.i18n[lang]}
          placeholder={disbursemenOptionAccount.placeDocumentNumber.i18n[lang]}
          value={formik.values[optionNameForm]?.identification || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          type="number"
          size="compact"
          status={
            formik.values[optionNameForm]?.identification.toString() ===
            customerData?.publicCode
              ? "invalid"
              : undefined
          }
          message={dataGeneralInformationForm.message.i18n[lang]}
        />

        <Input
          id={"name"}
          name={`${optionNameForm}.name`}
          label={disbursemenOptionAccount.labelName.i18n[lang]}
          placeholder={disbursemenOptionAccount.placeName.i18n[lang]}
          value={formik.values[optionNameForm]?.name || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <Input
          id={"lastName"}
          name={`${optionNameForm}.lastName`}
          label={disbursemenOptionAccount.labelLastName.i18n[lang]}
          placeholder={disbursemenOptionAccount.placeLastName.i18n[lang]}
          value={formik.values[optionNameForm]?.lastName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <DateInube
          id="birthdate"
          name={`${optionNameForm}.birthdate`}
          label={disbursemenOptionAccount.labelBirthdate.i18n[lang]}
          size="compact"
          fullwidth={true}
          value={formik.values[optionNameForm]?.birthdate || ""}
          onChange={(e) => {
            const date = new Date(e.target.value);
            formik.setFieldValue(
              `${optionNameForm}.birthdate`,
              date instanceof Date && !isNaN(date.getTime())
                ? date.toISOString().split("T")[0]
                : "",
            );
          }}
        />
        {Sex.length === 1 ? (
          <Textfield
            id={"sex"}
            name={`${optionNameForm}.sex`}
            label={disbursemenOptionAccount.labelSex.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            value={Sex[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"sex"}
            name={`${optionNameForm}.sex`}
            label={disbursemenOptionAccount.labelSex.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            options={Sex}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.sex`, value)
            }
            value={formik.values[optionNameForm]?.sex || ""}
            fullwidth
          />
        )}

        <Phonefield
          id={"phone"}
          name={`${optionNameForm}.phone`}
          label={disbursemenOptionAccount.labelphone.i18n[lang]}
          placeholder={disbursemenOptionAccount.placephone.i18n[lang]}
          value={formik.values[optionNameForm]?.phone || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <Input
          id={"mail"}
          name={`${optionNameForm}.mail`}
          label={disbursemenOptionAccount.labelMail.i18n[lang]}
          placeholder={disbursemenOptionAccount.placeMail.i18n[lang]}
          value={formik.values[optionNameForm]?.mail || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
          type="email"
        />
      </Grid>

      <Stack width={isMobile ? "100%" : "498px"}>
        {City.length === 1 ? (
          <Textfield
            id={"city"}
            name={`${optionNameForm}.city`}
            label={disbursemenOptionAccount.labelCity.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            value={City[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"city"}
            name={`${optionNameForm}.city`}
            label={disbursemenOptionAccount.labelCity.i18n[lang]}
            placeholder={disbursemenOptionAccount.placeOption.i18n[lang]}
            size="compact"
            options={City}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.city`, value)
            }
            value={formik.values[optionNameForm]?.city || ""}
            fullwidth
          />
        )}
      </Stack>
    </>
  );
}
