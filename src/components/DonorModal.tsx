import React from "react";

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
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
  };
  isEditing: boolean;
}

const DonorModal: React.FC<DonorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onChange,
  formData,
  isEditing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] md:w-[600px] max-h-[85vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isEditing ? "Edit Donor" : "Add Donor"}
        </h3>

        <div className="space-y-4">
          {/* Personal Information */}
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodGroup" className="block text-gray-700 mb-1">
                Blood Group
              </label>
              <input
                id="bloodGroup"
                type="text"
                name="bloodGroup"
                placeholder="e.g., A, B, AB, O"
                value={formData.bloodGroup}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="rhFactor" className="block text-gray-700 mb-1">
                Rh Factor
              </label>
              <input
                id="rhFactor"
                type="text"
                name="rhFactor"
                placeholder="Positive/Negative"
                value={formData.rhFactor}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Donation & Medical Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastDonationDate" className="block text-gray-700 mb-1">
                Last Donation Date
              </label>
              <input
                id="lastDonationDate"
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="ongoingMedications" className="block text-gray-700 mb-1">
                Ongoing Medications
              </label>
              <input
                id="ongoingMedications"
                type="text"
                name="ongoingMedications"
                placeholder="List any medications"
                value={formData.ongoingMedications}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="chronicDiseases" className="block text-gray-700 mb-1">
              Chronic Diseases
            </label>
            <input
              id="chronicDiseases"
              type="text"
              name="chronicDiseases"
              placeholder="E.g., Diabetes, Hypertension"
              value={formData.chronicDiseases}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="text"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="hemoglobinLevel" className="block text-gray-700 mb-1">
                Hemoglobin (g/dL)
              </label>
              <input
                id="hemoglobinLevel"
                type="text"
                name="hemoglobinLevel"
                placeholder="Hemoglobin Level"
                value={formData.hemoglobinLevel}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="allergies" className="block text-gray-700 mb-1">
                Allergies
              </label>
              <input
                id="allergies"
                type="text"
                name="allergies"
                placeholder="Allergies"
                value={formData.allergies}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="eligible" className="block text-gray-700 mb-1">
                Eligible to Donate
              </label>
              <input
                id="eligible"
                type="text"
                name="eligible"
                value={formData.eligible}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-gray-700 mb-1">
                Contact
              </label>
              <input
                id="contact"
                type="tel"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className={`px-5 py-2 ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              } text-white rounded-lg transition`}
          >
            {isEditing ? "Save Changes" : "Add Donor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorModal;
