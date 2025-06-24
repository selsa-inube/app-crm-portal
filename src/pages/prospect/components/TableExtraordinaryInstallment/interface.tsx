import { useContext } from "react";
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
  useFlag,
} from "@inubekit/inubekit";

import { ActionMobile } from "@components/feedback/ActionMobile";
import { ListModal } from "@components/modals/ListModal";
import { EditSeriesModal } from "@components/modals/EditSeriesModal";
import { formatPrimaryDate } from "@utils/formatData/date";
import { IExtraordinaryInstallments } from "@services/iProspect/saveExtraordinaryInstallments/types";
import { AppContext } from "@src/context/AppContext";
import { TextLabels } from "@src/components/modals/ExtraordinaryPaymentModal/config";
import { IProspect } from "@services/prospects/types";

import { TableExtraordinaryInstallmentProps } from ".";
import { dataTableExtraordinaryInstallment } from "./config";
import { Detail } from "./Detail";
import { removeExtraordinaryInstallment } from "./utils";

interface ITableExtraordinaryInstallmentProps {
  loading: boolean;
  visbleHeaders: {
    key: string;
    label: string;
    mask?: (value: string | number) => string | number;
  }[];
  visbleActions: { key: string; label: string }[];
  extraordinaryInstallments: TableExtraordinaryInstallmentProps[];
  isMobile: boolean;
  selectedDebtor: TableExtraordinaryInstallmentProps;
  isOpenModalDelete: boolean;
  isOpenModalEdit: boolean;
  setIsOpenModalDelete: (value: boolean) => void;
  setIsOpenModalEdit: (value: boolean) => void;
  handleEdit: (row: TableExtraordinaryInstallmentProps) => void;
  handleDelete: (
    id: string,
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => Promise<void>;
  handleUpdate: (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => Promise<void>;
  usePagination: (data: TableExtraordinaryInstallmentProps[]) => {
    totalRecords: number;
    handleStartPage: () => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleEndPage: () => void;
    firstEntryInPage: number;
    lastEntryInPage: number;
  };
  setSentData:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
  handleClose: (() => void) | undefined;
  prospectData: IProspect | undefined;
  setSelectedDebtor: React.Dispatch<
    React.SetStateAction<TableExtraordinaryInstallmentProps>
  >;
}

export function TableExtraordinaryInstallmentUI(
  props: ITableExtraordinaryInstallmentProps,
) {
  const {
    loading,
    visbleHeaders,
    visbleActions,
    extraordinaryInstallments,
    isMobile,
    selectedDebtor,
    setSelectedDebtor,
    isOpenModalDelete,
    isOpenModalEdit,
    setIsOpenModalDelete,
    setIsOpenModalEdit,
    handleEdit,
    handleDelete,
    handleUpdate,
    usePagination,
    handleClose,
    setSentData,
    prospectData,
  } = props;

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination(extraordinaryInstallments);
  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { addFlag } = useFlag();
  const initialValues: IExtraordinaryInstallments = {
    creditProductCode: prospectData?.creditProducts[0].creditProductCode || "",
    extraordinaryInstallments:
      prospectData?.creditProducts[0]?.extraordinaryInstallments
        ?.filter((ins) => {
          const expectedId = `${prospectData?.creditProducts[0].creditProductCode},${ins.installmentDate}`;
          return expectedId === selectedDebtor?.id;
        })
        ?.map((installment) => ({
          installmentDate:
            typeof installment.installmentDate === "string"
              ? installment.installmentDate
              : new Date(installment.installmentDate).toISOString(),
          installmentAmount: Number(installment.installmentAmount),
          paymentChannelAbbreviatedName: String(
            installment.paymentChannelAbbreviatedName,
          ),
        })) || [],
    prospectId: prospectData?.prospectId || "",
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments,
  ) => {
    await removeExtraordinaryInstallment(
      businessUnitPublicCode,
      extraordinaryInstallments,
    )
      .then(() => {
        addFlag({
          title: dataTableExtraordinaryInstallment.titleSuccess,
          description: dataTableExtraordinaryInstallment.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
        setSentData?.(extraordinaryInstallments);
        setIsOpenModalDelete(false);
        handleClose?.();
      })
      .catch(() => {
        addFlag({
          title: TextLabels.titleError,
          description: TextLabels.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      });
  };

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
          extraordinaryInstallments &&
          extraordinaryInstallments.length > 0 &&
          extraordinaryInstallments.map((row, indx) => (
            <Tr key={indx} zebra={indx % 2 !== 0}>
              {visbleHeaders.map((header) => (
                <Td key={header.key} align="left">
                  {header.key === "datePayment"
                    ? formatPrimaryDate(new Date(row[header.key] as string))
                    : header.mask
                      ? header.mask(row[header.key] as string | number)
                      : (row[header.key] as React.ReactNode)}
                </Td>
              ))}
              {visbleActions &&
                visbleActions.length > 0 &&
                visbleActions.map((action) => (
                  <Td key={action.key} type="custom">
                    {isMobile ? (
                      <ActionMobile
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                        handleEdit={() => handleEdit(row)}
                      />
                    ) : (
                      <Detail
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                        handleEdit={() => {
                          handleEdit(row);
                        }}
                      />
                    )}
                  </Td>
                ))}
            </Tr>
          ))}
        {!loading && extraordinaryInstallments.length === 0 && (
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
                {dataTableExtraordinaryInstallment.noData}
              </Text>
            </Td>
          </Tr>
        )}
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
        <ListModal
          title={dataTableExtraordinaryInstallment.deletion}
          handleClose={() => setIsOpenModalDelete(false)}
          handleSubmit={() => handleExtraordinaryInstallment(initialValues)}
          onSubmit={() => {
            if (selectedDebtor) {
              handleDelete(selectedDebtor.id as string, selectedDebtor);
              setIsOpenModalDelete(false);
            }
          }}
          buttonLabel={dataTableExtraordinaryInstallment.delete}
          content={dataTableExtraordinaryInstallment.content}
          cancelButton={dataTableExtraordinaryInstallment.cancel}
        />
      )}
      {isOpenModalEdit && (
        <EditSeriesModal
          handleClose={() => setIsOpenModalEdit(false)}
          onSubmit={() => setIsOpenModalEdit(false)}
          onConfirm={async (updatedDebtor) => {
            await handleUpdate(updatedDebtor);
          }}
          prospectData={prospectData}
          selectedDebtor={selectedDebtor}
          setSentData={setSentData}
        />
      )}
    </Table>
  );
}
