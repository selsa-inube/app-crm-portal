import { Text, Button, Stack, Icon, Spinner, useMediaQuery } from "@inubekit/inubekit";
import { Formik, FormikProps } from "formik";
import { MdOutlineAdd, MdOutlineArrowForward } from "react-icons/md";

import { spacing } from "@design/tokens/spacing";
import { SearchInput } from "@components/data/EmployeeSearchInput";

import { StyledAppPage, StyledQuickAccessContainer } from "./styles";
import { useSelectEmployee } from "./interface";

function SelectEmployeePage() {
  const {
    filteredEmployees,
    loading,
    error,
    setSearchTerm,
    isSubmitting,
    validationSchema,
    handleEmployeeSelection,
    selectedEmployee,
    handleSubmit,
  } = useSelectEmployee();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpenNewEmployeePage = () => {
    window.open("/employees/new-employee", "_blank");
  };

  return (
    <Formik
      initialValues={{ keyword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Formulario enviado con valores:", values);
      }}
    >
      {(formik: FormikProps<{ keyword: string }>) => (
        <StyledAppPage>
          <Stack direction="column" gap={spacing.s250}>
            <StyledQuickAccessContainer>
              <Stack direction="column" gap={spacing.s250}>
                <Text type="headline" size={isMobile ? "small" : undefined}>
                  Seleccionar empleado
                </Text>
                <Text appearance="gray">
                  Digita la cédula y/o nombre del empleado que quieres seleccionar.
                </Text>

                {loading && <Text appearance="gray">Cargando empleados...</Text>}
                {error && <Text appearance="danger">{error}</Text>}

                <form onSubmit={formik.handleSubmit}>
                  <Stack
                    gap={spacing.s150}
                    alignItems="start"
                    width={isMobile ? "100%" : "576px"}
                    direction="row"
                  >
                    <SearchInput
                      value={formik.values.keyword}
                      setValue={setSearchTerm}
                      formik={formik}
                      filteredItems={filteredEmployees}
                      handleItemSelection={handleEmployeeSelection}
                      renderItemLabel={(item) => (
                        <Stack>
                          <Text type="body" size={isMobile ? "small" : "medium"}>
                            {item.employeeId === "no-results"
                              ? "No hay resultados para esta búsqueda."
                              : `${item.identificationDocumentNumber} - ${item.names} ${item.surnames}`}
                          </Text>
                        </Stack>
                      )}
                      placeholder="Palabra clave"
                    />

                    {isMobile ? (
                      <Icon
                        appearance="primary"
                        disabled={!formik.isValid || !formik.dirty || loading}
                        icon={
                          isSubmitting ? (
                            <Spinner appearance="primary" />
                          ) : (
                            <MdOutlineArrowForward />
                          )
                        }
                        cursorHover={!loading}
                        spacing="wide"
                        variant="filled"
                        shape="rectangle"
                        size="40px"
                        onClick={() => {
                          if (selectedEmployee) {
                            handleSubmit({
                              employee: selectedEmployee.employeeId,
                            });
                          }
                        }}
                      />
                    ) : (
                      <Button
                        appearance="primary"
                        loading={isSubmitting}
                        spacing="wide"
                        variant="filled"
                        disabled={!formik.isValid || !formik.dirty}
                        onClick={() => {
                          if (selectedEmployee) {
                            handleSubmit({
                              employee: selectedEmployee.employeeId,
                            });
                          }
                        }}
                      >
                        Continuar
                      </Button>
                    )}
                  </Stack>
                </form>
              </Stack>
            </StyledQuickAccessContainer>

            <Stack justifyContent="end">
              <Button
                appearance="primary"
                iconBefore={<MdOutlineAdd />}
                variant="none"
                spacing="wide"
                onClick={handleOpenNewEmployeePage}
              >
                Vincular nuevo empleado
              </Button>
            </Stack>
          </Stack>
        </StyledAppPage>
      )}
    </Formik>
  );
}

export { SelectEmployeePage };
