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
  top: 74px;
  z-index: 1;
  width: 100%;
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
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: ${(props) => (props.$smallScreen ? "center" : "flex-start")};
  border: ${(props) => (props.$smallScreen ? "none" : "1px solid #E0E0E0")};
  border-radius: 8px;
  padding: 16px;

  & > * {
    flex: 1 1 calc(25% - 24px);
    min-width: 279px;
    max-width: calc(25% - 24px);
  }
`;

export {
  StyledTitle,
  StyledCollapse,
  StyledContainerCards,
  StyledGeneralHeader,
};
