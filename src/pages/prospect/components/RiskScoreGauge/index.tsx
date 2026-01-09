import { inube, Stack, Text } from "@inubekit/inubekit";

import {
  StyledArc,
  StyledIndicator,
  StyledCenterText,
  StyledContainer,
  StyledSvg,
  StyledImgLogo,
  StyledContainerLogo,
} from "./style";
import { DataRiskScore } from "./config";

interface IRiskScoreGaugeProps {
  value: number;
  logo?: string;
}

export function RiskScoreGauge(props: IRiskScoreGaugeProps) {
  const { value, logo } = props;

  const min = DataRiskScore.min;
  const max = DataRiskScore.max;

  const COLORS = {
    red: inube.palette.red.R400,
    orange: inube.palette.yellow.Y400,
    yellow: inube.palette.yellow.Y200,
    green: inube.palette.green.G400,
    darkGreen: inube.palette.green.G500,
  };

  const percentage = (value - min) / (max - min);

  const gaugeWidth = 240;
  const gaugeHeight = 140;
  const radius = 100;
  const arcStrokeWidth = 8;

  const arcCenterX = gaugeWidth / 2;
  const arcCenterY = radius + arcStrokeWidth / 2 - 5;

  const startAngle = -210;
  const endAngle = 30;
  const totalAngleSpan = endAngle - startAngle;

  const segmentAngle = totalAngleSpan * 0.2;

  const transition1Angle = startAngle + segmentAngle;
  const transition2Angle = transition1Angle + segmentAngle;
  const transition3Angle = transition2Angle + segmentAngle;
  const transition4Angle = transition3Angle + segmentAngle;

  const currentAngle = startAngle + percentage * totalAngleSpan;
  const radians = (currentAngle * Math.PI) / 180;

  const indicatorX = arcCenterX + radius * Math.cos(radians);
  const indicatorY = arcCenterY + radius * Math.sin(radians);

  const getCoords = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: arcCenterX + radius * Math.cos(radians),
      y: arcCenterY + radius * Math.sin(radians),
    };
  };

  const startCoords = getCoords(startAngle);
  const t1Coords = getCoords(transition1Angle);
  const t2Coords = getCoords(transition2Angle);
  const t3Coords = getCoords(transition3Angle);
  const t4Coords = getCoords(transition4Angle);
  const endCoords = getCoords(endAngle);

  const largeArcFlag = 0;
  const sweepFlag = 1;

  const indicatorOuterRadius = 8;
  const indicatorInnerRadius = 3;

  return (
    <Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        width={`${gaugeWidth}px`}
      >
        <StyledContainer
          $width={`${gaugeWidth}px`}
          $height={`${gaugeHeight}px`}
        >
          <StyledSvg width={gaugeWidth} height={gaugeHeight}>
            <StyledArc
              d={`M ${startCoords.x} ${startCoords.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${t1Coords.x} ${t1Coords.y}`}
              stroke={COLORS.red}
              $strokeWidth={arcStrokeWidth}
            />
            <StyledArc
              d={`M ${t1Coords.x} ${t1Coords.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${t2Coords.x} ${t2Coords.y}`}
              stroke={COLORS.orange}
              $strokeWidth={arcStrokeWidth}
            />
            <StyledArc
              d={`M ${t2Coords.x} ${t2Coords.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${t3Coords.x} ${t3Coords.y}`}
              stroke={COLORS.yellow}
              $strokeWidth={arcStrokeWidth}
            />
            <StyledArc
              d={`M ${t3Coords.x} ${t3Coords.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${t4Coords.x} ${t4Coords.y}`}
              stroke={COLORS.green}
              $strokeWidth={arcStrokeWidth}
            />
            <StyledArc
              d={`M ${t4Coords.x} ${t4Coords.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endCoords.x} ${endCoords.y}`}
              stroke={COLORS.darkGreen}
              $strokeWidth={arcStrokeWidth}
            />
            <StyledIndicator
              cx={indicatorX}
              cy={indicatorY}
              r={indicatorOuterRadius}
            />
            <circle
              cx={indicatorX}
              cy={indicatorY}
              r={indicatorInnerRadius}
              fill="white"
            />
          </StyledSvg>
          <StyledCenterText $top={`${gaugeHeight / 2 - 20}px`}>
            <Text type="body" size="medium" appearance="primary">
              {DataRiskScore.riskScore}
            </Text>
            <Text
              type="headline"
              weight="bold"
              size="large"
              appearance="primary"
            >
              {value}
            </Text>
          </StyledCenterText>
        </StyledContainer>
        <Stack gap="150px" justifyContent="space-between" margin="20px 0 0 0">
          <Text type="label" size="medium">
            {min}
          </Text>
          <Text type="label" size="medium">
            {max}
          </Text>
        </Stack>
      </Stack>
      {logo && (
        <StyledContainerLogo>
          <StyledImgLogo url={logo} alt={DataRiskScore.altImg} />
        </StyledContainerLogo>
      )}
    </Stack>
  );
}
