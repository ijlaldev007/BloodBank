import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PatientTable from "../components/PatientTable";
import PatientModal from "../components/PatientModal";

interface Patient {
  id: string;
  name: string;
  age: string;
  bloodGroup: string;
  rhFactor: string;
  city: string;
  contact: string;
}

const PatientDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    rhFactor: "",
    city: "",
    contact: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Patient[];
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Handle change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When adding a new patient, reset formData and open modal
  const handleAddPatient = () => {
    setFormData({ name: "", age: "", bloodGroup: "", rhFactor: "", city: "", contact: "" });
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  // When editing, load the patient data into formData and open modal
  const handleEditPatient = (patient: Patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      rhFactor: patient.rhFactor,
      city: patient.city,
      contact: patient.contact,
    });
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  // Save new patient or update existing one
  const handleSaveOrUpdatePatient = async () => {
    if (editingPatient) {
      // Update existing patient
      try {
        await updateDoc(doc(db, "patients", editingPatient.id), formData);
        setPatients(
          patients.map((p) =>
            p.id === editingPatient.id ? { id: editingPatient.id, ...formData } : p
          )
        );
        setIsModalOpen(false);
        setEditingPatient(null);
        alert("Patient updated successfully");
      } catch (error) {
        console.error("Error updating patient:", error);
        alert("Failed to update patient. Please try again.");
      }
    } else {
      // Add new patient
      try {
        const docRef = await addDoc(collection(db, "patients"), formData);
        setPatients([...patients, { id: docRef.id, ...formData }]);
        setIsModalOpen(false);
        alert("Patient added successfully");
      } catch (error) {
        console.error("Error adding patient:", error);
        alert("Failed to add patient. Please try again.");
      }
    }
    // Reset formData after save
    setFormData({ name: "", age: "", bloodGroup: "", rhFactor: "", city: "", contact: "" });
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await deleteDoc(doc(db, "patients", id));
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
          <button
            onClick={handleAddPatient}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Patient
          </button>

          <PatientTable
            patients={patients}
            handleEditPatient={handleEditPatient}
            handleDeletePatient={handleDeletePatient}
          />

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
        </div>
        {isModalOpen && (
          <PatientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveOrUpdatePatient}
            onChange={handleChange}
            formData={formData}
            isEditing={Boolean(editingPatient)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
