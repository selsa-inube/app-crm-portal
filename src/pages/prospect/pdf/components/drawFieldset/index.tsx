import jsPDF from "jspdf";
import { IDrawFieldsetProps, IDrawTextProps } from "../../types";
import {
  getFieldsetBackground,
  getFieldsetBorder,
  getTextColor,
  getFontSize,
} from "../../utils";

// --- DRAW FIELDSET ---
export const drawFieldset = ({
  doc,
  x,
  y,
  width,
  height,
  theme,
  isSelected = false,
  borderColor = "normal",
}: IDrawFieldsetProps): void => {
  const bgColor = getFieldsetBackground(isSelected, theme);
  const bdColor = getFieldsetBorder(isSelected, borderColor, theme);

  doc.setDrawColor(bdColor);
  doc.setFillColor(bgColor);
  // Drawing rounded rect with 6pt radius (approx 8px)
  doc.roundedRect(x, y, width, height, 6, 6, "FD");
};

// --- DRAW TEXT (FIXED) ---
export const drawText = ({
  doc,
  text,
  x,
  y,
  theme,
  appearance = "dark",
  type = "body",
  size = "medium",
  weight = "normal",
  align = "left",
  boldThickness = 0, // NEW: Allow custom bold thickness
}: IDrawTextProps): number => {
  const colorHex = getTextColor(appearance, theme);
  const fontSize = getFontSize(type, size);

  // SAFETY CHECK: Ensure text is a string and not undefined/null
  const safeText = text === undefined || text === null ? "" : String(text);

  doc.setTextColor(colorHex);
  doc.setFontSize(fontSize);
  if (weight === "bold") {
    doc.setFont("helvetica", "bold");

    // Si mandas un grosor mayor a 0, aplicamos el truco del borde
    if (boldThickness > 0) {
      doc.setDrawColor(colorHex);
      doc.setLineWidth(boldThickness);
      doc.text(safeText, x, y, {
        align,
        baseline: "top",
        renderingMode: "fillThenStroke",
      });
    } else {
      // Negrita estándar de la librería
      doc.text(safeText, x, y, { align, baseline: "top" });
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.text(safeText, x, y, { align, baseline: "top" });
  }

  return fontSize;
};

// --- DRAW ICON (FIXED) ---
export const drawIcon = (
  doc: jsPDF,
  base64: string,
  x: number,
  y: number,
  size: number,
): void => {
  try {
    // Check if string is valid before drawing
    if (base64 && base64.length > 100) {
      doc.addImage(base64, "PNG", x, y, size, size);
    }
  } catch (error) {
    // Silent fail so it doesn't break the whole PDF
    console.warn("Icon render failed, skipping icon.");
  }
};
