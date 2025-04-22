import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { postSubmitCredit } from "@services/submitCredit";
import { getSearchProspectById } from "@services/prospects";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { getMonthsElapsed } from "@utils/formatData/currency";

import { stepsFilingApplication } from "./config/filingApplication.config";
import { SubmitCreditApplicationUI } from "./interface";
import { FormData } from "./types";
import { evaluateRule } from "./evaluateRule";
import { ruleConfig } from "./config/configRules";

export function SubmitCreditApplication() {
  const { customerPublicCode, prospectCode } = useParams();
  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [sentModal, setSentModal] = useState(false);
  const [approvedRequestModal, setApprovedRequestModal] = useState(false);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  // const updatedSteps = {
  //   ...stepsFilingApplication,
  //   BorrowerData: {
  //     ...stepsFilingApplication.BorrowerData,
  //     name: data.stepName,
  //     description: data.stepDescription,
  //   },
  // };

  const dataHeader = {
    name: customerData?.fullName ?? "",
    status:
      customerData?.generalAssociateAttributes[0].partnerStatus.substring(2) ??
      "",
  };

  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prospectData, setProspectData] = useState<Record<string, any>>({});

  const [valueRule, setValueRule] = useState<{ [ruleName: string]: string[] }>(
    {},
  );

  const [formData, setFormData] = useState<FormData>({
    contactInformation: {
      document: "",
      documentNumber: "",
      name: "",
      lastName: "",
      email: "",
      phone: "",
    },
    borrowerData: {
      borrowers: {},
      initialBorrowers: {
        id: "",
        name: "",
        debtorDetail: {
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
    },
    propertyOffered: {
      antique: "",
      estimated: "",
      type: "",
      state: "",
      description: "",
    },
    vehicleOffered: {
      state: "",
      model: "",
      value: "",
      description: "",
    },
    bail: {
      client: false,
    },
    disbursementGeneral: {
      amount: 10000000,
      Internal: {
        amount: "",
        account: "",
        description: "",
        name: "",
        lastName: "",
        sex: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
        check: false,
        toggle: true,
        documentType: "",
      },
      External: {
        amount: "",
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
        bank: "",
        accountType: "",
        accountNumber: "",
        documentType: "",
      },
      CheckEntity: {
        amount: "",
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
      CheckManagement: {
        amount: "",
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
      Cash: {
        amount: "",
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
    },
    attachedDocuments: {},
  });

  const hasBorrowers = Object.keys(formData.borrowerData.borrowers).length;
  const bondValue = prospectData.bond_value;

  const rule = useMemo(() => {
    const raw = valueRule?.["ModeOfDisbursementType"] || [];
    return (
      raw
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((v: any) => (typeof v === "string" ? v : v?.value))
        .filter(Boolean)
    );
  }, [valueRule]);

  const steps = useMemo(() => {
    if (!valueRule) return Object.values(stepsFilingApplication);
    const hideMortgage = valueRule["ValidationGuarantee"]?.includes("Hipoteca");
    const hidePledge = valueRule["ValidationGuarantee"]?.includes("Prenda");

    return Object.values(stepsFilingApplication).filter((step) => {
      if (step.id === 4 && hideMortgage) return false;
      if (step.id === 5 && hidePledge) return false;
      if (step.id === 6 && (hasBorrowers >= 1 || bondValue === 0)) {
        return false;
      }
      return true;
    });
  }, [valueRule, hasBorrowers, bondValue]);

  const [currentStep, setCurrentStep] = useState<number>(steps[0]?.id || 1);

  const {
    contactInformation,
    propertyOffered,
    vehicleOffered,
    disbursementGeneral,
    //attachedDocuments,
  } = formData;

  const submitData = {
    clientEmail: contactInformation.email,
    clientId: "33333",
    clientIdentificationNumber: contactInformation.documentNumber,
    clientIdentificationType: contactInformation.document,
    clientName: `${contactInformation.name} ${contactInformation.lastName}`,
    clientPhoneNumber: contactInformation.phone.toString(),
    clientType: "333333",
    justification: "",
    loanAmount: 155555,
    moneyDestinationAbreviatedName: "Vehiculo",
    moneyDestinationId: "13698",
    prospectCode: prospectData.prospect_code || "",
    prospectId: prospectData.prospect_id, //crypto.randomUUID().toString(),
    /*documents: Object.entries(attachedDocuments || {}).flatMap(
      ([, docsArray]) =>
        docsArray.map((doc) => ({
          id: doc.id,
          name: doc.name,
        }))
    ),*/
    guarantees: [
      {
        guaranteeType: `mortgage${crypto.randomUUID().toString()}`,
        transactionOperation: "Insert",
        mortgages: [
          {
            descriptionUse: propertyOffered.description || "none",
            propertyAge: propertyOffered.antique || 1,
            propertyPrice: propertyOffered.estimated || 1,
            propertyType: propertyOffered.state || "none",
            transactionOperation: "Insert",
          },
        ],
      },
      {
        guaranteeType: `pledge${crypto.randomUUID().toString()}`,
        transactionOperation: "Insert",
        pledges: [
          {
            descriptionUse: vehicleOffered.description || "none",
            transactionOperation: "Insert",
            vehiculeAge: vehicleOffered.model || new Date().getFullYear(),
            vehiculePrice: vehicleOffered.value || 1,
          },
        ],
      },
    ],
    modesOfDisbursement: Object.entries(disbursementGeneral)
      .filter(([, value]) => {
        return value.amount && value.amount !== "";
      })
      .map(([key, value]) => ({
        accountBankCode: "100",
        accountBankName: value.accountType || "none",
        accountNumber: value.accountNumber || "none",
        accountType: value.account?.split("- ")[1]?.trim() || "none",
        disbursementAmount: value.amount || 1,
        disbursementDate: "01/01/2025",
        isInTheNameOfBorrower: value.check ? "Y" : "N",
        modeOfDisbursementCode: "<string>",
        modeOfDisbursementType: key,
        observation: value.description || "none",
        payeeBiologicalSex: value.sex === "man" ? "M" : "F",
        payeeBirthday: value.birthdate || "01/01/2000",
        payeeCityOfResidence: value.city || "none",
        payeeEmail: value.mail || "none",
        payeeIdentificationNumber: value.identification || "none",
        payeeIdentificationType: value.documentType || "none",
        payeeName: value.name || "none",
        payeePersonType: "N",
        payeePhoneNumber: value.phone || "none",
        payeeSurname: value.lastName || "none",
        transactionOperation: "Insert",
      })),
  };

  const handleSubmit = async () => {
    try {
      console.log("Enviando datos:", submitData);
      const response = await postSubmitCredit(
        businessUnitPublicCode,
        userAccount,
        submitData,
      );
      console.log("Solicitud enviada con éxito:", response);
      setSentModal(false);
      setApprovedRequestModal(true);
    } catch (error) {
      setSentModal(false);
      handleFlag();
    }
  };

  const isMobile = useMediaQuery("(max-width:880px)");
  const { addFlag } = useFlag();

  const handleFlag = () => {
    addFlag({
      title: "Error al enviar el radicado",
      description: "El radicado no se ha podido enviar correctamente.",
      appearance: "danger",
      duration: 5000,
    });
  };

  const fetchProspectData = useCallback(async () => {
    try {
      const prospect = await getSearchProspectById(
        businessUnitPublicCode,
        prospectCode || "",
      );
      if (prospect && typeof prospect === "object") {
        if (JSON.stringify(prospect) !== JSON.stringify(prospectData)) {
          setProspectData(prospect);
        }
      }
      const mainBorrower = prospect.borrowers.find(
        (borrower) => borrower.borrower_type === "main_borrower",
      );

      if (mainBorrower?.borrower_identification_number !== customerPublicCode) {
        setCodeError(1011);
        return;
      }

      if (prospect.state !== "Created") {
        setCodeError(1012);
        return;
      }
    } catch (error) {
      setCodeError(1010);
    }
  }, [businessUnitPublicCode, customerPublicCode, prospectCode, prospectData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanConditions = (rule: any) => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: { value: unknown }) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        delete cleaned.conditions;
      }
    }
    return cleaned;
  };

  const fetchValidationRules = useCallback(async () => {
    const rulesToCheck = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];
    const notDefinedRules: string[] = [];
    await Promise.all(
      rulesToCheck.map(async (ruleName) => {
        try {
          const rule = cleanConditions(ruleConfig[ruleName]?.({}));
          if (!rule) return notDefinedRules.push(ruleName);
          await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.response?.status === 400) notDefinedRules.push(ruleName);
        }
      }),
    );

    if (notDefinedRules.length) {
      setCodeError(1013);
      setAddToFix(notDefinedRules);
    }
  }, [businessUnitPublicCode]);

  useEffect(() => {
    fetchProspectData();
    fetchValidationRules();
  }, [fetchProspectData, fetchValidationRules]);

  const fetchValidationRulesData = useCallback(async () => {
    setCodeError(null);
    setAddToFix([]);
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = prospectData?.credit_products;

    if (!clientInfo || !creditProducts?.length) return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      LoanAmount: prospectData.requested_amount,
      PrimaryIncomeType: "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rulesValidate = [
      "ModeOfDisbursementType",
      "ValidationGuarantee",
      "ValidationCoBorrower",
    ];

    for (const product of creditProducts) {
      if (!product || typeof product !== "object") continue;

      const dataRules = {
        ...dataRulesBase,
        LineOfCredit: product.line_of_credit_abbreviated_name,
      };
      await Promise.all(
        rulesValidate.map(async (ruleName) => {
          const rule = ruleConfig[ruleName]?.(dataRules);
          if (!rule) return;

          try {
            const values = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
            );

            const extractedValues = Array.isArray(values)
              ? values
                  .map((v) => (typeof v === "string" ? v : (v?.value ?? "")))
                  .filter((val): val is string => val !== "")
              : [];

            if (
              ruleName === "ModeOfDisbursementType" &&
              extractedValues.length === 0
            ) {
              setCodeError(1014);
              setAddToFix(["ModeOfDisbursementType"]);
              return;
            }

            setValueRule((prev) => {
              const current = prev[ruleName] || [];
              const merged = [...current, ...extractedValues];
              const unique = Array.from(new Set(merged));
              return { ...prev, [ruleName]: unique };
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error(
              `Error evaluando ${ruleName} para producto`,
              product,
              error,
            );
          }
        }),
      );
    }
  }, [customerData, prospectData, businessUnitPublicCode]);

  useEffect(() => {
    if (customerData && prospectData) {
      fetchValidationRulesData();
    }
  }, [customerData, prospectData, fetchValidationRulesData]);

  const handleFormChange = (updatedValues: Partial<FormData>) => {
    setFormData((prev) => {
      if (
        JSON.stringify(prev) !== JSON.stringify({ ...prev, ...updatedValues })
      ) {
        return {
          ...prev,
          ...updatedValues,
        };
      }
      return prev;
    });
  };

  const handleNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else if (currentStep === steps[steps.length - 1].id) {
      handleSubmitClick();
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      setIsCurrentFormValid(true);
    }
  };

  function handleSubmitClick() {
    setSentModal(true);
  }

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepsNumber = {
    ...steps[currentStepIndex],
    number: currentStepIndex + 1,
  };

  return (
    <>
      <SubmitCreditApplicationUI
        steps={steps}
        currentStep={currentStep}
        isCurrentFormValid={isCurrentFormValid}
        setIsCurrentFormValid={setIsCurrentFormValid}
        formData={formData}
        dataHeader={dataHeader}
        prospectCode={prospectCode || ""}
        sentModal={sentModal}
        approvedRequestModal={approvedRequestModal}
        numberProspectCode={prospectCode || ""}
        setApprovedRequestModal={setApprovedRequestModal}
        setSentModal={setSentModal}
        handleFormChange={handleFormChange}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
        setCurrentStep={setCurrentStep}
        currentStepsNumber={currentStepsNumber}
        handleSubmitClick={handleSubmitClick}
        handleSubmit={handleSubmit}
        isMobile={isMobile}
        data={prospectData}
        customerData={customerData}
        codeError={codeError}
        addToFix={addToFix}
        rule={rule}
      />
    </>
  );
}
