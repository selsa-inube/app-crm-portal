import { useEffect, useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { getIncomeSourcesById } from "@services/creditLimit/getIncomeSources";
import { IIncomeSources } from "@services/creditLimit/types";
import { getSearchCustomerByCode } from "@services/customer/SearchCustomerCatalogByCode";
import { getAge } from "@utils/formatData/currency";
import { IProspect } from "@services/prospect/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { getFinancialObligations } from "@pages/simulateCredit/steps/extraDebtors/utils";
import { IObligations } from "@pages/prospect/components/TableObligationsFinancial/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { transformObligationsToBorrowerProperties } from "../DebtorEditModal/utils";
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
  lang: EnumType;
  enums: IAllEnumsResponse;
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
    lang,
    enums,
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
  const [financialObligationsData, setFinancialObligationsData] = useState<
    IObligations[]
  >([]);

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
        ...transformObligationsToBorrowerProperties(financialObligationsData),
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
    if (!borrowerId || isCurrentFormValid) return;

    const allFieldsFilled = Object.values(formData.personalInfo).every(
      (value) => value !== "" && value !== null && value !== undefined,
    );

    if (
      !allFieldsFilled &&
      customerData?.publicCode.toString() ===
        formData.personalInfo.documentNumber.toString()
    ) {
      return;
    }

    const fetchIncomeData = async () => {
      try {
        if (customerData === undefined) return;

        const customer = await getSearchCustomerByCode(
          borrowerId,
          businessUnitPublicCode || "",
          businessManagerCode,
          true,
          customerData.token,
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
          customerData.token,
        );

        const financialObligationsData = await getFinancialObligations(
          customer.publicCode,
          businessUnitPublicCode || "",
          businessManagerCode,
          customerData.token,
        );
        setFinancialObligationsData(financialObligationsData || []);

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
  }, [
    borrowerId,
    businessUnitPublicCode,
    businessManagerCode,
    isCurrentFormValid,
    isAutoCompleted,
  ]);

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
          ...transformObligationsToBorrowerProperties(financialObligationsData),
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
      setFinancialObligationsData={setFinancialObligationsData}
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
      enums={enums}
      lang={lang}
    />
  );
}
