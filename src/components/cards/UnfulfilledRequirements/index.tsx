import { MdWarningAmber } from "react-icons/md";
import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";

import LabelData from "./Config/config";

interface IUnfulfilledRequirementsProps {
  requirement: string;
  causeNonCompliance: string;
  title?: string;
  isMobile?: boolean;
}

export const UnfulfilledRequirements = (
  props: IUnfulfilledRequirementsProps,
) => {
  const { title, requirement, causeNonCompliance, isMobile } = props;
  return (
    <Fieldset title={title} isMobile={isMobile} width={"100%"}>
      <Stack direction="column" gap="16px" padding="0 16px">
        <Stack direction="column" gap="4px">
          <Stack justifyContent="space-between" alignItems="center">
            <Text ellipsis={true}>{LabelData.requirement}</Text>
            <Icon icon={<MdWarningAmber />} appearance="warning" size="24px" />
          </Stack>
          <Divider />
          <Text appearance="gray" size="medium" type="body" ellipsis={true}>
            {requirement}
          </Text>
        </Stack>
        <Stack direction="column" gap="4px">
          <Text ellipsis={true}>{LabelData.causeNonCompliance}</Text>
          <Divider />
          <Text appearance="gray" size="medium" ellipsis>
            {causeNonCompliance}
          </Text>
        </Stack>
      </Stack>
    </Fieldset>
  );
};
