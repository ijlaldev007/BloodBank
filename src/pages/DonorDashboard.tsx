import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
    const [donorData, setDonorData] = useState<{ name: string; bloodGroup: string; city: string; } | null>(null);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchDonor = async () => {
            try {
                if (user) {
                    const donorRef = doc(db, "donors", user.uid);
                    const donorSnap = await getDoc(donorRef);
                    if (donorSnap.exists()) {
                        const donorData = donorSnap.data();
                        setDonorData({
                            name: donorData.name || "Unknown",
                            bloodGroup: donorData.bloodGroup || "Unknown",
                            city: donorData.city || "Unknown",
                        }); // ✅ Ensure donorData has all required fields
                    }

                    else {
                        console.error("You are not registered as a donor.");
                    }
                }
            }
            catch (error) {
                console.error("Error fetching donor:", error);
            };
        }
        fetchDonor();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleUpdate = async () => {
        try {
            if (donorData) {
                if (!user) return alert("No user found.");
                await updateDoc(doc(db, "donors", user.uid), donorData);
                setEditing(false);
                alert("Profile updated successfully!");
            }
        }
        catch (error) {
            console.error("Error updating donor:", error);

        }
    }
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Donor Dashboard</h2>
            <button onClick={handleLogout} className="mb-4 bg-red-500 text-white p-2 rounded">
                Logout
            </button>

            {donorData ? (
                <div>
                    {editing ? (
                        <>
                            <input type="text" value={donorData.name} onChange={(e) => setDonorData({ ...donorData, name: e.target.value })} className="border p-2 w-full mb-2" />
                            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded">
                                Save
                            </button>
                        </>
                    ) : (
                        <p><strong>Name:</strong> {donorData.name}</p>
                    )}
                    <button onClick={() => setEditing(!editing)} className="bg-yellow-500 text-white p-2 rounded mt-2">
                        Edit Profile
                    </button>
                </div>
            ) : (
                <p>Loading donor data...</p>
            )}
        </div>
    );

};

export default DonorDashboard;