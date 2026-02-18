import { useEffect, useState, useRef } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, Button, Text } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import {
  TableExtraordinaryInstallment,
  TableExtraordinaryInstallmentProps,
} from "@pages/prospect/components/TableExtraordinaryInstallment";
import { TextLabels } from "@config/pages/add-prospect/ExtraordinaryInstallments/ExtraordinaryInstallments.config";
import { EnumType } from "@hooks/useEnum/useEnum";
import { titleExtraordinary } from "./config";

export interface ExtraordinaryInstallmentsProps {
  isMobile: boolean;
  initialValues: TableExtraordinaryInstallmentProps[] | null;
  businessManagerCode: string;
  lang: EnumType;
  lineOfCreditAbbreviatedName: string;
  moneyDestinationAbbreviatedName: string;
  clientIdentificationNumber: string;
  maxLoanTerm: number;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  handleOnChange: (
    newExtraordinary: TableExtraordinaryInstallmentProps[],
  ) => void;
}

export function ExtraordinaryInstallments(
  props: ExtraordinaryInstallmentsProps,
) {
  const {
    initialValues,
    isMobile,
    businessManagerCode,
    lang,
    handleOnChange,
    lineOfCreditAbbreviatedName,
    moneyDestinationAbbreviatedName,
    maxLoanTerm,
    setMessageError,
    setShowErrorModal,
  } = props;
  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isInitialMount = useRef(true);

  const initialInstallmentState = {
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  };

  const [installmentState, setInstallmentState] = useState(
    initialInstallmentState,
  );

  const toggleAddSeriesModal = () => {
    setAddSeriesModalOpen(!isAddSeriesModalOpen);
    setRefreshKey((prevKey) => prevKey + 1);
    if (!isAddSeriesModalOpen) {
      setInstallmentState(initialInstallmentState);
    }
  };

  const handleCloseModal = () => {
    setAddSeriesModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
    setInstallmentState(initialInstallmentState);
  };

  const [extraordinary, setExtraordinary] = useState<
    TableExtraordinaryInstallmentProps[]
  >(initialValues || []);

  useEffect(() => {
    setExtraordinary(initialValues || []);
  }, [initialValues]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      handleOnChange(extraordinary);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [extraordinary]);

  const handleSubmit = (installment: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
    abbreviatedName: string;
    value?: number;
  }) => {
    const {
      installmentDate,
      paymentChannelAbbreviatedName,
      value,
      abbreviatedName,
    } = installment;
    const amountToAdd =
      value !== undefined ? value : installmentState.installmentAmount;

    setExtraordinary((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.datePayment === installmentDate &&
          item.paymentMethod === paymentChannelAbbreviatedName,
      );

      let updated: TableExtraordinaryInstallmentProps[];
      if (existingIndex !== -1) {
        updated = prev.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                value: (Number(item.value) || 0) + amountToAdd,
                cycleName: abbreviatedName,
              }
            : item,
        );
      } else {
        const newPayment: TableExtraordinaryInstallmentProps = {
          id: `${paymentChannelAbbreviatedName},${installmentDate},${Date.now()}`,
          datePayment: installmentDate,
          value: amountToAdd,
          paymentMethod: paymentChannelAbbreviatedName,
          paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
          cycleName: abbreviatedName,
        };
        updated = [...prev, newPayment];
      }

      return updated;
    });

    toggleAddSeriesModal();
  };

  const handleDelete = (id: string) => {
    setExtraordinary((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      return updated;
    });
  };

  return (
    <Fieldset>
      <Stack direction="column">
        <Stack direction="column">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            margin="0px 0px 16px "
          >
            <Text
              type="label"
              size="large"
              appearance="dark"
              weight="bold"
              padding="0 20px"
            >
              {titleExtraordinary.title.i18n[lang]}
            </Text>
            <Button
              fullwidth={isMobile}
              iconBefore={
                <Icon
                  icon={<MdOutlineAdd />}
                  appearance="light"
                  size="18px"
                  spacing="narrow"
                />
              }
              onClick={toggleAddSeriesModal}
            >
              {TextLabels.addSeries.i18n[lang]}
            </Button>
          </Stack>
          <Stack justifyContent="center">
            <TableExtraordinaryInstallment
              refreshKey={refreshKey}
              extraordinary={extraordinary}
              service={false}
              handleDelete={handleDelete}
              businessManagerCode={businessManagerCode}
              lang={lang}
            />
          </Stack>
        </Stack>
        {isAddSeriesModalOpen && (
          <AddSeriesModal
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            installmentState={installmentState}
            setInstallmentState={setInstallmentState}
            service={true}
            lang={lang}
            lineOfCreditAbbreviatedName={lineOfCreditAbbreviatedName}
            moneyDestinationAbbreviatedName={moneyDestinationAbbreviatedName}
            maxLoanTerm={maxLoanTerm}
            setMessageError={setMessageError}
            setShowErrorModal={setShowErrorModal}
            toggleAddSeriesModal={toggleAddSeriesModal}
            isSimulateCredit={true}
          />
        )}
      </Stack>
    </Fieldset>
  );
}
