import { useState, useEffect, useMemo } from "react";

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
import { useIAuth } from "@context/authContext";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  urlLogo: string;
}

function useAppContext() {
  const { user } = useIAuth();
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

  const getUserPermissions = (identificationDocumentNumber: string) => {
    const isAdmon = identificationDocumentNumber === "elyerogo@gmail.com";
    return {
      canReject: isAdmon,
      canCancel: isAdmon,
      canPrint: isAdmon,
      canAttach: false,
      canViewAttachments: false,
      canManageGuarantees: isAdmon,
      canViewCreditProfile: false,
      canManageDisbursementMethods: isAdmon,
      canAddRequirements: false,
      canSendDecision: isAdmon,
      canChangeUsers: isAdmon,
      canApprove: isAdmon,
      canSubmitProspect: isAdmon,
    };
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const userIdentifier = user?.username;
        if (!userIdentifier) return;
        const staffData = await getStaff(userIdentifier);
        if (!staffData.length) return;
        const userPermissions = getUserPermissions(
          staffData[0].identificationDocumentNumber,
        );
        setEventData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            staff: {
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
              useCases: userPermissions,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    if (user?.username) {
      fetchStaffData();
    }
  }, [user?.username]);

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
    },
    businessUnit: {
      businessUnitPublicCode: businessUnit?.businessUnitPublicCode || "",
      abbreviatedName: businessUnit?.abbreviatedName || "",
      languageId: businessUnit?.languageId || "",
      urlLogo: businessUnit?.urlLogo || "",
    },
    user: {
      userAccount: user?.username || "",
      userName: user?.username || "",
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
        useCases: {
          canReject: false,
          canCancel: false,
          canPrint: false,
          canAttach: false,
          canViewAttachments: false,
          canManageGuarantees: false,
          canViewCreditProfile: false,
          canManageDisbursementMethods: false,
          canAddRequirements: false,
          canSendDecision: false,
          canChangeUsers: false,
          canApprove: false,
          canSubmitProspect: false,
        },
      },
    },
  });

  useEffect(() => {
    validateConsultation(portalCode).then((data) => {
      setPortalData(data);
    });
  }, []);

  useEffect(() => {
    const fetchOptionStaff = async () => {
      try {
        if (
          !eventData?.portal?.publicCode ||
          !eventData?.businessUnit?.businessUnitPublicCode ||
          !user?.username
        ) {
          return;
        }

        const result = await getSearchOptionForStaff(
          eventData.portal.publicCode,
          eventData.businessUnit.businessUnitPublicCode,
          "ossalincon422@gmail.",
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
  ]);

  useEffect(() => {
    if (!portalCode) return;
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
  }, [portalData, portalCode]);

  useEffect(() => {
    if (!businessManagers) return;

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
      },
    }));
  }, [businessManagers, portalData, portalCode]);

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

  const appContext = useMemo(
    () => ({
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      optionStaffData,
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
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
    ],
  );

  return appContext;
}

export { useAppContext };
