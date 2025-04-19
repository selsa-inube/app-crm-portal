import { useState, useEffect } from "react";

import {
  IBusinessManager,
  IEmployeePortalByBusinessManager,
} from "@ptypes/employeePortalBusiness.types";
import { getBusinessManagerById } from "@services/businessManagers/getBusinessManagerById";

import { useErrorFlag } from "./useErrorFlag";

export const useBusinessManagers = (portalPublicCode: IEmployeePortalByBusinessManager) => {
  const [businessManagersData, setBusinessManagersData] = useState<IBusinessManager>(
    {} as IBusinessManager,
  );
  const [hasError, setHasError] = useState(false);
  const [codeError, setCodeError] = useState<number | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [flagShown, setFlagShown] = useState(false);

  useErrorFlag(flagShown);

  useEffect(() => {
    const fetchBusinessManagers = async () => {
      if (!portalPublicCode?.businessManagerId) return;

      setIsFetching(true);
      try {
        const fetchedBusinessManagers = await getBusinessManagerById(
          portalPublicCode.businessManagerId,
        );

        if (!fetchedBusinessManagers || Object.keys(fetchedBusinessManagers).length === 0) {
          setHasError(true);
          setCodeError(1006);
          setFlagShown(true);
          return;
        }

        setHasError(false);
        setBusinessManagersData(fetchedBusinessManagers);
      } catch (err) {
        console.error("Error al obtener los datos del gestor de negocios:", err);
        setHasError(true);
        setCodeError(1007);
        setFlagShown(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBusinessManagers();
  }, [portalPublicCode]);

  return { businessManagersData, hasError, codeError, isFetching };
};
