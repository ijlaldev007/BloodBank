// import React, { useEffect } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/firebase";

// const sampleDonors = [
//   {
//     name: "Ahmed Khan",
//     bloodGroup: "A",
//     rhFactor: "Positive",
//     lastDonationDate: "2023-03-15",
//     ongoingMedications: "None",
//     chronicDiseases: "None",
//     weight: "72",
//     hemoglobinLevel: "14.5",
//     allergies: "None",
//     eligible: "Yes",
//     city: "Karachi",
//     contact: "0300-1234567"
//   },
//   {
//     "name": "Fatima Ali",
//     "bloodGroup": "B",
//     "rhFactor": "Negative",
//     "lastDonationDate": "2022-12-20",
//     "ongoingMedications": "Vitamin Supplements",
//     "chronicDiseases": "None",
//     "weight": "60",
//     "hemoglobinLevel": "13.2",
//     "allergies": "Pollen",
//     "eligible": "Yes",
//     "city": "Lahore",
//     "contact": "0321-6543210"
//   },
//   {
//     "name": "Hassan Siddiqui",
//     "bloodGroup": "O",
//     "rhFactor": "Positive",
//     "lastDonationDate": "2023-07-01",
//     "ongoingMedications": "None",
//     "chronicDiseases": "Hypertension",
//     "weight": "80",
//     "hemoglobinLevel": "13.9",
//     "allergies": "Dust",
//     "eligible": "No",
//     "city": "Islamabad",
//     "contact": "0302-8889990"
//   },
//   {
//     "name": "Ayesha Malik",
//     "bloodGroup": "AB",
//     "rhFactor": "Positive",
//     "lastDonationDate": "2023-02-10",
//     "ongoingMedications": "Insulin",
//     "chronicDiseases": "Diabetes",
//     "weight": "68",
//     "hemoglobinLevel": "12.8",
//     "allergies": "None",
//     "eligible": "Yes",
//     "city": "Karachi",
//     "contact": "0311-4567890"
//   },
//   {
//     "name": "Zainab Raza",
//     "bloodGroup": "A",
//     "rhFactor": "Negative",
//     "lastDonationDate": "2023-05-30",
//     "ongoingMedications": "Calcium Supplements",
//     "chronicDiseases": "None",
//     "weight": "62",
//     "hemoglobinLevel": "13.0",
//     "allergies": "Peanuts",
//     "eligible": "Yes",
//     "city": "Lahore",
//     "contact": "0304-2233445"
//   },
//   {
//     "name": "Bilal Shah",
//     "bloodGroup": "O",
//     "rhFactor": "Negative",
//     "lastDonationDate": "2023-01-25",
//     "ongoingMedications": "None",
//     "chronicDiseases": "Asthma",
//     "weight": "76",
//     "hemoglobinLevel": "15.2",
//     "allergies": "None",
//     "eligible": "Yes",
//     "city": "Islamabad",
//     "contact": "0333-9998877"
//   },
//   {
//     "name": "Maryam Javed",
//     "bloodGroup": "B",
//     "rhFactor": "Positive",
//     "lastDonationDate": "2022-11-10",
//     "ongoingMedications": "Thyroid Medication",
//     "chronicDiseases": "Hypothyroidism",
//     "weight": "65",
//     "hemoglobinLevel": "12.5",
//     "allergies": "Seafood",
//     "eligible": "Yes",
//     "city": "Karachi",
//     "contact": "0307-1112233"
//   },
//   {
//     "name": "Usman Tariq",
//     "bloodGroup": "AB",
//     "rhFactor": "Negative",
//     "lastDonationDate": "2023-06-05",
//     "ongoingMedications": "Painkillers",
//     "chronicDiseases": "None",
//     "weight": "85",
//     "hemoglobinLevel": "13.7",
//     "allergies": "None",
//     "eligible": "No",
//     "city": "Lahore",
//     "contact": "0322-4445566"
//   },
//   {
//     "name": "Rabia Farooq",
//     "bloodGroup": "A",
//     "rhFactor": "Positive",
//     "lastDonationDate": "2023-04-15",
//     "ongoingMedications": "Iron Supplements",
//     "chronicDiseases": "None",
//     "weight": "58",
//     "hemoglobinLevel": "14.1",
//     "allergies": "Penicillin",
//     "eligible": "Yes",
//     "city": "Islamabad",
//     "contact": "0315-6677889"
//   },
//   {
//     "name": "Hamza Qureshi",
//     "bloodGroup": "B",
//     "rhFactor": "Negative",
//     "lastDonationDate": "2023-03-01",
//     "ongoingMedications": "None",
//     "chronicDiseases": "None",
//     "weight": "70",
//     "hemoglobinLevel": "13.5",
//     "allergies": "None",
//     "eligible": "Yes",
//     "city": "Karachi",
//     "contact": "0306-9876543"
//   }
//   // ... Add the other 9 entries here ...
// ];

// const SeedDonors: React.FC = () => {
//   useEffect(() => {
//     const seedData = async () => {
//       for (const donor of sampleDonors) {
//         try {
//           await addDoc(collection(db, "donors"), donor);
//           console.log("Added donor:", donor.name);
//         } catch (error) {
//           console.error("Error adding donor:", error);
//         }
//       }
//     };

//     // Call seedData once when the component mounts
//     seedData();
//   }, []);

//   return <p>Seeding donors... Check console for progress.</p>;
// };

// export default SeedDonors;
