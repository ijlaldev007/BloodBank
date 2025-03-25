import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";
import Sidebar from "../components/Sidebar";
import DonorModal from "../components/DonorModal";
import DonorTable from "../components/DonorTable";

import { Donor, initialDonorFormData } from "../types/donor";
import { fetchDonors, addDonor, updateDonor, deleteDonor } from "../services/donorService";
import { computeEligibility } from "../utils/eligibility";

import { Bars3Icon } from "@heroicons/react/24/outline";

const AdminDashboard = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [formData, setFormData] = useState(initialDonorFormData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDonors = async () => {
            try {
                const donorList = await fetchDonors();
                setDonors(donorList);
            } catch (error) {
                console.error(error);
            }
        };
        loadDonors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if (name === "lastDonationDate") {
            const eligibility = computeEligibility(value);
            setFormData((prev) => ({ ...prev, [name]: updatedValue, eligible: eligibility }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: updatedValue }));
        }
    };

    const handleEditDonor = (donor: Donor) => {
        setFormData({ ...donor });
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
                await deleteDonor(id);
                setDonors(donors.filter((donor) => donor.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSaveOrUpdateDonor = async () => {
        try {
            if (editingDonor) {
                await updateDonor(editingDonor.id, formData);
                setDonors(
                    donors.map((d) => (d.id === editingDonor.id ? { id: editingDonor.id, ...formData } : d))
                );
                alert("Donor updated successfully");
            } else {
                const newDonor = await addDonor(formData);
                setDonors([...donors, newDonor]);
                alert("Donor added successfully");
            }
            setIsModalOpen(false);
            setFormData(initialDonorFormData);
            setEditingDonor(null);
        } catch (error) {
            console.error(error);
            alert("Operation failed. Please try again.");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-50 relative">
            {/* Sidebar (fixed) */}
            <div className=" left-0 top-0 h-screen w-[10rem] z-10">
                <Sidebar onAddDonor={handleAddDonor} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col ">
                <div className="pl-[10rem] pr-4 pt-4 pb-4"> {/* Left padding = sidebar width */}
                    <div className="p-3">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-1xl font-bold">Admin Dashboard</h2>
                            <button
                                onClick={handleAddDonor}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Add Donor
                            </button>
                        </div>

                        <h3 className="text-lg font-semibold mb-2 mt-4">Donor List</h3>

                        <div className=" pr-2">
                            <DonorTable
                                donors={donors}
                                handleDeleteDonor={handleDeleteDonor}
                                handleEditDonor={handleEditDonor}
                            />
                        </div>

                        <DonorModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSaveOrUpdateDonor}
                            onChange={handleChange}
                            formData={formData}
                            isEditing={Boolean(editingDonor)}
                        />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default AdminDashboard;
