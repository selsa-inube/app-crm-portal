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
import { DeleteModal } from "@components/modals/DeleteModal";
import { EditSeriesModal } from "@components/modals/EditSeriesModal";
import { formatPrimaryDate } from "@utils/formatData/date";
import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { TextLabels } from "@components/modals/ExtraordinaryPaymentModal/config";

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
  prospectData: IProspect | undefined;
  businessUnitPublicCode: string;
  service: boolean;
  setIsOpenModalDelete: (value: boolean) => void;
  setIsOpenModalEdit: (value: boolean) => void;
  handleEdit: (row: TableExtraordinaryInstallmentProps) => void;
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
    paddedCurrentData: TableExtraordinaryInstallmentProps[];
  };
  setSentData?:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
  handleClose?: (() => void) | undefined;
  setSelectedDebtor: React.Dispatch<
    React.SetStateAction<TableExtraordinaryInstallmentProps>
  >;
  handleDelete?: (id: string) => void;
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
    isOpenModalDelete,
    isOpenModalEdit,
    prospectData,
    businessUnitPublicCode,
    service,
    setIsOpenModalDelete,
    setIsOpenModalEdit,
    handleEdit,
    handleUpdate,
    usePagination,
    handleClose,
    setSentData,
    setSelectedDebtor,
    handleDelete,
  } = props;

  const {
    totalRecords,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
  } = usePagination(extraordinaryInstallments);

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

  const handleDeleteAction = async () => {
    if (handleDelete && selectedDebtor.id) {
      handleDelete(selectedDebtor.id as string);
      setIsOpenModalDelete(false);
    } else if (service) {
      try {
        await removeExtraordinaryInstallment(
          businessUnitPublicCode,
          initialValues,
        );

        setSentData?.(initialValues);
        setIsOpenModalDelete(false);
        handleClose?.();
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        addFlag({
          title: TextLabels.titleError,
          description,
          appearance: "danger",
          duration: 5000,
        });
      }
    }
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
                  const value =
                    header.key === "datePayment"
                      ? formatPrimaryDate(new Date(raw as string))
                      : header.mask
                        ? header.mask(raw as string | number)
                        : raw;

                  return (
                    <Td key={header.key} align="left">
                      {value?.toString() ?? ""}
                    </Td>
                  );
                })}

                {visbleActions.map((action) => (
                  <Td key={action.key} type="custom">
                    {isMobile ? (
                      <ActionMobile
                        handleEdit={() => handleEdit(row)}
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                      />
                    ) : (
                      <Detail
                        handleEdit={() => handleEdit(row)}
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
        <DeleteModal
          handleClose={() => setIsOpenModalDelete(false)}
          handleDelete={handleDeleteAction}
          TextDelete={dataTableExtraordinaryInstallment.content}
        />
      )}
      {isOpenModalEdit && (
        <EditSeriesModal
          handleClose={() => setIsOpenModalEdit(false)}
          onSubmit={() => setIsOpenModalEdit(false)}
          onConfirm={async (values) => {
            if (!service) {
              const updatedDebtor = {
                ...selectedDebtor,
                value: values.installmentAmount,
                paymentMethod: values.paymentChannelAbbreviatedName,
                datePayment: values.installmentDate,
              };
              await handleUpdate(updatedDebtor);
              return;
            }
            await handleUpdate(values);
          }}
          prospectData={prospectData}
          selectedDebtor={selectedDebtor}
          setSentData={setSentData}
          businessUnitPublicCode={businessUnitPublicCode}
          service={service}
        />
      )}
    </Table>
  );
}
