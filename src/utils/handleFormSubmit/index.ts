import { FormikValues } from "formik";
import { TableExtraordinaryInstallmentProps } from "@pages/prospect/components/TableExtraordinaryInstallment";

const handleFormSubmit = async (
  values: FormikValues,
  onConfirm: (values: FormikValues) => void,
) => {
  const rawDataString = localStorage.getItem(
    "crmPortal-extraordinary_installments",
  );
  let storedData: TableExtraordinaryInstallmentProps[] = [];

  if (rawDataString) {
    storedData = JSON.parse(rawDataString);
  }

  const updatedValues = {
    ...values,
  };

  if (values.id) {
    const updatedData = storedData.map((item) =>
      item.id === values.id ? { ...item, ...updatedValues } : item,
    );

    localStorage.setItem(
      "crmPortal-extraordinary_installments",
      JSON.stringify(updatedData),
    );
  } else {
    const newItem = {
      ...updatedValues,
      id: Date.now(),
    };

    localStorage.setItem(
      "crmPortal-extraordinary_installments",
      JSON.stringify([...storedData, newItem]),
    );
  }

  onConfirm(updatedValues);
};

export { handleFormSubmit };
