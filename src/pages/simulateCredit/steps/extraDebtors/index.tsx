import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useParams } from "react-router-dom";
import { FormikValues, useFormik } from "formik";
import { Stack, Grid, Button } from "@inubekit/inubekit";

import { CardBorrower } from "@components/cards/CardBorrower";
import { NewCardBorrower } from "@components/cards/CardBorrower/newCard";
import { Fieldset } from "@components/data/Fieldset";
import { DeleteModal } from "@components/modals/DeleteModal";
import { DebtorAddModal } from "@pages/prospect/components/modals/DebtorAddModal";
import { DebtorDetailsModal } from "@pages/prospect/components/modals/DebtorDetailsModal";
import { DebtorEditModal } from "@pages/prospect/components/modals/DebtorEditModal";
import { mockGuaranteeBorrower } from "@mocks/guarantee/offeredguarantee.mock";
import { dataSubmitApplication } from "@pages/applyForCredit/config/config";
import { choiceBorrowers } from "@mocks/filing-application/choice-borrowers/choiceborrowers.mock";
import { MockDataDebtor } from "@mocks/filing-application/add-borrower/addborrower.mock";
import { IBorrower, IProspect } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";

import { dataExtraDebtors } from "./config";

interface IExtraDebtorsProps {
  isMobile: boolean;
  onFormValid: (isValid: boolean) => void;
  initialValues: IDebtorDetail;
  handleOnChange: (values: FormikValues) => void;
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
        debtorDetail: IDebtorDetail;
      }
    >,
  );

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      initialBorrowers,
      debtorDetail: initialValues.debtorDetail || {
        document: "",
        documentNumber: "",
        name: "",
        lastName: "",
        email: "",
        number: "",
        sex: "",
        age: "",
        relation: "",
      },
    },
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values]);

  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedDebtorDetail, setSelectedDebtorDetail] =
    useState<IDebtorDetail | null>(null);
  const [selectedBorrowerForEdit, setSelectedBorrowerForEdit] =
    useState<IBorrower | null>(null);
  const [currentBorrowerIndex, setCurrentBorrowerIndex] = useState<
    number | null
  >(null);

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
                const borrowerData = initialBorrowers[`borrower${index + 1}`];
                if (borrowerData) {
                  setSelectedDebtorDetail(borrowerData.debtorDetail);
                  setIsModalView(true);
                }
              }}
              handleEdit={() => {
                const borrowerData = initialBorrowers[`borrower${index + 1}`];
                if (borrowerData) {
                  const borrowerForEdit: IBorrower = {
                    ...borrowerData.debtorDetail,
                    id: borrowerData.id,
                    borrowerName: "",
                    borrowerType: "",
                    borrowerIdentificationType: "",
                    borrowerIdentificationNumber: "",
                    borrowerProperties: [],
                  } as IBorrower;
                  setSelectedBorrowerForEdit(borrowerForEdit);
                  setCurrentBorrowerIndex(index);
                  setIsModalEdit(true);
                }
              }}
              handleDelete={() => {
                setCurrentBorrowerIndex(index);
                setIsModalDelete(true);
              }}
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
              onAddBorrower={() => {}}
              prospectData={{} as IProspect}
            />
          )}

          {isModalView && selectedDebtorDetail && (
            <DebtorDetailsModal
              handleClose={() => {
                setIsModalView(false);
                setSelectedDebtorDetail(null);
              }}
              isMobile={isMobile}
              initialValues={selectedDebtorDetail}
            />
          )}

          {isModalDelete && (
            <DeleteModal
              handleClose={() => {
                setIsModalDelete(false);
                setCurrentBorrowerIndex(null);
              }}
              TextDelete={dataExtraDebtors.Delete}
            />
          )}
          {isModalEdit && selectedBorrowerForEdit && (
            <DebtorEditModal
              handleClose={() => {
                setIsModalEdit(false);
                setSelectedBorrowerForEdit(null);
                setCurrentBorrowerIndex(null);
              }}
              isMobile={isMobile}
              initialValues={selectedBorrowerForEdit}
              currentBorrowerIndex={currentBorrowerIndex}
            />
          )}
        </Grid>
      </Stack>
    </Fieldset>
  );
}
