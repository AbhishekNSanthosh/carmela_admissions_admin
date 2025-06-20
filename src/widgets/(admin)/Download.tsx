"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "@lib/firebase";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Application } from "../../common/interface/interface";

// Define types for your application data
// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helvetica/v15/Helvetica.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.3,
  },
  header: {
    textAlign: "center",
    marginBottom: 3,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 7,
  },
  logo: {
    width: 40, // Adjust as needed
    height: 40, // Adjust as needed
  },
  title: {
    fontSize: 15,
    fontWeight: "semibold",
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  divider: {
    width: "100%",
    height: 0.7,
    backgroundColor: "#333",
    marginBottom: 9,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    fontSize: 9,
  },
  section: {
    borderWidth: 0.5,
    borderColor: "#999",
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 6,
  },
  gridContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  gridHalf: {
    width: "50%",
    gap: 3,
  },
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#999",
    marginTop: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#999",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    fontSize: 9,
  },
  tableCell: {
  padding: 4,
  borderRightWidth: 0.5,
  borderRightColor: "#999",
  flex: 1,
  fontSize: 9,
  textTransform: "capitalize", // ✅ Fixed this line
},
  lastCell: {
    borderRightWidth: 0,
  },
  checklistSection: {
    marginVertical: 12,
  },
  checklistHeader: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 6,
  },
  checklistRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  checklistNumber: {
    width: 15,
  },
  checklistItem: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#999",
    fontSize: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});

const SafePDFDocument = ({
  application,
  score,
  percent,
}: {
  application: Application;
  score: number;
  percent?: number;
}) => {
  try {
    return (
      <ApplicationPDFDocument
        indexScore={score}
        application={application}
        percent={percent}
      />
    );
  } catch (error) {
    return (
      <Document>
        <Page>
          <Text>Failed to generate PDF. Please try again.</Text>
        </Page>
      </Document>
    );
  }
};

const ApplicationPDFDocument = ({
  indexScore,
  application,
  percent,
}: {
  application: Application;
  indexScore: number;
  percent?: number;
}) => {
  const sslcOrder = [
    "firstLanguagePaperI",
    "firstLanguagePaperII",
    "english",
    "hindi",
    "socialScience",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
    "informationTechnology",
  ];

  const checklistItems = [
    "I have filled-in the correct information.",
    "I have uploaded the copy of statement of marks card of class X.",
    "My parent/guardian and I have signed the declaration on the printed application form.",
    "I am attaching the copy of application processing fee challan.",
  ];

  const marksEntries = application?.marks ? Object.entries(application.marks) : [];

const normalizeSubjectName = (subject: string): string => {
  // Convert to lowercase and remove special characters/spaces
  return subject
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
};

const getSortedEntries = (application: Application) => {
  if (!application?.marks) return [];
  
  const isSSLC = application?.universityOrBoard?.toLocaleLowerCase() === "sslc";
  
  if (!isSSLC) {
    return Object.entries(application.marks).filter(([_, value]) => value !== undefined);
  }

  // Define the standard SSLC subject order with normalized names
  const sslcOrder = [
    "firstLanguagePaperI",
    "firstLanguagePaperII",
    "english",
    "hindi",
    "socialScience",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
    "informationTechnology",
  ].map(normalizeSubjectName);

  // Create a map of normalized subject names to their original names and values
  const subjectMap = new Map();
  Object.entries(application.marks).forEach(([subject, value]) => {
    if (value !== undefined) {
      subjectMap.set(normalizeSubjectName(subject), { originalName: subject, value });
    }
  });

  // Sort according to SSLC order, with unknown subjects at the end
  return sslcOrder
    .map(normalizedSubject => {
      if (subjectMap.has(normalizedSubject)) {
        const entry = subjectMap.get(normalizedSubject);
        return [entry.originalName, entry.value];
      }
      return null;
    })
    .filter(entry => entry !== null)
    .concat(
      // Add any subjects not in the standard order
      Array.from(subjectMap.entries())
        .filter(([normalizedSubject]) => !sslcOrder.includes(normalizedSubject))
        .map(([_, entry]) => [entry.originalName, entry.value])
    );
};

// Usage:
const sortedEntries = getSortedEntries(application);

  const entriesToRender = sortedEntries;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/logomain.png" />
          </View>
          <Text style={styles.title}>Carmel Polytechnic College</Text>
          <Text style={styles.subtitle}>
            Application for Polytechnic Admission 2024-2025
          </Text>
          <Text style={{ marginBottom: 4 }}>{application?.title}</Text>
          <Text style={{ fontSize: 8 }}>
            Govt. Management Quota Application No. (www.polyadmission.org): {application?.govtQuotaApplicationNo || "N/A"}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Application Meta */}
        <View style={styles.metaInfo}>
          <Text>Application Number: {application?.generatedId || "Nill"}</Text>
          <Text>
            {application?.course === "X"
              ? `Index Score: ${indexScore ?? ""}`
              : `Score: ${indexScore ?? ""}`}
          </Text>
          {application?.course !== "X" && (
            <Text>Percentage: {percent?.toFixed(2) ?? ""}%</Text>
          )}
          <Text>Fees to be remitted: Rs. {application?.fee}/-</Text>
        </View>

        {/* Branch Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Branch Preference</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 9 }}>
            <Text><Text style={styles.boldText}>Preference 1:</Text> {application?.preferenceOne || "Nill"}</Text>
            <Text><Text style={styles.boldText}>Preference 2:</Text> {application?.preferenceTwo || "Nill"}</Text>
            <Text><Text style={styles.boldText}>Preference 3:</Text> {application?.preferenceThree || "Nill"}</Text>
          </View>
          {(application?.preferenceFour || application?.preferenceFive || application?.preferenceSix) && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 9 }}>
              <Text><Text style={styles.boldText}>Preference 4:</Text> {application?.preferenceFour || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Preference 5:</Text> {application?.preferenceFive || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Preference 6:</Text> {application?.preferenceSix || "Nill"}</Text>
            </View>
          )}
        </View>

        {/* Candidate Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Candidate Profile</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridHalf}>
              <Text><Text style={styles.boldText}>Name of the Applicant:</Text> {application?.firstName || "Nill"} {application?.lastName || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Date of Birth:</Text> {application?.dateOfBirth || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Religion:</Text> {application?.religion || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Email:</Text> {application?.email}</Text>
              <Text><Text style={styles.boldText}>Aadhar Number:</Text> {application?.aadhaarNo || "Nill"}</Text>
            </View>
            <View style={styles.gridHalf}>
              <Text><Text style={styles.boldText}>Gender:</Text> {application?.gender || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Place of Birth:</Text> {application?.placeOfBirth || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Community:</Text> {application?.community || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Phone Number:</Text> {application?.contactNo || "Nill"}</Text>
              <Text><Text style={styles.boldText}>Alternate Phone Number:</Text> {application?.alternateContactNo || "Nill"}</Text>
            </View>
          </View>
          <Text style={{ marginTop: 4 }}>
            <Text style={styles.boldText}>Address:</Text> {`${application?.addressLine1 ?? ""} ${application?.addressLine2 ?? ""}`.trim() || "Nill"}
          </Text>
        </View>

        {/* Academic History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic History</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>Course</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Institution</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Board</Text>
              <Text style={[styles.tableCell, styles.lastCell, { flex: 0.6 }]}>Year</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{application?.course}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{application?.institution}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{application?.universityOrBoard}</Text>
              <Text style={[styles.tableCell, styles.lastCell, { flex: 0.6 }]}>{application?.passedOn}</Text>
            </View>
          </View>
        </View>

        {/* Qualifying Examination */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={styles.boldText}>Qualifying Examination: {application?.course}</Text>
            <Text style={styles.boldText}>Chances taken: {application?.chancesTaken}</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.3 }]}>No.</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Subject</Text>
              <Text style={[styles.tableCell, styles.lastCell, { flex: 0.4 }]}>Grade</Text>
            </View>
            {entriesToRender.map(([subject, grade], index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{subject.replace(/([A-Z])/g, " $1").trim()}</Text>
                <Text style={[styles.tableCell, styles.lastCell, { flex: 0.4 }]}>{grade}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Guardian Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Info</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridHalf}>
              <Text><Text style={styles.boldText}>Name of the Guardian:</Text> {application?.guardian?.name}</Text>
              <Text><Text style={styles.boldText}>Occupation:</Text> {application?.guardian?.occupation}</Text>
              <Text><Text style={styles.boldText}>Phone Number:</Text> {application?.guardian?.phoneNumber}</Text>
            </View>
            <View style={styles.gridHalf}>
              <Text><Text style={styles.boldText}>Relationship with Applicant:</Text> {application?.guardian?.relationship}</Text>
              <Text><Text style={styles.boldText}>Monthly Income:</Text> {application?.guardian?.monthlyIncome}</Text>
                         <Text><Text style={styles.boldText}>Address (Residence):</Text> {`${application?.guardian?.addressLineOne ?? ""} ${application?.guardian?.addressLineTwo ?? ""}`.trim() || "Nill"}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Checklist Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee payment</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 9 }}>
            <Text><Text style={styles.boldText}>Transaction Id: </Text> {application?.transactionId || "Nill"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist for the Applicant</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 0.3 }]}>No.</Text>
              <Text style={[styles.tableCell, { flex: 2.5 }]}>Item</Text>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>Yes/No</Text>
            </View>
            {checklistItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.3 }]}>{index + 1}.</Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{item}</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}></Text>
              </View>
            ))}
          </View>

          <View style={[styles.signatureSection, { marginTop: 30 }]}>
            <Text>Place: _________________________</Text>
            <Text>
              Date: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".")}
            </Text>
            <Text style={{ marginTop: 15 }}>
              Signature of the Candidate: _________________________
            </Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 20,
            right: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 8,
            color: "#555",
            borderTop: "1pt solid #eee",
            paddingTop: 5,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Carmel Polytechnic Admission</Text>
          <Text>Generated on: {new Date().toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function Download() {
  const params = useParams();
  const appId = params?.appId as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) return;

    const fetchApplication = async () => {
      try {
        const docRef = doc(db, "admission_application", appId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApplication({ id: docSnap.id, ...docSnap.data() } as Application);
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
  console.log(application);

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
  ): {
    score: number;
    percentage?: number;
    isEligible?: boolean;
    reason?: string;
  } => {
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
        percentage: (totalMarksObtained / 1200) * 100,
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

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  if (!application)
    return (
      <div className="w-full h-full flex items-center justify-center">
        No application data found
      </div>
    );

  const { score, percentage, isEligible, reason } =
    computeIndexScore(application);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        Your Application PDF is Ready!
      </h2>
      <p className="text-gray-600 mb-4 text-center">
        Click the button below to download your application as a professionally
        formatted PDF.
      </p>
      {application && (
        <PDFDownloadLink
          document={
            <SafePDFDocument
              application={application}
              score={score}
              percent={percentage}
            />
          }
          fileName={`${application.firstName}_Application.pdf`}
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Preparing your document..." : "Download Your PDF"}
            </button>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
}
