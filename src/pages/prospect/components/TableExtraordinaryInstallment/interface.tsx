import {
  Pagination,
  SkeletonLine,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@inubekit/inubekit";

import { ActionMobile } from "@components/feedback/ActionMobile";
import { DeleteModal } from "@components/modals/DeleteModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { dataAddSeriesModal } from "@components/modals/AddSeriesModal/config";
import { formatPrimaryDate } from "@utils/formatData/date";
import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum/useEnum";

import { TableExtraordinaryInstallmentProps } from ".";
import { dataTableExtraordinaryInstallment } from "./config";
import { Detail } from "./Detail";

interface ITableExtraordinaryInstallmentProps {
  loading: boolean;
  visbleHeaders: {
    key: string;
    label: string;
    mask?: (value: string | number) => string | number;
  }[];
  lang: EnumType;
  visbleActions: { key: string; label: string }[];
  extraordinaryInstallments: TableExtraordinaryInstallmentProps[];
  isMobile: boolean;
  isOpenModalDelete: boolean;
  prospectData: IProspect | undefined;
  businessUnitPublicCode: string;
  service: boolean;
  showErrorModal: boolean;
  messageError: string;
  isLoadingDelete: boolean;
  installmentState: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
    cycleName?: string;
  };
  isOpenModalView: boolean;
  setIsOpenModalView: (value: boolean) => void;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalDelete: (value: boolean) => void;
  setInstallmentState: React.Dispatch<
    React.SetStateAction<{
      installmentAmount: number;
      installmentDate: string;
      paymentChannelAbbreviatedName: string;
      cycleName?: string;
    }>
  >;
  usePagination: {
    totalRecords: number;
    handleStartPage: () => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleEndPage: () => void;
    firstEntryInPage: number;
    lastEntryInPage: number;
    paddedCurrentData: TableExtraordinaryInstallmentProps[];
  };
  openMenuIndex: number | null;
  setOpenMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSentData?:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
  handleClose?: (() => void) | undefined;
  setSelectedDebtor: React.Dispatch<
    React.SetStateAction<TableExtraordinaryInstallmentProps>
  >;
  handleDelete?: (id: string) => void;
  itemIdentifiersForUpdate: IExtraordinaryInstallments;
  handleDeleteAction: () => Promise<void>;
}

export function TableExtraordinaryInstallmentUI(
  props: ITableExtraordinaryInstallmentProps,
) {
  const {
    loading,
    visbleHeaders,
    visbleActions,
    lang,
    extraordinaryInstallments,
    isMobile,
    isOpenModalDelete,
    usePagination,
    showErrorModal,
    messageError,
    isOpenModalView,
    installmentState,
    setIsOpenModalView,
    setShowErrorModal,
    setIsOpenModalDelete,
    setSelectedDebtor,
    handleDeleteAction,
    setInstallmentState,
    openMenuIndex,
    setOpenMenuIndex,
    isLoadingDelete = false,
  } = props;
  console.log("extraordinaryInstallments: ", extraordinaryInstallments);
  const {
    totalRecords,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
  } = usePagination;

  return (
    <Table>
      <Thead>
        <Tr>
          {!loading &&
            visbleHeaders.map((header) => (
              <Th key={header.key} align="center">
                {header.label}
              </Th>
            ))}
          {!loading &&
            visbleActions &&
            visbleActions.length > 0 &&
            visbleActions.map((action) => (
              <Th key={action.key} action>
                {action.label}
              </Th>
            ))}
          {loading &&
            visbleHeaders.map((header) => (
              <Td key={header.key} align="left" type="custom">
                <SkeletonLine />
              </Td>
            ))}
          {loading &&
            visbleActions.map((action) => (
              <Td key={action.key} type="custom">
                <SkeletonLine />
              </Td>
            ))}
        </Tr>
      </Thead>
      <Tbody>
        {loading && (
          <Tr>
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              align="center"
              type="custom"
            >
              <SkeletonLine />
            </Td>
          </Tr>
        )}

        {!loading &&
          paddedCurrentData.filter(
            (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
          ).length > 0 &&
          paddedCurrentData
            .filter(
              (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
            )
            .map((row: TableExtraordinaryInstallmentProps, index: number) => (
              <Tr key={index} zebra={index % 2 !== 0}>
                {visbleHeaders.map((header) => {
                  const raw =
                    row[header.key as keyof TableExtraordinaryInstallmentProps];

                  let value = raw;

                  if (header.key === "paymentMethod" && row.cycleName) {
                    value = row.cycleName;
                  } else if (header.key === "datePayment") {
                    value = formatPrimaryDate(new Date(raw as string));
                  } else if (header.mask) {
                    value = header.mask(raw as string | number);
                  }

                  return (
                    <Td key={header.key} align="left">
                      {value?.toString() ?? ""}
                    </Td>
                  );
                })}

                {visbleActions.map((action) => (
                  <Td key={action.key} type="custom" height={"10px"}>
                    {isMobile ? (
                      <ActionMobile
                        isOpen={openMenuIndex === index}
                        onToggle={() => {
                          setOpenMenuIndex(
                            openMenuIndex === index ? null : index,
                          );
                        }}
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                          setOpenMenuIndex(null);
                        }}
                        handleView={() => {
                          setSelectedDebtor(row);
                          setInstallmentState({
                            installmentAmount: Number(row.value) || 0,
                            installmentDate:
                              typeof row.datePayment === "string"
                                ? row.datePayment
                                : String(row.datePayment) || "",
                            paymentChannelAbbreviatedName:
                              String(row.paymentMethod) || "",
                            cycleName: String(row.cycleName) || "",
                          });
                          setIsOpenModalView(true);
                          setOpenMenuIndex(null);
                        }}
                      />
                    ) : (
                      <Detail
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                      />
                    )}
                  </Td>
                ))}
              </Tr>
            ))}

        {!loading &&
          paddedCurrentData.filter(
            (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
          ).length === 0 && (
            <Tr>
              <Td
                colSpan={visbleHeaders.length + visbleActions.length}
                align="center"
                type="custom"
              >
                <Text
                  size="large"
                  type="label"
                  appearance="gray"
                  textAlign="center"
                >
                  {dataTableExtraordinaryInstallment.noData.i18n[lang]}
                </Text>
              </Td>
            </Tr>
          )}
        {loading &&
          Array.from({ length: 5 }).map((_, rowIndex) => (
            <Tr key={`skeleton-row-${rowIndex}`}>
              {visbleHeaders.map((_, colIndex) => (
                <Td key={`skeleton-cell-${rowIndex}-${colIndex}`} align="left">
                  <SkeletonLine animated width="100%" />
                </Td>
              ))}
              {visbleActions.map((_, actionIndex) => (
                <Td
                  key={`skeleton-action-${rowIndex}-${actionIndex}`}
                  type="custom"
                >
                  <SkeletonLine animated width="100%" />
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>

      {extraordinaryInstallments.length > 0 && !loading && (
        <Tfoot>
          <Tr border="bottom">
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              type="custom"
              align="center"
            >
              <Pagination
                firstEntryInPage={firstEntryInPage}
                lastEntryInPage={lastEntryInPage}
                totalRecords={totalRecords}
                handleStartPage={handleStartPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handleEndPage={handleEndPage}
              />
            </Td>
          </Tr>
        </Tfoot>
      )}
      {isOpenModalDelete && (
        <DeleteModal
          handleClose={() => setIsOpenModalDelete(false)}
          handleDelete={handleDeleteAction}
          TextDelete={dataTableExtraordinaryInstallment.content.i18n[lang]}
          isLoading={isLoadingDelete}
          lang={lang}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
      {isOpenModalView && (
        <BaseModal
          title={dataAddSeriesModal.view.i18n[lang]}
          handleNext={() => setIsOpenModalView(false)}
          handleClose={() => setIsOpenModalView(false)}
          nextButton="Cerrar"
          width="290px"
        >
          <CardGray
            label={
              installmentState.cycleName ||
              installmentState.paymentChannelAbbreviatedName
            }
            placeHolder={installmentState.paymentChannelAbbreviatedName}
          />
          <CardGray
            label={dataAddSeriesModal.labelAmount.i18n[lang]}
            placeHolder={installmentState.installmentAmount}
          />
          <CardGray
            label={dataAddSeriesModal.labelDate.i18n[lang]}
            placeHolder={installmentState.installmentDate}
          />
        </BaseModal>
      )}
    </Table>
  );
}
