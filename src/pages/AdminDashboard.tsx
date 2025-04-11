import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DonorModal from "../components/DonorModal";
import DonorTable from "../components/DonorTable";
import Header from "../components/Header";
import { Donor, initialDonorFormData } from "../types/donor";
import { fetchDonors, addDonor, updateDonor, deleteDonor } from "../services/donorService";
import { computeEligibility } from "../utils/eligibility";
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const AdminDashboard = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [bloodGroupCounts, setBloodGroupCounts] = useState<{ [key: string]: number }>({});


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const counts = donors.reduce((acc, donor) => {
            // Only count donors with eligible === "Yes"
            // Debug log
            
            const eligibility = computeEligibility(donor);
            if (eligibility === "Yes") {
                const bloodType = `${donor.bloodGroup}${donor.rhFactor === "Positive" ? '+' : '-'}`;
                acc[bloodType] = (acc[bloodType] || 0) + 1;
            }
            return acc;
        }, {} as { [key: string]: number });

        setBloodGroupCounts(counts);
    }, [donors]);




    useEffect(() => {
        const loadDonors = async () => {
            try {
                const donorList = await fetchDonors();
                setDonors(donorList);

            } catch (error) {
                console.error(error);
                toast.error("Operation failed. Please try again.");
            }
        };
        loadDonors();
    }, []);



    const handleEditDonor = (donor: Donor) => {

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
                toast.success('Donor Deleted successfully!');
                setDonors(donors.filter((donor) => donor.id !== id));
            } catch (error) {
                console.error(error);
                toast.error("Operation failed. Please try again.");
            }
        }
    };

    // In AdminDashboard.tsx
    const handleSaveOrUpdateDonor = async (formData: Omit<Donor, "id">) => {
        try {
            // Calculate eligibility using all criteria
            if (!formData.name || !formData.bloodGroup || !formData.rhFactor) {
                toast.error("Please fill in required fields: Name, Blood Group, and Rh Factor");
                return;
            }
    
            // Numeric validation
            if (isNaN(Number(formData.weight)) || isNaN(Number(formData.hemoglobinLevel))) {
                toast.error("Please enter valid numbers for weight and hemoglobin");
                return;
            }
    
           

            const eligibility = computeEligibility(formData);


            if (editingDonor) {
                await updateDonor(editingDonor.id, { ...formData, eligible: eligibility });
                setDonors(donors.map(d =>
                    d.id === editingDonor.id ? { ...d, ...formData, eligible: eligibility } : d
                ));
            } else {
                const newDonor = await addDonor({ ...formData, eligible: eligibility });
                setDonors([...donors, newDonor]);
            }

            setIsModalOpen(false);
            setEditingDonor(null);
        } catch (error) {
            console.error("Error saving donor:", error);
            toast.error("Operation failed. Please try again.");
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



                    {/* Blood Group Statistics */}

                    <div className="mb-8">
                        <Grid container spacing={2} justifyContent="center">
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodType) => {
                                const count: number = bloodGroupCounts[bloodType] || 0;
                                const isCritical: boolean = count === 0;
                                const isPositive: boolean = bloodType.includes('+');
                                const groupColor: string = isPositive ? '#66bb6a' : '#ff7043';  // Green for positives, Red for negatives
                                const iconColor: string = isPositive ? '#4caf50' : '#f44336'; // Corresponding colors for icons

                                return (
                                    <Grid item xs={6} sm={4} md={1.5} lg={1.5} key={bloodType} sx={{ minWidth: 120 }}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                background: isCritical ? '#ff4444' : `rgba(${parseInt(groupColor.substring(1, 3), 16)}, ${parseInt(groupColor.substring(3, 5), 16)}, ${parseInt(groupColor.substring(5, 7), 16)}, 0.15)`,
                                                borderRadius: '12px',
                                                border: `1px solid ${isCritical ? '#ff8888' : groupColor}`,
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.22)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                                                    borderColor: isCritical ? '#ffaaaa' : groupColor,
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3, position: 'relative' }}>
                                                {/* Blood Drop Icon */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 6,
                                                        left: 8,
                                                        color: iconColor,
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    <FavoriteIcon />{/* Blood drop icon */}
                                                </Box>

                                                {/* Main content */}
                                                <div className="flex flex-col items-center">
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: isCritical ? '#ffffff' : groupColor,
                                                            lineHeight: 1.2,
                                                            fontSize: '1.2rem',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 1.2,
                                                        }}
                                                    >
                                                        {bloodType}
                                                    </Typography>

                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            fontWeight: 900,
                                                            color: isCritical ? '#ffffff' : '#000',
                                                            lineHeight: 1.2,
                                                            mt: 1.5,
                                                            fontSize: '2.5rem',
                                                            letterSpacing: -2,
                                                        }}
                                                    >
                                                        {count}
                                                    </Typography>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
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
                        isEditing={Boolean(editingDonor)}
                        initialValues={editingDonor || initialDonorFormData}
                    />
                </div>
            </div>
        </div>


    );
};

export default AdminDashboard;
