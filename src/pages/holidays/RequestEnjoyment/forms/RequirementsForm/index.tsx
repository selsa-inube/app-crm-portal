import React from "react";
import { Stack, Button, useMediaQuery } from "@inubekit/inubekit";

import { AlertCard } from "@components/data/AlertCard";

import { StyledContainer } from "./styles";
import { alerts } from "./config/alertConfig";

interface AlertCardContainerProps {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

const AlertCardContainer: React.FC<AlertCardContainerProps> = ({
  handlePreviousStep,
  handleNextStep,
}) => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <Stack direction="column" gap="16px">
      <StyledContainer $isMobile={isMobile}>
        {alerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))}
      </StyledContainer>
      <Stack direction="row" justifyContent="flex-end" gap="8px">
        <Button appearance="gray" variant="outlined" onClick={handlePreviousStep}>
          Anterior
        </Button>
        <Button appearance="primary" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Stack>
    </Stack>
  );
};

export { AlertCardContainer };
