import { IDrawFieldsetProps } from "../types";
import { getFieldsetBackground, getFieldsetBorder } from "../utils";

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

  doc.roundedRect(x, y, width, height, 6, 6, "FD");
};
