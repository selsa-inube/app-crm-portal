import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IStyledCenterText {
  $top: string;
}

interface IStyledContainer {
  $width: string;
  $height: string;
}
interface IStyledArc {
  $strokeWidth?: number;
}

interface IStyledImgLogo {
  url: string;
}

export const StyledContainer = styled.div<IStyledContainer>`
  position: relative;
  width: ${(prop) => prop.$width};
  height: ${(prop) => prop.$height};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSvg = styled.svg`
  overflow: visible;
`;

export const StyledArc = styled.path<IStyledArc>`
  fill: none;
  stroke-width: ${(prop) => prop.$strokeWidth || 10}px;
  stroke-linecap: round;
`;

export const StyledIndicator = styled.circle`
  fill: ${inube.palette.blue.B400};
  stroke: white;
  stroke-width: 3px;
`;

export const StyledCenterText = styled.div<IStyledCenterText>`
  position: absolute;
  top: ${(prop) => prop.$top};
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StyledImgLogo = styled.img<IStyledImgLogo>`
  content: url("${(prop) => prop.url}");
  width: 100px;
  height: 50px;
  position: absolute;
  top: 130px;
  left: -170px;
  border: none;
`;

export const StyledContainerLogo = styled.div`
  position: relative;
`;
