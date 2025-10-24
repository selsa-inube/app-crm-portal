import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Stack, useMediaQuery, Select, useFlag } from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";

import { changeUsersByCreditRequest } from "./utils";
import { txtFlags } from "../config";
import { ICreditRequests, IToDo } from "@src/services/creditRequest/types";
import { ICommercialManagerAndAnalyst } from "@src/services/staffs/types";
import { getCommercialManagerAndAnalyst } from "@src/services/staffs/commercialManagerAndAnalyst";
import { BaseModal } from "@src/components/modals/baseModal";

export interface StaffModalProps {
  commercialManager: string;
  analyst: string;
  buttonText: string;
  title: string;
  portalId?: string;
  handleNext?: () => void;
  onChange: (key: string) => void;
  onSubmit?: (values: { commercialManager: string; analyst: string }) => void;
  onCloseModal?: () => void;
  taskData?: IToDo | null;
  setAssignedStaff: React.Dispatch<
    React.SetStateAction<{
      commercialManager: string;
      analyst: string;
    }>
  >;
  handleRetry?: () => void;
}

export function StaffModal(props: StaffModalProps) {
  const {
    portalId = "portal",
    onSubmit,
    onCloseModal,
    taskData,
    setAssignedStaff,
    title,
    buttonText,
    handleRetry,
  } = props;
  const [analystList, setAnalystList] = useState<
    ICommercialManagerAndAnalyst[]
  >([]);
  const [accountManagerList, setAccountManagerList] = useState<
    ICommercialManagerAndAnalyst[]
  >([]);
  const [selectedCommercialManager, setSelectedCommercialManager] =
    useState<ICommercialManagerAndAnalyst | null>(null);
  const [selectedAnalyst, setSelectedAnalyst] =
    useState<ICommercialManagerAndAnalyst | null>(null);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const [showModal, setShowModal] = useState(false);
  const validationSchema = Yup.object().shape({
    commercialManager: Yup.string(),
    analyst: Yup.string(),
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const handleCommercialManagerChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const selectedManager = accountManagerList.find(
      (manager) => manager.staffName === value,
    );
    if (selectedManager) {
      setSelectedCommercialManager(selectedManager);
    }
  };
  const handleAnalystChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const selected = analystList.find((analyst) => analyst.staffName === value);
    if (selected) {
      setSelectedAnalyst(selected);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountManagers, analysts] = await Promise.all([
          getCommercialManagerAndAnalyst(
            "CredicarAccountManager",
            businessUnitPublicCode,
            businessManagerCode,
          ),
          getCommercialManagerAndAnalyst(
            "CredicarAnalyst",
            businessUnitPublicCode,
            businessManagerCode,
          ),
        ]);

        setAccountManagerList(accountManagers);
        setAnalystList(analysts);
      } catch (error) {
        addFlag({
          title: txtFlags.titleDanger,
          description: txtFlags.descriptionDanger,
          appearance: "danger",
          duration: 5000,
        });
      }
    };
    fetchData();
  }, []);
  const { addFlag } = useFlag();

  const buildCreditRequest = (
    role: string,
    user: ICommercialManagerAndAnalyst | null,
  ): ICreditRequests | null => {
    if (!user) return null;

    return {
      creditRequestId: taskData?.creditRequestId || "",
      executed_task: taskData?.taskToBeDone || "",
      execution_date: new Date().toISOString().split("T")[0],
      identificationNumber: user.identificationDocumentNumber || "",
      identificationType: "C",
      role: role,
      transactionOperation: "Insert",
      userId: user.staffId || "",
      userName: user.staffName || "",
      justification: "Justificacion",
      creditRequestCode: "",
    };
  };
  const handleCreditRequests = async () => {
    const managerRequest = buildCreditRequest(
      "CredicarAccountManager".substring(0, 20),
      selectedCommercialManager,
    );

    const analystRequest = buildCreditRequest(
      "CredicarAnalyst",
      selectedAnalyst,
    );

    try {
      if (managerRequest) {
        await changeUsersByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          managerRequest,
          userAccount,
        );
        setAssignedStaff((prev) => ({
          ...prev,
          commercialManager: selectedCommercialManager?.staffName || "",
        }));
      }

      if (analystRequest) {
        await changeUsersByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          analystRequest,
          userAccount,
        );
        setAssignedStaff((prev) => ({
          ...prev,
          analyst: selectedAnalyst?.staffName || "",
        }));
      }

      console.log("");
    } catch (error) {
      console.log(error);
    } finally {
      if (onCloseModal) onCloseModal();
      handleToggleModal();
      setTimeout(() => {
        navigate(`/extended-card/${id}`);
      }, 6000);
    }
  };
  const handleToggleModal = () => {
    if (handleRetry) {
      handleRetry();
    }
    setShowModal(!showModal);
  };
  const options = {
    commercialManager: accountManagerList.map((official) => ({
      id: official.staffId,
      label: official.staffName,
      value: official.staffName,
      document: official.identificationDocumentNumber,
    })),
    analyst: analystList.map((official) => ({
      id: official.staffId,
      label: official.staffName,
      value: official.staffName,
    })),
  };
  return (
    <Formik
      initialValues={{ commercialManager: "", analyst: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit?.(values);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <BaseModal
            title={title}
            handleNext={handleCreditRequests}
            width={isMobile ? "280px" : "500px"}
            handleBack={onCloseModal}
            handleClose={onCloseModal}
            portalId={portalId}
            nextButton={buttonText}
          >
            <Stack direction="column" gap="24px">
              <Select
                name="commercialManager"
                id="commercialManager"
                label="Gestor Comercial"
                placeholder={
                  options.commercialManager.length > 0
                    ? "Selecciona una opción"
                    : "No hay gestores disponibles"
                }
                options={options.commercialManager}
                onChange={(name, value) =>
                  handleCommercialManagerChange(name, value, setFieldValue)
                }
                value={values.commercialManager}
                fullwidth
                disabled={options.commercialManager.length === 0}
              />
              <Select
                name="analyst"
                id="analyst"
                label="Analista"
                placeholder={
                  options.analyst.length > 0
                    ? "Selecciona una opción"
                    : "No hay analistas disponibles"
                }
                options={options.analyst}
                onChange={(name, value) =>
                  handleAnalystChange(name, value, setFieldValue)
                }
                value={values.analyst}
                fullwidth
                disabled={options.analyst.length === 0}
              />
            </Stack>
          </BaseModal>
        </Form>
      )}
    </Formik>
  );
}
