import React from "react";

interface Patient {
  id: string;
  name: string;
  age: string;
  bloodGroup: string;
  rhFactor: string;
  city: string;
  contact: string;
}

interface PatientTableProps {
  patients: Patient[];
  handleEditPatient: (patient: Patient) => void;
  handleDeletePatient: (id: string) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, handleEditPatient, handleDeletePatient }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 text-left rounded-tl-lg">Name</th>
            <th className="p-3 text-left">Age</th>
            <th className="p-3 text-left">Blood Group</th>
            <th className="p-3 text-left">Rh Factor</th>
            <th className="p-3 text-left">City</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-center rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4 bg-gray-100 rounded-lg">
                No patients found.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr
                key={patient.id}
                className="bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300"
              >
                <td className="p-3 border-b">{patient.name}</td>
                <td className="p-3 border-b">{patient.age}</td>
                <td className="p-3 border-b">{patient.bloodGroup}</td>
                <td className="p-3 border-b">{patient.rhFactor}</td>
                <td className="p-3 border-b">{patient.city}</td>
                <td className="p-3 border-b">{patient.contact}</td>
                <td className="p-3 border-b flex justify-center gap-2">
                  <button
                    onClick={() => handleEditPatient(patient)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
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

export default PatientTable;
