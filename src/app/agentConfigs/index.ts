import { AllAgentConfigsType } from "@/app/types";
import cursorAgent from "./cursorAgent";

export const allAgentSets: AllAgentConfigsType = {
  // frontDeskAuthentication,
  // customerServiceRetail,
  // simpleExample,
  cursorAgent,
};

export const defaultAgentSetKey = "cursorAgent";