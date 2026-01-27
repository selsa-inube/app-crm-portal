import { useState, useEffect } from "react";

import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { getStaffPortalsByBusinessManager } from "@services/staff-portals-by-business-manager/SearchAllStaffPortalsByBusinessManager";
import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";
import { decrypt, encrypt } from "@utils/encrypt/encrypt";
import { IBusinessManagers } from "@services/businessManager/types";

interface IAuthConfig {
  clientId: string;
  clientSecret: string;
}

const usePortalLogic = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const portalParam = params.get("portal");
  const storedPortal = localStorage.getItem("portalCode");
  const decryptedPortal = storedPortal ? decrypt(storedPortal) : "";
  const portalCode = portalParam ?? decryptedPortal;

  const [portalData, setPortalData] =
    useState<IStaffPortalByBusinessManager | null>(null);
  const [publicCode, setPublicCode] = useState<string | null>(null);
  const [businessManager, setBusinessManager] = useState<IBusinessManagers>(
    {} as IBusinessManagers,
  );
  const [authConfig, setAuthConfig] = useState<IAuthConfig | null>(null);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (portalParam && portalParam !== decryptedPortal) {
      const encryptedPortal = encrypt(portalParam);
      localStorage.setItem("portalCode", encryptedPortal);
    }
  }, [portalParam, decryptedPortal]);

  useEffect(() => {
    const loadData = async () => {
      if (!portalCode) {
        setCodeError(1000);
        setLoading(false);
        return;
      }

      try {
        const portals = await getStaffPortalsByBusinessManager(portalCode);

        if (!portals || portals.length === 0) {
          setCodeError(1001);
          setLoading(false);
          return;
        }

        const portalData = portals[0];
        setPortalData(portalData);

        if (portalData.publicCode) {
          setPublicCode(portalData.publicCode);
        } else {
          setCodeError(1004);
          setLoading(false);
          return;
        }

        const { businessManagerCode } = portalData;

        if (!businessManagerCode) {
          setCodeError(1002);
          setLoading(false);
          return;
        }

        const manager = await getBusinessManagers(businessManagerCode, "");
        setBusinessManager(manager);

        if (manager.clientId && manager.clientSecret) {
          setAuthConfig({
            clientId: manager.clientId,
            clientSecret: manager.clientSecret,
          });
        }

        setLoading(false);
      } catch (error) {
        setCodeError(1003);
        setLoading(false);
      }
    };

    loadData();
  }, [portalCode]);

  const hasAuthError = !authConfig || Boolean(codeError);

  return {
    portalData,
    publicCode,
    businessManager,
    authConfig,
    codeError,
    loading,
    hasAuthError,
    portalCode,
  };
};

export { usePortalLogic };
