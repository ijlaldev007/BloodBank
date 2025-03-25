// src/services/donorService.ts

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  import { Donor } from "../types/donor";
  
  const defaultDonor: Donor = {
    id: "",
    name: "Unknown",
    bloodGroup: "Unknown",
    rhFactor: "Unknown",
    lastDonationDate: "Unknown",
    ongoingMedications: "None",
    chronicDiseases: "None",
    weight: "Unknown",
    hemoglobinLevel: "Unknown",
    allergies: "None",
    eligible: "No",
    city: "Unknown",
    contact: "N/A",
  };
  
  export const fetchDonors = async (): Promise<Donor[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "donors"));
      const donorList: Donor[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Partial<Donor>;
        return {
          ...defaultDonor,
          id: docSnap.id,
          ...data,
        };
      });
      return donorList;
    } catch (error) {
      console.error("Error fetching donors:", error);
      throw error;
    }
  };
  
  export const addDonor = async (donorData: Omit<Donor, "id">): Promise<Donor> => {
    try {
      const docRef = await addDoc(collection(db, "donors"), donorData);
      return { id: docRef.id, ...donorData };
    } catch (error) {
      console.error("Error adding donor:", error);
      throw error;
    }
  };
  
  export const updateDonor = async (id: string, donorData: Omit<Donor, "id">): Promise<void> => {
    try {
      await updateDoc(doc(db, "donors", id), donorData);
    } catch (error) {
      console.error("Error updating donor:", error);
      throw error;
    }
  };
  
  export const deleteDonor = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "donors", id));
    } catch (error) {
      console.error("Error deleting donor:", error);
      throw error;
    }
  };
  