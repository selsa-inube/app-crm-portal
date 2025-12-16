import { MdArrowBack, MdOutlinePaid } from "react-icons/md";
import { Stack, Grid, Button, Text, Icon } from "@inubekit/inubekit";

import { BoxAttribute } from "@components/data/BoxAttirbute";
import { Accordion } from "@components/data/Accordion";

import { StyledBoxAttribute, StyledScrollContainer } from "./styles";
import { IDataVerificationStep } from "./types";
import {
  verificatioModalConfig,
  verificationDebtorAddModalConfig,
} from "./config";

interface IVerificationDebtorAddModalUIProps {
  dataVerificationStep: IDataVerificationStep[];
  keySections: string[];
  isMobile: boolean;
  setCurrentStep: (step: number) => void;
}

export const VerificationDebtorAddModalUI = (
  props: IVerificationDebtorAddModalUIProps,
) => {
  const { dataVerificationStep, keySections, isMobile, setCurrentStep } = props;
  const totalSections = dataVerificationStep.reduce((count, dataStept) => {
    return (
      count +
      keySections.filter((keySection) => {
        const section = dataStept.sections[keySection];
        return section.attributes.length > 0 || section.customComponent;
      }).length
    );
  }, 0);

  const hasScroll = totalSections > 2;

  return (
    <StyledScrollContainer $hasScroll={hasScroll}>
      <Stack gap="20px" direction="column">
        <Stack gap="16px">
          <StyledBoxAttribute>
            <Icon appearance={"primary"} icon={<MdOutlinePaid />}></Icon>
            <Stack direction="column">
              <Text type="title" size="small" appearance="dark" weight="bold">
                {verificatioModalConfig.title}
              </Text>
              <Text appearance="gray" size="small">
                {verificatioModalConfig.description}
              </Text>
            </Stack>
          </StyledBoxAttribute>
          <StyledBoxAttribute>
            <Icon appearance={"primary"} icon={<MdOutlinePaid />}></Icon>
            <Stack direction="column">
              <Text type="title" size="small" appearance="dark" weight="bold">
                {verificatioModalConfig.titleCredit}
              </Text>
              <Text appearance="gray" size="small">
                {verificatioModalConfig.descriptionCredit}
              </Text>
            </Stack>
          </StyledBoxAttribute>
        </Stack>
        {dataVerificationStep.map((dataStept) =>
          keySections.map((keySection) => {
            const section = dataStept.sections[keySection];
            const hasContent =
              section.attributes.length > 0 || section.customComponent;

            return hasContent ? (
              <Accordion key={keySection} title={section.title} dashed={true}>
                {section.customComponent ? (
                  <>
                    {section.customComponent}
                    <Stack justifyContent="flex-end" width="100%">
                      <Button
                        variant="none"
                        appearance="dark"
                        spacing="compact"
                        iconBefore={<MdArrowBack />}
                        onClick={() => setCurrentStep(section.stepNumber)}
                      >
                        {verificationDebtorAddModalConfig.back}
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Grid
                      templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                      width="-webkit-fill-available"
                      autoRows="auto"
                      gap="10px"
                    >
                      {section.attributes.map((attribute) => (
                        <BoxAttribute
                          key={attribute.attribute}
                          attribute={attribute.attribute}
                          value={attribute.value}
                        />
                      ))}
                    </Grid>
                    {section.stepNumber !== 0 && (
                      <Stack justifyContent="flex-end" width="100%">
                        <Button
                          variant="none"
                          appearance="dark"
                          spacing="compact"
                          iconBefore={<MdArrowBack />}
                          onClick={() => setCurrentStep(section.stepNumber)}
                        >
                          {verificationDebtorAddModalConfig.back}
                        </Button>
                      </Stack>
                    )}
                  </>
                )}
              </Accordion>
            ) : null;
          }),
        )}
      </Stack>
    </StyledScrollContainer>
  );
};
