import { createContext, useState, useEffect, useContext } from "react";

import { getSearchCustomerByCode } from "@services/customer/SearchCustomerCatalogByCode";
import { AppContext } from "@context/AppContext";

import { ICustomerContext, ICustomerData, initialCustomerData } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
export const CustomerContext = createContext<ICustomerContext>(
  {} as ICustomerContext,
);

interface ICustomerContextProviderProps {
  children: React.ReactNode;
}

export function CustomerContextProvider({
  children,
}: ICustomerContextProviderProps) {
  const getInitialPublicCode = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crmPortal-customerPublicCodeState") || "";
    }
    return "";
  };

  const [customerData, setCustomerData] =
    useState<ICustomerData>(initialCustomerData);

  const [customerPublicCodeState, setCustomerPublicCodeState] =
    useState<string>(getInitialPublicCode());
  const { businessUnitSigla } = useContext(AppContext);
  let businessUnitPublicCode: string = "";

  try {
    if (businessUnitSigla) {
      const parsed = JSON.parse(businessUnitSigla);
      businessUnitPublicCode = parsed?.businessUnitPublicCode || "";
    }
  } catch (e) {
    businessUnitPublicCode = "";
  }

  const fetchCustomerData = async (
    publicCode: string,
    businessUnitPublicCode: string,
  ) => {
    try {
      const customers = await getSearchCustomerByCode(
        publicCode,
        businessUnitPublicCode,
      );

      if (customers) {
        setCustomerData({
          customerId: customers.customerId,
          publicCode: customers.publicCode,
          fullName: customers.fullName,
          natureClient: customers.natureClient,
          generalAttributeClientNaturalPersons: Array.isArray(
            customers.generalAttributeClientNaturalPersons,
          )
            ? customers.generalAttributeClientNaturalPersons
            : [],
          generalAssociateAttributes: Array.isArray(
            customers.generalAssociateAttributes,
          )
            ? customers.generalAssociateAttributes
            : [],
        });
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    if (customerPublicCodeState) {
      fetchCustomerData(customerPublicCodeState, businessUnitPublicCode);
    }
  }, [customerPublicCodeState, businessUnitPublicCode]);

  useEffect(() => {
    if (customerPublicCodeState) {
      localStorage.setItem(
        "crmPortal-customerPublicCodeState",
        customerPublicCodeState,
      );
    } else {
      localStorage.removeItem("crmPortal-customerPublicCodeState");
    }
  }, [customerPublicCodeState]);

  return (
    <CustomerContext.Provider
      value={{ customerData, setCustomerPublicCodeState, setCustomerData }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
