import localforage from "localforage";
import { FormikValues } from "formik";

import { Schedule } from "@services/enums";
import { ICreditProductProspect, IProspect } from "@services/types";

export async function addCreditProduct(
  id: string,
  values: FormikValues,
  mockProspectCredit: IProspect[],
) {
  try {
    const foundProspectIndex = mockProspectCredit.findIndex(
      (prospect) => prospect.public_code === id,
    );

    if (foundProspectIndex === -1) {
      console.error("Prospecto no encontrado para guardar el credit_product");
      return null;
    }

    if (!id) {
      console.error("ID no está definido");
      return null;
    }

    const newCreditProduct: ICreditProductProspect = {
      abbreviated_name: values.creditLine,
      credit_product_code: id,
      loan_amount: parseFloat(values.creditAmount),
      line_of_credit_code: "100",
      line_of_credit_abbreviated_name: "Compra Primera Vivienda",
      interest_rate: parseFloat(values.interestRate),
      fixed_points: 5,
      loan_term: parseInt(values.termInMonths, 10),
      schedule: values.paymentCycle,
      ordinary_installment_for_principal: {
        term: 10,
        number_of_installments: 10,
        schedule: Schedule.Quarterly,
        installment_amount_for_capital: 8,
        installment_amount: 3,
        gradient_rate: 8,
        gradient_value: 1000000,
        gradient_schedule: "monthly",
        first_gradient_date: "2024-01-15T23:59:59Z",
        payment_channel_code: values.paymentMethod,
      },
      ordinary_installment_for_interest: {
        schedule: values.paymentCycle,
        payment_channel_code: values.paymentMethod,
      },
      extraordinary_installment: {
        installment_amount: 2000,
        installment_date: "2024-01-15T23:59:59Z",
        payment_channel_code: "CAJA",
      },
      acquired_cash_flow: {
        amount: "2000",
        date: "2024-01-15T23:59:59Z",
        payment_channel_unique_code: "Principal",
        flow_number: 10,
      },
    };

    mockProspectCredit[foundProspectIndex].credit_product.push(
      newCreditProduct,
    );

    await localforage.setItem("prospects", mockProspectCredit);

    return newCreditProduct;
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return null;
  }
}
