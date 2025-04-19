export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const monthNames = [
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
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const getDateString = (date: string | { value: string }): string => {
  return typeof date === "string" ? date : date.value;
};

export const parseFormattedDate = (dateStr: string): Date => {
  const parts = dateStr.split("/");
  if (parts.length !== 3) {
    return new Date(dateStr);
  }
  const day = parseInt(parts[0], 10);
  const monthAbbr = parts[1].toLowerCase();
  const year = parseInt(parts[2], 10);
  const monthMap: Record<string, number> = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dic: 11,
  };
  const month = monthMap[monthAbbr] ?? 0;
  return new Date(year, month, day);
};
