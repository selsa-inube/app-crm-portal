import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Stack, useMediaQuery, Select } from "@inubekit/inubekit";

import { IPatchOfRequirements } from "@services/requirementsPackages/types";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { dataAddRequirement } from "@src/pages/financialReporting/Requirements/config";

import { IOptionsSelect } from "../types";
import { requirementJustificationMap, validationMessages } from "./config";

export interface IRequirements {
  optionsRequirement: IOptionsSelect[];
  creditRequestCode: string;
  title: string;
  setTypeOfRequirementToEvaluated: React.Dispatch<React.SetStateAction<string>>;
  setdescriptionUseValues: React.Dispatch<React.SetStateAction<string>>;
  setRequirementName: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  justificationRequirement: string;
  setJustificationRequirement: React.Dispatch<React.SetStateAction<string>>;
  rawRequirements?: IPackagesOfRequirementsById[];
  requirementName?: string;
  descriptionUseValues?: string;
  typeOfRequirementToEvaluated?: string;
  readOnly?: boolean;
  handleNext?: () => void;
  onSecondaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onChange?: (key: string) => void;
  onSubmit?: (values: { descriptionUseValues: string }) => void;
  onCloseModal?: () => void;
  disabledBack?: boolean;
  setSentData: React.Dispatch<
    React.SetStateAction<IPatchOfRequirements | null>
  >;
}

export function AddSystemValidation(props: IRequirements) {
  const {
    onSubmit,
    title,
    readOnly,
    buttonText,
    onCloseModal,
    onSecondaryButtonClick,
    optionsRequirement,
    setdescriptionUseValues,
    handleNext,
    secondaryButtonText = "Cancelar",
    setJustificationRequirement,
    justificationRequirement,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const validationSchema = Yup.object().shape({
    descriptionUseValues: Yup.string().required(
      validationMessages.requiredField,
    ),
  });

  const isButtonDisabled = (
    values: { descriptionUseValues: string },
    isSubmitting: boolean,
  ): boolean => {
    return !values.descriptionUseValues || isSubmitting;
  };

  const getPlaceholderText = (selectedValue: string) => {
    return requirementJustificationMap[selectedValue] || "";
  };

  const handleRequirementChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const selectedOption = options.Requirement.find(
      (option) => option.value === value,
    );
    if (selectedOption) {
      setdescriptionUseValues(selectedOption.value);
      const newPlaceholder = getPlaceholderText(selectedOption.value);
      setJustificationRequirement(newPlaceholder);
    }
  };

  const options = {
    Requirement: optionsRequirement.map((official) => ({
      id: official.id,
      label: official.label,
      value: official.value,
    })),
  };
  return (
    <Formik
      initialValues={{
        descriptionUseValues: "",
        requirementCatalogName: "",
        descriptionUse: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit?.(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <BaseModal
          title={title}
          nextButton={buttonText}
          backButton={secondaryButtonText}
          handleNext={handleNext ?? (() => {})}
          handleBack={onSecondaryButtonClick}
          handleClose={onCloseModal}
          width={isMobile ? "300px" : "500px"}
          disabledNext={isButtonDisabled(values, isSubmitting) && !readOnly}
        >
          <Form>
            <Stack direction="column" gap="24px">
              <Select
                name="descriptionUseValues"
                id="descriptionUseValues"
                label={dataAddRequirement.labelPaymentMethod}
                placeholder={
                  options.Requirement.length > 0
                    ? "Selecciona una opción"
                    : "No hay disponibles"
                }
                options={options.Requirement}
                onChange={(name, value) =>
                  handleRequirementChange(name, value, setFieldValue)
                }
                value={values.descriptionUseValues}
                fullwidth
                disabled={options.Requirement.length === 0}
              />
              {values.descriptionUseValues && (
                <CardGray
                  label={dataAddRequirement.titleJustification}
                  placeHolder={justificationRequirement}
                  apparencePlaceHolder="gray"
                  height="108px"
                />
              )}
            </Stack>
          </Form>
        </BaseModal>
      )}
    </Formik>
  );
}
