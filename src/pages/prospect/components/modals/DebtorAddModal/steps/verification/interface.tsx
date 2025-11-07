import { MdArrowBack } from "react-icons/md";
import { Stack, Grid, Button } from "@inubekit/inubekit";

import { BoxAttribute } from "@components/data/BoxAttirbute";
import { Accordion } from "@components/data/Accordion";

import { StyledScrollContainer } from "./styles";
import { IDataVerificationStep } from "./types";
import { verificationDebtorAddModalConfig } from "./config";

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
      <Stack gap="8px" direction="column">
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
                )}
              </Accordion>
            ) : null;
          }),
        )}
      </Stack>
    </StyledScrollContainer>
  );
};
