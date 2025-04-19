import { MdCheck } from "react-icons/md";
import { Stack, Icon, Divider } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";
import { IBusinessUnit } from "@ptypes/employeePortalBusiness.types";

import { StyledContainer, StyledUl, StyledLi, StyledImg, StyledContainerOption } from "./styles";

interface BusinessUnitChangeProps {
  businessUnits: IBusinessUnit[];
  selectedClient: string;
  onLogoClick: (businessUnit: IBusinessUnit) => void;
}

const BusinessUnitChange = (props: BusinessUnitChangeProps) => {
  const { businessUnits, selectedClient, onLogoClick } = props;

  return (
    <StyledContainer>
      <Stack width="200px">
        <StyledUl>
          {businessUnits.length === 0 ? (
            <p>No hay unidades de negocio disponibles</p>
          ) : (
            businessUnits.map((businessUnit, index) => (
              <StyledContainerOption
                key={businessUnit.businessUnitPublicCode}
                onClick={() => {
                  onLogoClick(businessUnit);
                }}
              >
                <StyledLi>
                  <StyledImg src={businessUnit.urlLogo} alt={businessUnit.abbreviatedName} />
                  {selectedClient === businessUnit.abbreviatedName && (
                    <Stack margin={`${spacing.s0} ${spacing.s150} ${spacing.s0}`}>
                      <Icon icon={<MdCheck />} appearance="primary" size="24px" cursorHover />
                    </Stack>
                  )}
                </StyledLi>
                <Stack padding={`${spacing.s0} ${spacing.s150}`}>
                  {index !== businessUnits.length - 1 && <Divider />}
                </Stack>
              </StyledContainerOption>
            ))
          )}
        </StyledUl>
      </Stack>
    </StyledContainer>
  );
};

export { BusinessUnitChange };
