import { Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { RiskScore } from "@pages/simulateCredit/steps/riskScore";
import { Fieldset } from "@components/data/Fieldset";
import { urlMock } from "./config";

import { prospectScore } from "./config";
import { DataRiskScore } from "../RiskScoreGauge/config";
import { StyledImgNotFound } from "./styles";
import { IScore } from "./types";

interface IScoreModalProspectUIProps {
  isMobile: boolean;
  firstScore: IScore | null;
  secondScore: IScore | null;
  newFirstScore: IScore | null;
  newSecondScore: IScore | null;
  setNewFirstScore: React.Dispatch<React.SetStateAction<IScore | null>>;
  setNewSecondScore: React.Dispatch<React.SetStateAction<IScore | null>>;
  handleResetScores: (resetScore: "first" | "second") => void;
  handleClose: () => void;
}

export const ScoreModalProspectUI = (props: IScoreModalProspectUIProps) => {
  const {
    isMobile,
    firstScore,
    secondScore,
    handleClose,
    setNewFirstScore,
    setNewSecondScore,
    newFirstScore,
    newSecondScore,
    handleResetScores,
  } = props;

  return (
    <BaseModal
      title={DataRiskScore.riskScore}
      nextButton={
        firstScore === null && secondScore === null
          ? undefined
          : prospectScore.save
      }
      backButton={prospectScore.close}
      handleClose={handleClose}
      handleBack={handleClose}
      marginsMobile={isMobile}
      height={isMobile ? "auto" : "545px"}
      width={isMobile ? "270px" : "600px"}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        gap={isMobile ? "6px" : "16px"}
      >
        {firstScore !== null && (
          <RiskScore
            value={
              newFirstScore !== null
                ? newFirstScore.score || 0
                : firstScore.score || 0
            }
            date={
              newFirstScore !== null
                ? newFirstScore.date || ""
                : firstScore.date || ""
            }
            isMobile={isMobile}
            handleOnChange={(newRisk) =>
              setNewFirstScore({
                score: newRisk.value,
                date: new Date().toISOString(),
              })
            }
            logo={urlMock}
            resetScore={() => {
              handleResetScores("first");
            }}
            newScore={newFirstScore?.score || null}
            isProspect={true}
          />
        )}
        {secondScore !== null && (
          <RiskScore
            value={
              newSecondScore !== null
                ? newSecondScore.score || 0
                : secondScore.score || 0
            }
            date={
              newSecondScore !== null
                ? newSecondScore.date || ""
                : secondScore.date || ""
            }
            isMobile={isMobile}
            handleOnChange={(newRisk) =>
              setNewSecondScore({
                score: newRisk.value,
                date: new Date().toISOString(),
              })
            }
            logo={urlMock}
            resetScore={() => {
              handleResetScores("second");
            }}
            newScore={newSecondScore?.score || null}
            isProspect={true}
          />
        )}

        {firstScore === null && secondScore === null && (
          <Fieldset>
            <Stack
              alignItems="center"
              direction="column"
              gap="20px"
              padding="24px"
            >
              <StyledImgNotFound />
              <Text>{prospectScore.notFount}</Text>
            </Stack>
          </Fieldset>
        )}
      </Stack>
    </BaseModal>
  );
};
