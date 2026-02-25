import { ITheme, IPalette } from "./types";
import React from "react";
import ReactDOMServer from "react-dom/server";

// Default Palette Fallback

// DEFAULT PALETTE (Sin cambios)
export const defaultPalette: IPalette = {
  neutral: {
    N900: "#091E42",
    N800: "#172B4D",
    N700: "#253858",
    N600: "#344563",
    N500: "#42526E",
    N400: "#505F79",
    N300: "#5E6C84", // Texto Gris (Labels)
    N200: "#6B778C",
    N100: "#7A869A",
    N90: "#8993A4",
    N80: "#97A0AF",
    N70: "#A5ADBA",
    N60: "#B3BAC5",
    N50: "#C1C7D0",
    N40: "#DFE1E6", // Bordes
    N30: "#EBECF0",
    N20: "#F4F5F7",
    N10: "#FAFBFC",
    N0: "#FFFFFF",
  },
  blue: {
    B500: "#0747A6",
    B400: "#0052CC", // Azul Primario
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

// ... (getFieldsetBackground y getFieldsetBorder se quedan igual) ...
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
      return palette.blue.B400; // #0052CC
    case "gray":
      return palette.neutral.N300; // #5E6C84 (Tus etiquetas)
    case "danger":
      return palette.red.R400;
    case "light":
      return palette.neutral.N0;
    case "dark":
    default:
      return palette.neutral.N900; // #091E42 (Tus valores)
  }
};

// --- AQUÍ ESTÁ EL CAMBIO CLAVE DE TAMAÑOS ---
export const getFontSize = (
  type: "headline" | "title" | "body",
  size: "large" | "medium" | "small",
): number => {
  // Conversión aproximada: 1px = 0.75pt
  // 12px web = 9pt PDF
  // 16px web = 12pt PDF
  // 28px web = 21pt PDF

  const map: Record<string, Record<string, number>> = {
    headline: {
      large: 21, // 28px (Encabezado Azul)
      medium: 18,
      small: 16,
    },
    title: {
      large: 14, // ~18px
      medium: 12, // 16px (Valores de las tarjetas)
      small: 10,
    },
    body: {
      large: 12, // 16px (Usado si el cuerpo es grande)
      medium: 10.5, // ~14px
      small: 9, // 12px (Etiquetas grises "Monto del préstamo")
    },
  };
  return map[type][size] || 9;
};

export const convertIconToBase64 = (
  iconElement: React.ReactElement,
): Promise<string> => {
  return new Promise((resolve) => {
    // 1. Convert React Component to SVG String
    const svgString = ReactDOMServer.renderToStaticMarkup(iconElement);

    // 2. Create a hidden HTML Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set resolution (higher = sharper PDF icon)
    const size = 64;
    canvas.width = size;
    canvas.height = size;

    // 3. Create an Image object
    const img = new Image();

    // 4. Load the SVG string into the Image
    // We must encode the SVG to be safe for data URIs
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    img.onload = () => {
      if (ctx) {
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, size, size);
        // Export to PNG Base64
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
    // Importante para evitar errores de CORS con Google Storage
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Multiplicamos por 2 para que el logo no se vea pixelado en el PDF (Retina/High DPI)
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
      console.warn("No se pudo cargar el logo desde: " + url);
      resolve("");
    };

    img.src = url;
  });
};
