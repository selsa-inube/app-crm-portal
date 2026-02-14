import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IStyledContainer {
  $smallScreen?: boolean;
  $typeTabs?: boolean;
}

const StyledTitle = styled.div<IStyledContainer>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-S300, 24px);
  align-self: stretch;
`;

const StyledGeneralHeader = styled.div`
  position: sticky;
  z-index: 1;
  width: 100%;
  height: 56px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledCollapse = styled.div`
  z-index: 2;
  position: absolute;
  top: 48px;
`;

const StyledContainerCards = styled.div<IStyledContainer>`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  border: ${(props) => (props.$smallScreen ? "none" : "1px solid #E0E0E0")};
  border-radius: 8px;
  padding: 16px;
  max-height: ${(props) => (props.$smallScreen ? "auto" : "550px")};
  overflow-y: auto;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  & > * {
    height: 130px;
  }

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
`;

export {
  StyledTitle,
  StyledCollapse,
  StyledContainerCards,
  StyledGeneralHeader,
};
