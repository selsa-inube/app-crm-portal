import { useMediaQuery } from "@inubekit/inubekit";

import { IAction, IEntries, ITitle, IAppearances } from "./types";
import { TableBoardUI } from "./interface";

export interface IInfoItems {
  isFirstTable?: boolean;
  infoItems?: { icon: JSX.Element; text: string }[];
}
export interface ITableBoardProps extends IInfoItems {
  id: string;
  entries: IEntries[];
  titles: ITitle[];
  actions?: IAction[];
  actionMobile?: IAction[];
  actionMobileIcon?: IAction[];
  borderTable?: boolean;
  loading?: boolean;
  portalId?: string;
  appearanceTable?: IAppearances;
}

export const TableBoard = (props: ITableBoardProps) => {
  const {
    id,
    entries,
    titles,
    actions,
    actionMobile,
    actionMobileIcon,
    loading = false,
    borderTable = false,
    portalId,
    appearanceTable = {
      title: "primary",
      efectzebra: true,
      borderTable: false,
      background: false,
      isStyleMobile: true,
    },
    isFirstTable,
    infoItems,
  } = props;

  const isTablet = useMediaQuery("(max-width: 720px)");

  return (
    <TableBoardUI
      id={id}
      actions={actions}
      entries={entries}
      actionMobile={actionMobile}
      actionMobileIcon={actionMobileIcon}
      borderTable={borderTable}
      loading={loading}
      portalId={portalId}
      titles={titles}
      appearanceTable={appearanceTable}
      isTablet={isTablet}
      isFirstTable={isFirstTable}
      infoItems={infoItems}
    />
  );
};
