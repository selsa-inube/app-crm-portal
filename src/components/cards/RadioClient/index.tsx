import { useMediaQueries, Grid, Text } from "@inubekit/inubekit";
import { spacing } from "@design/tokens/spacing";

import { StyledRadioClient, StyledRadio, StyledImage } from "./styles";

export interface RadioClientProps {
  name: string;
  id: string;
  value: string;
  label: string;
  logo: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

function RadioClient(props: RadioClientProps) {
  const { name, id, value, label, logo, handleChange } = props;

  const mediaQueries = ["(max-width: 532px)", "(max-width: 460px)"];
  const matches = useMediaQueries(mediaQueries);

  const isMobile = matches["(max-width: 460px)"];

  return (
    <StyledRadioClient>
      <Grid
        templateColumns={isMobile ? "auto 1fr" : "auto 1fr 130px"}
        padding={matches["(max-width: 532px)"] ? "8px 16px" : "16px 24px"}
        height={matches["(max-width: 532px)"] ? "auto" : "72px"}
        alignItems="center"
        alignContent="center"
        gap={spacing.s200}
        width="100%"
      >
        <StyledRadio type="radio" name={name} id={id} value={value} onChange={handleChange} />
        <Text size="medium">{label}</Text>

        {!isMobile && <StyledImage src={logo} alt="Logo de empresa" />}
      </Grid>
    </StyledRadioClient>
  );
}

export { RadioClient };
