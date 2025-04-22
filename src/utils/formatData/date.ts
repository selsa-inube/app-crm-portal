function formatISODatetoCustomFormat(isoDateString: string) {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("es-CO", { month: "long" });
  const year = date.getFullYear().toString().slice(-2);

  return `${month} ${day}/${year}`;
}

function formatDateWithFullYear(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("es-CO", { month: "long" });
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = date.getFullYear();

  return `${capitalizedMonth} ${day} / ${year}`;
}

function isValidDate(value: string) {
  return /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(value);
}

const formatPrimaryDate = (date: Date, withTime?: boolean): string => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  if (withTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};

export {
  formatISODatetoCustomFormat,
  formatDateWithFullYear,
  isValidDate,
  formatPrimaryDate,
};
