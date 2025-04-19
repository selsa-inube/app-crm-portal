import { useState, useEffect } from "react";
import { encrypt } from "@utils/encrypt";
import { staffPortalByBusinessManager } from "@services/staffPortal/StaffPortalByBusinessManager";
import { IStaffPortalByBusinessManager } from "@ptypes/staffPortalBusiness.types";
import { useErrorFlag } from "./useErrorFlag";

export const usePortalData = (codeParam: string) => {
  const [portalData, setPortalData] = useState<IStaffPortalByBusinessManager>(
    {} as IStaffPortalByBusinessManager,
  );
  const [hasError, setHasError] = useState<number | null>(1001);
  const [isFetching, setIsFetching] = useState(true);
  const [flagShown, setFlagShown] = useState(false);

  useErrorFlag(flagShown);

  useEffect(() => {
    const fetchPortalData = async () => {
      setIsFetching(true);
      try {
        const staffPortalData = await staffPortalByBusinessManager(codeParam);
        if (!staffPortalData || Object.keys(staffPortalData).length === 0) return;
        const encryptedParamValue = encrypt(codeParam);
        localStorage.setItem("portalCode", encryptedParamValue);
        setHasError(null);
        setPortalData(staffPortalData);
      } catch {
        setHasError(500);
        setFlagShown(true);
      } finally {
        setIsFetching(false);
      }
    };

    void fetchPortalData();
  }, [codeParam]);

  return { portalData, hasError, isFetching };
};
