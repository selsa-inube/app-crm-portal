import { useContext, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useFormik } from "formik";
import { Grid } from "@inubekit/grid";
import { Button } from "@inubekit/button";
import { Stack } from "@inubekit/stack";

import { CardBorrower } from "@components/cards/CardBorrower";
import { NewCardBorrower } from "@components/cards/CardBorrower/newCard";
import { Fieldset } from "@components/data/Fieldset";
import { DeleteModal } from "@components/modals/DeleteModal";
import { DebtorAddModal } from "@pages/prospect/components/modals/DebtorAddModal";
import { DebtorDetailsModal } from "@pages/prospect/components/modals/DebtorDetailsModal";
import { DebtorEditModal } from "@pages/prospect/components/modals/DebtorEditModal";
import { dataSubmitApplication } from "@pages/SubmitCreditApplication/config/config";
import { currencyFormat, getMonthsElapsed } from "@utils/formatData/currency";
import { ruleConfig } from "@pages/SubmitCreditApplication/config/configRules";
import { evaluateRule } from "@pages/SubmitCreditApplication/evaluateRule";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";

import { getPropertyValue, getTotalFinancialObligations } from "../../util";
import { BorrowerProperty } from "@services/incomeSources/types";
import { IBorrowerData } from "@pages/SubmitCreditApplication/types";
import { IProspect } from "@services/types";
import { StyledContainer } from "./styles";

interface borrowersProps {
  onFormValid: (isValid: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnChange: (values: any) => void;
  onUpdate?: (updatedBorrower: Borrower) => void;
  data: IProspect;
  initialValues: IBorrowerData;
  isMobile: boolean;
}

interface Borrower {
  borrower_identification_number: string;
  borrower_identification_type: string;
  borrower_name: string;
  borrower_type: string;
  borrower_properties: {
    [key: string]: BorrowerProperty;
  };
}
export function Borrowers(props: borrowersProps) {
  const { handleOnChange, initialValues, isMobile, data } = props;
  const dataDebtorDetail = Array.isArray(data.borrowers)
    ? [...data.borrowers].sort((a, b) => {
        if (a.borrower_type === "main_borrower") return -1;
        if (b.borrower_type === "main_borrower") return 1;
        return 0;
      })
    : [];
  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla } = useContext(AppContext);
  const [valueRule, setValueRule] = useState<string[] | null>(null);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik<{
    borrowers: Borrower[];
  }>({
    initialValues: { ...initialValues, borrowers: dataDebtorDetail },
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  useEffect(() => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProduct = data?.credit_product?.[0];

    if (!clientInfo || !creditProduct) return;

    const dataRules = {
      LineOfCredit: creditProduct.line_of_credit_abbreviated_name,
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      LoanAmount: data.requested_amount,
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rule = ruleConfig["ValidationCoBorrowwe"]?.(dataRules);

    if (!rule) return;

    (async () => {
      const values = await evaluateRule(
        rule,
        (businessUnitPublicCode, data) =>
          postBusinessUnitRules(businessUnitPublicCode, data),
        "value",
        businessUnitPublicCode,
      );

      const extractedValues = Array.isArray(values)
        ? values
            .map((v) => (typeof v === "string" ? v : v?.value))
            .filter((val): val is string => typeof val === "string")
        : [];

      setValueRule(extractedValues);
    })();
  }, [customerData, data, businessUnitPublicCode]);

  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBorrower, setSelectedBorrower] = useState<any>(null);

  return (
    <Fieldset>
      <Stack direction="column" gap="20px">
        <Stack justifyContent="end" margin="0 8px">
          <Button onClick={() => setIsModalAdd(true)} iconBefore={<MdAdd />}>
            {valueRule?.includes("Codeudor")
              ? dataSubmitApplication.coBorrowers.borrowerLabel
              : dataSubmitApplication.borrowers.borrowerLabel}
          </Button>
        </Stack>
        <StyledContainer>
          <Grid
            templateColumns={
              isMobile ? "1fr" : `repeat(${dataDebtorDetail.length + 1}, 317px)`
            }
            autoRows="auto"
            gap="20px"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {formik.values.borrowers.map((item: any, index: number) => (
              <CardBorrower
                key={index}
                title={
                  dataSubmitApplication.borrowers.borrowerLabel +
                  ` ${index + 1}`
                }
                name={getPropertyValue(item.borrower_properties, "name")}
                lastName={getPropertyValue(item.borrower_properties, "surname")}
                email={
                  getPropertyValue(item.borrower_properties, "email") || ""
                }
                income={currencyFormat(
                  Number(
                    getPropertyValue(
                      item.borrower_properties,
                      "PeriodicSalary",
                    ) || 0,
                  ) +
                    Number(
                      getPropertyValue(
                        item.borrower_properties,
                        "OtherNonSalaryEmoluments",
                      ) || 0,
                    ) +
                    Number(
                      getPropertyValue(
                        item.borrower_properties,
                        "PensionAllowances",
                      ) || 0,
                    ),
                  false,
                )}
                obligations={currencyFormat(
                  getTotalFinancialObligations(item.borrower_properties),
                  false,
                )}
                handleView={() => {
                  setSelectedBorrower(item);
                  setIsModalView(true);
                  setIsModalView(true);
                }}
                isMobile={isMobile}
                handleEdit={() => {
                  setEditIndex(index);
                  setIsModalEdit(true);
                }}
                handleDelete={() => setIsModalDelete(true)}
              />
            ))}
            <NewCardBorrower
              onClick={() => setIsModalAdd(true)}
              title={
                valueRule?.includes("Codeudor")
                  ? dataSubmitApplication.coBorrowers.borrowerLabel
                  : dataSubmitApplication.borrowers.borrowerLabel
              }
              isMobile={isMobile}
            />
            {isModalAdd && (
              <DebtorAddModal
                onSubmit={() => setIsModalAdd(false)}
                handleClose={() => setIsModalAdd(false)}
                title={
                  valueRule?.includes("Codeudor")
                    ? dataSubmitApplication.coBorrowers.borrowerLabel
                    : dataSubmitApplication.borrowers.borrowerLabel
                }
                businessUnitPublicCode={businessUnitPublicCode}
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
              />
            )}
            {isModalDelete && (
              <DeleteModal handleClose={() => setIsModalDelete(false)} />
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
                  borrower_properties: Object.values(
                    formik.values.borrowers[editIndex].borrower_properties,
                  ),
                }}
                onUpdate={(updatedBorrower: Borrower) => {
                  const updatedBorrowers = formik.values.borrowers.map(
                    (b, i) =>
                      i === editIndex ? { ...b, ...updatedBorrower } : b,
                  );
                  formik.setFieldValue("borrowers", updatedBorrowers);
                }}
              />
            )}
          </Grid>
        </StyledContainer>
      </Stack>
    </Fieldset>
  );
}
