"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@lib/firebase";
import { Application } from "../../common/interface/interface";
import Link from "next/link";

export default function ApplicationRanking() {
  const [applicationsWithScore, setApplicationsWithScore] = useState<
    (Application & { indexScore?: number })[]
  >([]);
  const [currentTab, setCurrentTabs] = useState("management_merit_regular");
  const [loading, setLoading] = useState(true);

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

    if (gradeMap[mark]) {
      return gradeMap[mark];
    }

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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(
          collection(db, "admission_application")
        );
        const rawApps: Application[] = querySnapshot.docs.map((doc) => ({
          appId: doc.id,
          ...(doc.data() as Application),
        }));

        const coreSubjectsX = [
          "mathematics",
          "physics",
          "chemistry",
          "science",
          "english",
        ];
        const coreSubjectsXII = ["mathematics", "physics", "chemistry"];

        const withIndexScores = rawApps.map((app) => {
          const marks = app.marks || {};

          if (app?.course?.toLowerCase().includes("xii")) {
            const coreSubjectsXII = ["mathematics", "physics", "chemistry"];
            const requiredPercentage = 0.5; // 50%

            // Check if all core subjects are present
            const hasAllCoreSubjects = coreSubjectsXII.every((subject) =>
              Object.keys(marks).some(
                (markSubject) => markSubject.trim().toLowerCase() === subject
              )
            );

            if (!hasAllCoreSubjects) {
              return {
                ...app,
                indexScore: 0,
                courseType: "XII",
                isEligible: false,
                reason: "Missing core subjects",
              };
            }

            // Calculate total marks obtained (convert all marks to numbers)
            const totalMarksObtained = Object.values(marks).reduce(
              (sum, mark) => sum + (parseFloat(mark.toString()) || 0),
              0
            );

            // Convert totalofMaxMarks from string to number
            const maxMarks =
              parseFloat(app?.totalofMaxMarks?.toString() || "0") || 0;

            // Check if total marks meet 50% requirement
            const isEligible = totalMarksObtained >= 1200 * requiredPercentage;

            return {
              ...app,
              indexScore: totalMarksObtained,
              percentage: (totalMarksObtained / 1200) * 100,
              courseType: "XII",
              isEligible,
              reason: isEligible
                ? "Eligible"
                : `Marks below 50% requirement (${totalMarksObtained}/${maxMarks})`,
              maxMarks, // Adding maxMarks to the output for reference
            };
          } else if (app?.course?.toLowerCase().includes("iti")) {
            // Calculate total marks obtained (convert all marks to numbers)
            const totalMarksObtained = Object.values(marks).reduce(
              (sum, mark) => sum + (parseFloat(mark.toString()) || 0),
              0
            );

            // Convert totalofMaxMarks from string to number
            const maxMarks =
              parseFloat(app?.totalofMaxMarks?.toString() || "0") || 0;

            // Check if total marks meet 50% requirement
            const isEligible = totalMarksObtained >= maxMarks * 0.5;

            return {
              ...app,
              indexScore: totalMarksObtained, // Using actual marks sum instead of calculated score
              courseType: "ITI",
              isEligible,
              percentage: (totalMarksObtained / maxMarks) * 100,
              reason: isEligible
                ? "Eligible"
                : `Not Eligible (${totalMarksObtained}/${maxMarks} = ${(
                    (totalMarksObtained / maxMarks) *
                    100
                  ).toFixed(2)}%)`,
              maxMarks, // Including for reference
            };
          } else {
            // Default calculation for X standard
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
                ? (corePoints.reduce((a, b) => a + b, 0) / corePoints.length) *
                  0.85
                : 0;

            const otherAvg =
              otherPoints.length > 0
                ? (otherPoints.reduce((a, b) => a + b, 0) /
                    otherPoints.length) *
                  0.15
                : 0;

            const indexScore = parseFloat((coreAvg + otherAvg).toFixed(10)); // Preserves up to 10 decimal places

            return {
              ...app,
              indexScore,
              courseType: "X",
            };
          }
        });

        setApplicationsWithScore(withIndexScores);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getFullName = (app: Application) => `${app.firstName} ${app.lastName}`;

  const tabs = [
    {
      title: "Management Merit - Regular",
      category: "management_merit_regular",
    },
    {
      title: "Management Quota - Regular",
      category: "management_quota_regular",
    },
    {
      title: "Management Merit - Lateral Entry",
      category: "management_merit_lateral_entry",
    },
    {
      title: "Management Quota - Lateral Entry",
      category: "management_quota_lateral_entry",
    },
  ];

  console.log(applicationsWithScore);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      <div className="flex border-b border-gray-300 gap-2 flex-wrap">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setCurrentTabs(tab.category)}
            className={`px-4 py-2 cursor-pointer font-medium border-b-2 rounded-t-md
              ${
                currentTab === tab.category
                  ? "border-transparent text-white bg-primary-600"
                  : "border-blue-500 text-blue-600 bg-white"
              }`}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {applicationsWithScore
              .filter((app) => app.category === currentTab)
              .sort((a, b) => (b.indexScore ?? 0) - (a.indexScore ?? 0))
              .map((app, idx) => (
                <li
                  key={idx}
                  className="p-3 border flex-row items-center justify-between rounded bg-gray-50 text-sm shadow-sm space-y-2 flex"
                >
                  <div className="">
                    <strong>
                      #{idx + 1}. {getFullName(app)}
                    </strong>
                    <div>Course: {app.course}</div>
                    <div>Email: {app.email}</div>
                    {app?.course === "X" && (
                      <div>
                        Index Score:{" "}
                        <span className="font-medium">
                          {app.indexScore ?? "N/A"}
                        </span>
                      </div>
                    )}
                    {app?.course !== "X" && (
                      <div>
                        Score:{" "}
                        <span className="font-medium">
                          {app.indexScore ?? "N/A"}/1200
                        </span>
                      </div>
                    )}
                    {app?.course?.toLocaleLowerCase() !== "x" && (
                      <div>
                        <span className="font-medium">
                          <div>
                            Status:{" "}
                            {app?.reason === "Eligible" ? (
                              <span className="font-semibold text-green-800">
                                {app?.reason}
                              </span>
                            ) : (
                              <span className="font-semibold">
                                {app?.reason}
                              </span>
                            )}{" "}
                          </div>
                        </span>
                      </div>
                    )}
                    {app?.course?.toLocaleLowerCase() !== "x" && (
                      <div>
                        <span className="font-medium">
                          <div>
                            Percentage: {Number(app?.percentage).toFixed(2)}%
                          </div>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/dashboard/application/view/${app?.appId}`}
                      className="text-white bg-primary-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      View Application
                    </Link>
                    <Link
                      href={`/dashboard/application/download/${app?.appId}`}
                      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Download Application
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
