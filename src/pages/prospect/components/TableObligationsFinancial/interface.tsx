import { useContext, useState } from "react";
import { FormikValues } from "formik";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdAdd,
  MdCached,
} from "react-icons/md";

import {
  Pagination,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Stack,
  Icon,
  Text,
  SkeletonLine,
  SkeletonIcon,
  Button,
  Divider,
} from "@inubekit/inubekit";

import { EditFinancialObligationModal } from "@components/modals/editFinancialObligationModal";
import { NewPrice } from "@components/modals/ReportCreditsModal/components/newPrice";
import { BaseModal } from "@components/modals/baseModal";
import { FinancialObligationModal } from "@components/modals/financialObligationModal";
import { IObligations } from "@services/creditLimit/getClientPortfolioObligations/types";
import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { ListModal } from "@components/modals/ListModal";
import { CustomerContext } from "@context/CustomerContext";

import { usePagination } from "./utils";
import { dataReport } from "./config";

export interface ITableFinancialObligationsProps {
  type?: string;
  id?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
  refreshKey?: number;
  setRefreshKey?: React.Dispatch<React.SetStateAction<number>>;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
  setFormState?: React.Dispatch<
    React.SetStateAction<{
      type: string;
      entity: string;
      fee: string;
      balance: string;
      payment: string;
      feePaid: string;
      term: string;
      idUser: string;
    }>
  >;
  clientPortfolio?: IObligations;
  handleOnChange?: (values: FormikValues) => void;
  formState?: {
    type: string;
    entity: string;
    fee: string;
    balance: string;
    payment: string;
    feePaid: string;
    term: string;
    idUser: string;
  };
}

export interface IDataInformationItem {
  id?: string;
  type?: string;
  balance?: number;
  fee?: number;
  propertyName?: string;
  propertyValue?: string | string[];
}

interface UIProps {
  dataInformation: IDataInformationItem[];
  extraDebtors: ITableFinancialObligationsProps[];
  selectedDebtor: ITableFinancialObligationsProps | null;
  loading: boolean;
  visibleHeaders: { key: string; label: string; action?: boolean }[];
  isModalOpenEdit: boolean;
  setIsModalOpenEdit: (value: boolean) => void;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
  setFormState?: React.Dispatch<
    React.SetStateAction<{
      type: string;
      entity: string;
      fee: string;
      balance: string;
      payment: string;
      feePaid: string;
      term: string;
      idUser: string;
    }>
  >;
  initialValuesModal?: FormikValues;
  handleEdit: (item: ITableFinancialObligationsProps) => void;
  isMobile: boolean;
  handleDelete: (id: string) => void;
  handleUpdate: (
    updatedDebtor: ITableFinancialObligationsProps,
  ) => Promise<void>;
  formState:
    | {
        type: string;
        entity: string;
        fee: string;
        balance: string;
        payment: string;
        feePaid: string;
        term: string;
        idUser: string;
      }
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
  handleOnChange: (values: FormikValues) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>> | undefined;
}

export const TableFinancialObligationsUI = ({
  dataInformation,
  extraDebtors,
  loading,
  selectedDebtor,
  visibleHeaders,
  isMobile,
  isModalOpenEdit,
  setIsModalOpenEdit,
  showOnlyEdit,
  handleEdit,
  handleDelete,
  handleUpdate,
  initialValues,
  handleOnChange,
  setRefreshKey,
}: UIProps) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
  } = usePagination(dataInformation);

  const getValueFromProperty = (
    value: string | number | string[] | undefined,
    index: number,
  ): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parts = value.split(",").map((v) => parseFloat(v.trim()));
      return parts[index] || 0;
    }
    if (Array.isArray(value)) {
      const num = parseFloat(value[index]?.toString().trim() || "0");
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };
  const [openModal, setOpenModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { customerData } = useContext(CustomerContext);
  const handleCloseModal = () => {
    setOpenModal(false);
    setRefreshKey?.((prevKey) => prevKey + 1);
  };

  function insertInDeepestObligations<T extends { obligations?: FormikValues }>(
    o: T,
    newItem: FormikValues,
  ): T {
    if (!o.obligations || typeof o.obligations !== "object") {
      return o;
    }

    if (Array.isArray(o.obligations)) {
      return {
        ...o,
        obligations: [...o.obligations, newItem],
      };
    }
    return {
      ...o,
      obligations: insertInDeepestObligations(o.obligations, newItem),
    };
  }

  const handleConfirm = (values: FormikValues) => {
    const newObligation = {
      obligationNumber: `10-${Date.now()}`,
      productName: values.type || "",
      paymentMethodName: values.payment || "",
      balanceObligationTotal: values.balance || 0,
      nextPaymentValueTotal: values.fee || 0,
      entity: values.entity || "",
    };
    const updatedObligations = insertInDeepestObligations(
      initialValues.obligations,
      newObligation,
    );

    const updatedInitialValues = {
      ...initialValues,
      obligations: updatedObligations,
    };

    handleOnChange(updatedInitialValues);
    setOpenModal(false);
    setRefreshKey?.((prev) => prev + 1);
  };

  const totalBalance = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 1),
    0,
  );
  const totalFee = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 2),
    0,
  );

  const renderHeaders = () => {
    return visibleHeaders.map((header, index) =>
      loading ? (
        <Td key={index} type="custom">
          <SkeletonIcon />
        </Td>
      ) : (
        <Th
          key={index}
          action={header.action}
          align="center"
          style={{ whiteSpace: "nowrap" }}
        >
          {header.label}
        </Th>
      ),
    );
  };

  const renderLoadingRow = () => (
    <Tr>
      {visibleHeaders.map((_, index) => (
        <Td key={index} type="custom">
          <SkeletonLine />
        </Td>
      ))}
    </Tr>
  );

  const renderNoDataRow = () => (
    <Tr>
      <Td colSpan={visibleHeaders.length} align="center" type="custom">
        <Text size="large" type="label" appearance="gray" textAlign="center">
          {dataReport.noData}
        </Text>
      </Td>
    </Tr>
  );

  const renderDataRows = () =>
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddedCurrentData.map((prop: any, rowIndex: number) => {
      if (prop.__isPadding) {
        return (
          <Tr key={prop.id}>
            {visibleHeaders.map((_, colIndex) => (
              <Td key={colIndex} type="text">
                &nbsp;
              </Td>
            ))}
          </Tr>
        );
      }

      let values: string[] = [];

      if (typeof prop.propertyValue === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        values = prop.propertyValue.split(",").map((val: any) => val.trim());
      } else if (Array.isArray(prop.propertyValue)) {
        values = prop.propertyValue.map(String);
      } else {
        values = Object.entries(prop)
          .filter(([key]) => key !== "id")
          .map(([, value]) => String(value).trim());
      }

      return (
        <Tr key={rowIndex}>
          {visibleHeaders.map((header, colIndex) => {
            let cellData = values[colIndex] || "";
            const isCurrency = ["balance", "fee"].includes(header.key);

            if (isCurrency) {
              cellData = isNaN(Number(cellData))
                ? cellData
                : currencyFormat(Number(cellData), false);
            }

            const isFromInitialValues = Boolean(prop.propertyName);
            if (isFromInitialValues && colIndex === values.length - 2) {
              cellData = `${values[colIndex]}/${values[colIndex + 1]}`.trim();
            }

            return (
              <Td
                key={colIndex}
                appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                type={header.action ? "custom" : "text"}
                align={isCurrency ? "right" : "left"}
              >
                {header.action ? (
                  <Stack justifyContent="space-around">
                    <Icon
                      icon={<MdOutlineEdit />}
                      appearance="dark"
                      size="16px"
                      onClick={() => handleEdit(prop)}
                      cursorHover
                    />
                    {!showOnlyEdit && (
                      <Icon
                        icon={<MdDeleteOutline />}
                        appearance="danger"
                        size="16px"
                        onClick={() => {
                          if (selectedDebtor) {
                            handleDelete(selectedDebtor.id as string);
                            setIsDeleteModal(false);
                          }
                        }}
                        cursorHover
                      />
                    )}
                  </Stack>
                ) : (
                  cellData
                )}
              </Td>
            );
          })}
        </Tr>
      );
    });

  return (
    <Stack direction="column" width="100%" gap="16px">
      <Stack direction="column">
        <Stack alignItems="center">
          {!isMobile && (
            <Text size="medium" type="label" weight="bold">
              {dataReport.title}
            </Text>
          )}
        </Stack>
        <Stack
          justifyContent="space-between"
          alignItems={isMobile ? "normal" : "end"}
          direction={isMobile ? "column" : "row"}
        >
          {!isMobile && (
            <Text size="medium" type="title" appearance="dark">
              {customerData?.fullName}
            </Text>
          )}
          {isMobile && (
            <Stack padding="0px 0px 10px 0px">
              <CardGray
                label={dataReport.title}
                placeHolder={customerData?.fullName}
                isMobile={true}
              />
            </Stack>
          )}
          <Stack
            justifyContent="end"
            gap="16px"
            direction={isMobile ? "column" : "row"}
            width={isMobile ? "100%" : "auto"}
          >
            <Stack>
              <Button
                children="Restablecer"
                iconBefore={<MdCached />}
                fullwidth={isMobile}
                variant="outlined"
                spacing="wide"
                onClick={() => setIsOpenModal(true)}
              />
            </Stack>
            <Stack>
              <Button
                children={dataReport.addObligations}
                iconBefore={<MdAdd />}
                fullwidth={isMobile}
                onClick={() => setOpenModal(true)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Table tableLayout="auto">
        <Thead>
          <Tr>{renderHeaders()}</Tr>
        </Thead>
        <Tbody>
          {loading
            ? renderLoadingRow()
            : extraDebtors.length === 0
              ? renderNoDataRow()
              : renderDataRows()}
        </Tbody>
        {!loading && dataInformation.length > 0 && (
          <Tfoot>
            <Tr border="bottom">
              <Td colSpan={visibleHeaders.length} type="custom" align="center">
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
        {isModalOpenEdit && selectedDebtor && (
          <EditFinancialObligationModal
            title={`${dataReport.edit} ${selectedDebtor.type || ""}`}
            onCloseModal={() => setIsModalOpenEdit(false)}
            onConfirm={async (updatedDebtor) => {
              await handleUpdate(updatedDebtor);
            }}
            initialValues={selectedDebtor}
            confirmButtonText={dataReport.save}
          />
        )}
        {isDeleteModal && (
          <BaseModal
            title={dataReport.deletion}
            nextButton={dataReport.delete}
            backButton={dataReport.cancel}
            handleNext={() => {
              if (selectedDebtor) {
                handleDelete(selectedDebtor.id as string);
                setIsDeleteModal(false);
              }
            }}
            handleClose={() => setIsDeleteModal(false)}
          >
            <Stack width="400px">
              <Text>{dataReport.content}</Text>
            </Stack>
          </BaseModal>
        )}
      </Table>
      <Stack gap="15px" justifyContent="center">
        {isOpenModal && (
          <ListModal
            title={dataReport.restore}
            handleClose={() => setIsOpenModal(false)}
            handleSubmit={() => setIsOpenModal(false)}
            cancelButton="Cancelar"
            appearanceCancel="gray"
            buttonLabel={dataReport.restore}
            content={dataReport.descriptionModal}
          />
        )}
      </Stack>
      {openModal && (
        <FinancialObligationModal
          title="Agregar obligaciones"
          onCloseModal={handleCloseModal}
          onConfirm={handleConfirm}
          confirmButtonText="Agregar"
        />
      )}
      <Stack
        gap="48px"
        direction={!isMobile ? "row" : "column"}
        justifyContent="center"
      >
        {loading ? (
          <SkeletonLine />
        ) : (
          <NewPrice
            value={totalBalance}
            label={dataReport.descriptionTotalBalance}
          />
        )}
        {loading ? (
          <SkeletonLine />
        ) : (
          <NewPrice value={totalFee} label={dataReport.descriptionTotalFee} />
        )}
      </Stack>
    </Stack>
  );
};
