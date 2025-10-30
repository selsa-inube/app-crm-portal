import { MdCheck } from "react-icons/md";
import { Stack, Icon, Divider } from "@inubekit/inubekit";

import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

import {
  StyledContainer,
  StyledUl,
  StyledLi,
  StyledImg,
  StyledContainerOption,
} from "./styles";

interface BusinessUnitChangeProps {
  businessUnits: IBusinessUnitsPortalStaff[];
  selectedClient: string;
  onLogoClick: (businessUnit: IBusinessUnitsPortalStaff) => void;
}

const BusinessUnitChange = (props: BusinessUnitChangeProps) => {
  const { businessUnits, selectedClient, onLogoClick } = props;

  return (
    <StyledContainer>
      <Stack width="200px">
        <StyledUl>
          {businessUnits.map((businessUnit, index) => (
            <StyledContainerOption
              key={businessUnit.businessUnitPublicCode}
              onClick={() => onLogoClick(businessUnit)}
            >
              <StyledLi>
                <StyledImg
                  src={businessUnit.urlLogo}
                  alt={businessUnit.abbreviatedName}
                />
                {selectedClient === businessUnit.abbreviatedName && (
                  <Stack margin={`0px 12px 0`}>
                    <Icon
                      icon={<MdCheck />}
                      appearance="primary"
                      size="24px"
                      cursorHover
                    />
                  </Stack>
                )}
              </StyledLi>
              {index !== businessUnits.length - 1 && (
                <Stack width="100%" justifyContent="center">
                  <Stack width="95%" padding="3px">
                    <Divider />
                  </Stack>
                </Stack>
              )}
            </StyledContainerOption>
          ))}
        </StyledUl>
      </Stack>
    </StyledContainer>
  );
};

export { BusinessUnitChange };
