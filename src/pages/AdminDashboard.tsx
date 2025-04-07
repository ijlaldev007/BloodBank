import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DonorModal from "../components/DonorModal";
import DonorTable from "../components/DonorTable";
import Header from "../components/Header";
import { Donor, initialDonorFormData } from "../types/donor";
import { fetchDonors, addDonor, updateDonor, deleteDonor } from "../services/donorService";
import { computeEligibility } from "../utils/eligibility";



const AdminDashboard = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [formData, setFormData] = useState(initialDonorFormData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    

    return (



        <div className="flex h-screen bg-gray-50">
            {/* Collapsible Sidebar */}
            <div className={`fixed h-screen z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
                <Sidebar
                    onAddDonor={handleAddDonor}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
                <Header />

                <div className="px-6 py-6">
                    {/* Dashboard Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Donor Management</h1>
                            <p className="text-gray-600 mt-1">{donors.length} registered donors</p>
                        </div>
                        <button
                            onClick={handleAddDonor}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>Add New Donor</span>
                        </button>
                    </div>

                    {/* Donor List Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Registered Donors</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{donors.length} entries</span>
                            </div>
                        </div>

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


    );
};

export default AdminDashboard;
