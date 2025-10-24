const getXAction = (humanDecision: string, id?: boolean): string => {
  if (humanDecision === "APROBAR_SOLICITUD" && id === true) {
    return "RegisterIndividualConceptOfApproval";
  }
  if (humanDecision === "APROBAR_SOLICITUD") {
    return "ApproveCreditRequest";
  } else if (humanDecision === "SOPORTES_VALIDOS") {
    return "ApproveLegalDocumentsAndWarranties";
  } else if (humanDecision === "CANCELAR_SOLICITUD") {
    return "CancelCreditRequest";
  } else if (humanDecision === "SOPORTES_INVALIDOS") {
    return "DisapproveLegalDocumentsAndWarranties";
  } else if (humanDecision === "VIABILIZAR_SOLICITUD") {
    return "MakeTheCreditRequestViable";
  } else if (humanDecision === "ANALISIS_RIESGO") {
    return "ManageCreditRequestRisk";
  } else if (humanDecision === "PREVIABILIZAR_SOLICITUD") {
    return "PrequalifyTheCreditRequest";
  } else if (humanDecision === "GESTION_COMERCIAL") {
    return "ReturnToCommercialManagement";
  } else if (humanDecision === "CONFIRMACION_CLIENTE") {
    return "WaitForCustomerConfirmation";
  } else if (humanDecision === "DESEMBOLSO_REALIZADO") {
    return "ConfirmDisbursementSuccessful";
  } else if (humanDecision === "RECHAZAR_SOLICITUD") {
    return "RejectCreditRequestBecauseItIsNotViable";
  } else if (humanDecision === "ANULAR_SOLICITUD") {
    return "ojo1---->";
  } else if (humanDecision === "SOPORTES_POS_NO_RECIBIDOS") {
    return "PostDisbursementRequirementsNotCompleted";
  } else if (humanDecision === "SOPORTES_POS_RECIBIDOS") {
    return "PostDisbursementRequirementsCompleted";
  } else if (humanDecision === "DECLINAR_OBLIGACIONES_DE_CARTERA") {
    return "ojo4---->";
  } else if (humanDecision === "CREAR_OBLIGACIONES_DE_CARTERA") {
    return "CreatePortfolioObligations";
  } else if (humanDecision === "DESEMBOLSO_DECLINADO") {
    return "ConfirmDisbursementDeclined";
  }
  return "";
};

export { getXAction };
