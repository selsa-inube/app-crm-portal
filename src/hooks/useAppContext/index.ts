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
import { useToken } from "@hooks/useToken";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  languageiso: string;
  urlLogo: string;
}

function useAppContext() {
  const { user, isLoading: isIAuthLoading } = useIAuth();
  const { getAuthorizationToken } = useToken();

  const [portalData, setPortalData] = useState<IStaffPortalByBusinessManager[]>(
    [],
  );
  const [messageError, setMessageError] = useState("");
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loadingEventData, setLoadingEventData] = useState(true);
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
      languageiso: businessUnit?.languageiso || "",
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
    if (!isIAuthLoading) {
      if (user) {
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
    }
  }, [user, isIAuthLoading]);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoadingEventData(true);
      try {
        const userIdentifier = user?.id;
        if (!userIdentifier || isIAuthLoading) {
          return;
        }

        const authorizationToken = await getAuthorizationToken();

        const staffData = await getStaff(userIdentifier, authorizationToken);
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
      } finally {
        setLoadingEventData(true);
      }
    };

    fetchStaffData();
  }, [user?.username, isIAuthLoading]);

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
        const authorizationToken = await getAuthorizationToken();

        const staffUseCaseData = await getSearchUseCaseForStaff(
          eventData.businessUnit.abbreviatedName,
          eventData.businessManager.publicCode,
          identificationNumber,
          authorizationToken,
        );
        setStaffUseCases(staffUseCaseData);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(JSON.stringify(error));
      }
    })();
  }, [
    eventData.businessUnit.abbreviatedName,
    eventData.businessManager.publicCode,
    eventData?.user?.identificationDocumentNumber,
  ]);

  useEffect(() => {
    if (isIAuthLoading || !portalCode) return;

    const validateConsultationAsync = async () => {
      const authorizationToken = await getAuthorizationToken();

      validateConsultation(portalCode, authorizationToken).then((data) => {
        setPortalData(data);
      });
    };

    validateConsultationAsync();
  }, [portalCode, isIAuthLoading]);

  const userIdentifier = eventData?.user?.identificationDocumentNumber;

  useEffect(() => {
    const fetchOptionStaff = async () => {
      try {
        if (
          !eventData?.portal?.publicCode ||
          !eventData?.businessUnit?.businessUnitPublicCode ||
          !user?.username ||
          isIAuthLoading
        ) {
          return;
        }

        const authorizationToken = await getAuthorizationToken();

        const result = await getSearchOptionForStaff(
          eventData.portal.publicCode,
          eventData.businessUnit.businessUnitPublicCode,
          userIdentifier || "",
          authorizationToken,
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
    isIAuthLoading,
  ]);

  useEffect(() => {
    if (!portalCode || isIAuthLoading) return;

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
  }, [portalData, portalCode, isIAuthLoading]);

  useEffect(() => {
    if (!businessManagers || isIAuthLoading) return;

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
  }, [businessManagers, portalData, portalCode, isIAuthLoading]);

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
          languageiso: businessUnit?.languageiso || "",
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
      isIAuthLoading,
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
      setOptionStaffData,
      showErrorModal,
      setShowErrorModal,
      messageError,
      loadingEventData,
    }),
    [
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      optionStaffData,
      isIAuthLoading,
      showErrorModal,
      setShowErrorModal,
      messageError,
      loadingEventData,
    ],
  );

  return appContext;
}

export { useAppContext };
