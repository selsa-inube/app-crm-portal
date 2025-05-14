import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { mockEditProspect } from "@mocks/add-prospect/edit-prospect/editprospect.mock";
import { CustomerContext } from "@context/CustomerContext";
import { getSearchProspectByCode } from "@services/prospects/AllProspects";
import { IProspect } from "@services/prospects/types";
import { AppContext } from "@context/AppContext";

import { EditProspectUI } from "./interface";

export function EditProspect() {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dataProspect, setDataProspect] = useState<IProspect>();

  const isMobile = useMediaQuery("(max-width:880px)");
  const { customerPublicCode, prospectCode } = useParams();

  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const data = mockEditProspect[0];

  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const handleSubmitClick = () => {
    setTimeout(() => {
      navigate(
        `/credit/submit-credit-application/${customerPublicCode}/67eb62079cdd4c16064c45be`,
      );
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectByCode(
          businessUnitPublicCode,
          prospectCode!,
        );
        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        console.error("Error al obtener los prospectos:", error);
      }
    };

    fetchData();
  }, [businessUnitPublicCode]);

  return (
    <EditProspectUI
      dataHeader={dataHeader}
      isMobile={isMobile}
      prospectCode={prospectCode || ""}
      data={data}
      dataProspect={dataProspect || ({} as IProspect)}
      showMenu={showMenu}
      showShareModal={showShareModal}
      setShowShareModal={setShowShareModal}
      setShowMenu={setShowMenu}
      handleSubmitClick={handleSubmitClick}
    />
  );
}
