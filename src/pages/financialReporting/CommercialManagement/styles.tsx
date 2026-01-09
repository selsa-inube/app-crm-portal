import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledCollapseIcon {
  $collapse: boolean;
  $isMobile?: boolean;
}

interface IStyledCardsCredit {
  $isMobile: boolean;
}

export const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.blue?.B400 || inube.palette.blue.B400};
  cursor: pointer;
`;

export const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  width: 26px;
  height: 26px;
  transition: all 500ms ease;
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(-90deg)" : "rotate(90deg)"};
`;

export const StyledFieldset = styled.div`
  padding: "4px";
  position: relative;

  @media print {
    border: none;
    overflow-y: visible !important;
    height: auto !important;
    width: 100% !important;
  }
`;

export const StyledCardsCredit = styled.div<IStyledCardsCredit>`
  overflow-x: auto;
  align-items: center;

  &::-webkit-scrollbar {
    height: 8px;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }

  @media (max-width: 800px) {
    height: ${({ $isMobile }) => ($isMobile ? "500px" : "100%")};
    overflow-y: auto;
    display: grid;
    place-items: center;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) =>
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
      border-radius: 8px;
    }
  }

  @media print {
    & > div {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      min-width: 100%;
    }
    overflow-y: visible !important;
    height: auto !important;
  }
`;

export const StyledContainerIcon = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
`;

export const StyledVerticalDivider = styled.hr`
  margin: 0px 10px;
  width: 2px;
  height: 28px;
  border: none;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
