import React from "react";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    name: string;
    age: string;
    bloodGroup: string;
    rhFactor: string;
    city: string;
    contact: string;
  };
  isEditing: boolean;
}

const PatientModal: React.FC<PatientModalProps> = ({
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
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] md:w-[500px] max-h-[85vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isEditing ? "Edit Patient" : "Add Patient"}
        </h3>

        <div className="space-y-4">
          {/* Full width field for Name */}
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

          {/* Two columns: Age & Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-gray-700 mb-1">
                Age
              </label>
              <input
                id="age"
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
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
          </div>

          {/* Full width field for Rh Factor */}
          <div>
            <label htmlFor="rhFactor" className="block text-gray-700 mb-1">
              Rh Factor
            </label>
            <input
              id="rhFactor"
              type="text"
              name="rhFactor"
              placeholder="Enter Rh Factor (Positive/Negative)"
              value={formData.rhFactor}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Two columns: City & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
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
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
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
            className={`px-5 py-2 ${
              isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            } text-white rounded-lg transition`}
          >
            {isEditing ? "Save Changes" : "Add Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
