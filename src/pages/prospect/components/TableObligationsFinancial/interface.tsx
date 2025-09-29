import { useContext, useState } from "react";
import { FormikValues } from "formik";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdAdd,
  MdCached,
  MdOutlineInfo,
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
  Select,
} from "@inubekit/inubekit";

import { EditFinancialObligationModal } from "@components/modals/editFinancialObligationModal";
import { NewPrice } from "@components/modals/ReportCreditsModal/components/newPrice";
import { BaseModal } from "@components/modals/baseModal";
import { FinancialObligationModal } from "@components/modals/financialObligationModal";
import { updateProspect } from "@services/prospect/updateProspect";
import { IObligations } from "@services/creditRequest/types";
import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { ListModal } from "@components/modals/ListModal";
import { CustomerContext } from "@context/CustomerContext";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { ErrorModal } from "@components/modals/ErrorModal";
import { privilegeCrm } from "@config/privilege";

import { usePagination } from "./utils";
import { dataReport } from "./config";
import { IBorrowerDataFinancial } from "./types";
import { IObligations as IObligationsFinancial } from "./types";
import InfoModal from "../InfoModal";

export interface ITableFinancialObligationsProps {
  type?: string;
  id?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  initialValues?: FormikValues | undefined;
  refreshKey?: number;
  setRefreshKey?: React.Dispatch<React.SetStateAction<number>>;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
  onProspectUpdate?: () => void;
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
  services?: boolean;
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
  handleOnChangeExtraBorrowers?: (
    newObligations: IObligationsFinancial[],
  ) => void;
}

export interface IDataInformationItem {
  id?: string;
  type?: string;
  balance?: number;
  fee?: number;
  propertyName?: string;
  propertyValue?: string | string[];
  __isPadding?: boolean;
}

interface UIProps {
  dataInformation: IDataInformationItem[];
  extraDebtors: ITableFinancialObligationsProps[];
  selectedBorrower: ITableFinancialObligationsProps | null;
  loading: boolean;
  visibleHeaders: { key: string; label: string; action?: boolean }[];
  isModalOpenEdit: boolean;
  setIsModalOpenEdit: (value: boolean) => void;
  onProspectUpdate?: () => void;
  showErrorModal: boolean;
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
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
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
  initialValues: FormikValues;
  services?: boolean;
  handleOnChange: (values: FormikValues) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>> | undefined;
  setSelectedBorrower:
    | React.Dispatch<
        React.SetStateAction<ITableFinancialObligationsProps | null>
      >
    | undefined;
  selectedBorrowerIndex: number;
  businessUnitPublicCode: string;
  messageError: string;
  setSelectedBorrowerIndex: React.Dispatch<React.SetStateAction<number>>;
  handleOnChangeExtraBorrowers?: (
    newObligations: IObligationsFinancial[],
  ) => void;
}

export const TableFinancialObligationsUI = ({
  dataInformation,
  extraDebtors,
  loading,
  selectedBorrower,
  visibleHeaders,
  isMobile,
  isModalOpenEdit,
  setIsModalOpenEdit,
  onProspectUpdate,
  showOnlyEdit,
  services = true,
  handleEdit,
  handleDelete,
  handleUpdate,
  initialValues,
  handleOnChange,
  setRefreshKey,
  setSelectedBorrower,
  selectedBorrowerIndex,
  businessUnitPublicCode,
  showErrorModal,
  messageError,
  setMessageError,
  setSelectedBorrowerIndex,
  setShowErrorModal,
  handleOnChangeExtraBorrowers,
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
  } = usePagination([...dataInformation].reverse());

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

  const borrowerOptions =
    initialValues?.[0]?.borrowers?.map(
      (borrower: IBorrowerDataFinancial, index: number) => ({
        id: String(index),
        value: String(index),
        label: borrower.borrowerName,
      }),
    ) || [];

  const handleCloseModal = () => {
    setOpenModal(false);
    setRefreshKey?.((prevKey) => prevKey + 1);
  };

  const mapToTableFinancialObligationsProps = (
    item: IDataInformationItem,
  ): ITableFinancialObligationsProps => {
    return {
      id: item.id,
      type: item.type,
      propertyValue: Array.isArray(item.propertyValue)
        ? item.propertyValue.join(",")
        : item.propertyValue,
      balance: item.balance?.toString(),
      fee: item.fee?.toString(),
    };
  };

  const handleConfirm = async (values: FormikValues) => {
    if (services) {
      try {
        const selectedBorrower =
          initialValues?.[0]?.borrowers?.[selectedBorrowerIndex];

        const newFinancialObligation = {
          propertyName: "FinancialObligation",
          propertyValue: `${values.type}, ${values.balance}, ${values.fee}, ${values.entity}, ${values.payment}, ${values.idUser}, ${values.feePaid}, ${values.term}`,
        };

        const updatedProperties = [
          ...selectedBorrower.borrowerProperties,
          newFinancialObligation,
        ];

        const updatedBorrower = {
          ...selectedBorrower,
          borrowerProperties: updatedProperties,
        };

        const updatedBorrowers = [...initialValues[0].borrowers];
        updatedBorrowers[selectedBorrowerIndex] = updatedBorrower;

        const prospectData = {
          ...initialValues[0],
          borrowers: updatedBorrowers,
        };

        await updateProspect(businessUnitPublicCode, prospectData);

        setRefreshKey?.((prev) => prev + 1);
        setOpenModal(false);
        onProspectUpdate?.();
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${error}`);
      }
    } else {
      const newObligation = {
        obligationNumber: values.idUser || "",
        productName: values.type || "",
        paymentMethodName: values.payment || "",
        balanceObligationTotal: values.balance || 0,
        nextPaymentValueTotal: values.fee || 0,
        entity: values.entity || "",
        duesPaid: values.feePaid || "",
        outstandingDues: values.term || "",
      };

      const currentObligations = Array.isArray(initialValues)
        ? initialValues
        : initialValues
          ? [initialValues]
          : [];

      const updatedInitialValues = [...currentObligations, newObligation];

      handleOnChange(updatedInitialValues);
      setOpenModal(false);
      setRefreshKey?.((prev) => prev + 1);
    }
  };

  const totalBalance = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 1),
    0,
  );
  const totalFee = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 2),
    0,
  );
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
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

  const renderDataRows = () =>
    paddedCurrentData.map((prop: IDataInformationItem, rowIndex: number) => {
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
        values = prop.propertyValue.split(",").map((val: string) => val.trim());
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
                      onClick={() =>
                        canEditCreditRequest
                          ? handleInfo()
                          : handleEdit(
                              mapToTableFinancialObligationsProps(prop),
                            )
                      }
                      cursorHover
                    />
                    {!showOnlyEdit && (
                      <Icon
                        icon={<MdDeleteOutline />}
                        appearance="danger"
                        size="16px"
                        onClick={() =>
                          canEditCreditRequest
                            ? handleInfo()
                            : (setSelectedBorrower?.(
                                mapToTableFinancialObligationsProps(prop),
                              ),
                              setIsDeleteModal(true))
                        }
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
    <Stack
      direction="column"
      width="100%"
      gap={handleOnChangeExtraBorrowers === undefined ? "16px" : "5px"}
    >
      <Stack direction="column">
        {handleOnChangeExtraBorrowers === undefined && (
          <>
            <Stack alignItems="center">
              {!isMobile && (
                <Text size="medium" type="label" weight="bold">
                  {dataReport.title}
                </Text>
              )}
            </Stack>
          </>
        )}
        <Stack
          justifyContent="space-between"
          alignItems={isMobile ? "normal" : "end"}
          direction={isMobile ? "column" : "row"}
        >
          {handleOnChangeExtraBorrowers === undefined && (
            <>
              {!isMobile && (
                <Stack>
                  {initialValues?.[0]?.borrowers?.length > 1 ? (
                    <Select
                      name="borrower"
                      id="borrower"
                      label="Deudor"
                      placeholder="Selecciona un deudor"
                      options={borrowerOptions}
                      value={String(selectedBorrowerIndex)}
                      onChange={(_, value) =>
                        setSelectedBorrowerIndex(Number(value))
                      }
                      size="wide"
                      fullwidth={isMobile}
                    />
                  ) : (
                    <Text size="medium" type="title" appearance="dark">
                      {customerData?.fullName}
                    </Text>
                  )}
                </Stack>
              )}

              {isMobile && (
                <Stack padding="0px 0px 10px 0px">
                  {initialValues?.[0]?.borrowers?.length > 1 ? (
                    <Select
                      name="borrower"
                      id="borrower"
                      label="Deudor"
                      placeholder="Selecciona un deudor"
                      options={borrowerOptions}
                      value={String(selectedBorrowerIndex)}
                      onChange={(_, value) =>
                        setSelectedBorrowerIndex(Number(value))
                      }
                      size="wide"
                      fullwidth={isMobile}
                    />
                  ) : (
                    <CardGray
                      label={dataReport.title}
                      placeHolder={customerData?.fullName}
                      isMobile={true}
                    />
                  )}
                </Stack>
              )}
            </>
          )}
          {!showOnlyEdit && (
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
                  disabled={canEditCreditRequest}
                  variant="outlined"
                  spacing="wide"
                  onClick={() => setIsOpenModal(true)}
                />
              </Stack>
              <Stack>
                <Button
                  children={dataReport.addObligations}
                  iconBefore={<MdAdd />}
                  disabled={canEditCreditRequest}
                  fullwidth={isMobile}
                  onClick={() => setOpenModal(true)}
                />
              </Stack>
              <Stack alignItems="center">
                {canEditCreditRequest ? (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                ) : (
                  <></>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
      {!showOnlyEdit && <Divider />}
      <Table tableLayout="auto">
        <Thead>
          <Tr>{renderHeaders()}</Tr>
        </Thead>
        <Tbody>
          {loading ? (
            renderLoadingRow()
          ) : extraDebtors.length === 0 ? (
            <Tr border="left">
              <Td colSpan={visibleHeaders.length} align="center" type="custom">
                <Stack
                  gap="16px"
                  direction="column"
                  height="250px"
                  justifyContent="center"
                >
                  <Text
                    size="large"
                    type="label"
                    appearance="gray"
                    textAlign="center"
                  >
                    {dataReport.noData}
                  </Text>
                </Stack>
              </Td>
            </Tr>
          ) : (
            renderDataRows()
          )}
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
        {isModalOpenEdit && selectedBorrower && (
          <EditFinancialObligationModal
            title={`${dataReport.edit} ${selectedBorrower.type || ""}`}
            onCloseModal={() => setIsModalOpenEdit(false)}
            onConfirm={async (updatedDebtor) => {
              await handleUpdate(updatedDebtor);
            }}
            initialValues={selectedBorrower}
            confirmButtonText={dataReport.save}
          />
        )}
        {isDeleteModal && (
          <BaseModal
            title={dataReport.deletion}
            nextButton={dataReport.delete}
            backButton={dataReport.cancel}
            handleNext={() => {
              handleDelete(selectedBorrower?.propertyValue ?? "");
              setIsDeleteModal(false);
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
            uploadedFiles={[]}
            setUploadedFiles={() => {}}
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
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
      {isModalOpen ? (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
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
