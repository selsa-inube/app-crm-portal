import { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { IBusinessManagers } from "@services/businessManager/types";
import { getStaffPortalsByBusinessManager } from "@services/staff-portals-by-business-manager/SearchAllStaffPortalsByBusinessManager";
import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";
import { decrypt, encrypt } from "@utils/encrypt/encrypt";

const usePortalLogic = () => {
  const [portalData, setPortalData] =
    useState<IStaffPortalByBusinessManager | null>(null);
  const [businessManager, setBusinessManager] =
    useState<IBusinessManagers | null>(null);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const rawPortalCode = useMemo(() => {
    const urlCode = new URLSearchParams(window.location.search)
      .get("portal")
      ?.trim();
    if (urlCode) {
      localStorage.setItem("portalCode", encrypt(urlCode));
      return urlCode;
    }

    const storedEncrypted = localStorage.getItem("portalCode");
    if (storedEncrypted) {
      try {
        return decrypt(storedEncrypted);
      } catch (err) {
        return null;
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!rawPortalCode) {
        setCodeError(1000);
        setLoading(false);
        return;
      }

      try {
        const portals = await getStaffPortalsByBusinessManager(rawPortalCode);
        const portalData = portals[0];
        if (!portalData) {
          setCodeError(1001);
          setLoading(false);
          return;
        }

        setPortalData(portalData);
        const { businessManagerId } = portalData;

        if (!businessManagerId) {
          setCodeError(1002);
          setLoading(false);
          return;
        }

        if (!isAuthenticated && !isLoading) {
          loginWithRedirect();
          return;
        }

        const manager = await getBusinessManagers(businessManagerId);
        setBusinessManager(manager);
        setLoading(false);
      } catch (error) {
        setCodeError(1003);
        setLoading(false);
      }
    };

    if (!isLoading) {
      loadData();
    }
  }, [rawPortalCode, isAuthenticated, isLoading, loginWithRedirect]);

  return {
    portalData,
    businessManager,
    codeError,
    loading,
    isAuthenticated,
  };
};

export { usePortalLogic };
