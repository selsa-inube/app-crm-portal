const textsConfig = {
  noResultsMessage: {
    title: (search: string) => `No se encontraron resultados para "${search}".`,
    suggestion: "Por favor, intenta modificando los parámetros de búsqueda.",
  },
  clientsTitle: "Unidades de negocio",
  clientsSubtitle: "Selecciona la unidad de negocio con la que vas a trabajar hoy",
  searchPlaceholder: "Buscar...",
  continueButton: "Continuar",
};

export { textsConfig };
