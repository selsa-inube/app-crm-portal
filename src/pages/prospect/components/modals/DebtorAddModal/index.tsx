import { useEffect, useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { getIncomeSourcesById } from "@services/creditLimit/getIncomeSources";
import { IIncomeSources } from "@services/creditLimit/types";
import { getSearchCustomerByCode } from "@services/customer/SearchCustomerCatalogByCode";
import { getAge } from "@utils/formatData/currency";
import { IProspect } from "@services/prospect/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { getCreditPayments } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment";

import { stepsAddBorrower } from "./config/addBorrower.config";
import { DebtorAddModalUI } from "./interface";
import { FormData } from "./types";

interface BorrowerProperty {
  propertyName: string;
  propertyValue: string;
}
interface BorrowerData {
  borrowerName: string;
  borrowerType: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
  borrowerProperties: BorrowerProperty[];
}

interface DebtorAddModalProps {
  onSubmit: () => void;
  handleClose: () => void;
  onAddBorrower: (borrowerData: BorrowerData[]) => void;
  title: string;
  prospectData: IProspect;
  businessManagerCode: string;
  businessUnitPublicCode?: string;
  customerData?: ICustomerData;
}

export function DebtorAddModal(props: DebtorAddModalProps) {
  const {
    title,
    handleClose,
    businessUnitPublicCode,
    prospectData,
    businessManagerCode,
    onAddBorrower,
    customerData,
  } = props;

  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddBorrower.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      tipeOfDocument: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      sex: "",
      age: "",
      relation: "",
    },
  });
  const [incomeData, setIncomeData] = useState<IIncomeSources | undefined>(
    undefined,
  );
  const [isAutoCompleted, setIsAutoCompleted] = useState(false);
  const [financialObligationsData] = useState<string[]>([]);

  const dataBorrower: BorrowerData[] = [
    {
      borrowerName: formData.personalInfo.firstName,
      borrowerType: "Borrower",
      borrowerIdentificationType: formData.personalInfo.tipeOfDocument,
      borrowerIdentificationNumber:
        formData.personalInfo.documentNumber.toString(),
      borrowerProperties: [
        {
          propertyName: "PeriodicSalary",
          propertyValue: incomeData?.PeriodicSalary?.toString() || "0",
        },
        {
          propertyName: "PersonalBusinessUtilities",
          propertyValue:
            incomeData?.PersonalBusinessUtilities?.toString() || "0",
        },
        {
          propertyName: "ProfessionalFees",
          propertyValue: incomeData?.ProfessionalFees?.toString() || "0",
        },
        {
          propertyName: "Dividends",
          propertyValue: incomeData?.Dividends?.toString() || "0",
        },
        {
          propertyName: "FinancialIncome",
          propertyValue: incomeData?.FinancialIncome?.toString() || "0",
        },
        {
          propertyName: "Leases",
          propertyValue: incomeData?.Leases?.toString() || "0",
        },
        {
          propertyName: "OtherNonSalaryEmoluments",
          propertyValue:
            incomeData?.OtherNonSalaryEmoluments?.toString() || "0",
        },
        {
          propertyName: "PensionAllowances",
          propertyValue: incomeData?.PensionAllowances?.toString() || "0",
        },
        // Obligaciones financieras capturadas en el formulario
        ...financialObligationsData.map((obligation) => ({
          propertyName: "FinancialObligation",
          propertyValue: obligation,
        })),
        {
          propertyName: "name",
          propertyValue: formData.personalInfo.firstName,
        },
        {
          propertyName: "surname",
          propertyValue: formData.personalInfo.lastName,
        },
        {
          propertyName: "email",
          propertyValue: formData.personalInfo.email,
        },
        {
          propertyName: "biological_sex",
          propertyValue: formData.personalInfo.sex,
        },
        {
          propertyName: "phone_number",
          propertyValue: formData.personalInfo.phone,
        },
        {
          propertyName: "birth_date",
          propertyValue: "1987-01-02T15:04:05Z",
        },
        {
          propertyName: "relationship",
          propertyValue: formData.personalInfo.relation,
        },
      ],
    },
  ];

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: "Error Fuentes de ingreso",
      description: `Error al traer los datos: ${error}`,
      appearance: "danger",
      duration: 5000,
    });
  };

  const borrowerId = formData.personalInfo.documentNumber.toString();

  // Función para mapear IPayment[]
  // const mapPaymentsToObligations = (payments: string[]) => {
  //   return payments.map((payment) => {
  //     // Buscar valores en las opciones
  //     const nextPaymentOption = payment.options.find((opt) =>
  //       opt.label.includes("Próximo"),
  //     );
  //     const totalOption = payment.options.find((opt) =>
  //       opt.label.includes("total"),
  //     );

  //     return {
  //       obligationNumber: payment.id,
  //       productName: payment.title,
  //       paymentMethodName: payment.paymentMethodName,
  //       balanceObligationTotal: totalOption?.value || 0,
  //       nextPaymentValueTotal: nextPaymentOption?.value || 0,
  //       entity: "fondecom", // Valor por defecto o extraer de otra fuente
  //       duesPaid: 0, // Estos valores necesitarían venir de otra fuente
  //       outstandingDues: 0,
  //     };
  //   });
  // };

  function capitalizeKeysExceptSome<T>(
    obj: Record<string, unknown>,
    exclude: string[] = [],
  ): T {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = exclude.includes(key)
        ? key
        : key.charAt(0).toUpperCase() + key.slice(1);

      result[newKey] = value;
    }

    return result as unknown as T;
  }

  useEffect(() => {
    if (!borrowerId) return;

    const allFieldsFilled = Object.values(formData.personalInfo).every(
      (value) => value !== "" && value !== null && value !== undefined,
    );

    if (allFieldsFilled && !isAutoCompleted) {
      return;
    }

    const fetchIncomeData = async () => {
      try {
        const customer = await getSearchCustomerByCode(
          borrowerId,
          businessUnitPublicCode || "",
          businessManagerCode,
          true,
        );

        if (
          !customer ||
          !customer.generalAttributeClientNaturalPersons ||
          customer.generalAttributeClientNaturalPersons.length === 0
        ) {
          setIsAutoCompleted(false);
          return;
        }

        const response = await getIncomeSourcesById(
          borrowerId,
          businessUnitPublicCode || "",
          businessManagerCode,
        );

        const obligations = await getCreditPayments(
          borrowerId,
          businessUnitPublicCode || "",
          businessManagerCode,
        );
        console.log("obligations", obligations);

        // Mapear IPayment[] a la estructura esperada
        /* const mappedObligations = obligations
          ? mapPaymentsToObligations(obligations)
          : [];
        setFinancialObligationsData(mappedObligations);
*/
        const formattedData = capitalizeKeysExceptSome<IIncomeSources>(
          response as unknown as Record<string, unknown>,
          ["name", "surname", "identificationNumber", "identificationType"],
        );

        setIncomeData(formattedData);

        const data = customer.generalAttributeClientNaturalPersons[0];

        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            tipeOfDocument: data?.typeIdentification || "",
            documentNumber: prev.personalInfo.documentNumber,
            firstName: data?.firstNames || "",
            lastName: data?.lastNames || "",
            email: data?.emailContact || "",
            phone: data?.cellPhoneContact || "",
            sex: data?.gender || "",
            age: getAge(data?.dateBirth || "").toString(),
            relation: prev.personalInfo.relation,
          },
        }));

        setIsAutoCompleted(true);
      } catch (error) {
        handleFlag(error);
        setIsAutoCompleted(false);
      }
    };

    fetchIncomeData();
  }, [borrowerId, businessUnitPublicCode, businessManagerCode]);

  useEffect(() => {
    if (!isAutoCompleted) {
      setIncomeData(
        (prev) =>
          ({
            ...prev,
            name: formData.personalInfo.firstName,
            surname: formData.personalInfo.lastName,
            identificationNumber: formData.personalInfo.documentNumber,
            identificationType: formData.personalInfo.tipeOfDocument,
          }) as IIncomeSources,
      );
    }
  }, [formData.personalInfo, isAutoCompleted]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const steps = Object.values(stepsAddBorrower);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  ) || { id: 0, number: 0, name: "", description: "" };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsCurrentFormValid(true);
    }
  };

  function handleSubmitClick() {
    onAddBorrower(dataBorrower);
    handleClose();
  }

  const handleFormChange = (updatedValues: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  const handleIncomeChange = (updatedIncomeData: Partial<IIncomeSources>) => {
    setIncomeData((prev) => {
      if (!prev) {
        return {
          Dividends: 0,
          FinancialIncome: 0,
          identificationNumber: "",
          identificationType: "",
          Leases: 0,
          OtherNonSalaryEmoluments: 0,
          PensionAllowances: 0,
          PeriodicSalary: 0,
          PersonalBusinessUtilities: 0,
          ProfessionalFees: 0,
          name: "",
          surname: "",
          ...updatedIncomeData,
        };
      }
      return {
        ...prev,
        ...updatedIncomeData,
      };
    });
  };

  // Transformar formData en la estructura de prospectData para los pasos 2 y 3
  // Si hay datos autocompletados del backend, se mapean en borrowerProperties
  const transformedProspectData: IProspect = {
    ...prospectData,
    borrowers: [
      {
        borrowerName:
          `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim() ||
          "Sin nombre",
        borrowerType: "Borrower",
        borrowerIdentificationType: formData.personalInfo.tipeOfDocument,
        borrowerIdentificationNumber:
          formData.personalInfo.documentNumber.toString(),
        borrowerProperties: [
          // Si hay datos autocompletados, incluir las obligaciones financieras
          ...financialObligationsData.map(() => ({
            propertyName: "FinancialObligation",
            propertyValue: "xxxx",
            // `${obligation.productName}, ${obligation.balanceObligationTotal}, ${obligation.nextPaymentValueTotal}, ${obligation.entity}, ${obligation.paymentMethodName}, ${obligation.obligationNumber}, ${obligation.duesPaid}, ${obligation.outstandingDues}`,
          })),
          // Mantener las propiedades originales del prospectData si existen
          ...(prospectData?.borrowers?.[0]?.borrowerProperties?.filter(
            (prop) => prop.propertyName !== "FinancialObligation",
          ) || []),
        ],
      },
    ],
  };

  return (
    <DebtorAddModalUI
      steps={steps}
      currentStep={currentStep}
      isCurrentFormValid={isCurrentFormValid}
      setIsCurrentFormValid={setIsCurrentFormValid}
      formData={formData}
      incomeData={incomeData}
      AutoCompleted={isAutoCompleted}
      prospectData={transformedProspectData}
      financialObligationsData={{
        customerName:
          `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim() ||
          "Sin nombre",
        customerIdentificationType: formData.personalInfo.tipeOfDocument,
        customerIdentificationNumber:
          formData.personalInfo.documentNumber.toString(),
        obligations: financialObligationsData,
      }}
      setFinancialObligationsData={() => {}}
      handleFormChange={handleFormChange}
      handleIncomeChange={handleIncomeChange}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      setCurrentStep={setCurrentStep}
      currentStepsNumber={currentStepsNumber}
      handleSubmitClick={handleSubmitClick}
      handleClose={handleClose}
      businessUnitPublicCode={businessUnitPublicCode || ""}
      businessManagerCode={businessManagerCode}
      title={title}
      isMobile={isMobile}
      customerData={customerData}
    />
  );
}
