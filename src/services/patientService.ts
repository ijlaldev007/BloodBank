import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  import { Patient } from "../types/patient";
  
  export const fetchPatients = async (): Promise<Patient[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "patients"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  };
  
  export const addPatient = async (patientData: Omit<Patient, "id">): Promise<Patient> => {
    try {
      const docRef = await addDoc(collection(db, "patients"), patientData);
      return { id: docRef.id, ...patientData };
    } catch (error) {
      console.error("Error adding patient:", error);
      throw error;
    }
  };
  
  export const updatePatient = async (id: string, patientData: Omit<Patient, "id">): Promise<void> => {
    try {
      await updateDoc(doc(db, "patients", id), patientData);
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  };
  
  export const deletePatient = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "patients", id));
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  };