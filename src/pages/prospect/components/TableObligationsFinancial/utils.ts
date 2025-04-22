import { useState } from "react";
import { mockFinancialObligation } from "@mocks/add-prospect/financial-obligation/financialobligation.mock";

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageLength = 5;
  const totalRecords = mockFinancialObligation.length;
  const totalPages = Math.ceil(totalRecords / pageLength);

  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = mockFinancialObligation.slice(
    firstEntryInPage,
    lastEntryInPage,
  );

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
    currentData,
  };
};
