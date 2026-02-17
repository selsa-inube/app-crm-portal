import { Spinner, Stack, Text } from "@inubekit/inubekit";

const LoadingAppUI = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      direction="column"
      width="100%"
      height="600px"
      gap="16px"
    >
      <Text type="headline" size="medium" textAlign="center">
        Cargando la aplicación
      </Text>
      <Text type="title" size="small" textAlign="center">
        Espere un momento, por favor.
      </Text>

      <Stack alignItems="center" direction="column">
        <Spinner size="large" transparent={false} />
      </Stack>
    </Stack>
  );
};

export { LoadingAppUI };
