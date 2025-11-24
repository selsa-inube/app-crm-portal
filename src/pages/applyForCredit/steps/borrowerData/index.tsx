import { useContext, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { FormikValues, useFormik } from "formik";
import { Stack, Button } from "@inubekit/inubekit";

import { CardBorrower } from "@components/cards/CardBorrower";
import { NewCardBorrower } from "@components/cards/CardBorrower/newCard";
import { Fieldset } from "@components/data/Fieldset";
import { DeleteModal } from "@components/modals/DeleteModal";
import { DebtorAddModal } from "@pages/prospect/components/modals/DebtorAddModal";
import { DebtorDetailsModal } from "@pages/prospect/components/modals/DebtorDetailsModal";
import { DebtorEditModal } from "@pages/prospect/components/modals/DebtorEditModal";
import { dataSubmitApplication } from "@pages/applyForCredit/config/config";
import { currencyFormat } from "@utils/formatData/currency";
import { AppContext } from "@context/AppContext";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { IBorrower, IBorrowerProperty } from "@services/creditLimit/types";
import { IBorrowerData, IDebtorDetail } from "@pages/applyForCredit/types";
import { IProspect, IProspectBorrower } from "@services/prospect/types";

import { getTotalFinancialObligations } from "../../util";
import { StyledContainer } from "./styles";
import { borrowerData } from "./config";

interface borrowersProps {
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IProspect | FormikValues) => void;
  onUpdate?: (updatedBorrower: Borrower) => void;
  prospectData: IProspectBorrower;
  initialValues: IBorrowerData;
  isMobile: boolean;
  valueRule: string[];
  businessManagerCode: string;
}

export interface Borrower {
  borrowerIdentificationNumber: string;
  borrowerIdentificationType: string;
  borrowerName: string;
  borrowerType: string;
  borrowerProperties: {
    [key: string]: IBorrowerProperty;
  };
}

export function Borrowers(props: borrowersProps) {
  const {
    handleOnChange,
    initialValues,
    isMobile,
    prospectData,
    valueRule,
    businessManagerCode,
  } = props;

  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<IDebtorDetail>();

  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const dataDebtorDetail = Array.isArray(prospectData.borrowers)
    ? [...prospectData.borrowers].sort((a, b) => {
        if (a.borrowerType === "MainBorrower") return -1;
        if (b.borrowerType === "MainBorrower") return 1;
        return 0;
      })
    : [];

  const formik = useFormik<{
    borrowers: Borrower[];
  }>({
    initialValues: {
      ...initialValues,
      borrowers: Array.isArray(initialValues?.borrowers)
        ? initialValues.borrowers
        : dataDebtorDetail,
    },
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  return (
    <Fieldset>
      <Stack direction="column" gap="20px">
        <Stack justifyContent="end" margin="0 8px">
          <Button onClick={() => setIsModalAdd(true)} iconBefore={<MdAdd />}>
            {valueRule?.includes("Coborrower")
              ? dataSubmitApplication.coBorrowers.borrowerLabel
              : dataSubmitApplication.borrowers.borrowerLabel}
          </Button>
        </Stack>
        <StyledContainer>
          <Stack wrap="wrap" gap="16px">
            {formik.values.borrowers
              .filter((item: FormikValues) =>
                valueRule.includes("Coborrower")
                  ? item.borrowerType !== "MainBorrower"
                  : true,
              )
              .map((item: FormikValues, index: number) => (
                <CardBorrower
                  key={index}
                  title={
                    dataSubmitApplication.borrowers.borrowerLabel +
                    ` ${index + 1}`
                  }
                  name={getPropertyValue(item.borrowerProperties, "name")}
                  lastName={getPropertyValue(
                    item.borrowerProperties,
                    "surname",
                  )}
                  email={
                    getPropertyValue(item.borrowerProperties, "email") || ""
                  }
                  income={currencyFormat(
                    Number(
                      getPropertyValue(
                        item.borrowerProperties,
                        "PeriodicSalary",
                      ) || 0,
                    ) +
                      Number(
                        getPropertyValue(
                          item.borrowerProperties,
                          "OtherNonSalaryEmoluments",
                        ) || 0,
                      ) +
                      Number(
                        getPropertyValue(
                          item.borrowerProperties,
                          "PensionAllowances",
                        ) || 0,
                      ),
                    false,
                  )}
                  obligations={currencyFormat(
                    getTotalFinancialObligations(item.borrowerProperties),
                    false,
                  )}
                  handleView={() => {
                    setSelectedBorrower(item as IDebtorDetail);
                    setIsModalView(true);
                  }}
                  isMobile={isMobile}
                  handleEdit={() => {
                    setEditIndex(index);
                    setIsModalEdit(true);
                  }}
                  handleDelete={() => setIsModalDelete(true)}
                  showIcons={valueRule?.includes("Coborrower")}
                />
              ))}
            <NewCardBorrower
              onClick={() => setIsModalAdd(true)}
              title={
                valueRule?.includes("Coborrower")
                  ? dataSubmitApplication.coBorrowers.borrowerLabel
                  : dataSubmitApplication.borrowers.borrowerLabel
              }
              isMobile={isMobile}
            />
            {isModalAdd && (
              <DebtorAddModal
                onSubmit={() => setIsModalAdd(false)}
                handleClose={() => setIsModalAdd(false)}
                businessManagerCode={businessManagerCode}
                title={
                  valueRule?.includes("Coborrower")
                    ? dataSubmitApplication.coBorrowers.borrowerLabel
                    : dataSubmitApplication.borrowers.borrowerLabel
                }
                businessUnitPublicCode={businessUnitPublicCode}
                prospectData={prospectData as IProspect}
                onAddBorrower={(newBorrower) => {
                  const updatedBorrowers = [
                    ...formik.values.borrowers,
                    ...newBorrower,
                  ];
                  formik.setFieldValue("borrowers", updatedBorrowers);
                }}
              />
            )}
            {isModalView && selectedBorrower && (
              <DebtorDetailsModal
                handleClose={() => {
                  setIsModalView(false);
                  setEditIndex(null);
                }}
                isMobile={isMobile}
                initialValues={selectedBorrower}
                properties={{} as IBorrower}
              />
            )}
            {isModalDelete && (
              <DeleteModal
                handleClose={() => setIsModalDelete(false)}
                TextDelete={borrowerData.delete}
              />
            )}
            {isModalEdit && editIndex !== null && (
              <DebtorEditModal
                handleClose={() => {
                  setIsModalEdit(false);
                  setEditIndex(null);
                }}
                isMobile={isMobile}
                initialValues={{
                  ...formik.values.borrowers[editIndex],
                  borrowerProperties: Object.values(
                    formik.values.borrowers[editIndex].borrowerProperties,
                  ),
                }}
                onUpdate={(updatedBorrower: IBorrower) => {
                  const updatedBorrowers = formik.values.borrowers.map(
                    (b, i) =>
                      i === editIndex ? { ...b, ...updatedBorrower } : b,
                  );
                  formik.setFieldValue("borrowers", updatedBorrowers);
                }}
                onSave={() => {}}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                prospectData={prospectData as IProspect}
              />
            )}
          </Stack>
        </StyledContainer>
      </Stack>
    </Fieldset>
  );
}
