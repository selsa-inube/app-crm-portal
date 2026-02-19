import { useState, useCallback } from "react";
import { useFlag } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum/useEnum";
import { ICRMPortalData } from "@context/AppContext/types";
import { IProspect } from "@services/prospect/types";
import { updateProspect } from "@services/prospect/updateProspect";

import { ScoreModalProspectUI } from "./interface";
import { IScore } from "./types";
import { creditScoreChanges } from "./config";

interface IScoreModalProspectProps {
  isMobile: boolean;
  lang: EnumType;
  customerPublicCode: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  handleClose: () => void;
  setShowMessageSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  eventData: ICRMPortalData;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  prospectData: IProspect;
  onProspectRefreshData: (() => void) | undefined;
}
export const ScoreModalProspect = (props: IScoreModalProspectProps) => {
  const {
    isMobile,
    lang,
    handleClose,
    businessUnitPublicCode,
    businessManagerCode,
    setMessageError,
    eventData,
    setShowErrorModal,
    prospectData,
    onProspectRefreshData,
  } = props;

  const { addFlag } = useFlag();

  const [newFirstScore, setNewFirstScore] = useState<IScore | null>(null);
  const [newSecondScore, setNewSecondScore] = useState<IScore | null>(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const getScoresFromProspect = useCallback((): {
    first: IScore | null;
    second: IScore | null;
  } => {
    const mainBorrower = prospectData?.borrowers?.find(
      (borower) => borower.borrowerType === "MainBorrower",
    );

    if (!mainBorrower) return { first: null, second: null };

    const scoreProps = mainBorrower.borrowerProperties.filter(
      (property) => property.propertyName === "CreditBureauScore",
    );

    const parseScore = (raw: string): IScore => {
      const [scoreValue, date, bureauName] = raw.split(",");
      return {
        score: Number(scoreValue),
        date: date || "",
        bureauName: bureauName || "",
        isActive: true,
      };
    };

    return {
      first: scoreProps[0] ? parseScore(scoreProps[0].propertyValue) : null,
      second: scoreProps[1] ? parseScore(scoreProps[1].propertyValue) : null,
    };
  }, [prospectData]);

  const { first: firstScore, second: secondScore } = getScoresFromProspect();

  const handleSave = async () => {
    setIsLoadingSubmit(true);
    try {
      const mainBorrowerIndex = prospectData.borrowers.findIndex(
        (borower) => borower.borrowerType === "MainBorrower",
      );

      if (mainBorrowerIndex === -1) return;

      const mainBorrower = prospectData.borrowers[mainBorrowerIndex];

      const otherProperties = mainBorrower.borrowerProperties.filter(
        (property) => property.propertyName !== "CreditBureauScore",
      );

      const updatedScoreProps = [];

      const buildScoreValue = (score: IScore) =>
        `${score.score},${score.date},${score.bureauName.toUpperCase().replace(/ /g, "_")}`;

      if (firstScore) {
        const resolved = newFirstScore ?? firstScore;
        updatedScoreProps.push({
          propertyName: "CreditBureauScore",
          propertyValue: buildScoreValue(resolved as IScore),
        });
      }

      if (secondScore) {
        const resolved = newSecondScore ?? secondScore;
        updatedScoreProps.push({
          propertyName: "CreditBureauScore",
          propertyValue: buildScoreValue(resolved as IScore),
        });
      }

      const updatedBorrower = {
        ...mainBorrower,
        borrowerProperties: [...otherProperties, ...updatedScoreProps],
      };

      const updatedBorrowers = [...prospectData.borrowers];
      updatedBorrowers[mainBorrowerIndex] = updatedBorrower;

      const updatedProspect: IProspect = {
        ...prospectData,
        borrowers: updatedBorrowers,
      };

      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
        eventData.token,
      );

      handleClose();

      if (onProspectRefreshData) onProspectRefreshData();

      addFlag({
        title: creditScoreChanges.title.i18n[lang],
        description: creditScoreChanges.description.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

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
      lang={lang}
      handleSave={handleSave}
      isLoadingSubmit={isLoadingSubmit}
    />
  );
};
