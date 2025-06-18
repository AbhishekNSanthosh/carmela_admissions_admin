"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@lib/firebase";
import { Application } from "../../common/interface/interface";
import Link from "next/link";

export default function ApplicationRanking() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicateIds, setDuplicateIds] = useState<Set<string>>(new Set());
  const [missingIds, setMissingIds] = useState<string[]>([]);

  // Function to extract the numeric part from IDs like "CRML-2025-00045"
  const extractNumber = (id: string): number => {
    const match = id.match(/-(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
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

        // Find duplicate IDs
        const idCounts: Record<string, number> = {};
        rawApps.forEach(app => {
          const id = app.generatedId || "";
          idCounts[id] = (idCounts[id] || 0) + 1;
        });

        const duplicates = new Set<string>();
        Object.entries(idCounts).forEach(([id, count]) => {
          if (count > 1 && id) duplicates.add(id);
        });
        setDuplicateIds(duplicates);

        // Sort by generatedId in ascending order
        rawApps.sort((a, b) => {
          const numA = extractNumber(a.generatedId || "");
          const numB = extractNumber(b.generatedId || "");
          return numA - numB;
        });

        // Find missing IDs in the sequence
        if (rawApps.length > 0) {
          const allNumbers = rawApps
            .map(app => extractNumber(app.generatedId || ""))
            .filter(num => num > 0);
          
          if (allNumbers.length > 0) {
            const minNum = Math.min(...allNumbers);
            const maxNum = Math.max(...allNumbers);
            const missing = [];
            
            for (let i = minNum; i <= maxNum; i++) {
              const expectedId = `CRML-2025-${i.toString().padStart(5, '0')}`;
              if (!rawApps.some(app => app.generatedId === expectedId)) {
                missing.push(expectedId);
              }
            }
            
            setMissingIds(missing);
          }
        }

        setApplications(rawApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getFullName = (app: Application) => `${app.firstName} ${app.lastName}`;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Applications</h1>
        <div className="text-sm text-gray-600">
          Total: {applications.length} applications | 
          Duplicates: {duplicateIds.size} |
          Missing: {missingIds.length}
        </div>
      </div>

      {/* Display missing IDs */}
      {missingIds.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <h3 className="font-bold text-red-700">Missing IDs:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {missingIds.map((id, index) => (
              <span key={index} className="text-red-600 text-sm bg-white px-2 py-1 rounded border border-red-200">
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {applications.map((app, idx) => {
              const isDuplicate = duplicateIds.has(app.generatedId || "");
              return (
                <li
                  key={idx}
                  className={`p-3 border flex-row items-center justify-between rounded text-sm shadow-sm space-y-2 flex ${
                    isDuplicate ? "bg-yellow-100" : "bg-gray-50"
                  }`}
                >
                  <div className="">
                    <strong>
                      {app.generatedId || "N/A"} - {getFullName(app)}
                      {isDuplicate && (
                        <span className="ml-2 text-red-600 text-xs font-semibold">
                          (DUPLICATE ID)
                        </span>
                      )}
                    </strong>
                    <div>Course: {app.course}</div>
                    <div>Category: {app.category || "N/A"}</div>
                    <div>Email: {app.email}</div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/dashboard/application/view/${app?.appId}`}
                      className="text-white bg-primary-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center"
                    >
                      View Application
                    </Link>
                    {app?.certificateUrl && (
                      <Link
                        href={app.certificateUrl}
                        target="_blank"
                        className="text-primary-600 border-[2px] border-primary-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      >
                        View Certificate
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/application/download/${app?.appId}`}
                      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center"
                    >
                      Download
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}