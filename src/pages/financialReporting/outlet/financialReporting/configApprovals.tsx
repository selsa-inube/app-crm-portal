import { isValidElement } from "react";
import { MdNotificationsNone, MdWarningAmber } from "react-icons/md";
import { Icon, Stack, Tag } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";
import info from "@assets/images/info.svg";
import { IEntries } from "@components/data/TableBoard/types";

import { approvalsConfig } from "./configApprovalTexts";

const handleData = (data: IEntries) => {
  console.log("function that receives data", data);
};

export const titlesApprovals = [
  {
    id: approvalsConfig.ids.users,
    titleName: approvalsConfig.titles.assignedApprovers,
    priority: 1,
  },
  {
    id: approvalsConfig.ids.tag,
    titleName: approvalsConfig.titles.decision,
    priority: 2,
  },
];

export const actionsApprovals = [
  {
    id: approvalsConfig.ids.error,
    actionName: approvalsConfig.actions.error,
    content: (data: IEntries) => {
      const error = Boolean(data.error);
      return (
        <Icon
          icon={<MdWarningAmber />}
          appearance="warning"
          spacing="narrow"
          cursorHover
          size="22px"
          disabled={!error}
        />
      );
    },
  },
  {
    id: approvalsConfig.ids.notifications,
    actionName: approvalsConfig.actions.notify,
    content: (data: IEntries) => (
      <Icon
        icon={<MdNotificationsNone />}
        appearance="primary"
        spacing="narrow"
        cursorHover
        size="22px"
        disabled={
          isValidElement(data?.tag) &&
          data?.tag?.props?.label !== approvalsConfig.status.pending
        }
      />
    ),
  },
];

export const actionMobileApprovals = [
  {
    id: approvalsConfig.ids.error,
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="narrow"
        cursorHover
        size="20px"
        onClick={() => handleData(data)}
        disabled={
          isValidElement(data?.tag) &&
          data?.tag?.props?.label !== approvalsConfig.status.pending
        }
      />
    ),
  },
  {
    id: approvalsConfig.ids.notifications,
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdNotificationsNone />}
        appearance="primary"
        spacing="narrow"
        cursorHover
        size="20px"
        onClick={() => handleData(data)}
        disabled={
          isValidElement(data?.tag) &&
          data?.tag?.props?.label !== approvalsConfig.status.pending
        }
      />
    ),
  },
];

export const handleNotificationClick = (
  data: IEntries,
  setSelectedData: (data: IEntries) => void,
  setShowModal: (showModal: boolean) => void,
) => {
  const tag = data?.tag;
  if (
    isValidElement(tag) &&
    tag.props?.label === approvalsConfig.status.pending
  ) {
    setSelectedData(data);
    setShowModal(true);
  }
};

export const handleErrorClick = (
  data: IEntries,
  setSelectedData: (data: IEntries) => void,
  setShowModal: (showModal: boolean) => void,
) => {
  const tag = data?.tag;
  if (
    isValidElement(tag) &&
    tag.props?.label === approvalsConfig.status.pending
  ) {
    setSelectedData(data);
    setShowModal(true);
  }
};

interface Action {
  id: string;
  actionName: string;
  content: (data: IEntries) => JSX.Element;
}

export const desktopActions = (
  actionsApprovals: Action[],
  handleNotificationClick?: (data: IEntries) => void,
  handleErrorClick?: (data: IEntries) => void,
) => {
  return actionsApprovals.map((action) => ({
    id: action.id,
    actionName: action.actionName,
    content: (data: IEntries) => {
      const handleClick = () => {
        if (action.id === approvalsConfig.ids.notifications) {
          handleNotificationClick(data);
        } else if (action.id === approvalsConfig.ids.error) {
          handleErrorClick(data);
        }
      };
      return <Icon {...action.content(data).props} onClick={handleClick} />;
    },
  }));
};

export const getMobileActionsConfig = (
  actionMobileApprovals: Action[],
  handleNotificationClickBound: (data: IEntries) => void,
  handleErrorClickBound: (data: IEntries) => void,
) => {
  return actionMobileApprovals.map((action) => ({
    id: action.id,
    content: (data: IEntries) => {
      const handleClick = () => {
        if (action.id === approvalsConfig.ids.notifications) {
          handleNotificationClickBound(data);
        } else if (action.id === approvalsConfig.ids.error) {
          handleErrorClickBound(data);
        }
      };
      return <Icon {...action.content(data).props} onClick={handleClick} />;
    },
  }));
};

const appearanceTag = (label: string) => {
  if (label === approvalsConfig.status.approved) {
    return "success";
  }
  if (label === approvalsConfig.status.pending) {
    return "warning";
  }
  if (label === approvalsConfig.status.returned) {
    return "help";
  }
  if (label === approvalsConfig.status.commercialManagement) {
    return "help";
  }
  if (label === approvalsConfig.status.riskAnalysis) {
    return "dark";
  }
  return "danger";
};

const getIconByTagStatus = (tagElement: React.ReactElement) => {
  const label = tagElement.props.label;

  if (label === approvalsConfig.status.approved) {
    return (
      <img
        src={check}
        alt={approvalsConfig.altTexts.complies}
        width={14}
        height={14}
      />
    );
  } else if (label === approvalsConfig.status.pending) {
    return (
      <img
        src={remove}
        alt={approvalsConfig.altTexts.notEvaluated}
        width={14}
        height={14}
      />
    );
  } else if (label === approvalsConfig.status.rejected) {
    return (
      <img
        src={close}
        alt={approvalsConfig.altTexts.doesNotComply}
        width={14}
        height={14}
      />
    );
  } else if (label === approvalsConfig.status.returned) {
    return (
      <img
        src={info}
        alt={approvalsConfig.altTexts.returned}
        width={14}
        height={14}
      />
    );
  } else {
    return null;
  }
};

export const getActionsMobileIcon = () => {
  return [
    {
      id: approvalsConfig.ids.status,
      actionName: "",
      content: (entry: IEntries) => {
        const tagElement = entry.tag as React.ReactElement;
        return (
          <Stack>
            <Icon
              icon={getIconByTagStatus(tagElement)}
              appearance={tagElement.props.appearance}
              cursorHover
              size="20px"
            />
          </Stack>
        );
      },
    },
  ];
};

export const entriesApprovals = (data: IApprovals[]) => {
  return data.map((entry) => ({
    id: entry?.approverName?.toString(),
    [approvalsConfig.ids.users]: entry?.approverName,
    concept: entry?.concept,
    identificationNumber: entry?.approverIdentificationNumber,
    identificationType: entry?.approverIdentificationType,
    approvalId: entry?.approvalId,
    approverId: entry?.approverId,
    tag: (
      <Tag label={entry.concept} appearance={appearanceTag(entry.concept)} />
    ),
    error: entry.error,
  }));
};
