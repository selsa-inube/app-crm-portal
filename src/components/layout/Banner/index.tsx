import { Text, Icon, Stack, useMediaQuery } from "@inubekit/inubekit";
import { useNavigate } from "react-router-dom";
import { MdOutlineGroup } from "react-icons/md";

import bannerImage from "@assets/images/banner.png";
import { spacing } from "@design/tokens/spacing";

import { getStatusConfig } from "./config";
import { StyledRadioClient, StyledBannerImage } from "./styles";

export interface VinculationBannerProps {
  name: string;
  status: string;
  imageUrl: string;
  redirectUrl?: string;
}

function VinculationBanner(props: VinculationBannerProps) {
  const { name, status, redirectUrl } = props;

  const navigate = useNavigate();

  const { color, icon, label } = getStatusConfig(status);

  const isMobile = useMediaQuery("(max-width: 550px)");

  return (
    <StyledRadioClient>
      <Stack
        gap={spacing.s150}
        alignItems="center"
        justifyContent={isMobile ? "space-between" : "flex-start"}
        width="100%"
      >
        <Stack gap={spacing.s150}>
          <StyledBannerImage src={bannerImage} alt={name} />
          <Stack direction="column">
            <Text type="label" weight="bold" size="medium">
              {name}
            </Text>
            <Stack gap={spacing.s075} alignItems="center">
              <Icon
                appearance={color}
                icon={icon}
                spacing="narrow"
                shape="rectangle"
                variant="outlined"
                size="12px"
              />
              <Text type="label" size="small" appearance={color}>
                {label}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        {redirectUrl ? (
          <Icon
            appearance="primary"
            icon={<MdOutlineGroup />}
            cursorHover={true}
            spacing="narrow"
            variant="outlined"
            shape="rectangle"
            size="22px"
            onClick={() => navigate(redirectUrl)}
          />
        ) : null}
      </Stack>
    </StyledRadioClient>
  );
}

export { VinculationBanner };
