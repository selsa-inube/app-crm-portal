import { Text, Grid, useMediaQueries, useMediaQuery } from "@inubekit/inubekit";

import { StyledImage, StyledRadio, StyledRadioBusinessUnit } from "./styles";

interface RadioBusinessUnitProps {
  name: string;
  id: string;
  value: string;
  label: string;
  logo: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

function RadioBusinessUnit(props: RadioBusinessUnitProps) {
  const { name, id, value, label, logo, handleChange } = props;

  const mediaQueries = ["(max-width: 532px)", "(max-width: 460px)"];
  const matches = useMediaQueries(mediaQueries);
  const isMobile = useMediaQuery("(max-width: 532px)");
  const hasLogo = logo !== "" && logo !== undefined;

  return (
    <StyledRadioBusinessUnit>
      <Grid
        templateColumns={
          matches["(max-width: 460px)"] ? "auto 1fr" : "auto 1fr 130px"
        }
        padding={matches["(max-width: 532px)"] ? "8px 16px" : "16px 24px"}
        height={matches["(max-width: 532px)"] ? "auto" : "72px"}
        alignItems="center"
        alignContent="center"
        gap="16px"
        width="100%"
      >
        <StyledRadio
          type="radio"
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
        />
        <Text size="medium">{label}</Text>
        <StyledImage
          hasLogo={hasLogo}
          $isMobile={isMobile}
          src={logo}
          alt="Logo de empresa"
        />
      </Grid>
    </StyledRadioBusinessUnit>
  );
}

export { RadioBusinessUnit };
export type { RadioBusinessUnitProps };
