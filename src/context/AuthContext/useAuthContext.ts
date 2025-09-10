import { useContext } from "react";

import { AuthContext } from ".";

export function useIAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useIAuth must be used within an AuthProvider");
  }
  return context;
}
