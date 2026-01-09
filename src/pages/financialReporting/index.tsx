import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  useMediaQuery,
  Blanket,
  Text,
  Spinner,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { OfferedGuaranteeModal } from "@components/modals/OfferedGuaranteeModal";
import { ErrorAlert } from "@components/ErrorAlert";
import { ListModal } from "@components/modals/ListModal";
import { MobileMenu } from "@components/modals/MobileMenu";
import { generatePDF } from "@utils/pdf/generetePDF";
import { AppContext } from "@context/AppContext";
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ICreditRequest, IPaymentChannel } from "@services/creditRequest/types";
import { getCreditRequestByCode } from "@services/creditRequest/getCreditRequestByCode";
import { getSearchAllDocumentsById } from "@services/creditRequest/SearchAllDocuments";
import { getSearchProspectById } from "@services/prospect/SearchByIdProspect";
import { ContainerSections } from "@components/layout/ContainerSections";
import { StockTray } from "@components/layout/ContainerSections/StockTray";
import { ShareModal } from "@components/modals/ShareModal";
import { patchAssignAccountManager } from "@services/creditRequest/patchAssignAccountManager";
import { getUnreadErrorsById } from "@services/creditRequest/unreadErrors";
import { CustomerContext } from "@context/CustomerContext";
import { ErrorPage } from "@components/layout/ErrorPage";
import { BaseModal } from "@components/modals/baseModal";
import { environment } from "@config/environment";
import { useEnum } from "@hooks/useEnum/useEnum";

import {
  configHandleactions,
  labelsAndValuesShare,
  errorMessages,
} from "./config";
import {
  StyledMarginPrint,
  StyledPageBreak,
  StyledScreenPrint,
  StyledToast,
  StyledContainerSpinner,
  BlockPdfSection,
  GlobalPdfStyles,
} from "./styles";
import { Approvals } from "./Approvals";
import { Requirements } from "./Requirements";
import { Management } from "./management";
import { PromissoryNotes } from "./PromissoryNotes";
import { Postingvouchers } from "./Postingvouchers";
import { IDocumentData, IErrorService, IErrorsUnread } from "./types";
import { ComercialManagement } from "./CommercialManagement";
import { GeneralHeader } from "../simulateCredit/components/GeneralHeader";

interface IListdataProps {
  data: { id: string; name: string }[];
  icon?: React.ReactNode;
  onPreview: (id: string, name: string) => void;
}

const removeErrorByIdServices = (
  errorsList: IErrorService[],
  errorId: string,
) => {
  return errorsList.filter((error) => error.id !== errorId);
};

export const FinancialReporting = () => {
  const [data, setData] = useState({} as ICreditRequest);
  const [attachDocuments, setAttachDocuments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [sentData, setSentData] = useState<IExtraordinaryInstallments | null>(
    null,
  );
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [sendCrediboard, setSendCrediboard] = useState(false);

  const [showGuarantee, setShowGuarantee] = useState(false);

  const [document, setDocument] = useState<IListdataProps["data"]>([]);

  const [dataProspect, setDataProspect] = useState<IProspect>();
  const [pdfState, setPdfState] = useState({
    isGenerating: false,
    blob: null as Blob | null,
    showShareModal: false,
  });
  const [loadingData, setLoadingData] = useState(true);

  const { creditRequestCode } = useParams();
  const { user } = useIAuth();
  const { lang } = useEnum();

  const navigation = useNavigate();

  const isMobile: boolean = useMediaQuery("(max-width: 880px)");

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  const [errorsService, setErrorsService] = useState<IErrorService[]>([]);
  const { businessUnitSigla, eventData, loadingEventData } =
    useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { customerData, loadingCustomerData } = useContext(CustomerContext);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    setLoadingData(true);
    getCreditRequestByCode(
      businessUnitPublicCode,
      businessManagerCode,
      user.id,
      { creditRequestCode },
    )
      .then((data) => {
        if (data && data.length > 0) {
          setData(data[0]);
        } else {
          setCodeError(1030);
          setAddToFix([errorMessages.errorCreditRequest.i18n[lang]]);
        }
      })
      .catch(() => {
        setCodeError(1030);
        setAddToFix([errorMessages.errorCreditRequest.i18n[lang]]);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [creditRequestCode, businessUnitPublicCode, user.id, businessManagerCode]);

  const fetchAndShowDocuments = async () => {
    if (!data?.creditRequestId || !user?.id || !businessUnitPublicCode) return;

    try {
      const documents = await getSearchAllDocumentsById(
        data.creditRequestId,
        user.id,
        businessUnitPublicCode,
        businessManagerCode,
      );

      const dataToMap = Array.isArray(documents) ? documents : documents.value;
      const documentsUser = dataToMap.map(
        (dataListDocument: IDocumentData) => ({
          id: dataListDocument.documentId,
          name: dataListDocument.fileName,
        }),
      );
      setDocument(documentsUser);
      setAttachDocuments(true);
    } catch (error) {
      setMessageError(errorMessages.documents.i18n[lang]);
      setShowErrorModal(true);
    }
  };

  const fetchProspectData = async () => {
    try {
      const result = await getSearchProspectById(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestCode!,
      );
      setDataProspect(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      setMessageError(errorMessages.prospect.i18n[lang]);
      setShowErrorModal(true);
      if (creditRequestCode === undefined) {
        setMessageError(errorMessages.prospect.i18n[lang]);
        setShowErrorModal(true);
      }
    }
  };

  useEffect(() => {
    fetchProspectData();
  }, [businessUnitPublicCode, businessManagerCode, sentData]);

  const generateAndSharePdf = async () => {
    setPdfState({ isGenerating: true, blob: null, showShareModal: false });

    try {
      const pdfBlob = await generatePDF(
        dataCommercialManagementRef,
        labelsAndValuesShare.titleOnPdf.i18n[lang],
      );

      if (pdfBlob) {
        setPdfState({
          isGenerating: false,
          blob: pdfBlob,
          showShareModal: true,
        });
      }
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setMessageError(errorMessages.share.description.i18n[lang]);
      setShowErrorModal(true);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfState.blob) return;

    try {
      const pdfFile = new File(
        [pdfState.blob],
        labelsAndValuesShare.fileName.i18n[lang],
        {
          type: "application/pdf",
        },
      );

      await navigator.share({
        files: [pdfFile],
        title: labelsAndValuesShare.titleOnPdf.i18n[lang],
        text: labelsAndValuesShare.text.i18n[lang],
      });

      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setMessageError(errorMessages.share.description.i18n[lang]);
      setShowErrorModal(true);
    }
  };

  const handleActions = configHandleactions({
    buttonPrint: () => {
      if (collapse === true) {
        setCollapse(false);
        setTimeout(() => {
          print();
        }, 1);
        setTimeout(() => {
          setCollapse(true);
        }, 1);
      } else {
        print();
      }
    },
    buttonViewAttachments: () => fetchAndShowDocuments(),
    buttonWarranty: () => setShowGuarantee(true),
    menuIcon: () => setShowMenu(true),
  });

  const handleCloseErrorService = (errorId: string) => {
    setErrorsService(removeErrorByIdServices(errorsService, errorId));
  };

  const handleOnAttach = () => {
    setShowMenu(false);
  };

  const handleOnViewAttachments = () => {
    setAttachDocuments(true);
    setShowMenu(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!data?.creditRequestId || !businessUnitPublicCode || !user?.id)
        return;
      try {
        await patchAssignAccountManager(
          data?.creditRequestId ?? "",
          businessUnitPublicCode,
          businessManagerCode,
          user?.id ?? "",
        );
      } catch (error) {
        setMessageError(errorMessages.getData.description.i18n[lang]);
      } finally {
        handleToggleModal();
      }
    };

    fetchData();
  }, [data?.creditRequestId, businessUnitPublicCode, user?.id]);

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(
        businessUnitPublicCode,
        businessManagerCode,
        user?.id ?? "",
        { creditRequestCode },
      );
      if (data[0].stage !== "TRAMITADA") {
        setSendCrediboard(true);
      }

      setRequests(data[0] as ICreditRequest);
    } catch (error) {
      setCodeError(1022);
      setAddToFix([errorMessages.prospect.i18n[lang]]);
    }
  }, [businessUnitPublicCode, user, businessManagerCode]);

  useEffect(() => {
    fetchCreditRequest();
  }, [fetchCreditRequest]);

  const fetchErrors = async () => {
    if (!data?.creditRequestId || !businessUnitPublicCode) return;

    try {
      const unreadErrors = await getUnreadErrorsById(
        businessUnitPublicCode,
        businessManagerCode,
        {
          creditRequestId: data.creditRequestId,
        },
      );

      if (Array.isArray(unreadErrors)) {
        const mappedErrors = unreadErrors.map((error: IErrorsUnread) => ({
          id: error.errorIssuedId,
          message: error.errorDescription,
        }));

        setErrorsService(mappedErrors);
      }
    } catch (error) {
      console.error("Error fetching unread errors", error);
    }
  };

  useEffect(() => {
    if (data?.creditRequestId) {
      fetchErrors();
    }
  }, [data]);

  const handleErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleSharePdfModal = () => {
    setPdfState({ isGenerating: false, blob: null, showShareModal: false });
  };

  useEffect(() => {
    if (loadingCustomerData || loadingEventData) return;

    let error = null;
    const messages: string[] = [];

    if (eventData.businessManager.abbreviatedName.length === 0) {
      error = 1003;
      messages.push(errorMessages.noBusinessUnit.i18n[lang]);
    }
    if (customerData.fullName.length === 0) {
      error = 1016;
      messages.push(errorMessages.noSelectClient.i18n[lang]);
    }

    setCodeError(error);
    setAddToFix(messages);
  }, [customerData, eventData]);

  const handleNavigate = () => {
    if (codeError === 1003) {
      navigation(`/login/${user.username}/business-units/select-business-unit`);
    } else if (codeError === 1016) {
      navigation("/clients/select-client/");
    } else {
      navigation("/credit/processed-credit-requests");
    }
  };

  return (
    <>
      {codeError ? (
        <ErrorPage
          onClick={handleNavigate}
          errorCode={codeError}
          addToFix={addToFix}
        />
      ) : (
        <div ref={dataCommercialManagementRef}>
          <Stack
            direction="column"
            width={isMobile ? "calc(100% - 40px)" : "min(100% - 40px, 1064px)"}
            margin={`20px auto ${isMobile ? "100px" : "60px"} auto`}
          >
            <GlobalPdfStyles $isGeneratingPdf={pdfState.isGenerating} />
            <StyledMarginPrint $isMobile={isMobile}>
              <GeneralHeader
                buttonText={labelsAndValuesShare.addLink.i18n[lang]}
                descriptionStatus={dataHeader.status}
                name={dataHeader.name}
                profileImageUrl="https://s3-alpha-sig.figma.com/img/27d0/10fa/3d2630d7b4cf8d8135968f727bd6d965?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h5lEzRE3Uk8fW5GT2LOd5m8eC6TYIJEH84ZLfY7WyFqMx-zv8TC1yzz-OV9FCH9veCgWZ5eBfKi4t0YrdpoWZriy4E1Ic2odZiUbH9uQrHkpxLjFwcMI2VJbWzTXKon-HkgvkcCnKFzMFv3BwmCqd34wNDkLlyDrFSjBbXdGj9NZWS0P3pf8PDWZe67ND1kropkpGAWmRp-qf9Sp4QTJW-7Wcyg1KPRy8G-joR0lsQD86zW6G6iJ7PuNHC8Pq3t7Jnod4tEipN~OkBI8cowG7V5pmY41GSjBolrBWp2ls4Bf-Vr1BKdzSqVvivSTQMYCi8YbRy7ejJo9-ZNVCbaxRg__"
              />
              <Stack direction="column" margin="20px 0 0 0">
                <Stack justifyContent="center" alignContent="center">
                  <StyledToast $isMobile={isMobile}>
                    {errorsService.map((error) => (
                      <ErrorAlert
                        key={error.id}
                        message={error.message.toString()}
                        onClose={() => handleCloseErrorService(error.id)}
                        isMobile={isMobile}
                      />
                    ))}
                  </StyledToast>
                </Stack>
                <ContainerSections
                  isMobile={isMobile}
                  stockTray={
                    <StockTray
                      isMobile={isMobile}
                      actionButtons={handleActions}
                      navigation={() =>
                        navigation("/credit/processed-credit-requests")
                      }
                      eventData={eventData}
                    />
                  }
                >
                  <>
                    <Stack direction="column" gap="20px">
                      <Stack direction="column">
                        <Stack direction="column">
                          <BlockPdfSection className="pdf-block">
                            <ComercialManagement
                              generateAndSharePdf={generateAndSharePdf}
                              data={data}
                              collapse={collapse}
                              setCollapse={setCollapse}
                              creditRequest={requests}
                              hideContactIcons={true}
                              prospectData={dataProspect!}
                              sentData={null}
                              setSentData={setSentData}
                              setRequestValue={setRequestValue}
                              requestValue={requestValue}
                              loadingData={loadingData}
                              lang={lang}
                            />
                          </BlockPdfSection>
                        </Stack>
                      </Stack>
                      <StyledScreenPrint $isMobile={isMobile}>
                        <Stack
                          direction="column"
                          height={isMobile ? "auto" : "314px"}
                        >
                          <BlockPdfSection className="pdf-block">
                            <Approvals
                              user={creditRequestCode!}
                              isMobile={isMobile}
                              creditRequest={requests}
                              lang={lang}
                            />
                          </BlockPdfSection>
                        </Stack>
                        <Stack
                          direction="column"
                          height={isMobile ? "auto" : "314px"}
                        >
                          <StyledPageBreak />
                          <BlockPdfSection className="pdf-block">
                            <Requirements
                              isMobile={isMobile}
                              id={data.creditRequestId!}
                              user={user!.id!}
                              businessUnitPublicCode={businessUnitPublicCode}
                              creditRequestCode={data.creditRequestCode!}
                              businessManagerCode={businessManagerCode}
                              lang={lang}
                            />
                          </BlockPdfSection>
                        </Stack>
                        <Stack direction="column">
                          <BlockPdfSection className="pdf-block">
                            <Management
                              creditRequest={requests}
                              isMobile={isMobile}
                              lang={lang}
                            />
                          </BlockPdfSection>
                        </Stack>
                        <Stack
                          direction="column"
                          height={isMobile ? "auto" : "340px"}
                        >
                          <StyledPageBreak />
                          <BlockPdfSection className="pdf-block">
                            <PromissoryNotes
                              id={creditRequestCode!}
                              isMobile={isMobile}
                              creditRequest={requests}
                              lang={lang}
                            />
                          </BlockPdfSection>
                        </Stack>
                      </StyledScreenPrint>
                    </Stack>
                    <Stack
                      direction="column"
                      height={isMobile ? "auto" : "163px"}
                    >
                      <BlockPdfSection className="pdf-block">
                        <Postingvouchers
                          user={creditRequestCode!}
                          id={creditRequestCode!}
                          isMobile={isMobile}
                          creditRequest={requests}
                          lang={lang}
                        />
                      </BlockPdfSection>
                    </Stack>
                    <StyledPageBreak />
                    <StyledPageBreak />
                    {attachDocuments && (
                      <ListModal
                        title="Ver Adjuntos"
                        handleClose={() => setAttachDocuments(false)}
                        buttonLabel="Cerrar"
                        id={data.creditRequestId!}
                        isViewing={true}
                        dataDocument={document}
                      />
                    )}
                  </>
                </ContainerSections>
                {showGuarantee && (
                  <OfferedGuaranteeModal
                    handleClose={() => setShowGuarantee(false)}
                    isMobile={isMobile}
                  />
                )}
                {showMenu && isMobile && (
                  <MobileMenu
                    onClose={() => setShowMenu(false)}
                    onAttach={handleOnAttach}
                    onViewAttachments={handleOnViewAttachments}
                    onGuarantee={() => setShowGuarantee(true)}
                  />
                )}
              </Stack>
            </StyledMarginPrint>
            {showErrorModal && (
              <ErrorModal
                message={messageError}
                handleClose={handleErrorModal}
              />
            )}
            {pdfState.isGenerating && (
              <Blanket>
                <StyledContainerSpinner>
                  <Spinner size="large" />
                  <Text size="large" weight="bold">
                    {errorMessages.share.spinner.i18n[lang]}
                  </Text>
                </StyledContainerSpinner>
              </Blanket>
            )}
            {pdfState.showShareModal && pdfState.blob && (
              <ShareModal
                isMobile={isMobile}
                handleClose={handleSharePdfModal}
                handleNext={handleSharePdf}
              />
            )}
            {sendCrediboard && (
              <BaseModal
                title="Solicitud"
                width={isMobile ? "300px" : "400px"}
                nextButton="Aceptar"
                backButton="Cancelar"
                handleNext={() => {
                  window.location.href = `${environment.VITE_CREDIBOARD_URL}/extended-card/${requests?.creditRequestCode}`;
                }}
                handleBack={() =>
                  navigation("/credit/processed-credit-requests")
                }
              >
                <Text>{labelsAndValuesShare.changePortal.i18n[lang]}</Text>
              </BaseModal>
            )}
          </Stack>
        </div>
      )}
    </>
  );
};
