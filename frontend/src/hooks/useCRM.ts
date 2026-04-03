import { useContext } from "react";
import { CRMContext } from "../context/crm-context";

export const useCRM = () => {
  const context = useContext(CRMContext);

  if (!context) {
    throw new Error("useCRM must be used within a CRMProvider");
  }

  return context;
};
