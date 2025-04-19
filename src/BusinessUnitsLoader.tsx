import { useEffect } from "react";

import { useBusinessUnits } from "@hooks/useBusinessUnits";

import { useAppContext } from "./context/AppContext/useAppContext";

interface BusinessUnitsLoaderProps {
  portalCode: string;
}

export function BusinessUnitsLoader(props: BusinessUnitsLoaderProps) {
  const { portalCode } = props;
  const { staffUser, setBusinessUnits, setBusinessUnitsIsFetching } = useAppContext();
  const userAccount = staffUser?.userAccount || "";
  const { businessUnitsData, hasError, isFetching } = useBusinessUnits(userAccount, portalCode);

  useEffect(() => {
    setBusinessUnitsIsFetching(isFetching);

    if (!isFetching && !hasError && businessUnitsData.length > 0) {
      setBusinessUnits(businessUnitsData);
    }
  }, [isFetching, hasError, businessUnitsData, setBusinessUnits, setBusinessUnitsIsFetching]);

  return null;
}
