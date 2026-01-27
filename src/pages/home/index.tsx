import { useMediaQuery } from "@inubekit/inubekit";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "@context/AppContext";
import { CustomerContext } from "@context/CustomerContext";
import { useIAuth } from "@inube/iauth-react";
import { useAppContext } from "@hooks/useAppContext";
import { useEnum } from "@hooks/useEnum/useEnum";

import { HomeUI } from "./interface";
import { errorDataCredit } from "./config/home.config";

const Home = () => {
  const { eventData } = useContext(AppContext);
  const { customerData } = useContext(CustomerContext);
  const { lang } = useEnum();

  const smallScreen = useMediaQuery("(max-width: 532px)");
  const isMobile = useMediaQuery("(max-width: 880px)");
  const username = eventData.user.userName.split(" ")[0];
  const { user } = useIAuth();

  const [loading, setLoading] = useState(true);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData?.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const { optionStaffData } = useAppContext();

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
      messages.push(errorDataCredit.noBusinessUnit.i18n[lang]);
    }
    if (customerData.fullName.length === 0) {
      error = 1016;
      messages.push(errorDataCredit.noSelectClient.i18n[lang]);
    }

    if (!optionStaffData || optionStaffData.length === 0) {
      error = 1041;
      messages.push(errorDataCredit.errorData.i18n[lang]);
    }

    setCodeError(error);
    setAddToFix(messages);
  }, [customerData, eventData, optionStaffData, loading]);

  return (
    <HomeUI
      smallScreen={smallScreen}
      isMobile={isMobile}
      username={username}
      dataHeader={dataHeader}
      loading={loading}
      dataOptions={optionStaffData}
      codeError={codeError}
      addToFix={addToFix}
      user={user}
      showErrorModal={showErrorModal}
      messageError={messageError}
      lang={lang}
      setMessageError={setMessageError}
      setShowErrorModal={setShowErrorModal}
      navigate={navigate}
    />
  );
};

export { Home };
