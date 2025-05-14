import localforage from "localforage";
import { FormikValues } from "formik";
import { TableExtraordinaryInstallmentProps } from "@pages/prospect/components/TableExtraordinaryInstallment";

const handleFormSubmit = async (
  values: FormikValues,
  onConfirm: (values: FormikValues) => void
) => {
  const storedData =
    (await localforage.getItem<TableExtraordinaryInstallmentProps[]>(
      "extraordinary_installments"
    )) || [];

  const updatedValues = {
    ...values,
  };

  if (values.id) {
    const updatedData = storedData.map((item) =>
      item.id === values.id ? { ...item, ...updatedValues } : item
    );
    await localforage.setItem("extraordinary_installments", updatedData);
  } else {
    const newItem = {
      ...updatedValues,
      id: Date.now(),
    };
    await localforage.setItem("extraordinary_installments", [
      ...storedData,
      newItem,
    ]);
  }

  onConfirm(updatedValues);
};

export { handleFormSubmit };
