import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { Donor } from "../types/donor"; // Import the Donor type

interface DonorTableProps {
  donors: Donor[];
  handleDeleteDonor: (id: string) => void;
  handleEditDonor: (donor: Donor) => void;
}

const TABLE_HEADERS = [
  "Name",
  "Blood Group",
  "Rh Factor",
  "Last Donation Date",
  "Medications",
  "Chronic Diseases",
  "Weight (kg)",
  "Hemoglobin (g/dL)",
  "Allergies",
  "Eligible (Yes/No)",
  "City",
  "Contact",
  "Actions",
];

const DonorTable: React.FC<DonorTableProps> = ({ donors, handleDeleteDonor, handleEditDonor }) => {
  return (
    <Card
      className="h-full w-full overflow-scroll shadow-md"
      variant="filled"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEADERS.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donors.length === 0 ? (
            <tr>
              <td colSpan={TABLE_HEADERS.length} className="p-4 text-center">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  No donors found.
                </Typography>
              </td>
            </tr>
          ) : (
            donors.map((donor) => (
              <tr key={donor.id} className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 transition-colors">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.bloodGroup}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.rhFactor}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.lastDonationDate}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.ongoingMedications}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.chronicDiseases}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.weight}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.hemoglobinLevel}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.allergies}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.eligible}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.city}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray">
                    {donor.contact}
                  </Typography>
                </td>
                <td className="p-4 flex gap-2">
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
    </Card>
  );
};

export default DonorTable;
