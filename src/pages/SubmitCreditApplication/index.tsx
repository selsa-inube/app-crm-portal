import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { postSubmitCredit } from "@services/submitCredit";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { getSearchProspectByCode } from "@services/prospects/AllProspects";

import { stepsFilingApplication } from "./config/filingApplication.config";
import { SubmitCreditApplicationUI } from "./interface";
import { IFormData } from "./types";
import { evaluateRule } from "./evaluateRule";
import { ruleConfig } from "./config/configRules";
import { dataSubmitApplication, tittleOptions } from "./config/config";
import { getSearchProspectSummaryById } from "@src/services/prospects/ProspectSummaryById";
import { IProspectSummaryById } from "@src/services/prospects/ProspectSummaryById/types";

export function SubmitCreditApplication() {
  const { customerPublicCode, prospectCode } = useParams();
  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [sentModal, setSentModal] = useState(false);
  const [approvedRequestModal, setApprovedRequestModal] = useState(false);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>();
  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

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

  const [formData, setFormData] = useState<IFormData>({
    contactInformation: {
      document: "",
      documentNumber: "",
      name: "",
      lastName: "",
      email: "",
      phone: "",
      whatsAppPhone: "",
      toggleChecked: true,
    },
    borrowerData: {
      borrowers: {},
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
      amount: "",
      Internal_account: {
        amount: "",
        accountNumber: "",
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
      External_account: {
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
      Certified_check: {
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
      Business_check: {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasBorrowers = Object.keys(formData.borrowerData.borrowers).length;
  const bondValue = prospectData.bondValue;
  const getRuleByName = useCallback(
    (ruleName: string) => {
      const raw = valueRule?.[ruleName] || [];
      return (
        raw
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((v: any) => (typeof v === "string" ? v : v?.value))
          .filter(Boolean)
      );
    },
    [valueRule],
  );

  const steps = useMemo(() => {
    if (!valueRule) return Object.values(stepsFilingApplication);
    const hideMortgage = valueRule["ValidationGuarantee"]?.includes("Mortgage");
    const hidePledge = valueRule["ValidationGuarantee"]?.includes("Pledge");
    const hasCoborrower =
      valueRule["ValidationCoborrower"]?.includes("Coborrower") ?? false;

    return Object.values(stepsFilingApplication)
      .map((step) => {
        if (step.id === 3 && hasBorrowers === 1 && hasCoborrower === true) {
          return {
            ...step,
            name: dataSubmitApplication.coBorrowers.stepName,
            description: dataSubmitApplication.coBorrowers.stepDescription,
          };
        }

        return step;
      })
      .filter((step) => {
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
    attachedDocuments,
  } = formData;

  const submitData = new FormData();
  submitData.append("clientEmail", contactInformation.email);
  submitData.append("clientId", "33333");
  submitData.append(
    "clientIdentificationNumber",
    contactInformation.documentNumber,
  );
  submitData.append("clientIdentificationType", contactInformation.document);
  submitData.append(
    "clientName",
    `${contactInformation.name} ${contactInformation.lastName}`,
  );
  submitData.append("clientPhoneNumber", contactInformation.phone.toString());
  submitData.append(
    "clientType",
    customerData?.generalAttributeClientNaturalPersons?.[0].associateType,
  );
  submitData.append("justification", "Radicación con éxito");
  submitData.append("loanAmount", "2000000");
  submitData.append(
    "moneyDestinationAbreviatedName",
    prospectData.money_destination_abbreviated_name,
  );
  submitData.append("moneyDestinationId", "13698");
  submitData.append("prospectCode", prospectData.prospect_code);
  submitData.append("prospectId", prospectData.prospect_id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadataArray: any[] = [];
  Object.entries(attachedDocuments || {}).forEach(([, docsArray]) => {
    docsArray.forEach((doc) => {
      submitData.append("file", doc.file);
      metadataArray.push({
        abbreviatedName: doc.name.split(".").slice(0, -1).join("."),
        transactionOperation: "Insert",
      });
    });
  });
  submitData.append("documents", JSON.stringify(metadataArray));

  const guarantees = [];

  if (getRuleByName("ValidationGuarantee")?.includes("Mortgage")) {
    guarantees.push({
      guaranteeType: "mortgage",
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
    });
  }
  if (getRuleByName("ValidationGuarantee")?.includes("Pledge")) {
    guarantees.push({
      guaranteeType: "pledge",
      transactionOperation: "Insert",
      pledges: [
        {
          descriptionUse: vehicleOffered.description || "none",
          vehiculeAge: Number(vehicleOffered.model || new Date().getFullYear()),
          vehiculePrice: vehicleOffered.value || 1,
          transactionOperation: "Insert",
        },
      ],
    });
  }
  submitData.append("guarantees", JSON.stringify(guarantees));

  const disbursements = Object.entries(disbursementGeneral)
    .filter(([, value]) => value.amount && value.amount !== "")
    .map(([key, value]) => ({
      accountBankCode: "100",
      accountBankName: value.bank,
      accountNumber: value.accountNumber,
      accountType: value.accountType,
      disbursementAmount: value.amount,
      disbursementDate: new Date().toISOString().split("T")[0],
      isInTheNameOfBorrower: value.toggle ? "Y" : "N",
      modeOfDisbursementCode: "<>",
      modeOfDisbursementType: key,
      observation: value.description || "",
      payeeBiologicalSex: value.sex === "man" ? "M" : "F",
      payeeBirthday: value.birthdate,
      payeeCityOfResidence: value.city,
      payeeEmail: value.mail,
      payeeIdentificationNumber: value.identification,
      payeeIdentificationType: value.documentType,
      payeeName: value.name,
      payeePersonType: "N",
      payeePhoneNumber: value.phone || "none",
      payeeSurname: value.lastName || "none",
      transactionOperation: "Insert",
    }));
  submitData.append("modesOfDisbursement", JSON.stringify(disbursements));

  const handleSubmit = async () => {
    try {
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
      const prospect = await getSearchProspectByCode(
        businessUnitPublicCode,
        prospectCode || "",
      );

      if (prospect && typeof prospect === "object") {
        if (JSON.stringify(prospect) !== JSON.stringify(prospectData)) {
          setProspectData(prospect);
        }
      }
      const mainBorrower = prospect.borrowers.find(
        (borrower) => borrower.borrowerType === "MainBorrower",
      );

      if (mainBorrower?.borrowerIdentificationNumber !== customerPublicCode) {
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

    if (notDefinedRules.length >= 1) {
      setCodeError(1013);
      setAddToFix(notDefinedRules);
    }
  }, [businessUnitPublicCode]);

  useEffect(() => {
    if (!customerData) return;
    fetchProspectData();
  }, [customerData, fetchProspectData]);

  useEffect(() => {
    if (!customerData || !prospectData) return;
    fetchValidationRules();
  }, [customerData, prospectData, fetchValidationRules]);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    const creditProducts = prospectData?.creditProducts;

    if (!clientInfo.associateType || !creditProducts?.length || !prospectData)
      return;

    const dataRulesBase = {
      ClientType: clientInfo.associateType?.substring(0, 1) || "",

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
        LineOfCredit: product.lineOfCreditAbbreviatedName,
        LoanAmount: product.loanAmount,
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
              setAddToFix([ruleName]);
              return;
            }
            setValueRule((prev) => {
              const current = prev[ruleName] || [];
              const merged = [...current, ...extractedValues];
              const unique = Array.from(new Set(merged));
              return { ...prev, [ruleName]: unique };
            });
          } catch (error: unknown) {
            if (ruleName === "ModeOfDisbursementType") {
              setCodeError(1014);
              setAddToFix([ruleName]);
              return;
            }
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

  const handleFormChange = (updatedValues: Partial<IFormData>) => {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          prospectData?.prospectId,
        );
        if (result) {
          setProspectSummaryData(result);
        }
      } catch (error) {
        addFlag({
          title: tittleOptions.titleError,
          description: JSON.stringify(error),
          appearance: "danger",
          duration: 6000,
        });
      }
    };

    if (prospectData?.prospectId) {
      fetchData();
    }
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  useEffect(() => {
    if (prospectSummaryData?.netAmountToDisburse) {
      setFormData((prev) => ({
        ...prev,
        disbursementGeneral: {
          ...prev.disbursementGeneral,
          amount: prospectSummaryData.netAmountToDisburse,
        },
      }));
    }
  }, [prospectSummaryData]);

  return (
    <>
      <SubmitCreditApplicationUI
        steps={steps}
        currentStep={currentStep}
        isCurrentFormValid={isCurrentFormValid}
        setIsCurrentFormValid={setIsCurrentFormValid}
        formData={formData}
        dataHeader={dataHeader}
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
        prospectData={prospectData}
        customerData={customerData}
        codeError={codeError}
        addToFix={addToFix}
        getRuleByName={getRuleByName}
        prospectSummaryData={prospectSummaryData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
