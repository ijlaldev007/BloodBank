import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface Donor {
    id: string;
    name: string;
    bloodGroup: string;
    rhFactor: string;
    city: string;
    contact: string;
};

interface Patient {
    id: string;
    name: string;
    age: number;
    bloodGroup: string;
    rhFactor: string;
    city: string;
    contact: string;
};

interface Match {
    donorName: string;
    donorBlood: string;
    PatientName: string;
    PatientBlood: string;
    city: string;
};

const Matches = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            const donorSnap = await getDocs(collection(db, "donors"));
            const donorList = donorSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Donor[];

            const patientSnap = await getDocs(collection(db, "patients"));
            const patientList = patientSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Patient[];

            setDonors(donorList);
            setPatients(patientList);
        };
        fetchData();
    }, []);

    const aboCompatible = (donorGroup: string, recipientGroup: string) => {
        switch (recipientGroup) {
            case "O": return donorGroup === "O";
            case "A": return donorGroup === "A" || donorGroup === "O";
            case "B": return donorGroup === "B" || donorGroup === "O";
            case "AB": return true;
            default: return false;
        }
    };

    const rhCompatible = (donorRh: string, recipientRh: string): boolean => {

        if (recipientRh.toLowerCase() === "Negative" || recipientRh === "-") {
            return donorRh === "Negative";
        }
        return true;
    };

    const isCompatibleDonor = (
        donorGroup: string,
        donorRh: string,
        recipientGroup: string,
        recipientRh: string
    ) => {
        return aboCompatible(donorGroup, recipientGroup) && rhCompatible(donorRh, recipientRh);
    };

    useEffect(() => {
        const foundMatches: Match[] = [];

        donors.forEach((donor) => {
            patients.forEach((patient => {
                if (donor.city.toLowerCase() === patient.city.toLowerCase()) {
                    if (isCompatibleDonor(donor.bloodGroup, donor.rhFactor, patient.bloodGroup, patient.rhFactor)) {
                        foundMatches.push({
                            donorName: donor.name,
                            donorBlood: donor.bloodGroup + (donor.rhFactor === "Positive" ? "+" : "-"),
                            PatientName: patient.name,
                            PatientBlood: patient.bloodGroup + (patient.rhFactor === "Positive" ? "+" : "-"),
                            city: donor.city,
                        });
                    }
                };
            }));

        });
        setMatches(foundMatches);
    },[donors, patients]);
    return (
        <div className="flex h-screen">
            <div className="w-48 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <Header />

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Matches</h2>

                    <table className="min-w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-3 text-left">Donor Name</th>
                                <th className="p-3 text-left">Donor Blood</th>
                                <th className="p-3 text-left">Patient Name</th>
                                <th className="p-3 text-left">Patient Blood</th>
                                <th className="p-3 text-left">City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 bg-gray-100 rounded-lg">
                                        No matches found.
                                    </td>
                                </tr>
                            ) : (
                                matches.map((match, index) => (
                                    <tr key={index} className="bg-white shadow-md hover:shadow-lg transition duration-300">
                                        <td className="p-3 border-b">{match.donorName}</td>
                                        <td className="p-3 border-b">{match.donorBlood}</td>
                                        <td className="p-3 border-b">{match.PatientName}</td>
                                        <td className="p-3 border-b">{match.PatientBlood}</td>
                                        <td className="p-3 border-b">{match.city}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default Matches;