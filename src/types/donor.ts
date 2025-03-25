// src/types/donor.ts

export interface Donor {
    id: string;
    name: string;
    bloodGroup: string;
    rhFactor: string;
    lastDonationDate: string;
    ongoingMedications: string;
    chronicDiseases: string;
    weight: string;
    hemoglobinLevel: string;
    allergies: string;
    eligible: string;
    city: string;
    contact: string;
  }
  
  export const initialDonorFormData: Omit<Donor, "id"> = {
    name: "",
    bloodGroup: "",
    rhFactor: "",
    lastDonationDate: "",
    ongoingMedications: "",
    chronicDiseases: "",
    weight: "",
    hemoglobinLevel: "",
    allergies: "",
    eligible: "",
    city: "",
    contact: "",
  };
  