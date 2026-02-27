import { ITheme, IPalette } from "./types";
import React from "react";
import ReactDOMServer from "react-dom/server";

export const defaultPalette: IPalette = {
  neutral: {
    N900: "#091E42",
    N800: "#172B4D",
    N700: "#253858",
    N600: "#344563",
    N500: "#42526E",
    N400: "#505F79",
    N300: "#5E6C84",
    N200: "#6B778C",
    N100: "#7A869A",
    N90: "#8993A4",
    N80: "#97A0AF",
    N70: "#A5ADBA",
    N60: "#B3BAC5",
    N50: "#C1C7D0",
    N40: "#DFE1E6",
    N30: "#EBECF0",
    N20: "#F4F5F7",
    N10: "#FAFBFC",
    N0: "#FFFFFF",
  },
  blue: {
    B500: "#0747A6",
    B400: "#0052CC",
    B300: "#0065FF",
    B200: "#2684FF",
    B100: "#4C9AFF",
    B75: "#B3D4FF",
    B50: "#DEEBFF",
  },
  red: {
    R400: "#DE350B",
  },
};

export const getFieldsetBackground = (
  isSelected: boolean,
  theme?: ITheme,
): string => {
  if (!isSelected)
    return theme?.palette?.neutral?.N0 || defaultPalette.neutral.N0;
  return theme?.palette?.blue?.B50 || defaultPalette.blue.B50;
};

export const getFieldsetBorder = (
  isSelected: boolean,
  borderColor: "blue" | "gray" | "normal",
  theme?: ITheme,
): string => {
  if (isSelected) return theme?.palette?.blue?.B300 || defaultPalette.blue.B300;
  switch (borderColor) {
    case "blue":
      return theme?.palette?.blue?.B300 || defaultPalette.blue.B300;
    case "gray":
      return theme?.palette?.neutral?.N300 || defaultPalette.neutral.N300;
    case "normal":
    default:
      return theme?.palette?.neutral?.N40 || defaultPalette.neutral.N40;
  }
};

export const getTextColor = (
  appearance: "primary" | "dark" | "gray" | "danger" | "light",
  theme?: ITheme,
): string => {
  const palette = theme?.palette || defaultPalette;
  switch (appearance) {
    case "primary":
      return palette.blue.B400;
    case "gray":
      return palette.neutral.N300;
    case "danger":
      return palette.red.R400;
    case "light":
      return palette.neutral.N0;
    case "dark":
    default:
      return palette.neutral.N900;
  }
};

export const getFontSize = (
  type: "headline" | "title" | "body",
  size: "large" | "medium" | "small",
): number => {
  const map: Record<string, Record<string, number>> = {
    headline: {
      large: 21,
      medium: 18,
      small: 16,
    },
    title: {
      large: 14,
      medium: 12,
      small: 10,
    },
    body: {
      large: 12,
      medium: 10.5,
      small: 9,
    },
  };
  return map[type][size] || 9;
};

export const convertIconToBase64 = (
  iconElement: React.ReactElement,
): Promise<string> => {
  return new Promise((resolve) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(iconElement);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = 64;
    canvas.width = size;
    canvas.height = size;

    const img = new Image();

    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve("");
      }
    };

    img.onerror = () => {
      console.warn("Failed to convert icon to image");
      resolve("");
    };

    img.src = svgData;
  });
};

export const convertUrlToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve("");
      }
    };

    img.onerror = () => {
      console.warn("error loading img: " + url);
      resolve("");
    };

    img.src = url;
  });
};

export const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return "$ 0";
  return `$ ${value.toLocaleString("es-CO")}`;
};
