import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { Stack, Grid, Button } from "@inubekit/inubekit";

import { CardBorrower } from "@components/cards/CardBorrower";
import { NewCardBorrower } from "@components/cards/CardBorrower/newCard";
import { Fieldset } from "@components/data/Fieldset";
import { DeleteModal } from "@components/modals/DeleteModal";
import { DebtorAddModal } from "@pages/prospect/components/modals/DebtorAddModal";
import { DebtorDetailsModal } from "@pages/prospect/components/modals/DebtorDetailsModal";
import { DebtorEditModal } from "@pages/prospect/components/modals/DebtorEditModal";
import { mockGuaranteeBorrower } from "@mocks/guarantee/offeredguarantee.mock";
import { dataSubmitApplication } from "@pages/SubmitCreditApplication/config/config";
import { choiceBorrowers } from "@mocks/filing-application/choice-borrowers/choiceborrowers.mock";
import { MockDataDebtor } from "@mocks/filing-application/add-borrower/addborrower.mock";

interface IExtraDebtorsProps {
  isMobile: boolean;
  onFormValid: (isValid: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnChange: (values: any) => void;
}
export function ExtraDebtors(props: IExtraDebtorsProps) {
  const { handleOnChange, initialValues, isMobile } = props;

  const sortedBorrowers = [...mockGuaranteeBorrower].sort((a, b) => {
    if (a.borrowerType === "MainBorrower") return -1;
    if (b.borrowerType === "MainBorrower") return 1;
    return 0;
  });

  const dataDebtorDetail = MockDataDebtor[0];
  const initialBorrowers = mockGuaranteeBorrower.reduce(
    (acc, item, index) => {
      acc[`borrower${index + 1}`] = {
        id: item.id,
        name: item.name,
        debtorDetail: {
          document: dataDebtorDetail?.TypeDocument || "",
          documentNumber: dataDebtorDetail?.NumberDocument || "",
          name: dataDebtorDetail?.Name || "",
          lastName: dataDebtorDetail?.LastName || "",
          email: dataDebtorDetail?.Email || "",
          number: dataDebtorDetail?.Number || "",
          sex: dataDebtorDetail?.Sex || "",
          age: dataDebtorDetail?.Age || "",
          relation: dataDebtorDetail?.Relation || "",
        },
      };
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        id: string;
        debtorDetail: Record<string, string | number>;
      }
    >,
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      initialBorrowers,
    },
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const { id } = useParams();
  const userId = parseInt(id || "0", 10);
  const userChoice =
    choiceBorrowers.find((choice) => choice.id === userId)?.choice ||
    "borrowers";

  const data =
    dataSubmitApplication[
      userChoice === "borrowers" ? "borrowers" : "coBorrowers"
    ];

  return (
    <Fieldset>
      <Stack direction="column" padding="2px 10px" gap="20px">
        <Stack justifyContent="end">
          <Button onClick={() => setIsModalAdd(true)} iconBefore={<MdAdd />}>
            {data.addButton}
          </Button>
        </Stack>
        <Grid
          templateColumns={
            isMobile
              ? "1fr"
              : `repeat(${mockGuaranteeBorrower.length + 1}, 317px)`
          }
          autoRows="auto"
          gap="20px"
        >
          {sortedBorrowers.map((item, index) => (
            <CardBorrower
              key={index}
              title={data.borrowerLabel + ` ${index + 1}`}
              name={item.name}
              lastName={item.lastName}
              email={item.email}
              income={item.income}
              obligations={item.obligations}
              isMobile={isMobile}
              handleView={() => {
                setIsModalView(true);
                formik.setFieldValue(
                  "debtorDetail",
                  initialBorrowers[`borrower${index + 1}`].debtorDetail,
                );
              }}
              handleEdit={() => setIsModalEdit(true)}
              handleDelete={() => setIsModalDelete(true)}
            />
          ))}
          <NewCardBorrower
            onClick={() => setIsModalAdd(true)}
            title={data.borrowerLabel}
            isMobile={isMobile}
          />
          {isModalAdd && (
            <DebtorAddModal
              onSubmit={() => setIsModalAdd(false)}
              handleClose={() => setIsModalAdd(false)}
              title={data.addButton}
            />
          )}
          {isModalView && (
            <DebtorDetailsModal
              handleClose={() => setIsModalView(false)}
              isMobile={isMobile}
              initialValues={formik.values.debtorDetail}
            />
          )}
          {isModalDelete && (
            <DeleteModal handleClose={() => setIsModalDelete(false)} />
          )}
          {isModalEdit && (
            <DebtorEditModal
              handleClose={() => setIsModalEdit(false)}
              isMobile={isMobile}
              initialValues={formik.values.debtorDetail}
            />
          )}
        </Grid>
      </Stack>
    </Fieldset>
  );
}
