import { useEffect, useState } from "react";

import { ScoreModalProspectUI } from "./interface";
import { mockFirstScore, mockSecondScore } from "./config";
import { IScore } from "./types";

interface IScoreModalProspectProps {
  isMobile: boolean;
  handleClose: () => void;
}
export const ScoreModalProspect = (props: IScoreModalProspectProps) => {
  const { isMobile, handleClose } = props;

  const [firstScore, setFirstScore] = useState<IScore | null>(null);
  const [secondScore, setSecondScore] = useState<IScore | null>(null);
  const [newFirstScore, setNewFirstScore] = useState<IScore | null>(null);
  const [newSecondScore, setNewSecondScore] = useState<IScore | null>(null);

  useEffect(() => {
    setFirstScore(mockFirstScore);
    setSecondScore(mockSecondScore);
  }, []);

  const handleResetScores = (resetScore: "first" | "second") => {
    if (resetScore === "first") {
      setNewFirstScore(null);
    } else if (resetScore === "second") {
      setNewSecondScore(null);
    }
  };
  console.log({ newFirstScore, newSecondScore });
  return (
    <ScoreModalProspectUI
      isMobile={isMobile}
      firstScore={firstScore}
      secondScore={secondScore}
      handleClose={handleClose}
      setNewFirstScore={setNewFirstScore}
      setNewSecondScore={setNewSecondScore}
      newFirstScore={newFirstScore}
      newSecondScore={newSecondScore}
      handleResetScores={handleResetScores}
    />
  );
};
