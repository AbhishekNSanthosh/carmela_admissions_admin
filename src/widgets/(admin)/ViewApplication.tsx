"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "@lib/firebase";
import Link from "next/link";
import { Application } from "../../common/interface/interface";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface InfoItemProps {
  label: string;
  value: string | number;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </section>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  const displayValue = typeof value === "number" ? value.toString() : value;
  return (
    <div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <p className="font-medium text-gray-800">{displayValue}</p>
    </div>
  );
};

export default function ViewApplication() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!params?.appId || typeof params?.appId !== "string") return;

      const docRef = doc(db, "admission_application", params.appId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Application;
        setApplication({ ...data, id: docSnap.id });
      }

      setLoading(false);
    };

    fetchApplication();
  }, [params?.appId]);

  const getPointFromMark = (mark: string): number => {
    const gradeMap: Record<string, number> = {
      "A+": 9,
      A1: 9,
      A: 8,
      A2: 8,
      "B+": 7,
      B1: 7,
      B: 6,
      B2: 6,
      "C+": 5,
      C1: 5,
      C: 4,
      C2: 4,
      "D+": 3,
      D1: 3,
      D: 2,
      D2: 2,
      E: 1,
      E1: 1,
    };

    if (gradeMap[mark]) return gradeMap[mark];

    const num = parseFloat(mark);
    if (!isNaN(num)) {
      if (num >= 90) return 9;
      if (num >= 80) return 8;
      if (num >= 70) return 7;
      if (num >= 60) return 6;
      if (num >= 50) return 5;
      if (num >= 40) return 4;
      if (num >= 30) return 3;
      if (num >= 20) return 2;
      return 1;
    }

    return 0;
  };

  const computeIndexScore = (
    app: Application
  ): { score: number; isEligible?: boolean; reason?: string } => {
    if (!app) return { score: 0 };

    const marks = app.marks || {};
    const course = app.course?.toLowerCase() || "";

    if (course.includes("xii")) {
      const coreSubjectsXII = ["mathematics", "physics", "chemistry"];
      const requiredPercentage = 0.5;

      // Check if all core subjects are present
      const hasAllCoreSubjects = coreSubjectsXII.every((subject) =>
        Object.keys(marks).some(
          (markSubject) => markSubject.trim().toLowerCase() === subject
        )
      );

      if (!hasAllCoreSubjects) {
        return {
          score: 0,
          isEligible: false,
          reason: "Missing core subjects",
        };
      }

      const totalMarksObtained = Object.values(marks).reduce(
        (sum, mark) => sum + (parseFloat(mark.toString()) || 0),
        0
      );

      const maxMarks = parseFloat(app?.totalofMaxMarks?.toString() || "0") || 0;
      const isEligible = totalMarksObtained >= maxMarks * requiredPercentage;

      return {
        score: totalMarksObtained,
        isEligible,
        reason: isEligible
          ? "Eligible"
          : `Marks below 50% requirement (${totalMarksObtained}/${maxMarks})`,
      };
    } else if (course.includes("iti")) {
      const totalMarksObtained = Object.values(marks).reduce(
        (sum, mark) => sum + (parseFloat(mark.toString()) || 0),
        0
      );

      const maxMarks = parseFloat(app?.totalofMaxMarks?.toString() || "0") || 0;
      const isEligible = totalMarksObtained >= maxMarks * 0.5;

      return {
        score: totalMarksObtained,
        isEligible,
        reason: isEligible
          ? "Eligible"
          : `Not Eligible (${totalMarksObtained}/${maxMarks} = ${(
              (totalMarksObtained / maxMarks) *
              100
            ).toFixed(2)}%)`,
      };
    } else {
      // Default calculation for X standard
      const coreSubjectsX = [
        "mathematics",
        "physics",
        "chemistry",
        "science",
        "english",
      ];
      const corePoints: number[] = [];
      const otherPoints: number[] = [];

      for (const [subject, mark] of Object.entries(marks)) {
        const point = getPointFromMark(mark);
        const sanitized = subject.trim().toLowerCase();
        if (coreSubjectsX.includes(sanitized)) {
          corePoints.push(point);
        } else {
          otherPoints.push(point);
        }
      }

      const coreAvg =
        corePoints.length > 0
          ? (corePoints.reduce((a, b) => a + b, 0) / corePoints.length) * 0.85
          : 0;

      const otherAvg =
        otherPoints.length > 0
          ? (otherPoints.reduce((a, b) => a + b, 0) / otherPoints.length) * 0.15
          : 0;

      const score = parseFloat((coreAvg + otherAvg).toFixed(10));

      return { score };
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!application) return <div className="p-8">Application not found</div>;

  const { score, isEligible, reason } = computeIndexScore(application);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Application Details
        </h1>
        <div className="">
          <Link
            href={`/dashboard/application/download/${params?.appId}`}
            className="bg-primary-500 outline-none border-none px-3 py-2 text-white rounded-md"
          >
            Download
          </Link>
        </div>
      </div>

      {/* Application Overview */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              {application?.title}
            </h2>
            <p className="text-gray-600 mt-1">
              Application Number:{" "}
              <span className="font-medium text-gray-800">
                {application.generatedId}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              Govt. Quota No:{" "}
              <span className="font-medium text-gray-800">
                {application.govtQuotaApplicationNo}
              </span>
            </p>
            <p className="text-gray-600 mt-1">
              Fees:{" "}
              <span className="font-medium text-gray-800">
                Rs. {application.fee}/-
              </span>
            </p>
          </div>
        </div>
        {application?.course === "X" && (
          <div className="mt-2">Index Score: {score}</div>
        )}
        {application?.course !== "X" && (
          <div className="mt-2">Score: {score}</div>
        )}
        {isEligible !== undefined && (
          <div className="mt-2">
            Status:{" "}
            <span
              className={`font-medium ${
                isEligible ? "text-green-600" : "text-red-600"
              }`}
            >
              {reason}
            </span>
          </div>
        )}
      </div>

      {/* Rest of your layout remains exactly the same */}
      {/* Sections */}
      <div className="space-y-8">
        {/* Branch Preferences */}
        <Section title="Branch Preferences">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              application.preferenceOne,
              application.preferenceTwo,
              application.preferenceThree,
              application.preferenceFour,
              application.preferenceFive,
              application.preferenceSix,
            ]
              .filter(Boolean)
              .map((pref, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-500">
                    Preference {idx + 1}
                  </span>
                  <p className="font-medium">
                    {pref !== "Nill" ? pref : "Nill"}
                  </p>
                </div>
              ))}
          </div>
        </Section>

        {/* Candidate Profile */}
        <Section title="Candidate Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Full Name"
              value={`${application.firstName} ${application.lastName}`}
            />
            <InfoItem label="Date of Birth" value={application.dateOfBirth} />
            <InfoItem label="Gender" value={application.gender} />
            <InfoItem label="Religion" value={application.religion} />
            <InfoItem label="Community" value={application.community} />
            <InfoItem label="Place of Birth" value={application.placeOfBirth} />
            <InfoItem label="Aadhaar Number" value={application.aadhaarNo} />
            <InfoItem label="Email" value={application.email || ""} />
            <InfoItem label="Phone" value={application.contactNo} />
            <InfoItem
              label="Alternate Phone"
              value={application.alternateContactNo}
            />
            <div className="md:col-span-2">
              <InfoItem
                label="Address"
                value={`${application.addressLine1} ${application.addressLine2}, ${application.street}, ${application.district}, ${application.pinCode}`}
              />
            </div>
          </div>
        </Section>

        {/* Academic History */}
        <Section title="Academic History">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Course" value={application.course} />
            <InfoItem label="Institution" value={application.institution} />
            <InfoItem
              label="University/Board"
              value={application.universityOrBoard}
            />
            <InfoItem label="Passed On" value={application.passedOn} />
            <InfoItem label="Chances taken" value={application.chancesTaken} />
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Marks Obtained</h4>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
              {Object.entries(application.marks).map(([subject, mark]) => (
                <div key={subject} className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {" "}
                    {subject.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="font-medium">{mark}</p>
                </div>
              ))}
            </div>
          </div>
          {application?.totalofMaxMarks && (
            <InfoItem
              label="Max Marks"
              value={application?.totalofMaxMarks ?? ""}
            />
          )}
          <Link
            href={application?.certificateUrl || ""}
            target="_blank"
            className="bg-primary-600 text-white px-3 py-2 rounded-md"
          >
            View Certificate
          </Link>
        </Section>

        {/* Guardian Info */}
        <Section title="Guardian Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Name" value={application.guardian.name} />
            <InfoItem
              label="Relationship"
              value={application.guardian.relationship}
            />
            <InfoItem
              label="Occupation"
              value={application.guardian.occupation}
            />
            <InfoItem
              label="Monthly Income"
              value={application.guardian.monthlyIncome}
            />
            <InfoItem label="Phone" value={application.guardian.phoneNumber} />
            <div className="md:col-span-2">
              <InfoItem
                label="Address"
                value={`${application.guardian.addressLineOne} ${application.guardian.addressLineTwo}, ${application.guardian.street}, ${application.guardian.district}, ${application.guardian.pincode}`}
              />
            </div>
          </div>
        </Section>

        {/* Payment Info */}
        <Section title="Payment Information">
          <InfoItem label="Transaction ID" value={application.transactionId} />
        </Section>
      </div>
    </div>
  );
}
