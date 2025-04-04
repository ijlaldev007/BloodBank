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
      try {
        await updateDoc(doc(db, "patients", editingPatient.id), formData);
        setPatients(
          patients.map((p) =>
            p.id === editingPatient.id ? { id: editingPatient.id, ...formData } : p
          )
        );
        alert("Patient updated successfully");
      } catch (error) {
        console.error("Error updating patient:", error);
        alert("Failed to update patient. Please try again.");
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "patients"), formData);
        setPatients([...patients, { id: docRef.id, ...formData }]);
        alert("Patient added successfully");
      } catch (error) {
        console.error("Error adding patient:", error);
        alert("Failed to add patient. Please try again.");
      }
    }
    setIsModalOpen(false);
    setFormData({ name: "", age: "", bloodGroup: "", rhFactor: "", city: "", contact: "" });
    setEditingPatient(null);
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
    <div className="flex h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <div className={`fixed h-screen z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
        <Header />
        <div className="px-6 py-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
              <p className="text-gray-600 mt-1">{patients.length} registered patients</p>
            </div>
            <button
              onClick={handleAddPatient}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>+</span>
              <span>Add New Patient</span>
            </button>
          </div>

          {/* Patient List Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Registered Patients</h3>
              <span className="text-sm text-gray-500">{patients.length} entries</span>
            </div>
            <PatientTable
              patients={patients}
              handleEditPatient={handleEditPatient}
              handleDeletePatient={handleDeletePatient}
            />
          </div>
        </div>
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
  );
};

export default PatientDashboard;
