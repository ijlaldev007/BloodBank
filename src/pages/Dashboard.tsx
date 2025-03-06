import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";




const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [donors, setDonors] = useState<{
    id: string;
    name: string;
    bloodGroup: string;
    city: string;
    contact: string;
  }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    contact: "",
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

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email ?? "No email found");
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch donors from Firestore
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
            city: data.city || "Unknown",
            contact: data.contact || "N/A",
          };
        });
        setDonors(donorList); // ✅ Correctly formatted donor list
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchDonors();
  }, []);

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bloodGroup || !formData.city || !formData.contact) {
      alert("Please dont leave the fields empty");
      return;
    }
    else {
      try {
        const docRef = await addDoc(collection(db, "donors"), formData);
        setDonors([...donors, { id: docRef.id, ...formData }]);
        setFormData({ name: "", bloodGroup: "", city: "", contact: "" });
        alert("Donor added successfully");
      }
      catch (error) {
        console.error("Error adding document:", error);
        alert("Error adding document. Please try again.");
      }
    }

  };

  const handleUpdateDonor = async () => {
    if (!editingDonor) return;

    try {
      const donorRef = doc(db, "donors", editingDonor.id);
      await updateDoc(donorRef, {
        name: editingDonor.name,
        bloodGroup: editingDonor.bloodGroup,
        city: editingDonor.city,
        contact: editingDonor.contact,
      });

      setDonors(donors.map(d => d.id === editingDonor.id ? editingDonor : d));
      setIsModalOpen(false);
      setEditingDonor(null);
      alert("Donor updated successfully");
    }
    catch (error) {
      console.error("Error updating document:", error);
      alert("Error updating document. Please try again.");
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {email}</h2>
      <button
        onClick={handleLogout}
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>

      <h3 className="text-xl font-semibold mb-2">Donor List</h3>
      <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Blood Group</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No donors available.</td>
              </tr>
            ) : (
              donors.map((donor) => (
                <tr key={donor.id} className="border-t">
                  <td className="border px-4 py-2">{donor.name}</td>
                  <td className="border px-4 py-2">{donor.bloodGroup}</td>
                  <td className="border px-4 py-2">{donor.city}</td>
                  <td className="border px-4 py-2">{donor.contact}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDonor(donor);
                        setIsModalOpen(true);
                      }

                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition">
                      Edit
                    </button>
                    <button
                      // onClick={() => handleDeleteDonor(donor.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {isModalOpen && editingDonor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Edit Donor</h3>
              <input type="text" name="name" placeholder="Name"
                value={editingDonor.name}
                onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                className="border p-2 rounded-md w-full mb-2" required />

              <input type="text" name="bloodGroup" placeholder="Blood Group"
                value={editingDonor.bloodGroup}
                onChange={(e) => setEditingDonor({ ...editingDonor, bloodGroup: e.target.value })}
                className="border p-2 rounded-md w-full mb-2" required />

              <input type="text" name="city" placeholder="City"
                value={editingDonor.city}
                onChange={(e) => setEditingDonor({ ...editingDonor, city: e.target.value })}
                className="border p-2 rounded-md w-full mb-2" required />

              <input type="tel" name="contact" placeholder="Contact Number"
                value={editingDonor.contact}
                onChange={(e) => setEditingDonor({ ...editingDonor, contact: e.target.value })}
                className="border p-2 rounded-md w-full mb-2" required />

              <div className="flex justify-end gap-2">
                <button onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                  Cancel </button>
                <button onClick={handleUpdateDonor} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
              </div>

            </div>
          </div>
        )}
      </div>


      <div>
        <form className="mt-6" onSubmit={handleAddDonor}>
          <h3 className="text-xl font-semibold mb-2">Add Donor</h3>

          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded-md w-full mb-2" required />

          <input type="text" placeholder="Blood Group" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            className="border p-2 rounded-md w-full mb-2" required />

          <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="border p-2 rounded-md w-full mb-2" required />

          <input type="tel" placeholder="Contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="border p-2 rounded-md w-full mb-2" required />

          <button type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            Add Donor
          </button>
        </form>

      </div>
    </div>
  );
};

export default Dashboard;
