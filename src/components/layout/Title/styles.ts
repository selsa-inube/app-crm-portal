import styled from "styled-components";

const StyledContainerText = styled.div`
  display: flex;

  & > p {
    word-break: keep-all;
    white-space: normal;
  }
`;

export { StyledContainerText };
