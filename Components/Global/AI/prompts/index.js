/**
 * System Prompt Aggregator for TrustMed AI
 */
import { generalPrompt } from "./generalPrompt";
import { patientPrompt } from "./patientPrompt";
import { doctorPrompt } from "./doctorPrompt";

export { generalPrompt, patientPrompt, doctorPrompt };

/**
 * Returns the customized system prompt based on user role (Patient, Doctor, or General)
 * @param {"Patient" | "Doctor" | "General"} role
 * @returns {string}
 */
export const getSystemPrompt = (role = "General") => {
  const normalized = String(role || "").toLowerCase();

  if (normalized === "patient") {
    return `${generalPrompt.trim()}\n\n${patientPrompt.trim()}`;
  }

  if (normalized === "doctor") {
    return `${generalPrompt.trim()}\n\n${doctorPrompt.trim()}`;
  }

  return generalPrompt.trim();
};
