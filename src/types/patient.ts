export interface Patient {
    id: string;
    name: string;
    age: string;
    bloodGroup: string;
    rhFactor: string;
    city: string;
    contact: string;
    // Additional patient-specific fields if needed
    diagnosis?: string;
    treatmentPlan?: string;
    admissionDate?: string;
  }
  
  export const initialPatientFormData: Omit<Patient, "id"> = {
    name: "",
    age: "",
    bloodGroup: "",
    rhFactor: "",
    city: "",
    contact: "",
    diagnosis: "",
    treatmentPlan: "",
    admissionDate: "",
  };