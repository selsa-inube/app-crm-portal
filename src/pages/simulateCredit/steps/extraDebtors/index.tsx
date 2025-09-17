import { useState, useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { useParams } from "react-router-dom";
import { FormikValues } from "formik";
import { Stack, Grid, Button } from "@inubekit/inubekit";

import { CardBorrower } from "@components/cards/CardBorrower";
import { NewCardBorrower } from "@components/cards/CardBorrower/newCard";
import { Fieldset } from "@components/data/Fieldset";
import { DeleteModal } from "@components/modals/DeleteModal";
import { DebtorAddModal } from "@pages/prospect/components/modals/DebtorAddModal";
import { DebtorDetailsModal } from "@pages/prospect/components/modals/DebtorDetailsModal";
import { DebtorEditModal } from "@pages/prospect/components/modals/DebtorEditModal";
import { dataSubmitApplication } from "@pages/applyForCredit/config/config";
import { choiceBorrowers } from "@mocks/filing-application/choice-borrowers/choiceborrowers.mock";
import { IBorrower, IProspect } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";

import { dataExtraDebtors } from "./config";
import { transformServiceData } from "./utils";

interface IExtraDebtorsProps {
  isMobile: boolean;
  onFormValid: (isValid: boolean) => void;
  initialValues: IBorrower[];
  handleOnChange: (values: FormikValues) => void;
}

export function ExtraDebtors(props: IExtraDebtorsProps) {
  const { handleOnChange, initialValues, isMobile } = props;
  const [borrowers, setBorrowers] = useState(() => transformServiceData(initialValues));
  console.log("borrowers: ",borrowers);
  const sortedBorrowers = useMemo(() => {
    return [...borrowers].sort((a, b) => {
      if (a.borrowerType === "MainBorrower") return -1;
      if (b.borrowerType === "MainBorrower") return 1;
      return 0;
    });
  }, [borrowers]);


  const initialBorrowers = sortedBorrowers.reduce(
    (acc, item, index) => {
      acc[`borrower${index + 1}`] = {
        id: item.id,
        name: item.name,
        debtorDetail: item.debtorDetail,
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

  /* const formik = useFormik({
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
    onSubmit: () => { },
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values]);
 */
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

  const handleUpdateBorrower = (updatedBorrower: IBorrower) => {
    const transformedUpdatedBorrowerArray = transformServiceData([updatedBorrower]);

    if (transformedUpdatedBorrowerArray.length === 0) {
      console.error("La transformación del deudor actualizado falló.");
      return;
    }
    const transformedUpdatedBorrower = transformedUpdatedBorrowerArray[0];

    const newBorrowers = borrowers.map((borrower) => {
      if (borrower.id === updatedBorrower.borrowerIdentificationNumber) {
        return transformedUpdatedBorrower;
      }
      return borrower;
    });

    setBorrowers(newBorrowers);

    handleOnChange({
      borrowers: newBorrowers,
    });
  };


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
              : `repeat(${sortedBorrowers.length + 1}, 317px)`
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
                  setSelectedBorrowerForEdit(item.originalData);
                  setIsModalView(true);
                }
              }}
              handleEdit={() => {
                console.log(index + "indext" + sortedBorrowers, " initialBorrowers: ", initialBorrowers, `borrower${index + 1}`);
                const borrowerData = initialBorrowers[`borrower${index + 1}`];
                console.log(borrowerData, " deptor select:::: ", borrowerData.debtorDetail);
                if (borrowerData) {
                  const borrowerForEdit: IBorrower = {
                    id: borrowerData.id,
                    borrowerName: borrowerData.name,
                    borrowerType: borrowerData.debtorDetail.type,
                    borrowerIdentificationType: borrowerData.debtorDetail.document,
                    borrowerIdentificationNumber: borrowerData.debtorDetail.documentNumber,
                    borrowerProperties: [],
                  } as IBorrower;
                  console.log("borrowerForEdit:: ", borrowerForEdit);
                  setSelectedBorrowerForEdit(item.originalData);
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
              onAddBorrower={() => { }}
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
              allDetails={selectedBorrowerForEdit}
            />
          )}

          {isModalDelete && (
            <DeleteModal
              handleClose={() => {selectedDebtorDetail
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
              onUpdate={handleUpdateBorrower}
            />
          )}
        </Grid>
      </Stack>
    </Fieldset>
  );
}
