// import React, { useEffect } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase/firebase";

// const samplePatients = [
//   {
//     name: "Ali Raza",
//     age: "45",
//     bloodGroup: "A+",
//     city: "Karachi",
//     contact: "0300-1234567"
//   },
//   {
//     name: "Sana Ahmed",
//     age: "32",
//     bloodGroup: "B+",
//     city: "Lahore",
//     contact: "0321-9876543"
//   },
//   {
//     name: "Bilal Iqbal",
//     age: "38",
//     bloodGroup: "O+",
//     city: "Islamabad",
//     contact: "0333-1234567"
//   },
//   {
//     name: "Hina Khan",
//     age: "29",
//     bloodGroup: "AB+",
//     city: "Karachi",
//     contact: "0301-1122334"
//   },
//   {
//     name: "Usman Malik",
//     age: "41",
//     bloodGroup: "A-",
//     city: "Lahore",
//     contact: "0320-2233445"
//   },
//   {
//     name: "Zara Bukhari",
//     age: "35",
//     bloodGroup: "B-",
//     city: "Islamabad",
//     contact: "0334-4455667"
//   },
//   {
//     name: "Saeed Akhtar",
//     age: "50",
//     bloodGroup: "O-",
//     city: "Karachi",
//     contact: "0302-3344556"
//   },
//   {
//     name: "Nida Hussain",
//     age: "27",
//     bloodGroup: "AB-",
//     city: "Lahore",
//     contact: "0325-6677889"
//   },
//   {
//     name: "Faisal Shah",
//     age: "44",
//     bloodGroup: "A+",
//     city: "Islamabad",
//     contact: "0331-5566778"
//   },
//   {
//     name: "Areeba Siddiqui",
//     age: "31",
//     bloodGroup: "B+",
//     city: "Karachi",
//     contact: "0303-7788990"
//   }
// ];

// const SeedPatients: React.FC = () => {
//   useEffect(() => {
//     const seedData = async () => {
//       for (const patient of samplePatients) {
//         try {
//           await addDoc(collection(db, "patients"), patient);
//           console.log("Added patient:", patient.name);
//         } catch (error) {
//           console.error("Error adding patient:", error);
//         }
//       }
//     };

//     // Seed data on component mount
//     seedData();
//   }, []);

//   return <p>Seeding patients... Check console for progress.</p>;
// };

// export default SeedPatients;
