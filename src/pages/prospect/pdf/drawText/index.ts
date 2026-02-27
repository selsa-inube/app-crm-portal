import { IDrawTextProps } from "../types";
import { getTextColor, getFontSize } from "../utils";

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
  boldThickness = 0,
  maxWidth,
}: IDrawTextProps): number => {
  const colorHex = getTextColor(appearance, theme);
  const fontSize = getFontSize(type, size);

  const safeText = text === undefined || text === null ? "" : String(text);

  doc.setTextColor(colorHex);
  doc.setFontSize(fontSize);

  if (weight === "bold") {
    doc.setFont("helvetica", "bold");
  } else {
    doc.setFont("helvetica", "normal");
  }

  let textToDraw: string | string[] = safeText;
  if (maxWidth) {
    textToDraw = doc.splitTextToSize(safeText, maxWidth);
  }

  if (weight === "bold") {
    if (boldThickness > 0) {
      doc.setDrawColor(colorHex);
      doc.setLineWidth(boldThickness);
      doc.text(textToDraw, x, y, {
        align,
        baseline: "top",
        renderingMode: "fillThenStroke",
      });
    } else {
      doc.text(textToDraw, x, y, { align, baseline: "top" });
    }
  } else {
    doc.text(textToDraw, x, y, { align, baseline: "top" });
  }

  return fontSize;
};
