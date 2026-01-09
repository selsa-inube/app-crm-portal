import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { useAppContext } from "@hooks/useAppContext";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { useIAuth } from "@inube/iauth-react";

import { CreditUI } from "./interface";
import { errorDataCredit } from "./config/credit.config";

const Credit = () => {
  const isMobile = useMediaQuery("(max-width: 880px)");
  const { optionStaffData } = useAppContext();
  const { customerData } = useContext(CustomerContext);
  const { eventData } = useContext(AppContext);
  const { user } = useIAuth();

  const [loading, setLoading] = useState(true);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    let error = null;
    const messages: string[] = [];

    if (eventData.businessManager.abbreviatedName.length === 0) {
      error = 1003;
      messages.push(errorDataCredit.noBusinessUnit);
    }
    if (customerData.fullName.length === 0) {
      error = 1016;
      messages.push(errorDataCredit.noSelectClient);
    }
    if (!optionStaffData || optionStaffData.length === 0) {
      error = 1041;
      messages.push(errorDataCredit.errorData);
    }

    setCodeError(error);
    setAddToFix(messages);
  }, [customerData, eventData, optionStaffData, loading]);

  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
  };

  const handleOpenInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  return (
    <CreditUI
      isMobile={isMobile}
      dataOptions={optionStaffData}
      dataHeader={dataHeader}
      codeError={codeError}
      addToFix={addToFix}
      user={user}
      navigate={navigate}
      showErrorModal={showErrorModal}
      messageError={messageError}
      setMessageError={setMessageError}
      setShowErrorModal={setShowErrorModal}
      loading={loading}
      isInfoModalOpen={isInfoModalOpen}
      handleInfoModalClose={handleInfoModalClose}
      handleOpenInfoModal={handleOpenInfoModal}
    />
  );
};

export { Credit };
