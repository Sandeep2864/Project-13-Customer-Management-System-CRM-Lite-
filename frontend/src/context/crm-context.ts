import { createContext } from "react";
import type { CRMContextType } from "../types";

export const CRMContext = createContext<CRMContextType | undefined>(undefined);
