// src/utils/eligibility.ts
import { Donor } from "../types/donor";

export const computeEligibility = (donorData: Omit<Donor, "id">): string => {
  // Eligibility thresholds
  const MIN_WEIGHT = 40;  // Minimum weight in kg
  const MAX_WEIGHT = 200; // Maximum weight in kg
  const MIN_HEMOGLOBIN = 12.5;  // Minimum hemoglobin level in g/dL
  const DONATION_INTERVAL = 90;  // Days between donations

  // 1. Validate weight range
  const weight = parseFloat(donorData.weight);
  if (isNaN(weight)) return "No";
  if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) return "No";

  // 2. Check hemoglobin level
  const hemoglobin = parseFloat(donorData.hemoglobinLevel);
  if (isNaN(hemoglobin)) return "No";
  if (hemoglobin < MIN_HEMOGLOBIN) return "No";

  // 3. Verify donation interval
  if (donorData.lastDonationDate) {
    const lastDonation = new Date(donorData.lastDonationDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastDonation.getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays < DONATION_INTERVAL) return "No";
  }

  // All criteria passed
  return "Yes";
};