import {
  Date as DateInube,
  Input,
  Select,
  Grid,
  Phonefield,
} from "@inubekit/inubekit";

import { disbursemenOptionAccount } from "@pages/SubmitCreditApplication/steps/disbursementGeneral/config";
import {
  Sex,
  typesOfDocuments,
  City,
} from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
import { ICustomerData } from "@context/CustomerContext/types";

interface IGeneralInformationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  optionNameForm: string;
  isReadOnly?: boolean;
  customerData?: ICustomerData;
}

export function GeneralInformationForm(props: IGeneralInformationFormProps) {
  const { formik, optionNameForm, isReadOnly, customerData } = props;

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap="16px" autoRows="auto">
        <Select
          id={"documentType"}
          name={`${optionNameForm}.documentType`}
          label={disbursemenOptionAccount.labelDocumentType}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={typesOfDocuments}
          onBlur={formik.handleBlur}
          onChange={(_, value) =>
            formik.setFieldValue(`${optionNameForm}.documentType`, value)
          }
          value={formik.values[optionNameForm]?.documentType || ""}
          fullwidth
        />
        <Input
          id={"identification"}
          name={`${optionNameForm}.identification`}
          label={disbursemenOptionAccount.labelDocumentNumber}
          placeholder={disbursemenOptionAccount.placeDocumentNumber}
          value={formik.values[optionNameForm]?.identification || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          type="number"
          size="compact"
          status={
            formik.values[optionNameForm]?.identification ===
            customerData?.publicCode
              ? "invalid"
              : undefined
          }
          message="El número de identificación ingresado no puede coincidir con el suyo"
        />
        <Input
          id={"name"}
          name={`${optionNameForm}.name`}
          label={disbursemenOptionAccount.labelName}
          placeholder={disbursemenOptionAccount.placeName}
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
          label={disbursemenOptionAccount.labelLastName}
          placeholder={disbursemenOptionAccount.placeLastName}
          value={formik.values[optionNameForm]?.lastName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />
        <Select
          id={"sex"}
          name={`${optionNameForm}.sex`}
          label={disbursemenOptionAccount.labelSex}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={Sex}
          onBlur={formik.handleBlur}
          onChange={(_, value) =>
            formik.setFieldValue(`${optionNameForm}.sex`, value)
          }
          value={formik.values[optionNameForm]?.sex || ""}
          fullwidth
          readonly={!isReadOnly}
        />
        <DateInube
          id="birthdate"
          name={`${optionNameForm}.birthdate`}
          label={disbursemenOptionAccount.labelBirthdate}
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
        <Phonefield
          id={"phone"}
          name={`${optionNameForm}.phone`}
          label={disbursemenOptionAccount.labelphone}
          placeholder={disbursemenOptionAccount.placephone}
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
          label={disbursemenOptionAccount.labelMail}
          placeholder={disbursemenOptionAccount.placeMail}
          value={formik.values[optionNameForm]?.mail || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
          type="email"
        />
        <Select
          id={"city"}
          name={`${optionNameForm}.city`}
          label={disbursemenOptionAccount.labelCity}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={City}
          onBlur={formik.handleBlur}
          onChange={(_, value) =>
            formik.setFieldValue(`${optionNameForm}.city`, value)
          }
          value={formik.values[optionNameForm]?.city || ""}
          fullwidth
          readonly={!isReadOnly}
        />
      </Grid>
    </>
  );
}
