import { useState } from "react";
import { IDataInformationItem } from "./interface";

export const usePagination = (data: IDataInformationItem[], pageLength = 5) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageLength);

  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = data.slice(firstEntryInPage, lastEntryInPage);

  const paddingCount = pageLength - currentData.length;
  const paddingItems = Array.from({
    length: paddingCount > 0 ? paddingCount : 0,
  }).map((_, i) => ({
    __isPadding: true,
    id: `padding-${i}`,
  }));

  const paddedCurrentData = [...currentData, ...paddingItems];

  return {
    currentPage,
    totalRecords,
    totalPages,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
  };
};
