import { useState, useEffect } from "react";
import { staffUserAccountById } from "@services/StaffUser/StaffUserAccountIportalStaff";
import { IStaffUserAccount } from "@ptypes/staffPortalBusiness.types";
import { useErrorFlag } from "./useErrorFlag";

interface UseStaffUserAccountProps {
  userAccountId: string;
  onUserAccountLoaded?: (userAccount: IStaffUserAccount) => void;
}

export const useStaffUserAccount = ({
  userAccountId,
  onUserAccountLoaded,
}: UseStaffUserAccountProps) => {
  const [userAccount, setUserAccount] = useState<IStaffUserAccount>({} as IStaffUserAccount);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<number | null>(1001);
  const [flagShown, setFlagShown] = useState(false);

  useErrorFlag(flagShown);

  useEffect(() => {
    const fetchUserAccount = async () => {
      if (!userAccountId) {
        setHasError(null);
        setUserAccount({} as IStaffUserAccount);
        return;
      }

      setLoading(true);
      setHasError(null);

      try {
        const data = await staffUserAccountById(userAccountId);
        setUserAccount(data);
        if (onUserAccountLoaded) {
          onUserAccountLoaded(data);
        }
      } catch {
        setHasError(500);
        setFlagShown(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccount();
  }, [userAccountId, onUserAccountLoaded]);

  return { userAccount, loading, hasError };
};
