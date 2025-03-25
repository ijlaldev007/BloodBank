// src/utils/eligibility.ts

export const computeEligibility = (lastDonationDate: string): string => {
    if (!lastDonationDate) return "No";
    const donationDate = new Date(lastDonationDate);
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - donationDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays >= 90 ? "Yes" : "No";
  };
  