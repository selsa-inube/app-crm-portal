import { useEffect, useRef } from "react";
import { MdInfoOutline } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Icon, Text, Checkbox } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import { dataBail } from "./config";
import { IBail } from "../../types";
import { currencyFormat } from "@utils/formatData/currency";
interface IBailProps {
  initialValues: IBail;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IBail) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function Bail(props: IBailProps) {
  const { initialValues, onFormValid, handleOnChange, data } = props;

  const validationSchema = Yup.object({
    client: Yup.boolean().oneOf([true]).required(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const prevValues = useRef(formik.values);

  useEffect(() => {
    onFormValid(formik.isValid);
  }, [formik.isValid, onFormValid]);

  useEffect(() => {
    if (prevValues.current.client !== formik.values.client) {
      handleOnChange(formik.values);
      prevValues.current = formik.values;
    }
  }, [formik.values, handleOnChange]);

  return (
    <Fieldset>
      <Stack direction="column" alignItems="center" padding="12px" gap="20px">
        <Stack direction="column" gap="8px" alignItems="center">
          <Text type="headline" weight="bold" size="large" appearance="primary">
            {currencyFormat(data.bond_value)}
          </Text>
          <Text type="body" size="small" appearance="gray">
            {dataBail.bail}
          </Text>
        </Stack>
        <Checkbox
          id="client"
          name="client"
          label={dataBail.labelCheckBox}
          checked={formik.values.client}
          onChange={formik.handleChange}
          value={"client"}
        />
        <Stack gap="4px">
          <Icon icon={<MdInfoOutline />} appearance="dark" size="16px" />
          <Text type="body" size="medium" appearance="gray">
            {dataBail.disbursement}
          </Text>
        </Stack>
      </Stack>
    </Fieldset>
  );
}
