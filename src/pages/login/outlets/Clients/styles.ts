import styled from "styled-components";

interface StyledBusinessUnitsListProps {
  $scroll?: boolean;
  $isMobile?: boolean;
}

interface StyledBusinessUnitsProps {
  $isMobile?: boolean;
}

const StyledBusinessUnits = styled.div<StyledBusinessUnitsProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  & form {
    & > div {
      margin: "48px 0";
      width: ${({ $isMobile }) => ($isMobile ? "auto%" : "500px")};
    }
  }

  & button {
    margin-top: "24px";
  }
`;

const StyledBusinessUnitsList = styled.div<StyledBusinessUnitsListProps>`
  & > div {
    list-style: none;
    min-height: ${({ $isMobile }) => ($isMobile ? "200px" : "300px")};
    max-height: 430px;
    width: inherit;
    overflow-y: ${({ $scroll }) => ($scroll ? "scroll" : "visible")};
  }
`;

const StyledNoResults = styled.div`
  margin: "16px 0";
`;

const StyledBusinessUnitsItem = styled.li`
  width: 100%;
`;

export {
  StyledBusinessUnits,
  StyledBusinessUnitsList,
  StyledNoResults,
  StyledBusinessUnitsItem,
};
