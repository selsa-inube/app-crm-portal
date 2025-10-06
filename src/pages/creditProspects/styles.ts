import styled from "styled-components";

interface IStyledArrowBack {
  $isMobile: boolean;
}

export const StyledArrowBack = styled.div<IStyledArrowBack>`
  cursor: pointer;
  width: ${($isMobile) => ($isMobile ? "100px" : "500px")};
`;
