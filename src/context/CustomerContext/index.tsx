import { createContext, useState, useEffect, useContext } from "react";
import { useIAuth } from "@inube/iauth-react";

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
  const { getAccessTokenSilently } = useIAuth();
  const getInitialPublicCode = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("customerPublicCodeState") || "";
    }
    return "";
  };

  const [customerData, setCustomerData] =
    useState<ICustomerData>(initialCustomerData);
  const [loadingCustomerData, setLoadingCustomerData] = useState(true);

  const [customerPublicCodeState, setCustomerPublicCodeState] =
    useState<string>(getInitialPublicCode());
  const { businessUnitSigla, eventData } = useContext(AppContext);
  let businessUnitPublicCode: string = "";

  const businessManagerCode = eventData.businessManager.publicCode;

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
    setLoadingCustomerData(true);

    const authorizationToken = await getAccessTokenSilently();

    try {
      const customers = await getSearchCustomerByCode(
        publicCode,
        businessUnitPublicCode,
        businessManagerCode,
        false,
        authorizationToken,
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
          token: authorizationToken || "",
        });
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoadingCustomerData(false);
    }
  };

  useEffect(() => {
    if (customerPublicCodeState) {
      fetchCustomerData(customerPublicCodeState, businessUnitPublicCode);
    }
  }, [customerPublicCodeState, businessUnitPublicCode]);

  useEffect(() => {
    if (customerPublicCodeState) {
      localStorage.setItem("customerPublicCodeState", customerPublicCodeState);
    } else {
      localStorage.removeItem("customerPublicCodeState");
    }
  }, [customerPublicCodeState]);

  return (
    <CustomerContext.Provider
      value={{
        customerData,
        loadingCustomerData,
        setCustomerPublicCodeState,
        setCustomerData,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
