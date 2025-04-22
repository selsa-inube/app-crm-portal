import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = (
  elementPrint: React.RefObject<HTMLDivElement>,
  customTitle = "",
  titlePDF = "document",
  margins?: { top: number; bottom: number; left: number; right: number },
) => {
  if (elementPrint.current === null) return;

  const pdf = new jsPDF({ orientation: "landscape", format: "a4" });

  const titleFontSize = 16;

  html2canvas(elementPrint.current)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      if (margins) {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = {
          width: canvas.width,
          height: canvas.height,
        };
        const contentWidth = pdfWidth - margins.left - margins.right;
        const contentHeight = (imgProps.height * contentWidth) / imgProps.width;

        const position = margins.top + titleFontSize + 10;

        pdf.setFontSize(titleFontSize);
        pdf.text(customTitle, margins.left, margins.top + titleFontSize);

        pdf.addImage(
          imgData,
          "PNG",
          margins.left,
          position,
          contentWidth,
          contentHeight,
        );
      } else {
        const position = titleFontSize + 20;

        pdf.setFontSize(titleFontSize);
        pdf.text(customTitle, 10, position);

        pdf.addImage(imgData, "PNG", 10, position + 10, 100, 100);
      }

      pdf.save(titlePDF);
    })
    .catch((error) => {
      console.error("Error al generar el PDF:", error);
    });
};
