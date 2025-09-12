import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = (
  elementPrint: React.RefObject<HTMLDivElement>,
  customTitle = "",
  titlePDF = "document",
  margins?: { top: number; bottom: number; left: number; right: number },
  getAsBlob = false,
): Promise<void | Blob> => {
  return new Promise((resolve, reject) => {
    if (elementPrint.current === null) {
      return reject(
        new Error("El elemento para generar el PDF no fue encontrado."),
      );
    }

    const pdf = new jsPDF({ orientation: "landscape", format: "a4" });

    const titleFontSize = 16;

    html2canvas(elementPrint.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 0.8);

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
          "JPEG",
          margins.left,
          position,
          contentWidth,
          contentHeight,
          undefined,
          "FAST",
        );
      } else {
        const position = titleFontSize + 20;

        pdf.setFontSize(titleFontSize);
        pdf.text(customTitle, 10, position);

        pdf.addImage(
          imgData,
          "JPEG",
          10,
          position + 10,
          100,
          100,
          undefined,
          "FAST",
        );
      }

      if (getAsBlob) {
        const pdfBlob = pdf.output("blob");
        resolve(pdfBlob);
      } else {
        pdf.save(titlePDF);
        resolve();
      }
    });
  });
};
