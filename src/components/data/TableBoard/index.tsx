import { useMediaQuery } from "@inubekit/inubekit";

import { IAction, IEntries, ITitle, IAppearances, IInfoItems } from "./types";
import { TableBoardUI } from "./interface";

export interface ITableBoardProps extends IInfoItems {
  id: string;
  entries: IEntries[];
  titles: ITitle[];
  actions?: IAction[];
  actionMobile?: IAction[];
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

  const isTablet = useMediaQuery("(max-width: 730px)");

  return (
    <TableBoardUI
      id={id}
      actions={actions}
      entries={entries}
      actionMobile={actionMobile}
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
