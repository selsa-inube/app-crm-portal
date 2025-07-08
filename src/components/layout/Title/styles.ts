import styled from "styled-components";

const StyledContainerText = styled.div`
  display: flex;
  width: 70%;

  & > p {
    word-break: keep-all;
    white-space: normal;
  }
`;

export { StyledContainerText };
