import jsPDF from "jspdf";

export const drawIcon = (
  doc: jsPDF,
  base64: string,
  x: number,
  y: number,
  size: number,
): void => {
  try {
    if (base64 && base64.length > 100) {
      doc.addImage(base64, "PNG", x, y, size, size);
    }
  } catch (error) {
    console.warn("Icon render failed, skipping icon.");
  }
};
