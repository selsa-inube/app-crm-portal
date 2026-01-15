import { EnumContext } from "@context/EnumContext";
import { useContext } from "react";

export type EnumType = "en" | "es";

export function useEnum() {
  const context = useContext(EnumContext);
  if (!context) {
    throw new Error("error useEnum: EnumContext is undefined");
  }
  return context;
}
