import { useContext, useEffect, useState } from "react";
import { Stack, Divider, useMediaQuery, useFlag } from "@inubekit/inubekit";

import { CreditProductCard } from "@components/cards/CreditProductCard";
import { NewCreditProductCard } from "@components/cards/CreditProductCard/newCard";
import { CardValues } from "@components/cards/cardValues";
import { DeleteModal } from "@components/modals/DeleteModal";
import { AppContext } from "@context/AppContext";
import {
  IProspect,
  ICreditProduct,
  IProspectSummaryById,
} from "@services/prospect/types";
import { DeductibleExpensesModal } from "@pages/prospect/components/modals/DeductibleExpensesModal";

import { dataTableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment/config";
import { ConsolidatedCredits } from "@pages/prospect/components/modals/ConsolidatedCreditModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { ErrorModal } from "@components/modals/ErrorModal";

import { StyledCardsCredit, StyledPrint } from "./styles";
import { SummaryProspectCredit, tittleOptions } from "./config/config";
import { getSearchProspectSummaryById } from "@src/services/prospect/GetProspectSummaryById";
import { getAllDeductibleExpensesById } from "@src/services/prospect/SearchAllDeductibleExpensesById";
import { Schedule } from "@src/services/enum/schedule";

interface CardCommercialManagementProps {
  id: string;
  dataRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  moneyDestination: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  prospectData?: IProspect;
  refreshProducts?: () => void;
  onProspectUpdate?: (prospect: IProspect) => void;
}

export const CardCommercialManagement = (
  props: CardCommercialManagementProps,
) => {
  const {
    dataRef,
    id,
    onClick,
    prospectData,
    onProspectUpdate,
    moneyDestination,
    clientIdentificationNumber,
  } = props;
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );

  const { addFlag } = useFlag();
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ICreditProduct | null>(
    null,
  );
  const currentModal = modalHistory[modalHistory.length - 1];
  const [selectedProductId, setSelectedProductId] = useState("");
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>();
  const [showConsolidatedModal, setShowConsolidatedModal] = useState(false);
  const [showDeductibleExpensesModal, setDeductibleExpensesModal] =
    useState(false);
  const [deductibleExpenses, setDeductibleExpenses] = useState<
    { expenseName: string; expenseValue: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (prospectData?.creditProducts) {
      setProspectProducts(prospectData?.creditProducts);
    }
  }, [prospectData]);
  const isMobile = useMediaQuery("(max-width: 800px)");

  const handleDeleteClick = (creditProductId: string) => {
    setSelectedProductId(creditProductId);
    setShowDeleteModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          businessManagerCode,
          id,
        );
        if (result) {
          setProspectSummaryData(result);
        }
      } catch (error) {
        addFlag({
          title: tittleOptions.titleError,
          description: tittleOptions.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      }
    };
    if (prospectData) {
      fetchData();
    }
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  useEffect(() => {
    if (!businessUnitPublicCode || !prospectData?.prospectId) return;

    const fetchExpenses = async () => {
      try {
        const data = await getAllDeductibleExpensesById(
          businessUnitPublicCode,
          businessManagerCode,
          id,
        );
        setDeductibleExpenses(data);
      } catch (error) {
        addFlag({
          title: tittleOptions.deductibleExpensesErrorTitle,
          description: `${error}`,
          appearance: "danger",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  return (
    <div ref={dataRef}>
      <StyledCardsCredit $isMobile={isMobile}>
        <Stack
          gap="24px"
          width="fit-content"
          padding="4px 8px 16px 8px"
          direction={isMobile ? "column" : "row"}
        >
          {prospectProducts.map((entry, index) => (
            <CreditProductCard
              key={`${entry.creditProductCode}-${index}`}
              lineOfCredit={entry.lineOfCreditAbbreviatedName}
              paymentMethod={
                entry.ordinaryInstallmentsForPrincipal?.[0]
                  ?.paymentChannelAbbreviatedName
              }
              loanAmount={entry.loanAmount}
              interestRate={entry.interestRate}
              termMonths={entry.loanTerm}
              periodicFee={
                entry.ordinaryInstallmentsForPrincipal?.[0]?.installmentAmount
              }
              schedule={entry.schedule as Schedule}
              onEdit={
                editCreditApplication
                  ? handleInfo
                  : () => {
                      setSelectedProduct(entry);
                      setModalHistory((prev) => [...prev, "editProductModal"]);
                    }
              }
              onDelete={
                editCreditApplication
                  ? handleInfo
                  : () => handleDeleteClick(entry.creditProductCode)
              }
            />
          ))}
          <StyledPrint>
            <NewCreditProductCard onClick={onClick} />
          </StyledPrint>
        </Stack>
      </StyledCardsCredit>
      {isMobile && <Divider />}
      <Stack
        gap="24px"
        margin="36px 16px 8px 8px"
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
      >
        {SummaryProspectCredit.map((entry, index) => (
          <CardValues
            key={index}
            items={entry.item.map((item) => ({
              ...item,
              amount: String(prospectSummaryData?.[item.id] ?? 0),
            }))}
            showIcon={entry.iconEdit}
            isMobile={isMobile}
            handleEdit={() => setShowConsolidatedModal(true)}
            handleView={() => setDeductibleExpensesModal(true)}
          />
        ))}
      </Stack>
      {/* {showDeleteModal && (
        <DeleteModal
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={handleDelete}
          TextDelete={dataTableExtraordinaryInstallment.content}
        />
      )} */}
      {/* {currentModal === "editProductModal" && selectedProduct && (
        <EditProductModal
          onCloseModal={() => setModalHistory((prev) => prev.slice(0, -1))}
          title={`Editar producto`}
          confirmButtonText="Guardar"
          moneyDestination={moneyDestination}
          initialValues={{
            creditLine: selectedProduct.lineOfCreditAbbreviatedName || "",
            creditAmount: selectedProduct.loanAmount || 0,
            paymentMethod:
              selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                ?.paymentChannelAbbreviatedName || "",
            paymentCycle: selectedProduct.schedule || "",
            firstPaymentCycle: "",
            termInMonths: selectedProduct.loanTerm || 0,
            amortizationType: "",
            interestRate: selectedProduct.interestRate || 0,
            rateType: "",
          }}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={clientIdentificationNumber}
          creditRequestCode={id || ""}
          creditProductCode={selectedProduct?.creditProductCode || ""}
          prospectId={prospectData?.prospectId || ""}
          onProspectUpdate={(updatedProspect) => {

            if (updatedProspect?.creditProducts) {
              setProspectProducts(updatedProspect.creditProducts);
            }

            if (onProspectUpdate) {
              onProspectUpdate(updatedProspect);
            }

            setModalHistory((prev) => prev.slice(0, -1));
          }}

        />
      )} */}

      {/* {showConsolidatedModal && (
        <ConsolidatedCredits
          handleClose={() => setShowConsolidatedModal(false)}
          prospectData={prospectData}
        />
      )} */}
      {showDeductibleExpensesModal && (
        <DeductibleExpensesModal
          handleClose={() => setDeductibleExpensesModal(false)}
          initialValues={deductibleExpenses}
          loading={isLoading}
          isMobile={isMobile}
        />
      )}
      {/* {isModalOpen && (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrediboard.title}
          subtitle={privilegeCrediboard.subtitle}
          description={privilegeCrediboard.description}
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      )} */}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
    </div>
  );
};
