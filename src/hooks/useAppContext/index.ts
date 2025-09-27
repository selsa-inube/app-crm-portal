import { useState, useEffect, useMemo } from "react";
import { useIAuth } from "@inube/iauth-react";

import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { IBusinessManagers } from "@services/businessManager/types";
import {
  validateBusinessManagers,
  validateConsultation,
} from "@context/AppContext/utils";
import { ICRMPortalData } from "@context/AppContext/types";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { getStaff } from "@services/staffs/searchAllStaff";
import { decrypt } from "@utils/encrypt/encrypt";
import { IOptionStaff } from "@services/staffs/searchOptionForStaff/types";
import { getSearchOptionForStaff } from "@services/staffs/searchOptionForStaff";
import { getSearchUseCaseForStaff } from "@services/staffs/SearchUseCaseForStaff";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  urlLogo: string;
}

function useAppContext() {
  const { user, isAuthenticated, isLoading } = useIAuth();
  const [hasUserLoaded, setHasUserLoaded] = useState(false);
  const [portalData, setPortalData] = useState<IStaffPortalByBusinessManager[]>(
    [],
  );
  const [businessManagers, setBusinessManagers] = useState<IBusinessManagers>(
    {} as IBusinessManagers,
  );
  const [businessUnitSigla, setBusinessUnitSigla] = useState(
    localStorage.getItem("businessUnitSigla") || "",
  );
  const [businessUnitsToTheStaff, setBusinessUnitsToTheStaff] = useState<
    IBusinessUnitsPortalStaff[]
  >(() => {
    const savedBusinessUnits = localStorage.getItem("businessUnitsToTheStaff");
    return savedBusinessUnits ? JSON.parse(savedBusinessUnits) : [];
  });
  const [optionStaffData, setOptionStaffData] = useState<IOptionStaff[]>([]);
  const [staffUseCases, setStaffUseCases] = useState<string[]>([]);

  const portalId = localStorage.getItem("portalCode");
  let portalCode = "";
  if (portalId) {
    portalCode = decrypt(portalId);
  }

  let businessUnit: IBusinessUnits | null = null;
  try {
    businessUnit = JSON.parse(businessUnitSigla || "{}") as IBusinessUnits;
  } catch (error) {
    console.error("Error parsing businessUnitSigla: ", error);
  }

  useEffect(() => {
    if (isLoading) return;

    const isValidAuthUser =
      user?.id &&
      user?.username &&
      user.id !== "id" &&
      user.username !== "username";

    if (user?.id === "id" && user?.username === "username") {
      const hasAlreadyRefreshed = localStorage.getItem(
        "hasRefreshedForDefaultUser",
      );

      if (!hasAlreadyRefreshed) {
        localStorage.setItem("hasRefreshedForDefaultUser", "true");
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
        return;
      }
    } else {
      localStorage.removeItem("hasRefreshedForDefaultUser");
    }

    if (isValidAuthUser) {
      setHasUserLoaded(true);
    } else if (
      user?.id === "id" &&
      user?.username === "username" &&
      !hasUserLoaded
    ) {
      setHasUserLoaded(false);
    } else if (!user && !hasUserLoaded) {
      setHasUserLoaded(false);
    }
  }, [user, hasUserLoaded, isLoading]);

  const [eventData, setEventData] = useState<ICRMPortalData>({
    portal: {
      abbreviatedName: "",
      staffPortalCatalogId: "",
      businessManagerId: "",
      publicCode: "",
    },
    businessManager: {
      publicCode: "",
      abbreviatedName: "",
      urlBrand: "",
      urlLogo: "",
      businessManagerId: "",
    },
    businessUnit: {
      businessUnitPublicCode: businessUnit?.businessUnitPublicCode || "",
      abbreviatedName: businessUnit?.abbreviatedName || "",
      languageId: businessUnit?.languageId || "",
      urlLogo: businessUnit?.urlLogo || "",
    },
    user: {
      userAccount: "",
      userName: "",
      identificationDocumentNumber: "",
      staff: {
        biologicalSex: "",
        birthDay: "",
        businessManagerCode: "",
        identificationDocumentNumber: "",
        identificationTypeNaturalPerson: "",
        missionName: "",
        principalEmail: "",
        principalPhone: "",
        staffByBusinessUnitAndRole: {
          businessUnitCode: "",
          roleName: "",
          staffId: "",
        },
        staffId: "",
        staffName: "",
        userAccount: "",
        useCases: [],
      },
    },
  });

  useEffect(() => {
    if (hasUserLoaded && user) {
      setEventData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          userAccount: user.username || "",
          userName: user.nickname || "",
          identificationDocumentNumber: user.id || "",
        },
      }));
    }
  }, [user, hasUserLoaded]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const userIdentifier = user?.id;
        if (
          !userIdentifier ||
          isLoading ||
          !isAuthenticated ||
          !hasUserLoaded
        ) {
          return;
        }

        const staffData = await getStaff(userIdentifier);
        if (!staffData.length) return;

        setEventData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            staff: {
              ...prev.user.staff,
              biologicalSex: staffData[0].biologicalSex,
              birthDay: staffData[0].birthDay,
              businessManagerCode: staffData[0].businessManagerCode,
              identificationDocumentNumber:
                staffData[0].identificationDocumentNumber,
              identificationTypeNaturalPerson:
                staffData[0].identificationTypeNaturalPerson,
              missionName: staffData[0].missionName,
              principalEmail: staffData[0].principalEmail,
              principalPhone: staffData[0].principalPhone,
              staffByBusinessUnitAndRole:
                staffData[0].staffByBusinessUnitAndRole,
              staffId: staffData[0].staffId,
              staffName: staffData[0].staffName,
              userAccount: staffData[0].userAccount,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [user?.username, isLoading, isAuthenticated, hasUserLoaded]);

  // Nuevo useEffect para obtener los use cases del staff
  useEffect(() => {
    const identificationNumber =
      eventData?.user?.identificationDocumentNumber || "";

    if (
      !eventData.businessUnit.abbreviatedName ||
      !eventData.businessManager.publicCode ||
      !identificationNumber
    ) {
      return;
    }

    (async () => {
      try {
        const staffUseCaseData = await getSearchUseCaseForStaff(
          eventData.businessUnit.abbreviatedName,
          eventData.businessManager.publicCode,
          identificationNumber,
        );
        setStaffUseCases(staffUseCaseData);
      } catch (error) {
        console.error("Error fetching use cases:", error);
      }
    })();
  }, [
    eventData.businessUnit.abbreviatedName,
    eventData.businessManager.publicCode,
    eventData?.user?.identificationDocumentNumber,
  ]);

  useEffect(() => {
    if (!hasUserLoaded || !portalCode) return;

    validateConsultation(portalCode).then((data) => {
      setPortalData(data);
    });
  }, [portalCode, hasUserLoaded]);

  const userIdentifier = eventData?.user?.identificationDocumentNumber;

  useEffect(() => {
    const fetchOptionStaff = async () => {
      try {
        if (
          !eventData?.portal?.publicCode ||
          !eventData?.businessUnit?.businessUnitPublicCode ||
          !user?.username ||
          isLoading ||
          !isAuthenticated ||
          !hasUserLoaded
        ) {
          return;
        }

        const result = await getSearchOptionForStaff(
          eventData.portal.publicCode,
          eventData.businessUnit.businessUnitPublicCode,
          userIdentifier || "",
        );
        setOptionStaffData(result);
      } catch (error) {
        console.error("Error fetching option staff:", error);
      }
    };

    fetchOptionStaff();
  }, [
    eventData?.portal?.publicCode,
    eventData?.businessUnit?.businessUnitPublicCode,
    user?.username,
    isLoading,
    isAuthenticated,
    userIdentifier,
    hasUserLoaded,
  ]);

  useEffect(() => {
    if (!portalCode || !hasUserLoaded) return;

    const portalDataFiltered = portalData.filter(
      (data) => data.staffPortalId === portalCode,
    );

    const foundBusiness = portalDataFiltered.find(
      (bussines) => bussines,
    )?.businessManagerCode;

    if (portalDataFiltered.length > 0 && foundBusiness) {
      validateBusinessManagers(foundBusiness).then((data) => {
        setBusinessManagers(data);
      });
    }
  }, [portalData, portalCode, hasUserLoaded]);

  useEffect(() => {
    if (!businessManagers || !hasUserLoaded) return;

    const portalDataFiltered = portalData.find(
      (data) => data.staffPortalId === portalCode,
    );
    setEventData((prev) => ({
      ...prev,
      portal: {
        ...prev.portal,
        abbreviatedName: portalDataFiltered?.abbreviatedName || "",
        staffPortalCatalogId: portalDataFiltered?.staffPortalId || "",
        businessManagerId: portalDataFiltered?.businessManagerCode || "",
        publicCode: portalDataFiltered?.publicCode || "",
      },
      businessManager: {
        ...prev.businessManager,
        publicCode: businessManagers.publicCode || "",
        abbreviatedName: businessManagers.abbreviatedName || "",
        urlBrand: businessManagers.urlBrand || "",
        urlLogo: businessManagers.urlLogo || "",
        businessManagerId: businessManagers.id || "",
      },
    }));
  }, [businessManagers, portalData, portalCode, hasUserLoaded]);

  useEffect(() => {
    localStorage.setItem("businessUnitSigla", businessUnitSigla);

    if (businessUnitsToTheStaff && businessUnitSigla) {
      let businessUnit: IBusinessUnits | null = null;
      try {
        businessUnit = JSON.parse(businessUnitSigla) as IBusinessUnits;
      } catch (error) {
        console.error("Error parsing businessUnitSigla: ", error);
        return;
      }

      setEventData((prev) => ({
        ...prev,
        businessUnit: {
          ...prev.businessUnit,
          abbreviatedName: businessUnit?.abbreviatedName || "",
          businessUnitPublicCode: businessUnit?.businessUnitPublicCode || "",
          languageId: businessUnit?.languageId || "",
          urlLogo: businessUnit?.urlLogo || "",
        },
      }));
    }
  }, [businessUnitSigla, businessUnitsToTheStaff]);

  useEffect(() => {
    localStorage.setItem(
      "businessUnitsToTheStaff",
      JSON.stringify(businessUnitsToTheStaff),
    );
  }, [businessUnitsToTheStaff]);

  useEffect(() => {
    if (staffUseCases) {
      setEventData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          staff: {
            ...prev.user.staff,
            useCases: staffUseCases,
          },
        },
      }));
    }
  }, [staffUseCases]);
  const appContext = useMemo(
    () => ({
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      optionStaffData,
      isLoading,
      isAuthenticated,
      hasUserLoaded,
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
      setOptionStaffData,
    }),
    [
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      optionStaffData,
      isLoading,
      isAuthenticated,
      hasUserLoaded,
    ],
  );

  return appContext;
}

export { useAppContext };
