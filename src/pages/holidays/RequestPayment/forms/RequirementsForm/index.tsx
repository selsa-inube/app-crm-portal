import { Stack, Button, useMediaQuery } from "@inubekit/inubekit";

import { AlertCard } from "@components/data/AlertCard";
import { spacing } from "@design/tokens/spacing";

import { StyledContainer } from "./styles";
import { alerts } from "./config/alertConfig";

interface AlertCardContainerProps {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

const AlertCardStep = ({ handlePreviousStep, handleNextStep }: AlertCardContainerProps) => {
  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <Stack direction="column" gap={spacing.s200}>
      <StyledContainer $isMobile={isMobile}>
        {alerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))}
      </StyledContainer>
      <Stack justifyContent="flex-end" gap={spacing.s100}>
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

export { AlertCardStep };
