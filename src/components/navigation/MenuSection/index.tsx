import { Stack, Divider } from "@inubekit/inubekit";

import { ISection } from "./types";
import { MenuHeading } from "../MenuHeading";
import { MenuItemSpacingType } from "../MenuItem/types";
import { MenuItem } from "../MenuItem";

interface MenuSectionProps {
  sections: ISection[];
  spacing?: MenuItemSpacingType;
  divider?: boolean;
}

function MenuSection(props: MenuSectionProps) {
  const { sections, spacing = "wide", divider = false } = props;

  return (
    <>
      {sections.map((section, index) => (
        <Stack key={index} width="312px" direction="column">
          {divider && (
            <Stack width="280px" margin="0px 0px 0px 16px" direction="column">
              <Divider />
            </Stack>
          )}

          {section.title && <MenuHeading title={section.title} />}
          <Stack
            direction="column"
            gap={spacing === "compact" ? "4px" : "0px"}
            margin="6px 0px"
          >
            {section.links.map((link) => (
              <MenuItem
                key={link.title}
                title={link.title}
                description={link.description}
                iconBefore={link.iconBefore}
                iconAfter={link.iconAfter}
                isDisabled={link.isDisabled}
                path={link.path}
                onClick={link.onClick}
                spacing={spacing}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </>
  );
}

export type { MenuSectionProps };
export { MenuSection };
