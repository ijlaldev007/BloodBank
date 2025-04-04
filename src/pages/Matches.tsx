import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { BloodGroup, RhFactor, PakistaniCity } from "../constants/patientConstants";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface Donor {
    id: string;
    name: string;
    bloodGroup: BloodGroup;
    rhFactor: RhFactor;
    city: PakistaniCity;
    contact: string;
    isAvailable: boolean;
};

interface Patient {
    id: string;
    name: string;
    age: number;
    bloodGroup: BloodGroup;
    rhFactor: RhFactor;
    city: PakistaniCity;
    contact: string;
    needsMatch: boolean;
};

interface Match {
    id: string;
    patientId: string;
    patientName: string;
    patientBlood: string;
    donorId: string;
    donorName: string;
    donorBlood: string;
    city: PakistaniCity;
    timestamp: Date;
}

const Matches = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedDonors, setSelectedDonors] = useState<Record<string, string>>({});
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data in parallel
                const [donorSnap, patientSnap, matchesSnap] = await Promise.all([
                    getDocs(collection(db, "donors")),
                    getDocs(collection(db, "patients")),
                    getDocs(collection(db, "matches"))
                ]);

                const donorList = donorSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isAvailable: doc.data().isAvailable ?? true
                })) as Donor[];

                const patientList = patientSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    needsMatch: doc.data().needsMatch ?? true
                })) as Patient[];

                const matchList = matchesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() ?? new Date()
                })) as Match[];

                setDonors(donorList);
                setPatients(patientList);
                setMatches(matchList);

                // Initialize selected donors for patients needing matches
                const initialSelections: Record<string, string> = {};
                patientList
                    .filter(patient => patient.needsMatch)
                    .forEach(patient => {
                        const compatible = getCompatibleDonors(patient, donorList, matchList);
                        if (compatible.length > 0) {
                            initialSelections[patient.id] = compatible[0].id;
                        }
                    });
                setSelectedDonors(initialSelections);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Blood compatibility functions
    const aboCompatible = (donorGroup: BloodGroup, recipientGroup: BloodGroup) => {
        switch (recipientGroup) {
            case "O": return donorGroup === "O";
            case "A": return donorGroup === "A" || donorGroup === "O";
            case "B": return donorGroup === "B" || donorGroup === "O";
            case "AB": return true;
            default: return false;
        }
    };

    const rhCompatible = (donorRh: RhFactor, recipientRh: RhFactor): boolean => {
        if (recipientRh === "Negative") {
            return donorRh === "Negative";
        }
        return true;
    };

    const isCompatibleDonor = (
        donorGroup: BloodGroup,
        donorRh: RhFactor,
        recipientGroup: BloodGroup,
        recipientRh: RhFactor
    ) => {
        return aboCompatible(donorGroup, recipientGroup) && rhCompatible(donorRh, recipientRh);
    };

    const getCompatibleDonors = (patient: Patient, donorList: Donor[], matchList: Match[]) => {
        return donorList.filter(donor => 
            donor.isAvailable &&
            donor.city === patient.city &&
            isCompatibleDonor(
                donor.bloodGroup, 
                donor.rhFactor, 
                patient.bloodGroup, 
                patient.rhFactor
            ) &&
            !matchList.some(match => match.donorId === donor.id)
        );
    };

    // Database operations
    const saveMatchToDB = async (match: Match) => {
        try {
            const matchRef = doc(collection(db, "matches"), match.id);
            await setDoc(matchRef, {
                ...match,
                timestamp: new Date()
            });
            
            // Update donor availability
            const donorRef = doc(db, "donors", match.donorId);
            await setDoc(donorRef, { isAvailable: false }, { merge: true });
            
            // Update patient status
            const patientRef = doc(db, "patients", match.patientId);
            await setDoc(patientRef, { needsMatch: false }, { merge: true });
            
            return true;
        } catch (error) {
            console.error("Error saving match:", error);
            return false;
        }
    };

    const removeMatchFromDB = async (matchId: string) => {
        try {
            const match = matches.find(m => m.id === matchId);
            if (!match) return false;

            // Delete match document
            await deleteDoc(doc(db, "matches", matchId));
            
            // Make donor available again
            const donorRef = doc(db, "donors", match.donorId);
            await setDoc(donorRef, { isAvailable: true }, { merge: true });
            
            // Mark patient as needing match
            const patientRef = doc(db, "patients", match.patientId);
            await setDoc(patientRef, { needsMatch: true }, { merge: true });
            
            return true;
        } catch (error) {
            console.error("Error removing match:", error);
            return false;
        }
    };

    // Event handlers
    const handleSelectDonor = (patientId: string, donorId: string) => {
        setSelectedDonors(prev => ({
            ...prev,
            [patientId]: donorId
        }));
    };

    const handleConfirmMatch = async (patient: Patient) => {
        const donorId = selectedDonors[patient.id];
        const donor = donors.find(d => d.id === donorId);
        if (!donor) return;

        const newMatch: Match = {
            id: `match_${patient.id}_${donor.id}_${Date.now()}`, // Unique ID
            patientId: patient.id,
            patientName: patient.name,
            patientBlood: `${patient.bloodGroup}${patient.rhFactor === "Positive" ? "+" : "-"}`,
            donorId: donor.id,
            donorName: donor.name,
            donorBlood: `${donor.bloodGroup}${donor.rhFactor === "Positive" ? "+" : "-"}`,
            city: patient.city,
            timestamp: new Date()
        };

        const success = await saveMatchToDB(newMatch);
        if (success) {
            setMatches([...matches, newMatch]);
            // Update local state
            setDonors(donors.map(d => 
                d.id === donor.id ? { ...d, isAvailable: false } : d
            ));
            setPatients(patients.map(p => 
                p.id === patient.id ? { ...p, needsMatch: false } : p
            ));
        }
    };

    const handleRemoveMatch = async (matchId: string) => {
        const success = await removeMatchFromDB(matchId);
        if (success) {
            const match = matches.find(m => m.id === matchId);
            if (match) {
                setMatches(matches.filter(m => m.id !== matchId));
                // Update local state
                setDonors(donors.map(d => 
                    d.id === match.donorId ? { ...d, isAvailable: true } : d
                ));
                setPatients(patients.map(p => 
                    p.id === match.patientId ? { ...p, needsMatch: true } : p
                ));
            }
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

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
                <Header />

                <div className="px-6 py-6 space-y-6">
                    {/* Dashboard Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Patient-Donor Matching</h1>
                            <p className="text-gray-600 mt-1">
                                {isLoading ? "Loading..." : `${patients.filter(p => p.needsMatch).length} patients need matches`}
                            </p>
                        </div>
                    </div>

                    {/* Available Patients Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Available Patients</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    {isLoading ? "..." : `${patients.filter(p => p.needsMatch).length} patients`}
                                </span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Blood Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Compatible Donors</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">City</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {patients.filter(p => p.needsMatch).length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                                    No patients currently need matches
                                                </td>
                                            </tr>
                                        ) : (
                                            patients
                                                .filter(patient => patient.needsMatch)
                                                .map((patient) => {
                                                    const compatibleDonors = getCompatibleDonors(patient, donors, matches);
                                                    const selectedDonorId = compatibleDonors.length > 0 
                                                        ? (selectedDonors[patient.id] || compatibleDonors[0].id)
                                                        : "";

                                                    return (
                                                        <tr key={patient.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {patient.name} ({patient.age})
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {patient.bloodGroup}{patient.rhFactor === "Positive" ? "+" : "-"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {compatibleDonors.length > 0 ? (
                                                                    <select
                                                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full"
                                                                        value={selectedDonorId}
                                                                        onChange={(e) => handleSelectDonor(patient.id, e.target.value)}
                                                                    >
                                                                        {compatibleDonors.map(donor => (
                                                                            <option key={donor.id} value={donor.id}>
                                                                                {donor.name} ({donor.bloodGroup}{donor.rhFactor === "Positive" ? "+" : "-"})
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    <span className="text-red-500">No compatible donors available</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {compatibleDonors.length > 0 && (
                                                                    <button
                                                                        onClick={() => handleConfirmMatch(patient)}
                                                                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                                                                        title="Confirm match"
                                                                        disabled={!selectedDonorId}
                                                                    >
                                                                        <CheckIcon fontSize="small" />
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {patient.city}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Confirmed Matches Table */}
                    {matches.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Confirmed Matches</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                        {matches.length} active matches
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient Blood</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Donor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Donor Blood</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">City</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {matches.map((match) => (
                                            <tr key={match.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {match.patientName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {match.patientBlood}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {match.donorName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {match.donorBlood}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {match.city}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() => handleRemoveMatch(match.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                                        title="Remove match"
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Matches;