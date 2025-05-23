import { useState, useEffect } from "react";
import { MdAdd, MdCached } from "react-icons/md";
import { FormikValues } from "formik";
import { Stack, useMediaQuery, Button, Select } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { IProspect } from "@services/prospects/types";
import { ListModal } from "../ListModal";
import { FinancialObligationModal } from "../financialObligationModal";
export interface ReportCreditsModalProps {
  handleClose: () => void;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  prospectData?: IProspect[];
}

export function ReportCreditsModal(props: ReportCreditsModalProps) {
  const { handleClose, onChange, options, debtor, prospectData } = props;

  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const initialValues: FormikValues = {
    type: "",
    entity: "",
    fee: "",
    balance: "",
    payment: "",
    feePaid: "",
    term: "",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const isMobile = useMediaQuery("(max-width:880px)");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <BaseModal
      title={dataReport.title}
      nextButton={dataReport.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "1050px" : "290px"}
    >
      <Stack direction="column" gap="16px">
        {loading ? (
          <></>
        ) : (
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            gap="16px"
          >
            <Select
              id="income"
              name="deudor"
              label="Deudor"
              placeholder="Seleccione una opción"
              options={options}
              value={debtor}
              onChange={(name, value) => onChange(name, value)}
              size="compact"
            />
            <Stack alignItems="center" gap="16px">
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
              <Stack gap="16px">
                <Button
                  children={dataReport.addObligations}
                  iconBefore={<MdAdd />}
                  fullwidth={isMobile}
                  onClick={() => setOpenModal(true)}
                />
              </Stack>
            </Stack>
          </Stack>
        )}
        <Stack gap="16px" justifyContent="center">
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
          {openModal && (
            <FinancialObligationModal
              title="Agregar obligaciones"
              onCloseModal={handleCloseModal}
              onConfirm={() => console.log("ok")}
              initialValues={initialValues}
              confirmButtonText="Agregar"
            />
          )}
        </Stack>
        <TableFinancialObligations
          showActions={true}
          initialValues={prospectData}
        />
      </Stack>
    </BaseModal>
  );
}
