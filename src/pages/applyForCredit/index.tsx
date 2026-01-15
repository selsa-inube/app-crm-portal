import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { postSubmitCredit } from "@services/creditRequest/submitCredit";
import { getSearchProspectByCode } from "@services/prospect/SearchAllProspects";
import { getSearchProspectSummaryById } from "@services/prospect/GetProspectSummaryById";
import {
  IBorrower,
  IProspect,
  IProspectSummaryById,
} from "@services/prospect/types";
import { MessagingPlatform } from "@services/enum/icorebanking-vi-crediboard/messagingPlatform";
import { IDocumentsCredit } from "@services/creditRequest/types";
import { getGuaranteesRequiredByCreditProspect } from "@services/prospect/guaranteesRequiredByCreditProspect";
import { useEnum } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { stepsFilingApplication } from "./config/filingApplication.config";
import { ApplyForCreditUI } from "./interface";
import { IFormData } from "./types";
import {
  dataSubmitApplication,
  prospectStates,
  tittleOptions,
} from "./config/config";
import { getSearchAllModesOfDisbursementTypes } from "@services/lineOfCredit/getSearchAllModesOfDisbursementTypes";

export function ApplyForCredit() {
  const { prospectCode } = useParams();
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const { customerData } = useContext(CustomerContext);
  const [sentModal, setSentModal] = useState(false);
  const [approvedRequestModal, setApprovedRequestModal] = useState(false);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [creditRequestCode, setCreditRequestCode] = useState("");
  const [loading, setLoading] = useState(false);

  const customerPublicCode: string = customerData.publicCode;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { lang, enums } = useEnum();

  if (!businessManagerCode && codeError === null) {
    setCodeError(1003);
  } else if (!customerPublicCode && codeError === null) {
    setCodeError(400);
  }

  const dataHeader = {
    name: customerData?.fullName ?? "",
    status:
      customerData?.generalAssociateAttributes[0].partnerStatus.substring(2) ??
      "",
  };

  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [modesOfDisbursement, setModesOfDisbursement] = useState<string[]>([]);
  const [prospectData, setProspectData] = useState<IProspect>({
    prospectId: "",
    prospectCode: "",
    state: "",
    requestedAmount: 0,
    installmentLimit: 0,
    termLimit: 0,
    timeOfCreation: new Date(),
    selectedRegularPaymentSchedule: "",
    selectedRateType: "",
    preferredPaymentChannelAbbreviatedName: "",
    gracePeriod: 0,
    gracePeriodType: "",
    moneyDestinationAbbreviatedName: "",
    bondValue: 0,
    creditScore: "",
    modifyJustification: "",
    clientManagerIdentificationNumber: "",
    clientManagerName: "",
    clientManagerObservation: "",
    clientComments: "",
    borrowers: [],
    consolidatedCredits: [],
    creditProducts: [],
    outlays: [],
  });

  const [formData, setFormData] = useState<IFormData>({
    contactInformation: {
      document: "",
      documentNumber: "",
      name: "",
      lastName: "",
      email: "",
      phone: "",
      phoneDial: "+57",
      whatsAppDial: "",
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
      amount: 0,
      Internal_account: {
        amount: 0,
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
        amount: 0,
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
        accountNumber: "0",
        documentType: "",
      },
      Certified_check: {
        amount: 0,
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
        amount: 0,
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
        amount: 0,
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
    observations: { relevantObservations: "" },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guaranteesRequired, setGuaranteesRequired] = useState<string[]>([]);

  const hasBorrowers = Object.keys(prospectData?.borrowers || {}).length;

  const bondValue = prospectData.bondValue;

  const steps = useMemo(() => {
    if (!guaranteesRequired) {
      return Object.values(stepsFilingApplication).map((step) => ({
        ...step,
        name: typeof step.name === "string" ? step.name : step.name.i18n[lang],
        description:
          typeof step.description === "string"
            ? step.description
            : step.description.i18n[lang],
      }));
    }
    const hideMortgage = guaranteesRequired.includes("Mortgage");
    const hidePledge = guaranteesRequired.includes("Pledge");
    const hasCoborrower =
      guaranteesRequired.includes("Coborower") ||
      guaranteesRequired.includes("Borrower");
    const hasBond = guaranteesRequired.includes("Bond") ?? false;

    return Object.values(stepsFilingApplication)
      .map((step) => {
        if (step.id === 3 && hasBorrowers === 1 && hasCoborrower === true) {
          return {
            ...step,
            name: dataSubmitApplication.coBorrowers.stepName.i18n[lang],
            description:
              dataSubmitApplication.coBorrowers.stepDescription.i18n[lang],
          };
        }

        return {
          ...step,
          name:
            typeof step.name === "string" ? step.name : step.name.i18n[lang],
          description:
            typeof step.description === "string"
              ? step.description
              : step.description.i18n[lang],
        };
      })
      .filter((step) => {
        if (step.id === 3 && hasBorrowers === 1 && !hasCoborrower) return false;
        if (step.id === 4 && !hideMortgage) return false;
        if (step.id === 5 && !hidePledge) return false;
        if (step.id === 6 && (hasBorrowers >= 2 || !hasBond)) {
          return false;
        }
        return true;
      });
  }, [guaranteesRequired, hasBorrowers, bondValue, lang]);

  const [currentStep, setCurrentStep] = useState<number>(
    stepsFilingApplication.generalInformation.id,
  );

  const {
    contactInformation,
    propertyOffered,
    vehicleOffered,
    disbursementGeneral,
    attachedDocuments,
    observations,
  } = formData;

  const submitData = new FormData();

  const borrowersArray = Array.isArray(formData.borrowerData.borrowers)
    ? formData.borrowerData.borrowers
    : [];

  const borrowers = borrowersArray.map((borrower: IBorrower) => ({
    borrowerIdentificationNumber: borrower.borrowerIdentificationNumber,
    borrowerIdentificationType: borrower.borrowerIdentificationType,
    borrowerName: borrower.borrowerName,
    borrowerProperties: borrower.borrowerProperties.map((prop) => ({
      propertyName: prop.propertyName,
      propertyValue: prop.propertyValue,
    })),
    borrowerType: borrower.borrowerType,
  }));

  const showBorrowers = steps?.some((step) => step.id === 3);
  const borrowersToSend = showBorrowers
    ? borrowers
    : prospectData.borrowers || [];
  submitData.append("borrowers", JSON.stringify(borrowersToSend));

  submitData.append("clientEmail", contactInformation.email);
  submitData.append("clientId", customerData.customerId);
  submitData.append(
    "clientIdentificationNumber",
    contactInformation.documentNumber,
  );
  submitData.append("clientIdentificationType", contactInformation.document);
  submitData.append(
    "clientName",
    `${contactInformation.name} ${contactInformation.lastName}`,
  );
  submitData.append(
    "clientManagerObservation",
    observations.relevantObservations,
  );
  submitData.append("clientPhoneNumber", contactInformation.phone.toString());
  submitData.append(
    "clientType",
    customerData?.generalAttributeClientNaturalPersons?.[0].associateType,
  );
  submitData.append(
    "justification",
    formData.observations.relevantObservations,
  );
  submitData.append("loanAmount", prospectData.requestedAmount.toString());
  submitData.append(
    "moneyDestinationAbbreviatedName",
    prospectData.moneyDestinationAbbreviatedName,
  );
  submitData.append("prospectCode", prospectData.prospectCode);
  submitData.append("prospectId", prospectData.prospectId);

  submitData.append(
    "instantMessagingPlatforms",
    JSON.stringify([
      {
        instantMessagingPlatformName: MessagingPlatform[0].Value,
        propertyName:
          formData.contactInformation.whatsAppDial ||
          formData.contactInformation.phoneDial,
        propertyValue: `${formData.contactInformation.whatsAppDial} ${formData.contactInformation.whatsAppPhone} || ${formData.contactInformation.phoneDial} ${formData.contactInformation.phone}`,
        transactionOperation: "Insert",
      },
    ]),
  );

  const metadataArray: IDocumentsCredit[] = [];
  Object.entries(attachedDocuments || {}).forEach(([, docsArray]) => {
    docsArray.forEach((doc) => {
      submitData.append("file", doc.file);
      metadataArray.push({
        abbreviatedName: doc.name.split(".").slice(0, -1).join("."),
        documentCode: doc.id.slice(0, 10),
        documentId: doc.id.slice(0, 10),
        fileName: doc.name,
        requirementReference: doc.name,
        transactionOperation: "Insert",
      });
    });
  });

  submitData.append("documents", JSON.stringify(metadataArray));

  const guarantees = [];
  if (guaranteesRequired.includes("Mortgage")) {
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
  if (guaranteesRequired.includes("Pledge")) {
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
      accountBankCode: value.bank || businessUnitPublicCode,
      accountBankName: value.bank || businessUnitPublicCode,
      accountNumber: value.accountNumber || "0",
      accountType: value.accountType || "CH",
      disbursementAmount: value.amount,
      disbursementDate: new Date().toISOString().split("T")[0],
      isInTheNameOfBorrower: value.toggle ? "Y" : "N",
      modeOfDisbursementType: key,
      observation: value.description || "",
      payeeBiologicalSex: value.sex === "man" ? "M" : "F",
      payeeBirthday: value.birthdate,
      payeeCityOfResidence: value.city,
      payeeEmail: value.mail,
      payeeIdentificationNumber: value.identification,
      payeeIdentificationType: value.documentType,
      payeeName: value.name,
      payeePersonType: "Natural_person",
      payeePhoneNumber: value.phone || "",
      payeeSurname: value.lastName || "",
      transactionOperation: "Insert",
    }));
  submitData.append("modesOfDisbursement", JSON.stringify(disbursements));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await postSubmitCredit(
        businessUnitPublicCode,
        businessManagerCode,
        eventData.user.identificationDocumentNumber || "",
        submitData,
      );

      setCreditRequestCode(response?.creditRequestCode || "");
      setApprovedRequestModal(true);
    } catch (error) {
      console.error("error: ", error);
      setSentModal(false);
      handleFlag();
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery("(max-width:880px)");

  const handleFlag = () => {
    setShowErrorModal(true);
    setMessageError(tittleOptions.errorSubmit.i18n[lang]);
  };

  const fetchProspectData = useCallback(async () => {
    try {
      const prospect = await getSearchProspectByCode(
        businessUnitPublicCode,
        businessManagerCode,
        prospectCode || "",
      );

      const mainBorrower = prospect.borrowers.find(
        (borrower) => borrower.borrowerType === "MainBorrower",
      );
      if (mainBorrower?.borrowerIdentificationNumber !== customerPublicCode) {
        setCodeError(1011);
        return;
      }

      if (prospect.state !== prospectStates.CREATED.i18n[lang]) {
        setCodeError(1012);
      }

      if (prospect && typeof prospect === "object") {
        if (JSON.stringify(prospect) !== JSON.stringify(prospectData)) {
          setProspectData(prospect);
        }
      }
    } catch (error) {
      setCodeError(1010);
    }
  }, [businessUnitPublicCode, customerPublicCode, prospectCode, prospectData]);

  useEffect(() => {
    const fetchDisbursementData = async () => {
      if (
        !prospectData.borrowers?.[0]?.borrowerIdentificationNumber ||
        !prospectData.creditProducts?.[0]?.lineOfCreditAbbreviatedName ||
        !prospectData.moneyDestinationAbbreviatedName
      ) {
        return;
      }

      try {
        const creditData = await getSearchAllModesOfDisbursementTypes(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.borrowers[0].borrowerIdentificationNumber,
          prospectData.creditProducts[0].lineOfCreditAbbreviatedName,
          prospectData.moneyDestinationAbbreviatedName,
          prospectData.creditProducts[0].loanAmount.toString(),
        );

        if (codeError) return;

        if (
          creditData?.modesOfDisbursementTypes &&
          creditData.modesOfDisbursementTypes.length > 0
        ) {
          setModesOfDisbursement(creditData.modesOfDisbursementTypes);
          setCodeError(null);
          setAddToFix([]);
        } else {
          setModesOfDisbursement([]);
          setCodeError(1014);
          setAddToFix(["ModeOfDisbursementType"]);
        }
      } catch (error) {
        setModesOfDisbursement([]);
        setCodeError(1014);
        setAddToFix(["ModeOfDisbursementType"]);
      }
    };

    fetchDisbursementData();
  }, [businessUnitPublicCode, businessManagerCode, prospectData]);

  useEffect(() => {
    if (!customerData || !customerPublicCode) return;
    fetchProspectData();
  }, [customerData, fetchProspectData]);

  const fetchGuaranteesRequired = useCallback(async () => {
    try {
      const response = await getGuaranteesRequiredByCreditProspect(
        businessUnitPublicCode,
        businessManagerCode,
        prospectCode || "",
      );

      if (!response) {
        setGuaranteesRequired([]);
        return;
      }

      let warrantiesArray: string[] = [];

      if (Array.isArray(response)) {
        warrantiesArray = response
          .map((item) => item.warranty?.trim())
          .filter(
            (warranty): warranty is string =>
              warranty !== undefined && warranty !== null && warranty !== "",
          );
      } else if (response.warranty) {
        if (Array.isArray(response.warranty)) {
          warrantiesArray = response.warranty
            .map((item) => item.warranty?.trim())
            .filter(
              (warranty): warranty is string =>
                warranty !== undefined && warranty !== null && warranty !== "",
            );
        } else if (typeof response.warranty === "string") {
          warrantiesArray = response.warranty
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");
        }
      }
      setGuaranteesRequired(warrantiesArray);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataSubmitApplication.error.i18n[lang]);
    }
  }, [businessUnitPublicCode, businessManagerCode, prospectCode]);

  useEffect(() => {
    if (prospectData?.prospectId) {
      fetchGuaranteesRequired();
    }
  }, [prospectData?.prospectId, fetchGuaranteesRequired]);

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
  const currentStep_ = steps[currentStepIndex];
  const currentStepsNumber = {
    ...currentStep_,
    number: currentStepIndex + 1,
    name:
      typeof currentStep_.name === "string"
        ? currentStep_.name
        : currentStep_.name,
    description:
      typeof currentStep_.description === "string"
        ? currentStep_.description
        : currentStep_.description,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
        );
        if (result) {
          setProspectSummaryData(result);
        }
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(tittleOptions.errorSummaryProspect.i18n[lang]);
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
      <ApplyForCreditUI
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
        currentStepNumber={currentStepsNumber}
        handleSubmitClick={handleSubmitClick}
        handleSubmit={handleSubmit}
        setShowErrorModal={setShowErrorModal}
        businessManagerCode={businessManagerCode}
        isMobile={isMobile}
        prospectData={prospectData as IProspect}
        customerData={customerData}
        codeError={codeError}
        addToFix={addToFix}
        prospectSummaryData={prospectSummaryData}
        isModalOpen={isModalOpen}
        showErrorModal={showErrorModal}
        messageError={messageError}
        setIsModalOpen={setIsModalOpen}
        businessUnitPublicCode={businessUnitPublicCode}
        setMessageError={setMessageError}
        creditRequestCode={creditRequestCode}
        modesOfDisbursement={modesOfDisbursement}
        guaranteesRequired={guaranteesRequired}
        loading={loading}
        enums={enums as IAllEnumsResponse}
        lang={lang}
      />
    </>
  );
}
