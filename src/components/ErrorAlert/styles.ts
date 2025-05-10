import styled, { keyframes } from "styled-components";
import { inube } from "@inubekit/inubekit";

const slideDown = keyframes`
 
	0% {
		animation-timing-function: ease-in;
		opacity: 0;
		transform: translateY(-250px);
	}

	38% {
		animation-timing-function: ease-out;
		opacity: 1;
		transform: translateY(0);
	}

	55% {
		animation-timing-function: ease-in;
		transform: translateY(-65px);
	}

	72% {
		animation-timing-function: ease-out;
		transform: translateY(0);
	}

	81% {
		animation-timing-function: ease-in;
		transform: translateY(-28px);
	}

	90% {
		animation-timing-function: ease-out;
		transform: translateY(0);
	}

	95% {
		animation-timing-function: ease-in;
		transform: translateY(-8px);
	}

	100% {
		animation-timing-function: ease-out;
		transform: translateY(0);
	}

`;

export const AlertContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: center;
  position: relative;
  width: ${(props) => (props.$isMobile ? "calc(100%-10px)" : "100%")};
  margin: ${(props) => (props.$isMobile ? "0px 10px" : "0px")};
  padding: 7px;
  border-radius: 4px;
  background-color: ${({ theme }) =>
    theme?.palette?.yellow?.Y50 || inube.palette.yellow.Y50};
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  animation: ${slideDown} 2s ease-in-out;
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
