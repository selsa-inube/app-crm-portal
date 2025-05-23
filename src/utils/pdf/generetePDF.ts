import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (
  elementPrint: React.RefObject<HTMLDivElement>,
  customTitle = "",
  margins?: { top: number; bottom: number; left: number; right: number },
): Promise<string | null> => {
  if (elementPrint.current === null) return null;

  const pdf = new jsPDF({ orientation: "landscape", format: "a4" });
  const titleFontSize = 16;

  try {
    const canvas = await html2canvas(elementPrint.current);
    const imgData = canvas.toDataURL("image/JPEG");

    if (margins) {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pdfWidth - margins.left - margins.right;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const position = margins.top + titleFontSize + 10;

      pdf.setFontSize(titleFontSize);
      pdf.text(customTitle, margins.left, margins.top + titleFontSize);
      pdf.addImage(
        imgData,
        "JPEG",
        margins.left,
        position,
        contentWidth,
        contentHeight,
      );
    } else {
      const position = titleFontSize + 20;
      pdf.setFontSize(titleFontSize);
      pdf.text(customTitle, 10, position);
      pdf.addImage(imgData, "JPEG", 10, position + 10, 100, 100);
    }

    const base64 = pdf.output("datauristring");
    return base64;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return null;
  }
};
