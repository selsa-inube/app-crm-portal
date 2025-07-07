import { useState } from "react";
import { FormikValues } from "formik";
import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, Text, Button } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import { IExtraordinaryPayment } from "@services/types";
import { TableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment";
import { TextLabels } from "@config/pages/add-prospect/ExtraordinaryInstallments/ExtraordinaryInstallments.config";

export interface ExtraordinaryInstallmentsProps {
  dataTable: IExtraordinaryPayment[];
  onClickDetails?: (id: string) => void;
  onClickEdit?: (id: string) => void;
  onClickEliminate?: (id: string) => void;
  isMobile: boolean;
}

export function ExtraordinaryInstallments(
  props: ExtraordinaryInstallmentsProps,
) {
  const { dataTable, isMobile } = props;
  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const initialValues: FormikValues = {
    paymentMethod: "",
    amount: "",
    value: "",
    frequency: "",
    datePayment: "",
  };

  const toggleAddSeriesModal = () => {
    setAddSeriesModalOpen(!isAddSeriesModalOpen);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleCloseModal = () => {
    setAddSeriesModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleSubmit = () => {
    toggleAddSeriesModal();
  };

  const handleConfirm = () => {
    console.log("Confirmar acción");
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
            {dataTable.length > 0 ? (
              <TableExtraordinaryInstallment refreshKey={refreshKey} />
            ) : (
              <Text type="label" appearance="gray" weight="bold">
                {TextLabels.NoData}
              </Text>
            )}
          </Stack>
          <Stack></Stack>
        </Stack>
        {isAddSeriesModalOpen && (
          <AddSeriesModal
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            onConfirm={handleConfirm}
            initialValues={initialValues}
          />
        )}
      </Stack>
    </Fieldset>
  );
}
