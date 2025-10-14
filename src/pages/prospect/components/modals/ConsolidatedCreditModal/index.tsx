import { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  Text,
  Stack,
  Grid,
  Divider,
  useMediaQuery,
  Button,
  useFlag,
} from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { InvestmentCreditCard } from "@pages/simulateCredit/components/InvestmentCreditCard";
import { BaseModal } from "@components/modals/baseModal";
import { CardConsolidatedCredit } from "@pages/simulateCredit/components/CardConsolidatedCredit";
import { IProspect } from "@services/prospect/types";
import { getCreditPayments } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { CustomerContext } from "@context/CustomerContext";
import { paymentOptionValues } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { IConsolidatedCredit } from "@services/prospect/types";
import { updateConsolidatedCredits } from "@services/prospect/updateConsolidatedCredits";

import { ScrollableContainer } from "./styles";
import { ModalConfig } from "./config";

export interface ConsolidatedCreditsProps {
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  loading?: boolean;
  prospectData?: IProspect;
  setConsolidatedCredits: React.Dispatch<
    React.SetStateAction<IConsolidatedCredit[]>
  >;
  consolidatedCredits: IConsolidatedCredit[];
  onProspectUpdated?: () => void;
}

export function ConsolidatedCredits(props: ConsolidatedCreditsProps) {
  const {
    handleClose,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    setConsolidatedCredits,
    consolidatedCredits,
    onProspectUpdated,
  } = props;
  const isMobile = useMediaQuery("(max-width:880px)");
  const [editOpen, setEditOpen] = useState(true);
  const [obligationPayment, setObligationPayment] = useState<IPayment[] | null>(
    null,
  );
  const [sortedObligationPayment, setSortedObligationPayment] = useState<
    IPayment[]
  >([]);
  const { customerData } = useContext(CustomerContext);
  const [totalCollected, setTotalCollected] = useState(0);
  const initialConsolidatedCreditsRef = useRef<IConsolidatedCredit[]>([]);
  const isInitializedRef = useRef(false);

  const { addFlag } = useFlag();

  const fetchDataObligationPayment = async () => {
    if (!customerData.publicCode) {
      return;
    }
    try {
      const data = await getCreditPayments(
        customerData.publicCode,
        businessUnitPublicCode,
        businessManagerCode,
      );
      console.log("data----:", data);
      setObligationPayment(data ?? null);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      addFlag({
        title: "Error al cargar obligaciones",
        description:
          description || "No se pudieron cargar las obligaciones de pago",
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (
      !isInitializedRef.current &&
      consolidatedCredits &&
      consolidatedCredits.length >= 0
    ) {
      initialConsolidatedCreditsRef.current = JSON.parse(
        JSON.stringify(consolidatedCredits),
      );

      let sumOfInitialsConsolidatedCredit = 0;
      for (const credit of consolidatedCredits) {
        sumOfInitialsConsolidatedCredit += credit.consolidatedAmount;
      }
      setTotalCollected(sumOfInitialsConsolidatedCredit);

      isInitializedRef.current = true;
    }
  }, [consolidatedCredits]);

  const initialValuesMap = consolidatedCredits.reduce(
    (acc, credit) => {
      acc[credit.creditProductCode] = {
        amount: credit.consolidatedAmount,
        type: credit.consolidatedAmountType,
      };
      return acc;
    },
    {} as Record<string, { amount: number; type: string }>,
  );

  useEffect(() => {
    fetchDataObligationPayment();
  }, []);

  useEffect(() => {
    if (
      obligationPayment &&
      obligationPayment.length > 0 &&
      sortedObligationPayment.length === 0
    ) {
      const sorted = [...obligationPayment].sort((a, b) => {
        const aHasValue = (initialValuesMap[a.id]?.amount || 0) > 0;
        const bHasValue = (initialValuesMap[b.id]?.amount || 0) > 0;

        if (aHasValue && !bHasValue) return -1;

        if (!aHasValue && bHasValue) return 1;
        return 0;
      });

      setSortedObligationPayment(sorted);
    }
  }, [obligationPayment, initialValuesMap, sortedObligationPayment.length]);

  const handleUpdateTotal = (
    oldValue: number,
    newValue: number,
    label?: string,
    code?: string,
    id?: string,
    title?: string,
    selectedDate?: Date,
  ) => {
    setTotalCollected((prevTotal) => prevTotal - oldValue + newValue);

    setConsolidatedCredits((prev) => {
      const existingCreditIndex = prev.findIndex(
        (credit) => credit.creditProductCode === code,
      );

      if (newValue === 0) {
        if (existingCreditIndex !== -1) {
          const wasInitiallySelected =
            initialConsolidatedCreditsRef.current.some(
              (credit) => credit.creditProductCode === code,
            );

          if (!wasInitiallySelected) {
            return prev.filter((credit) => credit.creditProductCode !== code);
          }

          return prev.map((credit, index) =>
            index === existingCreditIndex
              ? {
                  ...credit,
                  consolidatedAmount: 0,
                  consolidatedAmountType:
                    label || credit.consolidatedAmountType,
                  estimatedDateOfConsolidation:
                    selectedDate || credit.estimatedDateOfConsolidation,
                }
              : credit,
          );
        }
        return prev;
      }

      if (existingCreditIndex !== -1) {
        return prev.map((credit, index) =>
          index === existingCreditIndex
            ? {
                ...credit,
                consolidatedAmount: newValue,
                consolidatedAmountType: label || credit.consolidatedAmountType,
                lineOfCreditDescription:
                  title || credit.lineOfCreditDescription,
                borrowerIdentificationNumber:
                  id || credit.borrowerIdentificationNumber,
                estimatedDateOfConsolidation:
                  selectedDate || credit.estimatedDateOfConsolidation,
              }
            : credit,
        );
      }

      if (code && newValue > 0) {
        return [
          ...prev,
          {
            creditProductCode: code,
            consolidatedAmount: newValue,
            consolidatedAmountType: label || "",
            estimatedDateOfConsolidation: selectedDate || new Date(),
            lineOfCreditDescription: title || "",
            borrowerIdentificationType: code,
            borrowerIdentificationNumber: id || "",
          },
        ];
      }

      return prev;
    });
  };
  const handleRemoveCredit = (code: string) => {
    setConsolidatedCredits((prev) => {
      const updated = prev.filter((item) => item.creditProductCode !== code);

      return updated;
    });
  };

  const hasRealChanges = useMemo(() => {
    if (!isInitializedRef.current) {
      return false;
    }

    const initialCredits = initialConsolidatedCreditsRef.current;

    if (initialCredits.length === 0 && consolidatedCredits.length === 0) {
      return false;
    }

    if (consolidatedCredits.length !== initialCredits.length) {
      return true;
    }

    const currentMap = new Map(
      consolidatedCredits.map((credit) => [
        credit.creditProductCode,
        {
          amount: credit.consolidatedAmount,
          type: credit.consolidatedAmountType,
        },
      ]),
    );

    const initialMap = new Map(
      initialCredits.map((credit) => [
        credit.creditProductCode,
        {
          amount: credit.consolidatedAmount,
          type: credit.consolidatedAmountType,
        },
      ]),
    );

    for (const code of currentMap.keys()) {
      if (!initialMap.has(code)) {
        return true;
      }
    }

    for (const code of initialMap.keys()) {
      if (!currentMap.has(code)) {
        return true;
      }
    }

    for (const [code, currentCredit] of currentMap) {
      const initialCredit = initialMap.get(code);

      if (!initialCredit) {
        return true;
      }

      if (
        currentCredit.amount !== initialCredit.amount ||
        currentCredit.type !== initialCredit.type
      ) {
        return true;
      }
    }

    return false;
  }, [consolidatedCredits]);

  const handleSaveChanges = async () => {
    if (!prospectData?.prospectId) {
      return;
    }

    try {
      await updateConsolidatedCredits(
        businessUnitPublicCode,
        prospectData.prospectId,
        consolidatedCredits,
      );

      if (onProspectUpdated) {
        onProspectUpdated();
      }

      handleClose();

      addFlag({
        title: "Cambios guardados",
        description: "Los créditos consolidados se actualizaron correctamente",
        appearance: "success",
        duration: 4000,
      });
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      addFlag({
        title: "Error al guardar",
        description:
          description || "No se pudieron actualizar los créditos consolidados",
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  return (
    <BaseModal
      title={ModalConfig.title}
      nextButton={ModalConfig.keep}
      disabledNext={!hasRealChanges}
      handleNext={handleSaveChanges}
      width={isMobile ? "300px" : "640px"}
      height={isMobile ? "auto" : "688px"}
      handleBack={handleClose}
      finalDivider={true}
      backButton={ModalConfig.close}
    >
      <Stack direction="column" gap="24px">
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent={isMobile ? "center" : "space-between"}
          gap={isMobile ? "10px" : "0px"}
        >
          <Stack direction="column">
            <Text
              appearance="primary"
              weight="bold"
              type="headline"
              size="large"
            >
              ${currencyFormat(totalCollected, false)}
            </Text>
            <Text
              type="body"
              appearance="gray"
              size="small"
              textAlign="center"
            ></Text>
          </Stack>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            appearance="primary"
            spacing="wide"
            fullwidth={isMobile}
            disabled={!editOpen}
          >
            {ModalConfig.edit}
          </Button>
        </Stack>
        <Divider dashed />
        <ScrollableContainer>
          <Stack
            direction="column"
            gap="16px"
            height={isMobile ? "auto" : "420px"}
            padding="0px 0px 0px 2px"
          >
            {editOpen ? (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="0%"
                >
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                    />
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.newObligations}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="0%"
                >
                  {sortedObligationPayment.map((creditData) => (
                    <CardConsolidatedCredit
                      key={creditData.id}
                      title={creditData.title}
                      code={creditData.id}
                      expiredValue={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.EXPIREDVALUE,
                        )?.value ?? 0
                      }
                      nextDueDate={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.NEXTVALUE,
                        )?.value ?? 0
                      }
                      fullPayment={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.TOTALVALUE,
                        )?.value ?? 0
                      }
                      description={
                        creditData.options.find(
                          (option) =>
                            option.description ===
                            paymentOptionValues.INMEDIATE,
                        )?.description ?? ""
                      }
                      date={
                        creditData.options.find((option) => option.date)
                          ?.date ?? new Date()
                      }
                      onUpdateTotal={(
                        oldValue,
                        newValue,
                        label,
                        title,
                        selectedDate,
                      ) =>
                        handleUpdateTotal(
                          oldValue,
                          newValue,
                          label,
                          creditData.id,
                          creditData.id,
                          title,
                          selectedDate,
                        )
                      }
                      tags={creditData.tags}
                      initialValue={
                        initialValuesMap[creditData.id]?.amount || 0
                      }
                      isMobile={isMobile}
                      allowCustomValue={creditData.allowCustomValue}
                      initialType={initialValuesMap[creditData.id]?.type}
                      handleRemoveCredit={handleRemoveCredit}
                    />
                  ))}
                </Grid>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="100%"
                >
                  {consolidatedCredits.length === 0 && (
                    <Text type="body" size="small">
                      {ModalConfig.noSelected}
                    </Text>
                  )}
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Stack>
        </ScrollableContainer>
      </Stack>
    </BaseModal>
  );
}
