import { useState, useMemo, useEffect } from "react";
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
import { ICustomerData } from "@context/CustomerContext/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataExtraDebtors, ITransformedBorrower } from "./config";
import { transformServiceData } from "./utils";

interface IExtraDebtorsProps {
  isMobile: boolean;
  onFormValid: (isValid: boolean) => void;
  initialValues: IBorrower[];
  businessUnitPublicCode: string;
  handleOnChange: (values: FormikValues) => void;
  customerData: ICustomerData;
  businessManagerCode: string;
  prospectData: IProspect | undefined;
  lang: EnumType;
}

export function ExtraDebtors(props: IExtraDebtorsProps) {
  const {
    handleOnChange,
    initialValues,
    isMobile,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    customerData,
    lang,
  } = props;
  const [borrowers, setBorrowers] = useState(() =>
    transformServiceData(initialValues),
  );

  useEffect(() => {
    setBorrowers(transformServiceData(initialValues));
  }, [initialValues]);

  const sortedBorrowers = useMemo(() => {
    return [...borrowers].sort((borrowerA, borrowerB) => {
      if (borrowerA.borrowerType === "MainBorrower") return -1;
      if (borrowerB.borrowerType === "MainBorrower") return 1;
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

  const handleUpdateBorrower = (
    updatedBorrower: IBorrower,
    isSave?: boolean,
  ) => {
    const transformedUpdatedBorrowerArray = transformServiceData([
      updatedBorrower,
    ]);

    if (transformedUpdatedBorrowerArray.length === 0) {
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

    isSave && saveGlobalState(newBorrowers);
  };

  const handleConfirmDelete = () => {
    if (currentBorrowerIndex === null) return;

    const borrowerToDelete = sortedBorrowers[currentBorrowerIndex];
    if (!borrowerToDelete || borrowerToDelete.borrowerType === "MainBorrower") {
      setIsModalDelete(false);
      setCurrentBorrowerIndex(null);
      return;
    }

    const updatedBorrowers = borrowers.filter(
      (borrower) => borrower.id !== borrowerToDelete.id,
    );
    setBorrowers(updatedBorrowers);

    setIsModalDelete(false);
    setCurrentBorrowerIndex(null);
  };

  const saveGlobalState = (newBorrowers: ITransformedBorrower[]) => {
    handleOnChange({
      borrowers: newBorrowers.map((borrower) => borrower.originalData),
    });
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalEdit(false);
  };

  return (
    <Fieldset>
      <Stack direction="column" padding="2px 10px" gap="20px">
        <Stack justifyContent="end">
          <Button onClick={() => setIsModalAdd(true)} iconBefore={<MdAdd />}>
            {data.addButton.i18n[lang]}
          </Button>
        </Stack>
        <Grid
          templateColumns={
            isMobile ? "1fr" : `repeat(${sortedBorrowers.length + 1}, 317px)`
          }
          autoRows="auto"
          gap="20px"
        >
          {sortedBorrowers.map((item, index) => (
            <CardBorrower
              typeBorrower={item.borrowerType}
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
                const borrowerData = initialBorrowers[`borrower${index + 1}`];

                if (borrowerData) {
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
            title={data.borrowerLabel.i18n[lang]}
            isMobile={isMobile}
          />

          {isModalAdd && (
            <DebtorAddModal
              onSubmit={() => setIsModalAdd(false)}
              handleClose={() => setIsModalAdd(false)}
              title={data.addButton.i18n[lang]}
              onAddBorrower={(newBorrowers: IBorrower[]) => {
                const transformed = transformServiceData(newBorrowers);
                if (transformed.length === 0) return;
                const updated = [...borrowers, ...transformed];
                setBorrowers(updated);
                handleOnChange({
                  borrowers: updated.map((borrower) => borrower.originalData),
                });
                setIsModalAdd(false);
              }}
              prospectData={{} as IProspect}
              businessManagerCode={businessManagerCode}
              businessUnitPublicCode={businessUnitPublicCode}
              customerData={customerData}
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
              properties={selectedBorrowerForEdit}
            />
          )}
          {isModalDelete && (
            <DeleteModal
              handleClose={() => {
                selectedDebtorDetail;
                setIsModalDelete(false);
                setCurrentBorrowerIndex(null);
              }}
              handleDelete={handleConfirmDelete}
              TextDelete={dataExtraDebtors.delete.i18n[lang]}
            />
          )}
          {isModalEdit && selectedBorrowerForEdit && (
            <DebtorEditModal
              handleClose={() => {
                handleCloseModal();
                setBorrowers(transformServiceData(initialValues));
              }}
              isMobile={isMobile}
              initialValues={selectedBorrowerForEdit}
              currentBorrowerIndex={currentBorrowerIndex}
              onUpdate={handleUpdateBorrower}
              businessUnitPublicCode={businessUnitPublicCode}
              businessManagerCode={businessManagerCode}
              prospectData={prospectData}
            />
          )}
        </Grid>
      </Stack>
    </Fieldset>
  );
}
