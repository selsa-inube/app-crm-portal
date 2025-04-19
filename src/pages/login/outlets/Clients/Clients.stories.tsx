import React from "react";
import { BrowserRouter } from "react-router-dom";

import { clientsDataMock } from "@mocks/login/clients.mock";
import { IClient } from "@context/AppContext/types";

import { Clients } from ".";

const story = {
  components: [Clients],
  title: "layout/login/outlets/clients",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: React.ElementType) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const handleClientChange = (client: IClient) => {
  console.log("Cliente seleccionado:", client);
};

const Default = () => (
  <Clients handleClientChange={handleClientChange} businessUnits={clientsDataMock} />
);

export { Default };
export default story;
