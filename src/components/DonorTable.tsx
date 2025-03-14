import React from "react";

interface Donor {
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
}

interface DonorTableProps {
    donors: Donor[];
    handleDeleteDonor: (id: string) => void;
    handleEditDonor: (donor: Donor) => void;
}

const DonorTable: React.FC<DonorTableProps> = ({ donors, handleDeleteDonor, handleEditDonor }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-3 text-left rounded-tl-lg">Name</th>
                        <th className="p-3 text-left">Blood Group</th>
                        <th className="p-3 text-left">Rh Factor</th>
                        <th className="p-3 text-left">Last Donation Date</th>
                        <th className="p-3 text-left">Medications</th>
                        <th className="p-3 text-left">Chronic Diseases</th>
                        <th className="p-3 text-left">Weight (kg)</th>
                        <th className="p-3 text-left">Hemoglobin (g/dL)</th>
                        <th className="p-3 text-left">Allergies</th>
                        <th className="p-3 text-left">Eligible (Yes/No)</th>
                        <th className="p-3 text-left">City</th>
                        <th className="p-3 text-left">Contact</th>
                        <th className="p-3 text-center rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donors.length === 0 ? (
                        <tr>
                            <td colSpan={13} className="text-center p-4 bg-gray-100 rounded-lg">
                                No donors found.
                            </td>
                        </tr>
                    ) : (
                        donors.map((donor) => (
                            <tr
                                key={donor.id}
                                className="bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300"
                            >
                                <td className="p-3 border-b">{donor.name}</td>
                                <td className="p-3 border-b">{donor.bloodGroup}</td>
                                <td className="p-3 border-b">{donor.rhFactor}</td>
                                <td className="p-3 border-b">{donor.lastDonationDate}</td>
                                <td className="p-3 border-b">{donor.ongoingMedications}</td>
                                <td className="p-3 border-b">{donor.chronicDiseases}</td>
                                <td className="p-3 border-b">{donor.weight}</td>
                                <td className="p-3 border-b">{donor.hemoglobinLevel}</td>
                                <td className="p-3 border-b">{donor.allergies}</td>
                                <td className="p-3 border-b">{donor.eligible}</td>
                                <td className="p-3 border-b">{donor.city}</td>
                                <td className="p-3 border-b">{donor.contact}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditDonor(donor)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDonor(donor.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DonorTable;
