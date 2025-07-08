import { inube } from "@inubekit/inubekit";
import styled, { keyframes } from "styled-components";

const pulseRing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
`;

export const StyledMic = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${({ theme }) =>
      theme?.palette?.blue?.B400 || inube.palette.blue.B400};
    animation: ${pulseRing} 1.5s infinite;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const StyledAutomatic = styled.div`
  width: 100%;
`;
