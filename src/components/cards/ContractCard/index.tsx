import { Stack, Text, Divider, Button } from "@inubekit/inubekit";
import { MdOutlineVisibility } from "react-icons/md";

import { spacing } from "@design/tokens/spacing";
import { currencyFormat } from "@utils/forms/currency";

import { StyledContractCard, StyledSeparatorLine } from "./styles";

interface ContractCardProps {
  contractNumber: number;
  isContractValid: boolean;
  startDate: string;
  endDate: string;
  lastCharge: string;
  lastSalary: number;
  contractType: string;
  normativeFramework: string;
  company: string;
  workplace: string;
  formalizationDate: string;
  salaryProfile: number;
  retirementDate?: string;
  retirementReason?: string;
  onDetailsClick?: () => void;
}

function ContractCard(props: ContractCardProps) {
  const {
    isContractValid = true,
    startDate,
    endDate,
    lastCharge,
    lastSalary,
    contractType,
    normativeFramework,
    company,
    onDetailsClick,
  } = props;

  return (
    <Stack
      direction="column"
      alignItems="center"
      width="212px"
      gap={spacing.s100}
      padding={spacing.s150}
    >
      <Text
        type="title"
        weight={isContractValid ? "bold" : "normal"}
        size="medium"
        appearance={isContractValid ? "primary" : "gray"}
      >
        {isContractValid ? "Vigente" : "Terminado"}
      </Text>
      <StyledContractCard>
        <Stack direction="column" alignItems="center" gap={spacing.s100}>
          <Stack gap={spacing.s100}>
            <Stack direction="column" alignItems="center" width="97px">
              <Text type="label" weight="bold" size="small" appearance="primary">
                Desde
              </Text>
              <Text appearance="gray" size="small">
                {startDate}
              </Text>
            </Stack>
            <StyledSeparatorLine />
            <Stack direction="column" alignItems="center" width="97px">
              <Text type="label" weight="bold" size="small" appearance="primary">
                Hasta
              </Text>
              <Text appearance="gray" size="small">
                {endDate}
              </Text>
            </Stack>
          </Stack>
          <Divider dashed />
          <Stack direction="column" alignItems="flex-start" width="100%" gap={spacing.s150}>
            <Stack direction="column" gap={spacing.s050}>
              <Text type="label" weight="bold" size="medium">
                Último cargo
              </Text>
              <Text size="medium" appearance="gray">
                {lastCharge}
              </Text>
            </Stack>
            <Stack direction="column" gap={spacing.s050}>
              <Text type="label" weight="bold" size="medium">
                Último salario
              </Text>
              <Text size="medium" appearance="gray">
                {currencyFormat(lastSalary)}
              </Text>
            </Stack>
            <Stack direction="column" gap={spacing.s050}>
              <Text type="label" weight="bold" size="medium">
                Tipo de contrato
              </Text>
              <Text size="medium" appearance="gray">
                {contractType}
              </Text>
            </Stack>
            <Stack direction="column" gap={spacing.s050}>
              <Text type="label" weight="bold" size="medium">
                Marco normativo
              </Text>
              <Text size="medium" appearance="gray">
                {normativeFramework}
              </Text>
            </Stack>
            <Stack direction="column" gap={spacing.s050}>
              <Text type="label" weight="bold" size="medium">
                Empresa
              </Text>
              <Text size="medium" appearance="gray">
                {company}
              </Text>
            </Stack>
          </Stack>
          <Divider dashed />
          <Stack justifyContent="flex-end" width="100%">
            <Button
              variant="none"
              iconBefore={<MdOutlineVisibility />}
              spacing="compact"
              cursorHover
              onClick={onDetailsClick}
            >
              Más detalles
            </Button>
          </Stack>
        </Stack>
      </StyledContractCard>
    </Stack>
  );
}

export { ContractCard };
export type { ContractCardProps };
