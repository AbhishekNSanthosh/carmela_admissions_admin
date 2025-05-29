"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/firebase";

export default function View() {
  const params = useParams();
  const appId = params?.appId as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) return;

    const fetchApplication = async () => {
      try {
        const docRef = doc(db, "admission_application", appId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApplication({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such application!");
        }
      } catch (err) {
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [appId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!application) return <div className="p-4">Application not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Application Details</h1>

      <div>
        Name: {application.firstName} {application.lastName}
      </div>
      <div>Email: {application.email}</div>
      <div>Category: {application.category}</div>
      <div>Generated ID: {application.generatedId}</div>
      <div>Contact No: {application.contactNo}</div>
      <div>Alternate Contact No: {application.alternateContactNo || "—"}</div>
      <div>Date of Birth: {application.dateOfBirth || "—"}</div>
      <div>Gender: {application.gender || "—"}</div>
      <div>Course: {application.course || "—"}</div>
      <div>Title: {application.title}</div>
      <div>Place of Birth: {application.placeOfBirth || "—"}</div>

      <hr className="my-4" />

      <div className="font-medium">Address</div>
      <div>{application.addressLine1}, {application.addressLine2}, {application.street}</div>
      <div>District: {application.district}</div>
      <div>Pin Code: {application.pinCode}</div>

      <hr className="my-4" />

      <div className="font-medium">Guardian</div>
      <div>Name: {application.guardian?.name}</div>
      <div>Phone: {application.guardian?.phoneNumber}</div>
      <div>Address: {application.guardian?.addressLineOne}, {application.guardian?.addressLineTwo}, {application.guardian?.street}</div>
      <div>Pincode: {application.guardian?.pincode}</div>
      <div>Occupation: {application.guardian?.occupation || "—"}</div>
      <div>Monthly Income: {application.guardian?.monthlyIncome || "—"}</div>
      <div>Relationship: {application.guardian?.relationship || "—"}</div>

      <hr className="my-4" />

      <div className="font-medium">Preferences</div>
      <div>1: {application.preferenceOne}</div>
      <div>2: {application.preferenceTwo || "—"}</div>
      <div>3: {application.preferenceThree || "—"}</div>
      <div>4: {application.preferenceFour || "—"}</div>
      <div>5: {application.preferenceFive || "—"}</div>

      <hr className="my-4" />

      <div className="font-medium">Academic Info</div>
      <div>Institution: {application.institution || "—"}</div>
      <div>University/Board: {application.universityOrBoard || "—"}</div>
      <div>Board: {application.board || "—"}</div>
      <div>Passed On: {application.passedOn || "—"}</div>

      <hr className="my-4" />

      <div className="font-medium">Marks</div>
      {application.marks && Object.entries(application.marks).map(([subject, mark]) => (
         <div key={subject}>{`${subject}: ${mark || "—"}`}</div>
      ))}
    </div>
  );
}
