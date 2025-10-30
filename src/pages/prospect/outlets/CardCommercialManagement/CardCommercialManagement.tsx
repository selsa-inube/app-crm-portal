import { useContext, useEffect, useState } from "react";
import { FormikValues } from "formik";
import { Stack, Divider, useMediaQuery } from "@inubekit/inubekit";

import { CreditProductCard } from "@components/cards/CreditProductCard";
import { NewCreditProductCard } from "@components/cards/CreditProductCard/newCard";
import { ErrorModal } from "@components/modals/ErrorModal";
import { CardValues } from "@components/cards/cardValues";
import { DeleteModal } from "@components/modals/DeleteModal";
import { ConsolidatedCredits } from "@pages/prospect/components/modals/ConsolidatedCreditModal";
import { DeductibleExpensesModal } from "@pages/prospect/components/modals/DeductibleExpensesModal";
import {
  IProspect,
  ICreditProduct,
  IProspectSummaryById,
} from "@services/prospect/types";
import { getSearchProspectSummaryById } from "@services/prospect/GetProspectSummaryById";
import { AppContext } from "@context/AppContext";
import { EditProductModal } from "@components/modals/ProspectProductModal";
import { Schedule } from "@services/enum/schedule";
import { getAllDeductibleExpensesById } from "@services/prospect/SearchAllDeductibleExpensesById";
import { RemoveCreditProduct } from "@services/prospect/removeCreditProduct";
import { updateCreditProduct } from "@services/prospect/updateCreditProduct";
import { getSearchProspectById } from "@services/prospect/SearchByIdProspect";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrm } from "@config/privilege";

import InfoModal from "../../components/InfoModal";
import { SummaryProspectCredit, tittleOptions } from "./config/config";
import { StyledCardsCredit, StyledPrint } from "./styles";

interface CardCommercialManagementProps {
  id: string;
  dataRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  setShowMessageSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  prospectSummaryData?: IProspectSummaryById;
  setProspectSummaryData?: React.Dispatch<
    React.SetStateAction<IProspectSummaryById>
  >;
  prospectData?: IProspect;
  showAddProduct?: boolean;
  refreshProducts?: () => void;
  onProspectUpdate?: (prospect: IProspect) => void;
  onProspectRefreshData?: () => void;
}

export const CardCommercialManagement = (
  props: CardCommercialManagementProps,
) => {
  const {
    dataRef,
    onClick,
    prospectData,
    showAddProduct = true,
    onProspectUpdate,
    prospectSummaryData,
    setProspectSummaryData,
    setShowMessageSuccessModal,
    onProspectRefreshData,
  } = props;
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const currentModal = modalHistory[modalHistory.length - 1];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ICreditProduct | null>(
    null,
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [showConsolidatedModal, setShowConsolidatedModal] = useState(false);
  const [consolidatedCredits, setConsolidatedCredits] = useState(
    prospectData?.consolidatedCredits || [],
  );
  const [showDeductibleExpensesModal, setDeductibleExpensesModal] =
    useState(false);
  const [deductibleExpenses, setDeductibleExpenses] = useState<
    { expenseName: string; expenseValue: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (prospectData?.creditProducts) {
      setProspectProducts(prospectData?.creditProducts);
    }
  }, [prospectData]);

  useEffect(() => {
    if (prospectData?.consolidatedCredits) {
      setConsolidatedCredits(prospectData.consolidatedCredits);
    }
  }, [prospectData?.consolidatedCredits]);

  const isMobile = useMediaQuery("(max-width: 800px)");

  const handleDelete = async () => {
    if (!prospectData || !prospectProducts.length) return;
    try {
      await RemoveCreditProduct(businessUnitPublicCode, businessManagerCode, {
        creditProductCode: selectedProductId,
        prospectId: prospectData.prospectId,
      });
      setProspectProducts((prev) =>
        prev.filter(
          (product) => product.creditProductCode !== selectedProductId,
        ),
      );

      if (prospectData?.prospectId) {
        const updatedProspect = await getSearchProspectById(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
        );
        if (onProspectUpdate) {
          onProspectUpdate(updatedProspect);
        }
      }

      setShowDeleteModal(false);
      setShowMessageSuccessModal(true);
    } catch (error) {
      setShowDeleteModal(false);
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!prospectData || !selectedProduct) return;

    try {
      const payload = {
        creditProductCode: selectedProduct.creditProductCode,
        interestRate: Number(values.interestRate),
        loanTerm: Number(values.termInMonths),
        prospectId: prospectData.prospectId,
      };

      await updateCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (prospectData?.prospectId) {
        const updatedProspect = await getSearchProspectById(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
        );
        if (onProspectUpdate) {
          onProspectUpdate(updatedProspect);
        }
      }

      setModalHistory((prev) => prev.slice(0, -1));
      setShowMessageSuccessModal(true);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    }
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
          businessManagerCode,
          prospectData?.prospectId || "",
        );
        if (result && setProspectSummaryData) {
          setProspectSummaryData(result);
        }
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(tittleOptions.descriptionError);
      }
    };
    if (prospectData) {
      fetchData();
    }
  }, [businessUnitPublicCode, prospectData?.prospectId, prospectData]);

  useEffect(() => {
    if (!businessUnitPublicCode || !prospectData?.prospectId) return;

    const fetchExpenses = async () => {
      try {
        const data = await getAllDeductibleExpensesById(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.prospectId,
        );
        setDeductibleExpenses(data);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${error}`);
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
              schedule={entry.lineOfCreditAbbreviatedName as Schedule}
              onEdit={() =>
                canEditCreditRequest
                  ? handleInfo()
                  : (setSelectedProduct(entry),
                    setModalHistory((prev) => [...prev, "editProductModal"]))
              }
              onDelete={() =>
                canEditCreditRequest
                  ? handleInfo()
                  : handleDeleteClick(entry.creditProductCode)
              }
            />
          ))}
          {showAddProduct && (
            <StyledPrint>
              <NewCreditProductCard onClick={onClick} />
            </StyledPrint>
          )}
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
          onConfirm={handleConfirm}
          title={tittleOptions.editProduct}
          confirmButtonText={tittleOptions.save}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          initialValues={{
            creditLine: selectedProduct.lineOfCreditAbbreviatedName || "",
            creditAmount: selectedProduct.loanAmount || 0,
            paymentMethod:
              selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                ?.paymentChannelAbbreviatedName || "",
            paymentCycle: selectedProduct.installmentFrequency || "",
            firstPaymentCycle: "",
            termInMonths: selectedProduct.loanTerm || 0,
            amortizationType: "",
            interestRate: selectedProduct.interestRate || 0,
            rateType: "",
          }}
          prospectData={{
            lineOfCredit: selectedProduct.lineOfCreditAbbreviatedName || "",
            moneyDestination:
              prospectData!.moneyDestinationAbbreviatedName || "",
            paymentChannelType:
              prospectData!.preferredPaymentChannelAbbreviatedName,
          }}
          setShowErrorModal={setShowErrorModal}
          setMessageError={setMessageError}
        />
      )}
      {showConsolidatedModal && (
        <ConsolidatedCredits
          handleClose={() => {
            setShowConsolidatedModal(false);
            setConsolidatedCredits(prospectData?.consolidatedCredits || []);
          }}
          prospectData={prospectData}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          consolidatedCredits={consolidatedCredits}
          setConsolidatedCredits={setConsolidatedCredits}
          onProspectRefreshData={onProspectRefreshData}
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
      {isModalOpen && (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrm.title}
          subtitle={privilegeCrm.subtitle}
          description={privilegeCrm.description}
          nextButtonText={privilegeCrm.nextButtonText}
          isMobile={isMobile}
        />
      )}
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
