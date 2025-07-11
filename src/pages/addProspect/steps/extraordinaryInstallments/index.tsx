import { useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, Button } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import {
  TableExtraordinaryInstallment,
  TableExtraordinaryInstallmentProps,
} from "@pages/prospect/components/TableExtraordinaryInstallment";
import { TextLabels } from "@config/pages/add-prospect/ExtraordinaryInstallments/ExtraordinaryInstallments.config";

export interface ExtraordinaryInstallmentsProps {
  isMobile: boolean;
  initialValues: TableExtraordinaryInstallmentProps[] | null;
  handleOnChange: (newData: TableExtraordinaryInstallmentProps[]) => void;
}

export function ExtraordinaryInstallments(
  props: ExtraordinaryInstallmentsProps,
) {
  const { initialValues, isMobile, handleOnChange } = props;

  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleAddSeriesModal = () => {
    setAddSeriesModalOpen(!isAddSeriesModalOpen);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleCloseModal = () => {
    setAddSeriesModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [installmentState, setInstallmentState] = useState({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });

  const [extraordinary, setExtraordinary] = useState<
    TableExtraordinaryInstallmentProps[]
  >([]);

  const handleSubmit = (installment: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }) => {
    const { installmentDate, paymentChannelAbbreviatedName } = installment;

    const newPayment: TableExtraordinaryInstallmentProps = {
      id: `${paymentChannelAbbreviatedName},${installmentDate},${Date.now()}`,
      datePayment: installmentDate,
      value: installmentState.installmentAmount,
      paymentMethod: paymentChannelAbbreviatedName,
    };

    setExtraordinary((prev) => {
      const exists = prev.some((p) => p.id === newPayment.id);
      const updated = !exists ? [...prev, newPayment] : prev;
      if (handleOnChange) {
        handleOnChange(updated);
      }
      return updated;
    });

    toggleAddSeriesModal();
  };

  const handleDelete = (id: string) => {
    setExtraordinary((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (handleOnChange) {
        handleOnChange(updated);
      }
      return updated;
    });
  };

  return (
    <Fieldset>
      <Stack direction="column">
        <Stack direction="column">
          <Stack justifyContent="end" margin="0px 0px 16px ">
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
              {TextLabels.addSeries}
            </Button>
          </Stack>
          <Stack justifyContent="center">
            <TableExtraordinaryInstallment
              refreshKey={refreshKey}
              extraordinary={initialValues || extraordinary}
              service={false}
              handleDelete={handleDelete}
            />
          </Stack>
        </Stack>
        {isAddSeriesModalOpen && (
          <AddSeriesModal
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            installmentState={installmentState}
            setInstallmentState={setInstallmentState}
            service={false}
          />
        )}
      </Stack>
    </Fieldset>
  );
}
