import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DonorModal from "../components/DonorModal";
import DonorTable from "../components/DonorTable";  // ✅ Importing DonorTable

const AdminDashboard = () => {
    const [donors, setDonors] = useState<{
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
    }[]>([]);

    const [formData, setFormData] = useState({
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
        contact: ""
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<{
        id: string;
        name: string;
        bloodGroup: string;
        city: string;
        contact: string;
    } | null>(null);

    const navigate = useNavigate();



    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "donors"));
                const donorList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || "Unknown",
                        bloodGroup: data.bloodGroup || "Unknown",
                        rhFactor: data.rhFactor || "Unknown",
                        lastDonationDate: data.lastDonationDate || "Unknown",
                        ongoingMedications: data.ongoingMedications || "None",
                        chronicDiseases: data.chronicDiseases || "None",
                        weight: data.weight || "Unknown",
                        hemoglobinLevel: data.hemoglobinLevel || "Unknown",
                        allergies: data.allergies || "None",
                        eligible: data.eligible || "No",
                        city: data.city || "Unknown",
                        contact: data.contact || "N/A",
                    };
                });
                setDonors(donorList);
            } catch (error) {
                console.error("Error fetching donors:", error);
            }
        };
        fetchDonors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        const { name, value } = e.target;
        let updatedValue = value;

        if (name === "lastDonationDate") {
            const eligibility = computeEligibility(value);
            setFormData(prev => ({ ...prev, [name]: updatedValue, eligible: eligibility }));
        } else {
            setFormData(prev => ({ ...prev, [name]: updatedValue }));
        }
    };

    const handleEditDonor = (donor: any) => {
        setFormData({
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            rhFactor: donor.rhFactor || "",
            lastDonationDate: donor.lastDonationDate || "",
            ongoingMedications: donor.ongoingMedications || "",
            chronicDiseases: donor.chronicDiseases || "",
            weight: donor.weight || "",
            hemoglobinLevel: donor.hemoglobinLevel || "",
            allergies: donor.allergies || "",
            eligible: donor.eligible || "",
            city: donor.city,
            contact: donor.contact
        });
        setEditingDonor(donor);
        setIsModalOpen(true);
    };



    const handleAddDonor = () => {
        setEditingDonor(null);
        setIsModalOpen(true);
    };

    const handleDeleteDonor = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this donor?")) {
            try {
                await deleteDoc(doc(db, "donors", id));
                setDonors(donors.filter((donor) => donor.id !== id));
            } catch (error) {
                console.error("Error deleting donor:", error);
            }
        }
    };

    const handleSaveOrUpdateDonor = async () => {
        if (editingDonor) {
            try {
                await updateDoc(doc(db, "donors", editingDonor.id), formData);
                setDonors(donors.map((d) => (d.id === editingDonor.id ? { id: editingDonor.id, ...formData } : d)));
                setIsModalOpen(false);
                alert("Donor updated successfully");
            } catch (error) {
                console.error("Error updating donor:", error);
                alert("Failed to update donor. Please try again.");
            }
        } else {
            try {
                const docRef = await addDoc(collection(db, "donors"), formData);
                setDonors([...donors, { id: docRef.id, ...formData }]);
                setIsModalOpen(false);
                alert("Donor added successfully");
            } catch (error) {
                console.error("Error adding donor:", error);
                alert("Failed to add donor. Please try again.");
            }
        }
        setFormData({
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
            contact: ""
        });

        setEditingDonor(null);
    };

    const computeEligibility = (lastDonationDate: string): string => {
        if (!lastDonationDate) return "No";
        const donationDate = new Date(lastDonationDate);
        const currentDate = new Date();
        const diffInTime = currentDate.getTime() - donationDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays >= 90 ? "Yes" : "No";
    };


    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-48 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

                    <button onClick={handleAddDonor} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                        Add Donor
                    </button>

                    <h3 className="text-lg font-semibold mb-2 mt-4">Donor List</h3>

                    {/* ✅ Using DonorTable Component */}
                    <DonorTable
                        donors={donors}
                        handleDeleteDonor={handleDeleteDonor}
                        handleEditDonor={handleEditDonor}
                    />

                    <DonorModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveOrUpdateDonor}
                        onChange={handleChange}
                        formData={formData}   // ✅ Pass the formData here
                        isEditing={Boolean(editingDonor)}
                    />

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
