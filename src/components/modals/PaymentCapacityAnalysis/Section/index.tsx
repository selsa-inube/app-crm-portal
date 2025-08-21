import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Divider, Fieldset, Icon, Stack, Text } from "@inubekit/inubekit";

import { IFieldsetSection, ISummarySection, IValueWithIcon } from "../types";
import { DataCapacityAnalysis } from "../config";

const ValueWithIcon = (props: IValueWithIcon) => {
  const { value, showIcon, isMobile, onShowModal } = props;

  return (
    <Stack gap="4px">
      <Text
        type="body"
        size={isMobile ? "small" : "medium"}
        weight="bold"
        appearance="success"
      >
        $
      </Text>
      <Text
        type="body"
        size={isMobile ? "small" : "medium"}
        appearance={showIcon ? "gray" : undefined}
      >
        {value}
      </Text>
      {showIcon && onShowModal && (
        <Icon
          icon={<MdOutlineRemoveRedEye />}
          appearance="primary"
          size="16px"
          onClick={onShowModal}
          cursorHover
        />
      )}
    </Stack>
  );
};

const FieldsetSection = (props: IFieldsetSection) => {
  const { legend, items, isMobile } = props;

  return (
    <Fieldset legend={legend} type="body" size="medium">
      <Stack direction="column" width="100%" gap="8px">
        <Stack justifyContent="space-between">
          <Text type="body" size={isMobile ? "small" : "medium"}>
            {DataCapacityAnalysis.concept}
          </Text>
          <Text type="body" size={isMobile ? "small" : "medium"}>
            {DataCapacityAnalysis.availableValue}
          </Text>
        </Stack>
        <Divider dashed />
        <Stack justifyContent="space-between">
          <Stack direction="column" gap="8px" width="100%">
            {items.map((item, index) => (
              <Stack key={index} justifyContent="space-between">
                <Text
                  type="body"
                  size={isMobile ? "small" : "medium"}
                  appearance="gray"
                >
                  {item.label}
                </Text>
                <ValueWithIcon
                  value={item.value}
                  showIcon={item.showIcon}
                  onShowModal={item.onShowModal}
                  isMobile={isMobile}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Fieldset>
  );
};

const SummarySection = (props: ISummarySection) => {
  const { items, isMobile } = props;

  return (
    <Stack direction="column" gap="12px" margin="16px 0 0 0">
      {items.map((item, index) => (
        <Stack key={index} justifyContent="space-between">
          <Text
            type="body"
            size={isMobile ? "small" : "medium"}
            weight={item.bold ? "bold" : undefined}
            appearance={item.gray ? "gray" : undefined}
          >
            {item.label}
          </Text>
          <ValueWithIcon
            value={item.value}
            showIcon={item.showIcon}
            onShowModal={item.onShowModal}
            isMobile={isMobile}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export { FieldsetSection, SummarySection, ValueWithIcon };
