import { useState } from "react";
import { MdOutlineInfo } from "react-icons/md";
import { Icon, Text, SkeletonLine, Stack } from "@inubekit/inubekit";

import { InfoModal } from "@components/modals/InfoModal";

import { ITableBoardProps } from ".";
import { IAction, IEntries, ITitle, appearances } from "./types";
import {
  StyledContainer,
  StyledTable,
  StyledTbody,
  StyledThead,
  StyledTr,
  StyledTh,
  StyledTd,
  StyledThactions,
  StyledTdactions,
  StyledDivactions,
} from "./styles";

interface ITableBoardUIProps extends ITableBoardProps {
  loading: boolean;
  isTablet: boolean;
}

interface IRenderActionsTitles {
  actions: IAction[];
  isTablet: boolean;
  appearance: appearances;
  isStyleMobile: boolean;
  onInfoClick: () => void;
  isFirstTable: boolean;
}

const RenderActionsTitles = (props: IRenderActionsTitles) => {
  const {
    actions,
    appearance,
    isTablet,
    isStyleMobile,
    onInfoClick,
    isFirstTable,
  } = props;

  return (
    <>
      {!isTablet
        ? actions.map((actionTitle) => (
            <StyledThactions key={actionTitle.id}>
              <Text
                appearance={appearance}
                type="title"
                size="medium"
                padding="0px 4px"
                textAlign="center"
              >
                {actionTitle.actionName}
              </Text>
            </StyledThactions>
          ))
        : isFirstTable && (
            <StyledThactions $isTablet={isTablet} colSpan={3} $isFirst>
              {isStyleMobile && (
                <Stack margin="0 10px 0 0" justifyContent="end">
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="20px"
                    onClick={onInfoClick}
                  />
                </Stack>
              )}
            </StyledThactions>
          )}
    </>
  );
};

const actionsLoading = (numberActions: number) => {
  const cellsOfActionsLoading = [];
  for (let cellAction = 0; cellAction < numberActions; cellAction++) {
    cellsOfActionsLoading.push(
      <StyledTd key={cellAction}>
        <SkeletonLine animated />
      </StyledTd>,
    );
  }
  return cellsOfActionsLoading;
};

const dataLoading = (titleColumns: ITitle[], numberActions: number) => {
  const rowsLoading = [];
  for (let rows = 0; rows < 3; rows++) {
    rowsLoading.push(
      <StyledTr key={rows}>
        {titleColumns.map((title) => (
          <StyledTd key={`e-${title.id}`}>
            <SkeletonLine animated />
          </StyledTd>
        ))}
        {actionsLoading(numberActions)}
      </StyledTr>,
    );
  }
  return rowsLoading;
};

const ActionsIcon = (props: IActionsComponent) => {
  const { actionMobile, entry, isTablet } = props;

  return (
    <>
      {isTablet &&
        actionMobile?.map((action, index) => (
          <StyledDivactions
            key={action.id}
            $isTablet={isTablet}
            $isFirst={index === 0}
          >
            {action.content(entry)}
          </StyledDivactions>
        ))}
    </>
  );
};

interface IActionsComponent {
  actions: IAction[];
  isTablet: boolean;
  entry: IEntries;
  actionMobile?: IAction[];
}

const Actions = (props: IActionsComponent) => {
  const { actions, isTablet, entry, actionMobile } = props;

  return (
    <>
      {!isTablet &&
        actions.map((action) => (
          <StyledTdactions key={action.id}>
            {action.content(entry)}
          </StyledTdactions>
        ))}
      {isTablet &&
        actionMobile &&
        actionMobile.map((action, index) => (
          <StyledTdactions
            key={action.id}
            $isTablet={isTablet}
            $isFirst={index === 0}
          >
            {action.content(entry)}
          </StyledTdactions>
        ))}
    </>
  );
};

export const TableBoardUI = (props: ITableBoardUIProps) => {
  const {
    id,
    entries,
    actions,
    titles,
    borderTable,
    loading,
    appearanceTable,
    isTablet,
    actionMobileIcon,
    actionMobile,
    isFirstTable,
    infoItems,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledContainer
      id={id}
      $borderTable={borderTable!}
      $isTablet={isTablet}
      $actionsMobile={Boolean(actionMobile)}
    >
      <StyledTable
        $zebraEffect={appearanceTable!.efectzebra!}
        $background={appearanceTable!.background!}
        $isTablet={isTablet}
      >
        <StyledThead>
          <tr>
            {titles
              .filter((title) => !(isTablet && title.id === "tag"))
              .map((title) =>
                !isTablet || title.titleName ? (
                  <StyledTh key={title.id + id}>
                    <Text
                      appearance={appearanceTable!.title}
                      type="title"
                      size="medium"
                      padding={isTablet ? "0px" : "0px 4px"}
                    >
                      {title.titleName}
                    </Text>
                  </StyledTh>
                ) : null,
              )}

            {actions && actionMobile && (
              <RenderActionsTitles
                actions={actions}
                appearance={appearanceTable!.title!}
                isTablet={isTablet}
                isStyleMobile={appearanceTable!.isStyleMobile!}
                onInfoClick={() => setIsModalOpen(true)}
                isFirstTable={isFirstTable ?? false}
              />
            )}
          </tr>
        </StyledThead>
        <StyledTbody>
          {loading ? (
            dataLoading(titles, actions?.length || 0)
          ) : (
            <>
              {entries.map((entry, index) => (
                <StyledTr
                  key={`${entry.id}-${index}`}
                  $borderTable={appearanceTable!.borderTable}
                >
                  {titles
                    .filter((title) => !(isTablet && title.id === "tag"))
                    .map((title, titleIndex) => (
                      <StyledTd
                        key={title.id}
                        $widthTd={appearanceTable?.widthTd}
                      >
                        <Stack gap="6px">
                          {actionMobileIcon && titleIndex === 0 && (
                            <ActionsIcon
                              actionMobile={actionMobileIcon}
                              entry={entry}
                              isTablet={isTablet}
                              actions={[]}
                            />
                          )}
                          {typeof entry[title.id] !== "string" ? (
                            entry[title.id]
                          ) : (
                            <Text
                              size="medium"
                              padding={isTablet ? "0px" : "0px 4px"}
                            >
                              {entry[title.id]}
                            </Text>
                          )}
                        </Stack>
                      </StyledTd>
                    ))}
                  {actions && (
                    <Actions
                      actions={actions}
                      isTablet={isTablet}
                      entry={entry}
                      actionMobile={actionMobile}
                    />
                  )}
                </StyledTr>
              ))}
            </>
          )}
        </StyledTbody>
      </StyledTable>
      {isModalOpen && (
        <InfoModal
          onClose={() => setIsModalOpen(false)}
          items={infoItems || []}
        />
      )}
    </StyledContainer>
  );
};
