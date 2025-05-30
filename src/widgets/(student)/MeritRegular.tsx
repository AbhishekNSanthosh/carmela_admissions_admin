"use client";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db, storage } from "@lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { Application, ErrorState } from "../../common/interface/interface";
import { PreferenceKey } from "../../common/types/types";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import easyToast from "@components/CustomToast";
import Image from "next/image";
import { uploadBytesResumable } from "firebase/storage";
import {
  gradeOptions,
  sslcGradeOptions,
  sslcSubjects,
  subjectOptions,
} from "@utils/constants";

export default function MeritRegular() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [isSSLC, setIsSSLC] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasDoneGovtQuotaApplications, setHasDoneGovtQuotaApplications] =
    useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const [errorState, setErrorState] = useState<ErrorState>({
    id: false,
    generatedId: false,
    category: false,
    title: false,
    preferenceOne: false,
    preferenceTwo: false,
    preferenceThree: false,
    preferenceFour: false,
    preferenceFive: false,
    preferenceSix: false,
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    govtQuotaApplicationNo: false,
    email: false,
    placeOfBirth: false,
    gender: false,
    religion: false,
    aadhaarNo: false,
    addressLine1: false,
    addressLine2: false,
    street: false,
    district: false,
    pinCode: false,
    contactNo: false,
    alternateContactNo: false,
    course: false,
    board: false,
    institution: false,
    universityOrBoard: false,
    certificateUrl: false,
    passedOn: false,
    marks: false,
    certificate: false,
    guardian: {
      name: false,
      occupation: false,
      addressLineOne: false,
      addressLineTwo: false,
      street: false,
      district: false,
      pincode: false,
      relationship: false,
      monthlyIncome: false,
      phoneNumber: false,
    },
    declarationAccepted: false,
  });
  const [application, setApplication] = useState<Application>({
    id: "",
    generatedId: "",
    category: "management_merit_regular",
    title: "Management Merit - Regular",
    preferenceOne: "",
    preferenceTwo: "",
    preferenceThree: "",
    preferenceFour: "",
    fee: "200",
    preferenceFive: "",
    preferenceSix: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    govtQuotaApplicationNo: "",
    transactionId: "",
    chancesTaken: "",
    email: "",
    placeOfBirth: "",
    gender: "",
    religion: "",
    community: "",
    aadhaarNo: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    district: "",
    pinCode: "",
    contactNo: "",
    alternateContactNo: "",
    course: "", // For course selection (HSE, SSLC, CBSE, etc.)
    board: "", // For selecting board (e.g., HSE, CBSE)
    institution: "",
    universityOrBoard: "",
    certificateUrl: "",
    passedOn: "",
    marks: {
      // english: "",
      // hindi: "",
      // physics: "",
      // science: "",
      // language: "",
      // chemistry: "",
      // computerScience: "",
      // mathematics: "",
      // firstLanguagePaperOne: "",
      // firstLanguagePaperTwo: "",
      // socialScience: "",
      // biology: "",
      // informationTechnology: "",
      // communicativeEnglish: "",
      // },
    },
    guardian: {
      name: "",
      occupation: "",
      addressLineOne: "",
      addressLineTwo: "",
      street: "",
      district: "",
      pincode: "",
      relationship: "",
      monthlyIncome: "",
      phoneNumber: "",
    },
    declarationAccepted: false, // Checkbox for declaration
  });
  const location = usePathname();
  const router = useRouter();
  console.log(location?.split("/")[4]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!finished) {
        e.preventDefault();
        e.returnValue = "Your progress will be lost!";
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!finished) {
        // Alert the user
        if (
          !window.confirm(
            "Your progress will be lost! Are you sure you want to leave?"
          )
        ) {
          // If user cancels, push the current state back
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    // Add initial state to prevent immediate back navigation
    window.history.pushState(null, "", window.location.pathname);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [finished]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorState((prev) => ({
        ...prev,
        certificate: false,
      }));
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) return;
      setUploading(true);

      const storageRef = ref(
        storage,
        `certificates/${Date.now()}_${file.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          // Handle errors
          console.error("Upload failed:", error);
          setUploading(false);
        },
        async () => {
          // Upload complete
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setCertificateUrl(url);
          setApplication((prev) => ({
            ...prev,
            certificateUrl: url,
          }));
          setUploaded(true);
          setUploading(false);
          setIsModalOpen(false);
        }
      );
    } catch (error) {
      easyToast({
        message: "Something went wrong",
        type: "error",
      });
    }
  };

  const handleDeleteCertificate = async () => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, certificateUrl);
      await deleteObject(fileRef);

      // Clear state
      setCertificateUrl("");
      setApplication((prev) => ({
        ...prev,
        certificateUrl: "", // replace with the actual URL you get from Firebase
      }));
      setUploaded(false);
      setFile(null);

      alert("Certificate deleted successfully.");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("Failed to delete certificate.");
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploaded(false);
  };

  const addSubject = () => {
    const subject = newSubject.trim();
    if (subject && !application.marks[subject]) {
      setApplication((prev) => ({
        ...prev,
        marks: {
          ...prev.marks,
          [subject]: "",
        },
      }));
      // setErrorState((prev) => ({
      //   ...prev,
      //   marks: false,
      // }));
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    const newMarks = { ...application.marks };
    delete newMarks[subject];
    setApplication((prev) => ({ ...prev, marks: newMarks }));
  };

  const handleMarkChange = (subject: string, value: string) => {
    setApplication((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: value,
      },
    }));
  };

  const preferenceKeys: PreferenceKey[] = [
    "preferenceOne",
    "preferenceTwo",
    "preferenceThree",
    // "preferenceFour",
    // "preferenceFive",
    // "preferenceSix",
  ];

  const handlePreferenceChange = (key: PreferenceKey, value: string) => {
    setApplication((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (value !== "") {
      setErrorState((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  const courses = [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical & Electronics Engineering",
  ];

  useEffect(() => {
    const preferenceKeys: PreferenceKey[] = [
      "preferenceOne",
      "preferenceTwo",
      "preferenceThree",
      //   "preferenceFour",
      //   "preferenceFive",
      //   "preferenceSix",
    ];

    const hasGovtCourse = preferenceKeys.some((key) => {
      const value = application?.[key];
      console.log(`${key}: ${value} -> match: ${courses.includes(value)}`);
      return courses.includes(value);
    });

    console.log("Has govt:", hasGovtCourse);
    setHasDoneGovtQuotaApplications(hasGovtCourse);
  }, [application]);

  const branches = [
    // "Civil Engineering",
    // "Mechanical Engineering",
    // "Electrical & Electronics Engineering",
    "Computer Science and Engineering",
    "Automobile Engineering",
    "Electronics Engineering",
  ];

  const getAvailableBranches = (currentKey: PreferenceKey) => {
    const selectedBranches = preferenceKeys
      .filter((key) => key !== currentKey)
      .map((key) => application[key]);

    return branches.filter((branch) => !selectedBranches.includes(branch));
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        setApplication((prev) => ({
          ...prev,
          email: currentUser.email || "", // Provide fallback empty string if email is null
        }));
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getSubjectCount = (board: any) => {
    switch (board) {
      case "CBSE_X":
        return 5;
      case "SSLC":
        return 10;
      case "HSE_XII":
        return 6;
      case "CBSE_XII":
        return 5;
      default:
        return 0;
    }
  };

  const subjectCount = getSubjectCount(selectedBoard);

  const generateCustomId = async (): Promise<string> => {
    const snapshot = await getDocs(collection(db, "admission_application"));
    const count = snapshot.size + 1;
    const padded = String(count).padStart(5, "0");
    return `CRML-2025-${padded}`;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    // e.preventDefault();
    setSubmitting(true);
    try {
      const customId = await generateCustomId();

      // Update the application state with generatedId before saving
      const updatedApplication = {
        ...application,
        generatedId: customId,
        createdAt: serverTimestamp(),
      };

      // Save application to Firestore
      const docRef = await addDoc(
        collection(db, "admission_application"),
        updatedApplication
      );

      // If there's a draftId, delete the corresponding draft
      // if (draftId && draftId !== "") {
      //   await deleteDoc(doc(db, "drafts", draftId));
      //   console.log("Draft deleted with ID:", draftId);
      // }
      easyToast({
        message: `Submission Successful`,
        type: "success",
        desc: "You can download the application from the Applications tab.",
      });
      setTimeout(() => {
        router.push("/dashboard/application");
      }, 300);

      console.log("Application submitted with Firestore ID:", docRef.id);
      console.log("Custom ID assigned:", customId);
    } catch (e) {
      console.error("Error submitting application:", e);
      easyToast({
        message: "Something went wrong",
        type: "error",
        desc: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleError = () => {
    console.log("application?.marks", application?.marks);
    console.log("application?.marks", Object.keys(application.marks).length);
    if (application?.marks && Object.keys(application.marks).length === 0) {
      easyToast({
        message: "Marks Required",
        type: "error",
        desc: "Please enter the marks before proceeding.",
        showIcon: true,
      });
      console.log("error");
    } else if (certificateUrl === "") {
      easyToast({
        message: "Please upload marksheet",
        type: "error",
      });
    } else {
      handleSubmit();
    }
  };

  const saveAsDraft = async () => {
    if (!user?.email) {
      console.error("User email not available.");
      return;
    }

    try {
      const draftsRef = collection(db, "drafts");
      const q = query(
        draftsRef,
        where("email", "==", user.email),
        where("category", "==", "lateral_entry")
      );

      const querySnapshot = await getDocs(q);

      if (!application.category) {
        application.category = "lateral_entry"; // ensure it's added
      }

      if (!application.email) {
        application.email = user.email; // fallback if not already set
      }

      if (!querySnapshot.empty) {
        try {
          const existingDoc = querySnapshot.docs[0];
          await setDoc(doc(db, "drafts", existingDoc.id), application);
          console.log("Draft updated:", existingDoc.id);

          easyToast({
            message: "Draft saved",
            type: "success",
            showIcon: true,
          });
        } catch (error) {
          console.error("Draft update failed:", error);
          easyToast({
            message: "Failed to save draft",
            type: "error",
          });
        }
      } else {
        // Else, create a new draft
        const docRef = await addDoc(draftsRef, {
          ...application,
          category: "lateral_entry",
          email: user.email,
        });
        easyToast({
          message: "New draft created",
          type: "success",
        });
        console.log("New draft created with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const q = query(
        collection(db, "drafts"),
        where("email", "==", currentUser.email),
        where("category", "==", "lateral_entry")
      );

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          // setApplication(docData as Application); // cast to your Application type
          const doc = querySnapshot.docs[0];
          console.log("Document ID:", doc.id);
          setDraftId(doc?.id);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, []);

  console.log("Applications: ", application);
  console.log("Id", draftId);

  //   const handleErrorCheck = () => {
  //     console.log(errorState?.email);
  //     const newErrorState: any = {};
  //     const fieldsToCheck: (keyof Application)[] = [
  //       "id",
  //       "generatedId",
  //       "preferenceOne",
  //       "preferenceTwo",
  //       "preferenceThree",
  //       "preferenceFour",
  //       "preferenceFive",
  //       "preferenceSix",
  //       "firstName",
  //       "lastName",
  //       "dateOfBirth",
  //       "email",
  //       "placeOfBirth",
  //       "gender",
  //       "religion",
  //       "aadhaarNo",
  //       "addressLine1",
  //       "addressLine2",
  //       "street",
  //       "district",
  //       "pinCode",
  //       "contactNo",
  //       "alternateContactNo",
  //       "course",
  //       "board",
  //       "institution",
  //       "universityOrBoard",
  //       "certificateUrl",
  //       "passedOn",
  //     ];

  //     fieldsToCheck.forEach((field) => {
  //       if (application?.[field] === "") {
  //         newErrorState[field] = true;
  //       }
  //     });
  //     // Guardian fields
  //     const guardianFields = [
  //       "name",
  //       "occupation",
  //       "addressLineOne",
  //       "addressLineTwo",
  //       "street",
  //       "district",
  //       "pincode",
  //       "relationship",
  //       "monthlyIncome",
  //       "phoneNumber",
  //     ];

  //     guardianFields.forEach((field) => {
  //       if (application?.guardian?.[field] === "") {
  //         if (!newErrorState.guardian) newErrorState.guardian = {};
  //         newErrorState.guardian[field] = true;
  //       }
  //     });

  //     // Marks fields (if applicable)
  //     Object.entries(application?.marks || {}).forEach(([key, value]) => {
  //       if (value === "") {
  //         if (!newErrorState.marks) newErrorState.marks = {};
  //         newErrorState.marks[key] = true;
  //       }
  //     });

  //     setErrorState((prev) => ({
  //       ...prev,
  //       ...newErrorState,
  //     }));

  // //    const isMarksEmpty = application?.marks && Object.keys(application.marks).length === 0;

  // // console.log("marks is empty object:", isMarksEmpty);
  // // console.log(application?.marks)
  // // if (isMarksEmpty) {
  // //   setErrorState((prev) => ({
  // //     ...prev,
  // //     marks: true,
  // //   }));
  // // }

  //     if (certificateUrl === "") {
  //       setErrorState((prev) => ({
  //         ...prev,
  //         certificate: true,
  //       }));
  //     }

  //     if (!application?.declarationAccepted) {
  //       setErrorState((prev) => ({
  //         ...prev,
  //         declarationAccepted: true,
  //       }));
  //     }
  //   };

  const downloadQRCode = () => {
    // Get the QR code image element with proper typing
    const qrCode = document.getElementById(
      "qr-code-image"
    ) as HTMLImageElement | null;

    if (!qrCode || !qrCode.src) return;

    // Rest of the download logic remains the same
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCode.src;
    downloadLink.download = "college-fee-payment-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    if (sameAsPermanent) {
      setApplication((prev) => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          addressLineOne: prev.addressLine1,
          addressLineTwo: prev.addressLine2,
          street: prev.street,
          district: prev.district,
          pincode: prev.pinCode,
        },
      }));
    } else {
      setApplication((prev) => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          addressLineOne: "",
          addressLineTwo: "",
          street: "",
          district: "",
          pincode: "",
        },
      }));
    }
  }, [sameAsPermanent]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading
      </div>
    );
  }

  return (
    <div className=" flex items-start flex-col justify-center space-y-4">
      <div className="bg-white w-full h-auto py-5 px-4  rounded-[5px]">
        <h3 className="text-primary-600 font-semibold text-lg md:text-xl">
          Management Merit - Regular
        </h3>
      </div>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          // handleErrorCheck();
          // handleSubmit(e);
          handleError();
        }}
        className=" flex items-start w-full flex-col justify-center space-y-4"
      >
        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">Branch Preference</h6>
            <span className="text-gray-700 text-sm">
              Select your preferred branches in order.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preferenceKeys.map((key, index) => (
              <div key={key}>
                <label
                  className={`text-sm mb-1 font-medium ${
                    errorState?.[key] ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  Preference {index + 1}{" "}
                  {index === 0 && <span className="text-red-500">*</span>}
                </label>
                <select
                  required={index === 0}
                  className={`w-full ${
                    errorState?.[key]
                      ? "border-2 border-red-500"
                      : "border border-gray-300"
                  } px-3 py-2 rounded-md`}
                  value={application[key]}
                  // required
                  onChange={(e) => handlePreferenceChange(key, e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {getAvailableBranches(key).map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">
              Govt. Management Quota Application No.
              <span className="text-red-500">*</span>
            </h6>
            <span className="text-gray-700 text-sm">
              Govt. Management Quota Application No. (www.polyadmission.org)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              onChange={(e) => {
                setApplication((prevStat) => ({
                  ...prevStat,
                  govtQuotaApplicationNo: e.target.value,
                }));

                if (application?.govtQuotaApplicationNo !== "") {
                  setErrorState((prev) => ({
                    ...prev,
                    govtQuotaApplicationNo: false,
                  }));
                }
              }}
              value={application.govtQuotaApplicationNo}
              type="text"
              placeholder="Eg: 131752"
              className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errorState?.firstName
                  ? "border-2 border-red-500"
                  : "border border-gray-300"
              }`}
            />
          </div>
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">Candidate Profile</h6>
            <span className="text-gray-700 text-sm">
              Fill in your name, email, and personal info.
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.firstName ? "text-red-500" : "text-gray-800"
                }`}
              >
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    firstName: e.target.value,
                  }));

                  if (application?.firstName !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      firstName: false,
                    }));
                  }
                }}
                required
                value={application.firstName}
                type="text"
                placeholder="Eg: John"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.firstName
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.lastName ? "text-red-500" : "text-gray-800"
                }`}
              >
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    lastName: e.target.value,
                  }));
                  if (application?.lastName !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      lastName: false,
                    }));
                  }
                }}
                value={application.lastName}
                type="text"
                placeholder="Eg: Doe"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.lastName
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.dateOfBirth ? "text-red-500" : "text-gray-800"
                }`}
              >
                Date of Birth<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    dateOfBirth: e.target.value,
                  }));
                  if (application?.dateOfBirth !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      dateOfBirth: false,
                    }));
                  }
                }}
                value={application.dateOfBirth}
                type="date"
                placeholder="Eg: 2000-01-01"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.dateOfBirth
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.email ? "text-red-500" : "text-gray-800"
                }`}
              >
                Email<span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    email: e.target.value, // Update the course field with the selected value
                  }));
                }}
                value={application.email || ""}
                type="email"
                readOnly
                placeholder="Eg: john.doe@example.com"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.email
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Place of Birth */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.placeOfBirth ? "text-red-500" : "text-gray-800"
                }`}
              >
                Place of Birth<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    placeOfBirth: e.target.value,
                  }));
                  if (application?.placeOfBirth !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      placeOfBirth: false,
                    }));
                  }
                }}
                value={application.placeOfBirth}
                type="text"
                placeholder="Eg: Kochi"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.placeOfBirth
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.gender ? "text-red-500" : "text-gray-800"
                }`}
              >
                Gender<span className="text-red-500">*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    gender: e.target.value,
                  }));
                  if (application?.gender !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      gender: false,
                    }));
                  }
                }}
                value={application.gender}
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.gender
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Religion */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.religion ? "text-red-500" : "text-gray-800"
                }`}
              >
                Religion<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    religion: e.target.value,
                  }));
                  if (application?.religion !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      religion: false,
                    }));
                  }
                }}
                value={application.religion}
                type="text"
                placeholder="Eg: Christianity"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.religion
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.religion ? "text-red-500" : "text-gray-800"
                }`}
              >
                Community<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    community: e.target.value,
                  }));
                  if (application?.religion !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      religion: false,
                    }));
                  }
                }}
                value={application.community}
                type="text"
                placeholder=""
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.religion
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Aadhaar Number */}
            <div className="flex flex-col">
              <label className={`text-sm mb-1 font-medium text-gray-800`}>
                Aadhaar Number
              </label>
              <input
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    aadhaarNo: e.target.value,
                  }));
                }}
                value={application.aadhaarNo}
                type="text"
                maxLength={12}
                placeholder="Eg: 1234 5678 9012"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300`}
              />
            </div>

            {/* Address Line 1 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.addressLine1 ? "text-red-500" : "text-gray-800"
                }`}
              >
                Address Line 1<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    addressLine1: e.target.value,
                  }));
                  if (application?.addressLine1 !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      addressLine1: false,
                    }));
                  }
                }}
                value={application.addressLine1}
                type="text"
                placeholder="Eg: House Name"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.addressLine1
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Address Line 2 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.addressLine2 ? "text-red-500" : "text-gray-800"
                }`}
              >
                Address Line 2<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    addressLine2: e.target.value,
                  }));
                  if (application?.addressLine2 !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      addressLine2: false,
                    }));
                  }
                }}
                value={application.addressLine2}
                type="text"
                placeholder="Eg: Apartment, Floor No."
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.addressLine2
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Street */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.street ? "text-red-500" : "text-gray-800"
                }`}
              >
                Street<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    street: e.target.value,
                  }));
                  if (application?.street !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      street: false,
                    }));
                  }
                }}
                value={application.street}
                type="text"
                placeholder="Eg: MG Road"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.street
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* District */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.district ? "text-red-500" : "text-gray-800"
                }`}
              >
                District<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    district: e.target.value,
                  }));
                  if (application?.district !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      district: false,
                    }));
                  }
                }}
                value={application.district}
                type="text"
                placeholder="Eg: Ernakulam"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.district
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.pinCode ? "text-red-500" : "text-gray-800"
                }`}
              >
                Pincode<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    pinCode: e.target.value,
                  }));
                  if (application?.pinCode !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      pinCode: false,
                    }));
                  }
                }}
                value={application.pinCode}
                type="text"
                maxLength={6}
                placeholder="Eg: 682001"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.pinCode
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Contact Number 1 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.contactNo ? "text-red-500" : "text-gray-800"
                }`}
              >
                Contact Number<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    contactNo: e.target.value,
                  }));
                  if (application?.contactNo !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      contactNo: false,
                    }));
                  }
                }}
                value={application.contactNo}
                type="text"
                maxLength={10}
                placeholder="Eg: 9876543210"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.contactNo
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Contact Number 2 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.alternateContactNo
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Alternate Contact Number<span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    alternateContactNo: e.target.value,
                  }));
                  if (application?.alternateContactNo !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      alternateContactNo: false,
                    }));
                  }
                }}
                value={application.alternateContactNo}
                type="text"
                maxLength={10}
                placeholder="Eg: 9123456789"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.alternateContactNo
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">Academic History</h6>
            <span className="text-gray-700 text-sm">
              Provide details of your educational background and qualifications.
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.course ? "text-red-500" : "text-gray-800"
                }`}
              >
                Course<span className="text-red-500">*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    course: e.target.value,
                  }));
                  if (application?.course !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      course: false,
                    }));
                  }
                }}
                value={application.course}
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.course
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              >
                <option value="">Select Course</option>
                <option value="X">X</option>
              </select>
            </div>

            {/* Name of Institution */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.institution ? "text-red-500" : "text-gray-800"
                }`}
              >
                Name of Institution<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    institution: e.target.value,
                  }));
                  if (application?.institution !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      institution: false,
                    }));
                  }
                }}
                value={application.institution}
                type="text"
                placeholder="Eg: Carmel School"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.institution
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* University / Board */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.universityOrBoard
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                University / Board<span className="text-red-500">*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    universityOrBoard: e.target.value,
                  }));
                  if (e.target.value === "SSLC") {
                    setIsSSLC(true);
                  } else {
                    setIsSSLC(false);
                  }
                  if (application?.universityOrBoard !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      universityOrBoard: false,
                    }));
                  }
                }}
                value={application.universityOrBoard}
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.universityOrBoard
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              >
                <option value="">Select Board</option>
                <option value="SSLC">SSLC</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Passed On */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.passedOn ? "text-red-500" : "text-gray-800"
                }`}
              >
                Passed On<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevStat) => ({
                    ...prevStat,
                    passedOn: e.target.value,
                  }));
                  if (application?.passedOn !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      passedOn: false,
                    }));
                    setErrorState((prev) => ({
                      ...prev,
                      passedOn: false,
                    }));
                  }
                }}
                value={application.passedOn}
                type="text"
                placeholder="Eg: MAR-2025"
                className={`rounded-md uppercase px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.passedOn
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        {!isSSLC && (
          <div
            className={`bg-white w-full h-auto py-5 px-4 rounded-[5px] flex flex-col ${
              errorState?.marks && "border-2 border-red-500"
            }`}
          >
            <div className="flex flex-col gap-1">
              <h6 className="font-semibold">Qualifying Examination</h6>
              <span className="text-gray-700 text-sm">
                Enter the marks or grade obtained in your qualifying
                examination.
              </span>
            </div>
            <div className="">
              <div className="flex flex-col">
                <div className="grid grid-cols-1 gap-4">
                  {/* Display existing subject fields in a 3-column grid on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    {Object.entries(application.marks)
                      .filter(([subject]) =>
                        application?.universityOrBoard === "SSLC"
                          ? sslcSubjects.includes(subject)
                          : true
                      )
                      .map(([subject, mark]) => (
                        <div key={subject} className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <label className="text-gray-800 text-sm mb-1 font-medium capitalize">
                              {subject.replace(/([A-Z])/g, " $1").trim()}
                              <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeSubject(subject)}
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          <select
                            onChange={(e) =>
                              handleMarkChange(subject, e.target.value)
                            }
                            value={application.marks?.[subject] || ""}
                            className="rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 bg-white"
                          >
                            <option value="" disabled>
                              Select grade
                            </option>
                            {gradeOptions.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                  </div>

                  {/* Add new subject field */}
                  <div className="flex items-center gap-2">
                    <select
                      value={newSubject}
                      onChange={(e) => {
                        setNewSubject(e.target.value);
                        setErrorState((prev) => ({
                          ...prev,
                          marks: false,
                        }));
                      }}
                      className="border capitalize border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 bg-white"
                    >
                      <option value="">Select subject</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={addSubject}
                      disabled={!newSubject}
                      className={`${
                        newSubject
                          ? "bg-primary-500 hover:bg-primary-600"
                          : "bg-gray-300 cursor-not-allowed"
                      } text-white px-3 py-2 rounded-md text-sm`}
                    >
                      Add Subject
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
              <div className="flex flex-col mt-3">
                <label
                  className={`text-sm mb-1 font-medium ${
                    errorState?.passedOn ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  Chances Taken <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={(e) => {
                    setApplication((prevStat) => ({
                      ...prevStat,
                      chancesTaken: e.target.value,
                    }));
                    if (application?.passedOn !== "") {
                      setErrorState((prev) => ({
                        ...prev,
                        passedOn: false,
                      }));
                      setErrorState((prev) => ({
                        ...prev,
                        passedOn: false,
                      }));
                    }
                  }}
                  value={application.chancesTaken}
                  type="text"
                  placeholder="Eg: 1"
                  className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errorState?.passedOn
                      ? "border-2 border-red-500"
                      : "border border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div className="">
              <span className="italic text-xs mt-1">
                Note:Please add the subject and enter the marks. Make sure all
                subjects are included; missing any subject may lead to a
                reduction in the index score.
              </span>
            </div>
          </div>
        )}

        {/* SSLC  */}
        {isSSLC && (
          <div
            className={`bg-white w-full h-auto py-5 px-4 rounded-[5px] flex flex-col ${
              errorState?.marks && "border-2 border-red-500"
            }`}
          >
            <div className="flex flex-col gap-1">
              <h6 className="font-semibold">Qualifying Examination</h6>
              <span className="text-gray-700 text-sm">
                Enter the marks or grade obtained in your qualifying
                examination.
              </span>
            </div>
            <div className="">
              <div className="flex flex-col">
                <div className="grid grid-cols-1 gap-4">
                  {/* Display existing subject fields in a 3-column grid on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    {sslcSubjects.map((subject) => (
                      <div key={subject} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <label className="text-gray-800 text-sm mb-1 font-medium capitalize">
                            {subject.replace(/([A-Z])/g, " $1").trim()}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <select
                          onChange={(e) =>
                            handleMarkChange(subject, e.target.value)
                          }
                          value={application.marks?.[subject] || ""}
                          className="rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 bg-white"
                        >
                          <option value="" disabled>
                            Select grade
                          </option>
                          {sslcGradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Add new subject field */}
                  {/* <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => {
                        setNewSubject(e.target.value);
                        setErrorState((prev) => ({
                          ...prev,
                          marks: false,
                        }));
                      }}
                      onKeyDown={(e) => e.key === "Enter" && addSubject()}
                      placeholder="Enter subject name"
                      className="border capitalize border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1"
                    />
                    <button
                      type="button"
                      onClick={addSubject}
                      className="bg-primary-500 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-600"
                    >
                      Add Subject
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
              <div className="flex flex-col mt-3">
                <label
                  className={`text-sm mb-1 font-medium ${
                    errorState?.passedOn ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  Chances Taken <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={(e) => {
                    setApplication((prevStat) => ({
                      ...prevStat,
                      chancesTaken: e.target.value,
                    }));
                    if (application?.passedOn !== "") {
                      setErrorState((prev) => ({
                        ...prev,
                        passedOn: false,
                      }));
                      setErrorState((prev) => ({
                        ...prev,
                        passedOn: false,
                      }));
                    }
                  }}
                  value={application.chancesTaken}
                  type="text"
                  placeholder="Eg: 1"
                  className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errorState?.passedOn
                      ? "border-2 border-red-500"
                      : "border border-gray-300"
                  }`}
                />
              </div>
            </div>
            {/* <div className="">
              <span className="italic text-xs mt-1">
                Note:Please add the subject and enter the marks. Make sure all
                subjects are included; missing any subject may lead to a
                reduction in the index score.
              </span>
            </div> */}
          </div>
        )}

        <div
          className={`bg-white w-full h-auto py-5 px-4 rounded-[5px] flex flex-col ${
            errorState?.certificate && "border-2 border-red-500"
          }`}
        >
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">
              Upload Certificate<span className="text-red-500">*</span>
            </h6>
            <span className="text-gray-700 text-sm">
              Upload the copy of your certificate or statement of marks.
            </span>
          </div>

          <input
            required
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {file && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded text-gray-600">
                  PDF
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-gray-800">{file.name}</span>
                {uploading && (
                  <div className="text-sm text-gray-700 mt-2">
                    Uploading: {uploadProgress}%
                  </div>
                )}
                {!uploaded ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-1 text-sm bg-primary-600 text-white rounded hover:bg-blue-700"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      onClick={handleRemove}
                      className="px-4 py-1 text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2 items-center">
                    <span className="text-green-600 text-sm">
                      Uploaded successfully.
                    </span>
                    <button
                      onClick={handleRemove}
                      className="px-4 py-1 text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {certificateUrl && (
                  <div className="flex items-center gap-4 mt-2">
                    {/* View Icon */}
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="View Certificate"
                    >
                      <FaEye size={18} />
                    </a>

                    {/* Delete Icon */}
                    <button
                      onClick={handleDeleteCertificate}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Certificate"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-sm w-full">
                <h2 className="text-lg font-semibold">Confirm Upload</h2>
                <p className="text-sm text-gray-700">
                  Are you sure you want to upload this file? Once uploaded, it
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpload();
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-blue-700"
                    disabled={uploading}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">Guardian Info</h6>
            <span className="text-gray-700 text-sm">
              {" "}
              Provide guardian's details.
            </span>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sameAsPermanent}
              onChange={(e) => setSameAsPermanent(e.target.checked)}
            />
            <span>Same as Permanent Address</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Name of Guardian */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian?.name ? "text-red-500" : "text-gray-800"
                }`}
              >
                Name of Guardian<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      name: e.target.value,
                    },
                  }));
                  if (application?.guardian?.name !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        name: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.name}
                type="text"
                placeholder="Enter Guardian's Name"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.name
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Occupation */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.occupation
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Occupation<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      occupation: e.target.value,
                    },
                  }));
                  if (application?.guardian?.occupation !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        occupation: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.occupation}
                type="text"
                placeholder="Enter Occupation"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.occupation
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Address Line 1 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian?.addressLineOne
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Address Line 1 (Residence)
                <span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      addressLineOne: e.target.value,
                    },
                  }));
                  if (application?.guardian?.addressLineOne !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        addressLineOne: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.addressLineOne}
                type="text"
                placeholder="Eg: House Name"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.addressLineOne
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Address Line 2 */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian?.addressLineTwo
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Address Line 2<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      addressLineTwo: e.target.value,
                    },
                  }));
                  if (application?.guardian?.addressLineTwo !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        addressLineTwo: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.addressLineTwo}
                type="text"
                placeholder="Eg: Apartment, Floor No."
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.addressLineTwo
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Street */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.street ? "text-red-500" : "text-gray-800"
                }`}
              >
                Street<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      street: e.target.value,
                    },
                  }));
                  if (application?.guardian?.street !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        street: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.street}
                type="text"
                placeholder="Eg: MG Road"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.street
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* District */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.district
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                District<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      district: e.target.value,
                    },
                  }));
                  if (application?.guardian?.district !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        district: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.district}
                type="text"
                placeholder="Eg: Ernakulam"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian?.district
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.pincode
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Pincode<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      pincode: e.target.value,
                    },
                  }));
                  if (application?.guardian?.pincode !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        pincode: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.pincode}
                type="text"
                maxLength={6}
                placeholder="Eg: 682001"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian.pincode
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Relationship with Applicant */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.relationship
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Relationship with Applicant
                <span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      relationship: e.target.value,
                    },
                  }));
                  if (application?.guardian?.relationship !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        relationship: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.relationship}
                type="text"
                placeholder="Enter Relationship"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian.relationship
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Monthly Income */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.monthlyIncome
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Monthly Income<span className="text-red-500">*</span>
              </label>
              <input
                required
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      monthlyIncome: e.target.value,
                    },
                  }));
                  if (application?.guardian?.monthlyIncome !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        monthlyIncome: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.monthlyIncome}
                type="number"
                placeholder="Enter Monthly Income"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian.monthlyIncome
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 font-medium ${
                  errorState?.guardian.phoneNumber
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                onChange={(e) => {
                  setApplication((prevState) => ({
                    ...prevState,
                    guardian: {
                      ...prevState.guardian,
                      phoneNumber: e.target.value,
                    },
                  }));
                  if (application?.guardian?.phoneNumber !== "") {
                    setErrorState((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        phoneNumber: false,
                      },
                    }));
                  }
                }}
                value={application.guardian.phoneNumber}
                maxLength={10}
                placeholder="Enter Phone Number"
                className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errorState?.guardian.phoneNumber
                    ? "border-2 border-red-500"
                    : "border border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] space-y-4 flex flex-col">
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">Fee Payment</h6>
            <span className="text-gray-700 text-sm">
              Application fee: ₹200 (Non-refundable)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UPI Payment Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col gap-3">
                <h6 className="font-medium text-gray-800">Pay via UPI ID</h6>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Our UPI ID</p>
                    <p className="font-semibold">CARMELPOLY@FBL</p>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50">
                    ₹200 (Fixed amount)
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    // Construct the UPI payment link
                    const upiId = "CARMELPOLY@FBL"; // Replace with your actual UPI ID
                    const amount = "200";
                    const name = "College Name"; // Replace with your institution name
                    const transactionNote = "Admission Fee"; // Payment purpose

                    // Create the UPI URL
                    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
                      name
                    )}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;

                    // Try to open the UPI app
                    window.location.href = upiUrl;

                    // Fallback in case the deep link fails
                    setTimeout(() => {
                      window.location.href =
                        "https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user";
                    }, 500);
                  }}
                >
                  Pay via UPI App
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col gap-3 items-center">
                <h6 className="font-medium text-gray-800 w-full">
                  Scan QR Code
                </h6>

                <div className="bg-gray-100 p-4 rounded-md flex justify-center">
                  <div className="bg-white p-4">
                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                      <Image
                        src="/qr.png"
                        alt="UPI Payment QR Code"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                        id="qr-code-image" // Added ID for download reference
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Scan to pay ₹200 using any UPI app
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={downloadQRCode}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction ID Input */}
          <div className="border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex flex-col gap-3">
              <h6 className="font-medium text-gray-800">
                Payment Confirmation
              </h6>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID<span className="text-red-500">*</span>
                </label>
                <input
                  onChange={(e) => {
                    setApplication((prevState) => ({
                      ...prevState,
                      transactionId: e.target.value,
                    }));
                  }}
                  value={application?.transactionId}
                  required
                  type="text"
                  placeholder="Enter UPI transaction ID"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found in your payment receipt or bank statement
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h6 className="text-sm font-medium text-gray-800 mb-2">
              Payment Instructions
            </h6>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              {/* <li>Fixed application fee: ₹200 (non-refundable)</li> */}
              <li>Make payment using either UPI ID or QR code</li>
              <li>After payment, enter the transaction ID above</li>
              <li>Payment verification may take 1-2 working days</li>
              {/* <li>Contact payments@college.edu for any issues</li> */}
            </ul>
          </div>
        </div>

        <div
          className={`bg-white w-full h-auto py-5 px-4 rounded-[5px] flex flex-col ${
            errorState?.declarationAccepted && "border-2 border-red-500"
          }`}
        >
          <div className="flex flex-col gap-1">
            <h6 className="font-semibold">
              Declaration<span className="text-red-500">*</span>
            </h6>
            <span className="text-gray-700 text-sm">
              {" "}
              Confirm the declaration.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              required
              onChange={(e) => {
                setApplication((prevState) => ({
                  ...prevState,
                  declarationAccepted: e.target.checked,
                }));
                if (!application?.declarationAccepted) {
                  setErrorState((prev) => ({
                    ...prev,
                    declarationAccepted: false,
                  }));
                }
              }}
              checked={application.declarationAccepted}
              type="checkbox"
              id="declaration"
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
            />
            <label htmlFor="declaration" className="text-sm text-gray-700">
              I declare that the information provided is true and accurate.
            </label>
          </div>
        </div>

        <div className="bg-white w-full h-auto py-5 px-4 rounded-[5px] gap-3 flex flex-row">
          {/* <button
            className="flex-1 bg-primary-50 text-primary-600 font-semibold py-3 rounded-[10px]"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              saveAsDraft();
            }}
          >
            Save as draft
          </button> */}
          <button
            disabled={submitting}
            className={`flex-1  py-3 rounded-[10px] text-white font-semibold ${
              submitting ? "bg-primary-200" : "bg-primary-600"
            }`}
            type="submit"
          >
            {submitting ? "Please wait" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
