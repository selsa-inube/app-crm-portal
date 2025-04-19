import React from "react";
import { Button, Stack, Text, useMediaQuery } from "@inubekit/inubekit";

import { RadioClient } from "@components/cards/RadioClient";
import { IClient } from "@context/AppContext/types";
import { spacing } from "@design/tokens/spacing";

import { StyledClients, StyledClientsList, StyledClientsItem } from "./styles";
import { textsConfig } from "./config";

interface ClientsUIProps {
  clients: IClient[];
  client: {
    ref: HTMLInputElement | null;
    value: boolean;
  };
  handleClientChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event?: Event) => void;
}

function ClientsUI(props: ClientsUIProps) {
  const { clients, client, handleClientChange, handleSubmit } = props;
  const isMobile = useMediaQuery("(max-width: 461px)");

  return (
    <StyledClients>
      <Stack direction="column" alignItems="center" gap={spacing.s200}>
        <Text type="title" as="h2" textAlign="center">
          {textsConfig.clientsTitle}
        </Text>
        <Text size="medium" textAlign="center">
          {textsConfig.clientsSubtitle}
        </Text>
      </Stack>
      <form>
        <Stack direction="column">
          <StyledClientsList $scroll={clients.length > 5 && !isMobile} $isMobile={isMobile}>
            <Stack
              direction="column"
              alignItems="center"
              gap={isMobile ? spacing.s150 : spacing.s200}
            >
              {clients.map((clientItem) => (
                <StyledClientsItem key={clientItem.id}>
                  <RadioClient
                    name="client"
                    label={clientItem.name}
                    id={clientItem.id}
                    value={clientItem.name}
                    logo={clientItem.logo}
                    handleChange={handleClientChange}
                  />
                </StyledClientsItem>
              ))}
            </Stack>
          </StyledClientsList>
          <Stack justifyContent="end">
            <Button
              type="button"
              disabled={client.value}
              onClick={handleSubmit}
              fullwidth={isMobile}
            >
              {textsConfig.continueButton}
            </Button>
          </Stack>
        </Stack>
      </form>
    </StyledClients>
  );
}

export { ClientsUI };
