import { useState } from "react";
import { FormikValues } from "formik";
import { MdAdd, MdCached } from "react-icons/md";
import { Stack, Text, Divider, Button } from "@inubekit/inubekit";

import { ListModal } from "@components/modals/ListModal";
import { FinancialObligationModal } from "@components/modals/financialObligationModal";
import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";

interface IObligationsFinancialProps {
  isMobile: boolean;
}

export function ObligationsFinancial(props: IObligationsFinancialProps) {
  const { isMobile } = props;

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const initialValues: FormikValues = {
    type: "",
    entity: "",
    fee: "",
    balance: "",
    payment: "",
    feePaid: "",
    term: "",
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Fieldset>
      <Stack
        direction="column"
        height="auto"
        gap="20px"
        padding={isMobile ? "8px" : "16px"}
      >
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
                {dataReport.description}
              </Text>
            )}
            {isMobile && (
              <Stack padding="0px 0px 10px 0px">
                <CardGray
                  label={dataReport.title}
                  placeHolder={dataReport.description}
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
        <Stack
          width="auto"
          justifyContent="center"
          direction="column"
          margin={isMobile ? "none" : "16px"}
        >
          <TableFinancialObligations
            refreshKey={refreshKey}
            showActions={true}
            showButtons={false}
          />
        </Stack>
      </Stack>
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
    </Fieldset>
  );
}
