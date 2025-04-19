import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "@context/AppContext/useAppContext";
import { IClient } from "@context/AppContext/types";
import { IBusinessUnit } from "@ptypes/employeePortalBusiness.types";

import { ClientsUI } from "./interface";
import { IClientLocal } from "./types";

export interface ClientsProps {
  businessUnits?: IBusinessUnit[];
  handleClientChange?: (client: IClient) => void;
}

const ClientsWithProps = (props: ClientsProps) => {
  const navigate = useNavigate();

  const clients: IClient[] = (props.businessUnits ?? []).map((unit) => ({
    id: unit.businessUnitPublicCode,
    name: unit.descriptionUse,
    sigla: unit.abbreviatedName,
    logo: unit.urlLogo,
  }));

  const [clientLocal, setClientLocal] = useState<IClientLocal>({
    ref: null,
    value: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientLocal({ ref: event.target, value: false });
    const selectedClient = clients.find((client) => client.name === event.target.value);

    if (selectedClient && props.handleClientChange) {
      props.handleClientChange(selectedClient);
    }
  };

  const handleSubmit = () => {
    navigate("/login/loading-app");
  };

  return (
    <ClientsUI
      clients={clients}
      client={clientLocal}
      handleClientChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

const ClientsWithContext = () => {
  const context = useAppContext();
  const navigate = useNavigate();

  const clients: IClient[] = (context.businessUnits ?? []).map((unit) => ({
    id: unit.businessUnitPublicCode,
    name: unit.descriptionUse,
    sigla: unit.abbreviatedName,
    logo: unit.urlLogo,
  }));

  const [clientLocal, setClientLocal] = useState<IClientLocal>({
    ref: null,
    value: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientLocal({ ref: event.target, value: false });
    const selectedClient = clients.find((client) => client.name === event.target.value);
    if (selectedClient && context.handleClientChange) {
      context.handleClientChange(selectedClient);
    }
  };

  const handleSubmit = () => {
    navigate("/login/loading-app");
  };

  return (
    <ClientsUI
      clients={clients}
      client={clientLocal}
      handleClientChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

function Clients(props: ClientsProps) {
  if (props.businessUnits && props.handleClientChange) {
    return (
      <ClientsWithProps
        businessUnits={props.businessUnits}
        handleClientChange={props.handleClientChange}
      />
    );
  }

  return <ClientsWithContext />;
}

export { Clients };
