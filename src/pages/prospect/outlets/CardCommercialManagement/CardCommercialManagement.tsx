import { useContext, useEffect, useState } from "react";
import { Stack, Divider, useMediaQuery, useFlag } from "@inubekit/inubekit";

import { CreditProductCard } from "@components/cards/CreditProductCard";
import { NewCreditProductCard } from "@components/cards/CreditProductCard/newCard";
import { CardValues } from "@components/cards/cardValues";
import { DeleteModal } from "@components/modals/DeleteModal";
import { ConsolidatedCredits } from "@pages/prospect/components/modals/ConsolidatedCreditModal";
import { DeductibleExpensesModal } from "@pages/prospect/components/modals/DeductibleExpensesModal";
import { deleteCreditProductMock } from "@mocks/utils/deleteCreditProductMock.service";
import { IProspect, ICreditProduct } from "@services/prospects/types";
import { IProspectSummaryById } from "@services/prospects/ProspectSummaryById/types";
import { getSearchProspectSummaryById } from "@services/prospects/ProspectSummaryById";
import { AppContext } from "@context/AppContext";
import { EditProductModal } from "@components/modals/ProspectProductModal";
import { Schedule } from "@services/enums";
import { getAllDeductibleExpensesById } from "@services/prospects/deductibleExpenses";

import { SummaryProspectCredit, tittleOptions } from "./config/config";
import { StyledCardsCredit, StyledPrint } from "./styles";

interface CardCommercialManagementProps {
  id: string;
  dataRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  prospectData?: IProspect;
  refreshProducts?: () => void;
}

export const CardCommercialManagement = (
  props: CardCommercialManagementProps,
) => {
  const { dataRef, id, onClick, prospectData } = props;
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );

  const { addFlag } = useFlag();
  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const currentModal = modalHistory[modalHistory.length - 1];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ICreditProduct | null>(
    null,
  );

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

  useEffect(() => {
    if (prospectData?.creditProducts) {
      setProspectProducts(prospectData?.creditProducts);
    }
  }, [prospectData]);
  const isMobile = useMediaQuery("(max-width: 800px)");

  const handleDelete = async () => {
    await deleteCreditProductMock(
      id,
      selectedProductId,
      prospectProducts,
      setProspectProducts,
    );
    setShowDeleteModal(false);
  };
  const handleDeleteClick = (creditProductId: string) => {
    setSelectedProductId(creditProductId);
    setShowDeleteModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          prospectData?.prospectId || "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  useEffect(() => {
    if (!businessUnitPublicCode || !prospectData?.prospectId) return;

    const fetchExpenses = async () => {
      try {
        const data = await getAllDeductibleExpensesById(
          businessUnitPublicCode,
          prospectData.prospectId,
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
              onEdit={() => {
                setSelectedProduct(entry);
                setModalHistory((prev) => [...prev, "editProductModal"]);
              }}
              onDelete={() => handleDeleteClick(entry.creditProductCode)}
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
      {showDeleteModal && (
        <DeleteModal
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={handleDelete}
          TextDelete={tittleOptions.deletedExpensesErrorDescription}
        />
      )}
      {currentModal === "editProductModal" && selectedProduct && (
        <EditProductModal
          onCloseModal={() => setModalHistory((prev) => prev.slice(0, -1))}
          onConfirm={() => setModalHistory((prev) => prev.slice(0, -1))}
          title={`Editar producto`}
          confirmButtonText="Guardar"
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
        />
      )}

      {showConsolidatedModal && (
        <ConsolidatedCredits
          handleClose={() => setShowConsolidatedModal(false)}
          prospectData={prospectData}
        />
      )}
      {showDeductibleExpensesModal && (
        <DeductibleExpensesModal
          handleClose={() => setDeductibleExpensesModal(false)}
          initialValues={deductibleExpenses}
          loading={isLoading}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};
