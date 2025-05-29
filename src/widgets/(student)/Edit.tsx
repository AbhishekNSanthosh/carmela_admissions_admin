"use client";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db } from "@lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useParams, usePathname } from "next/navigation";
import { Application } from "../../common/interface/interface";
import easyToast from "@components/CustomToast";

export default function Edit() {
  return(
    <div className="">
    </div>
  )
  // // const [user, setUser] = useState<any>(null);
  // // const [isLoading, setIsLoading] = useState(true);
  // // const [draftId, setDraftId] = useState("");
  // // const [selectedBoard, setSelectedBoard] = useState("");
  // // const [application, setApplication] = useState<Application>({
  // //   id: "",
  // //   generatedId: "",
  // //   category: "lateral_entry",
  // //   title: "Management Quota - Lateral Entry",
  // //   preferenceOne: "",
  // //   preferenceTwo: "",
  // //   preferenceThree: "",
  // //   preferenceFour: "",
  // //   preferenceFive: "",
  // //   preferenceSix: "",
  // //   firstName: "",
  // //   lastName: "",
  // //   dateOfBirth: "",
  // //   govtQuotaApplicationNo: "",
  // //   email: "",
  // //   placeOfBirth: "",
  // //   gender: "",
  // //   religion: "",
  // //   aadhaarNo: "",
  // //   addressLine1: "",
  // //   addressLine2: "",
  // //   street: "",
  // //   district: "",
  // //   pinCode: "",
  // //   contactNo: "",
  // //   alternateContactNo: "",
  // //   course: "", // For course selection (HSE, SSLC, CBSE, etc.)
  // //   board: "", // For selecting board (e.g., HSE, CBSE)
  // //   institution: "",
  // //   universityOrBoard: "",
  // //   certificateUrl: "",
  // //   passedOn: "",
  // //   marks: {},
  // //   // english: "",
  // //   // hindi: "",
  // //   // physics: "",
  // //   // science: "",
  // //   // language: "",
  // //   // chemistry: "",
  // //   // computerScience: "",
  // //   // mathematics: "",
  // //   // firstLanguagePaperOne: "",
  // //   // firstLanguagePaperTwo: "",
  // //   // socialScience: "",
  // //   // biology: "",
  // //   // informationTechnology: "",
  // //   // communicativeEnglish: "",
  // //   // },
  // //   guardian: {
  // //     name: "",
  // //     occupation: "",
  // //     addressLineOne: "",
  // //     addressLineTwo: "",
  // //     street: "",
  // //     district: "",
  // //     pincode: "",
  // //     relationship: "",
  // //     monthlyIncome: "",
  // //     phoneNumber: "",
  // //   },
  // //   declarationAccepted: false, // Checkbox for declaration
  // // });
  // // const location = usePathname();
  // // console.log(location?.split("/")[4]);
  // // const params = useParams();
  // // console.log("Params: ", params?.appId);

  // // useEffect(() => {
  // //   const auth = getAuth(app);
  // //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  // //     setUser(currentUser);
  // //     if (currentUser?.email) {
  // //       setApplication((prev) => ({
  // //         ...prev,
  // //         email: currentUser.email || "", // Provide fallback empty string if email is null
  // //       }));
  // //     }
  // //     setIsLoading(false);
  // //   });
  // //   return () => unsubscribe();
  // // }, []);

  // // const getSubjectCount = (board: any) => {
  // //   switch (board) {
  // //     case "CBSE_X":
  // //       return 5;
  // //     case "SSLC":
  // //       return 10;
  // //     case "HSE_XII":
  // //       return 6;
  // //     case "CBSE_XII":
  // //       return 5;
  // //     default:
  // //       return 0;
  // //   }
  // // };

  // // const subjectCount = getSubjectCount(selectedBoard);

  // // const generateCustomId = async (): Promise<string> => {
  // //   const snapshot = await getDocs(collection(db, "admission_application"));
  // //   const count = snapshot.size + 1;
  // //   const padded = String(count).padStart(5, "0");
  // //   return `CRML-2025-${padded}`;
  // // };

  // // const handleSubmit = async (e: React.FormEvent) => {
  // //   e.preventDefault();

  // //   try {
  // //     const customId = await generateCustomId();

  // //     // Update the application state with generatedId before saving
  // //     const updatedApplication = {
  // //       ...application,
  // //       generatedId: customId,
  // //     };

  // //     // Save application to Firestore
  // //     const docRef = await addDoc(
  // //       collection(db, "admission_application"),
  // //       updatedApplication
  // //     );

  // //     // If there's a draftId, delete the corresponding draft
  // //     if (params?.appId && params?.appId !== "") {
  // //       await deleteDoc(doc(db, "drafts", params?.appId as string));
  // //       console.log("Draft deleted with ID:", params?.appId);
  // //     }

  // //     console.log("Application submitted with Firestore ID:", docRef.id);
  // //     console.log("Custom ID assigned:", customId);
  // //   } catch (e) {
  // //     console.error("Error submitting application:", e);
  // //   }
  // // };

  // // const saveAsDraft = async () => {
  // //   if (!user?.email) {
  // //     console.error("User email not available.");
  // //     return;
  // //   }

  // //   try {
  // //     const draftsRef = collection(db, "drafts");
  // //     const q = query(
  // //       draftsRef,
  // //       where("email", "==", user.email),
  // //       where("category", "==", "lateral_entry")
  // //     );

  // //     const querySnapshot = await getDocs(q);

  // //     if (!application.category) {
  // //       application.category = "lateral_entry"; // ensure it's added
  // //     }

  // //     if (!application.email) {
  // //       application.email = user.email; // fallback if not already set
  // //     }

  // //     if (!querySnapshot.empty) {
  // //       // If draft exists, update the first one found
  // //       const existingDoc = querySnapshot.docs[0];
  // //       await setDoc(doc(db, "drafts", existingDoc.id), application);
  // //       console.log("Draft updated:", existingDoc.id);
  // //       easyToast({
  // //         message: "Draft saved",
  // //         type: "success",
  // //         showIcon: true,
  // //       });
  // //     } else {
  // //       // Else, create a new draft
  // //       const docRef = await addDoc(draftsRef, {
  // //         ...application,
  // //         category: "lateral_entry",
  // //         email: user.email,
  // //       });
  // //       easyToast({
  // //         message: "New draft created",
  // //         type: "success",
  // //         showIcon: true,
  // //       });
  // //       console.log("New draft created with ID:", docRef.id);
  // //     }
  // //   } catch (error) {
  // //     console.error("Error saving draft:", error);
  // //   }
  // // };

  // // useEffect(() => {
  // //   const fetchApplication = async () => {
  // //     setIsLoading(true);

  // //     try {
  // //       const auth = getAuth();
  // //       const currentUser = auth.currentUser;

  // //       if (!currentUser || !params?.appId) return;

  // //       const docRef = doc(db, "drafts", params?.appId as string);
  // //       const docSnap = await getDoc(docRef);

  // //       if (docSnap.exists()) {
  // //         const docData = docSnap.data();
  // //         if (
  // //           docData.email === currentUser.email &&
  // //           docData.category === "lateral_entry"
  // //         ) {
  // //           setApplication(docData as Application);
  // //           setDraftId(docSnap.id);
  // //           console.log("Document ID:", docSnap.id);
  // //         } else {
  // //           console.warn("Draft found, but email or category does not match.");
  // //         }
  // //       } else {
  // //         console.warn("No such draft found.");
  // //       }
  // //     } catch (error) {
  // //       console.error("Error fetching application:", error);
  // //     } finally {
  // //       setIsLoading(false);
  // //     }
  // //   };

  // //   fetchApplication();
  // // }, []);

  // // console.log("Applications: ", application);
  // // console.log("Id", draftId);

  // // if (isLoading) {
  // //   return (
  // //     <div className="w-full h-full flex items-center justify-center">
  // //       Loading
  // //     </div>
  // //   );
  // // }

  // // return (
  // //   <div className=" flex items-start flex-col justify-center space-y-4">
  // //     <div className="bg-white w-full h-auto py-5 px-4  rounded-[5px]">
  // //       <h3 className="text-primary-600 font-semibold text-xl">
  // //         Management Quota - Lateral Entry
  // //       </h3>
  // //     </div>

  // //     <form
  // //       action=""
  // //       onSubmit={handleSubmit}
  // //       className=" flex items-start w-full flex-col justify-center space-y-4"
  // //     >
  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Branch Preference</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             Select your preferred branches in order.
  // //           </span>
  // //         </div>
  // //         <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Preference 1
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   preferenceOne: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.preferenceOne}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select a branch</option>
  // //               <option value="CSE">Computer Science and Engineering</option>
  // //               <option value="ECE">
  // //                 Electronics and Communication Engineering
  // //               </option>
  // //               <option value="ME">Mechanical Engineering</option>
  // //               <option value="CE">Civil Engineering</option>
  // //               <option value="EEE">
  // //                 Electrical and Electronics Engineering
  // //               </option>
  // //             </select>
  // //           </div>

  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Preference 2
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   preferenceTwo: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.preferenceTwo}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select a branch</option>
  // //               <option value="CSE">Computer Science and Engineering</option>
  // //               <option value="ECE">
  // //                 Electronics and Communication Engineering
  // //               </option>
  // //               <option value="ME">Mechanical Engineering</option>
  // //               <option value="CE">Civil Engineering</option>
  // //               <option value="EEE">
  // //                 Electrical and Electronics Engineering
  // //               </option>
  // //             </select>
  // //           </div>

  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Preference 3
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   preferenceThree: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.preferenceThree}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select a branch</option>
  // //               <option value="CSE">Computer Science and Engineering</option>
  // //               <option value="ECE">
  // //                 Electronics and Communication Engineering
  // //               </option>
  // //               <option value="ME">Mechanical Engineering</option>
  // //               <option value="CE">Civil Engineering</option>
  // //               <option value="EEE">
  // //                 Electrical and Electronics Engineering
  // //               </option>
  // //             </select>
  // //           </div>

  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Preference 4
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   preferenceFour: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.preferenceThree}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select a branch</option>
  // //               <option value="CSE">Computer Science and Engineering</option>
  // //               <option value="ECE">
  // //                 Electronics and Communication Engineering
  // //               </option>
  // //               <option value="ME">Mechanical Engineering</option>
  // //               <option value="CE">Civil Engineering</option>
  // //               <option value="EEE">
  // //                 Electrical and Electronics Engineering
  // //               </option>
  // //             </select>
  // //           </div>

  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Preference 5
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   preferenceFive: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.preferenceThree}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select a branch</option>
  // //               <option value="CSE">Computer Science and Engineering</option>
  // //               <option value="ECE">
  // //                 Electronics and Communication Engineering
  // //               </option>
  // //               <option value="ME">Mechanical Engineering</option>
  // //               <option value="CE">Civil Engineering</option>
  // //               <option value="EEE">
  // //                 Electrical and Electronics Engineering
  // //               </option>
  // //             </select>
  // //           </div>
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Candidate Profile</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             Fill in your name, email, and personal info.
  // //           </span>
  // //         </div>
  // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  // //           {/* First Name */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               First Name
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   firstName: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.firstName}
  // //               type="text"
  // //               placeholder="Eg: John"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Last Name */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Last Name
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   lastName: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.lastName}
  // //               type="text"
  // //               placeholder="Eg: Doe"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Date of Birth */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Date of Birth
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   dateOfBirth: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.dateOfBirth}
  // //               type="date"
  // //               placeholder="Eg: 2000-01-01"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Email */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Email
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   email: e.target.value, // Update the course field with the selected value
  // //                 }));
  // //               }}
  // //               value={application.email || ""}
  // //               type="email"
  // //               placeholder="Eg: john.doe@example.com"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Place of Birth */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Place of Birth
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   placeOfBirth: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.placeOfBirth}
  // //               type="text"
  // //               placeholder="Eg: Kochi"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Gender */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Gender
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   gender: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.gender}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select Gender</option>
  // //               <option value="Male">Male</option>
  // //               <option value="Female">Female</option>
  // //               <option value="Other">Other</option>
  // //             </select>
  // //           </div>

  // //           {/* Religion */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Religion
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   religion: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.religion}
  // //               type="text"
  // //               placeholder="Eg: Christianity"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Aadhaar Number */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Aadhaar Number
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   aadhaarNo: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.aadhaarNo}
  // //               type="text"
  // //               maxLength={12}
  // //               placeholder="Eg: 1234 5678 9012"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Address Line 1 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Address Line 1
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   addressLine1: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.addressLine1}
  // //               type="text"
  // //               placeholder="Eg: House Name"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Address Line 2 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Address Line 2
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   addressLine2: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.addressLine2}
  // //               type="text"
  // //               placeholder="Eg: Apartment, Floor No."
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Street */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Street
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   street: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.street}
  // //               type="text"
  // //               placeholder="Eg: MG Road"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* District */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               District
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   district: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.district}
  // //               type="text"
  // //               placeholder="Eg: Ernakulam"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Pincode */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Pincode
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   pinCode: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.pinCode}
  // //               type="text"
  // //               maxLength={6}
  // //               placeholder="Eg: 682001"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Contact Number 1 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Contact Number
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   contactNo: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.contactNo}
  // //               type="text"
  // //               maxLength={10}
  // //               placeholder="Eg: 9876543210"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Contact Number 2 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Alternate Contact Number
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   alternateContactNo: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.alternateContactNo}
  // //               type="text"
  // //               maxLength={10}
  // //               placeholder="Eg: 9123456789"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Academic History</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             Provide details of your educational background and qualifications.
  // //           </span>
  // //         </div>
  // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  // //           {/* Course */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Course
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   course: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.course}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select Course</option>
  // //               <option value="HSE">HSE</option>
  // //               <option value="SSLC">SSLC</option>
  // //             </select>
  // //           </div>

  // //           {/* Name of Institution */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Name of Institution
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   institution: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.institution}
  // //               type="text"
  // //               placeholder="Eg: Carmel School"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* University / Board */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               University / Board
  // //             </label>
  // //             <select
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   universityOrBoard: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.universityOrBoard}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">Select Board</option>
  // //               <option value="HSE">HSE</option>
  // //               <option value="CBSE">CBSE</option>
  // //             </select>
  // //           </div>

  // //           {/* Passed On */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Passed On
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevStat) => ({
  // //                   ...prevStat,
  // //                   passedOn: e.target.value,
  // //                 }));
  // //               }}
  // //               value={application.passedOn}
  // //               type="text"
  // //               placeholder="Eg: MAR-2025"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Qualifying Examination</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             Enter the marks or grade obtained in your qualifying examination.
  // //           </span>
  // //         </div>
  // //         <div className="space-y-4">
  // //           {/* Board Select */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Select Board
  // //             </label>
  // //             <select
  // //               value={selectedBoard}
  // //               onChange={(e) => setSelectedBoard(e.target.value)}
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             >
  // //               <option value="">-- Select --</option>
  // //               <option value="CBSE_X">CBSE (X)</option>
  // //               <option value="SSLC">SSLC</option>
  // //               <option value="HSE_XII">HSE (XII)</option>
  // //               <option value="CBSE_XII">CBSE (XII)</option>
  // //             </select>
  // //           </div>

  // //           {/* Subject Marks Input Fields */}
  // //           {selectedBoard === "CBSE_X" && (
  // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   English
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         english: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.english}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Language
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         language: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.language}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Mathematics
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         mathematics: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.mathematics}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Science
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         science: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.science}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Social Science
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         socialScience: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.socialScience}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>
  // //             </div>
  // //           )}

  // //           {selectedBoard === "SSLC" && (
  // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   First Language - Paper I
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         firstLanguagePaperOne: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.firstLanguagePaperOne}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   First Language - Paper II
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         firstLanguagePaperTwo: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.firstLanguagePaperTwo}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   English
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         english: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.english}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>
  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Hindi
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         hindi: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.hindi}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Social Science
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         socialScience: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.socialScience}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Physics
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         physics: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.physics}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Chemistry
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         chemistry: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.chemistry}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Biology
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         biology: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.biology}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Mathematics
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         mathematics: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.mathematics}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>

  // //               <div className="flex flex-col">
  // //                 <label className="text-gray-800 text-sm mb-1 font-medium">
  // //                   Information Technology
  // //                 </label>
  // //                 <input
  // //                   onChange={(e) => {
  // //                     setApplication((prevState) => ({
  // //                       ...prevState,
  // //                       marks: {
  // //                         ...prevState.marks,
  // //                         informationTechnology: e.target.value,
  // //                       },
  // //                     }));
  // //                   }}
  // //                   value={application.marks.informationTechnology}
  // //                   type="text"
  // //                   placeholder={`Eg: 95`}
  // //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //                 />
  // //               </div>
  // //             </div>
  // //           )}
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Guardian Info</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             {" "}
  // //             Provide guardian's details.
  // //           </span>
  // //         </div>
  // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  // //           {/* Name of Guardian */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Name of Guardian
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     name: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.name}
  // //               type="text"
  // //               placeholder="Enter Guardian's Name"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Occupation */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Occupation
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     occupation: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.occupation}
  // //               type="text"
  // //               placeholder="Enter Occupation"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Address Line 1 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Address Line 1 (Residence)
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     addressLineOne: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.addressLineOne}
  // //               type="text"
  // //               placeholder="Eg: House Name"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Address Line 2 */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Address Line 2
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     addressLineTwo: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.addressLineTwo}
  // //               type="text"
  // //               placeholder="Eg: Apartment, Floor No."
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Street */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Street
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     street: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.street}
  // //               type="text"
  // //               placeholder="Eg: MG Road"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* District */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               District
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     district: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.district}
  // //               type="text"
  // //               placeholder="Eg: Ernakulam"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Pincode */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Pincode
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     pincode: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.pincode}
  // //               type="text"
  // //               maxLength={6}
  // //               placeholder="Eg: 682001"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Relationship with Applicant */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Relationship with Applicant
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     relationship: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.relationship}
  // //               type="text"
  // //               placeholder="Enter Relationship"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Monthly Income */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Monthly Income
  // //             </label>
  // //             <input
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     monthlyIncome: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.monthlyIncome}
  // //               type="number"
  // //               placeholder="Enter Monthly Income"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>

  // //           {/* Phone Number */}
  // //           <div className="flex flex-col">
  // //             <label className="text-gray-800 text-sm mb-1 font-medium">
  // //               Phone Number
  // //             </label>
  // //             <input
  // //               type="text"
  // //               onChange={(e) => {
  // //                 setApplication((prevState) => ({
  // //                   ...prevState,
  // //                   guardian: {
  // //                     ...prevState.guardian,
  // //                     phoneNumber: e.target.value,
  // //                   },
  // //                 }));
  // //               }}
  // //               value={application.guardian.phoneNumber}
  // //               maxLength={10}
  // //               placeholder="Enter Phone Number"
  // //               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
  // //             />
  // //           </div>
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
  // //         <div className="flex flex-col gap-1">
  // //           <h6 className="font-semibold">Declaration</h6>
  // //           <span className="text-gray-700 text-sm">
  // //             {" "}
  // //             Confirm the declaration.
  // //           </span>
  // //         </div>
  // //         <div className="flex items-center space-x-3">
  // //           <input
  // //             onChange={(e) => {
  // //               setApplication((prevState) => ({
  // //                 ...prevState,
  // //                 declarationAccepted: e.target.checked,
  // //               }));
  // //             }}
  // //             checked={application.declarationAccepted}
  // //             type="checkbox"
  // //             id="declaration"
  // //             className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
  // //           />
  // //           <label htmlFor="declaration" className="text-sm text-gray-700">
  // //             I declare that the information provided is true and accurate.
  // //           </label>
  // //         </div>
  // //       </div>

  // //       <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] gap-3 flex flex-row">
  // //         <button
  // //           className="flex-1 bg-primary-50 text-primary-600 font-semibold py-3 rounded-[10px]"
  // //           type="button"
  // //           onClick={(e) => {
  // //             e.preventDefault();
  // //             saveAsDraft();
  // //           }}
  // //         >
  // //           Save as draft
  // //         </button>
  // //         <button
  // //           className="flex-1 bg-primary-600 py-3 rounded-[10px] text-white font-semibold"
  // //           type="submit"
  // //         >
  // //           Submit
  // //         </button>
  // //       </div>
  // //     </form>
  // //   </div>
  // );
}
