import { createContext, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { getSearchCustomerByCode } from "@services/customers/AllCustomers";
import { AppContext } from "@context/AppContext";

import { ICustomerContext, ICustomerData } from "./types";

export const CustomerContext = createContext<ICustomerContext>(
  {} as ICustomerContext,
);

interface ICustomerContextProviderProps {
  children: React.ReactNode;
}

export function CustomerContextProvider({
  children,
}: ICustomerContextProviderProps) {
  const { customerPublicCode } = useParams();
  const [customerData, setCustomerData] = useState<ICustomerData>({
    customerId: "",
    publicCode: "",
    fullName: "",
    natureClient: "",
    generalAttributeClientNaturalPersons: [
      {
        employmentType: "",
        associateType: "",
        typeIdentification: "",
        firstNames: "",
        lastNames: "",
        emailContact: "",
        cellPhoneContact: "",
        gender: "",
        dateBirth: "",
        zone: "",
      },
    ],
    generalAssociateAttributes: [
      {
        affiliateSeniorityDate: "",
        partnerStatus: "",
      },
    ],
  });

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  useEffect(() => {
    fetchCustomerData(customerPublicCode!, businessUnitPublicCode);
  }, [customerPublicCode, businessUnitPublicCode]);

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

  return (
    <CustomerContext.Provider value={{ customerData }}>
      {children}
    </CustomerContext.Provider>
  );
}
