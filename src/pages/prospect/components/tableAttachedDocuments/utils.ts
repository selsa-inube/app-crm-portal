import { useState } from "react";
import { mockAttachedDocuments } from "@mocks/filing-application/attached-documents/attacheddocuments.mock";

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageLength = 5;
  const totalRecords = mockAttachedDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageLength);

  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = mockAttachedDocuments.slice(
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
