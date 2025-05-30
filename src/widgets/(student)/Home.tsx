"use client";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { app } from "@lib/firebase"; // adjust path to your firebase config
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Application } from "../../common/interface/interface";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [applicationFound, setApplicationFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    const checkApplication = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "admission_application"),
          where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);

        const applications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Store all applications
        setAllApplications(applications as Application[]);

        // If you still want to store the latest application separately
        if (applications.length > 0) {
          setAllApplications(applications as Application[]);
          setApplicationFound(true);
        } else {
          setApplicationFound(false);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
        console.log(allApplications);
      }
    };

    checkApplication();
  }, []);

  const handleCreateNew = () => {
    setShowModal(true);
  };

  const handleOptionSelect = (option: string) => {
    setShowModal(false);
    router.push(`/`);
  };

  if (loading) {
    return (
      <div className="w-full h-full items-center justify-center flex">
        Loading...
      </div>
    );
  }

  if (!applicationFound) {
    return (
      <div className="flex flex-col items-center justify-center h-full relative">
        <p className="mb-4 text-lg">You haven't submitted any application.</p>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed w-[85vw] h-[88vh] backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-[25vw]">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Select Admission Type
              </h2>
              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                  <Link
                    href={"/dashboard/application/management/lateral-entry"}
                    className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                  >
                    Management Quota - Lateral Entry
                  </Link>
                  <Link
                    href={
                      "/dashboard/application/management/merit-lateral-entry"
                    }
                    className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                  >
                    Management Merit - Lateral Entry
                  </Link>
                  <Link
                    href={"/dashboard/application/management/regular"}
                    className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                  >
                    Management Quota - Regular
                  </Link>
                  <Link
                    href={"/dashboard/application/management/merit-regular"}
                    className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                  >
                    Management Merit - Regular
                  </Link>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-[15px] text-sm text-red-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 flex flex-col h-full gap-4">
      <div className="">
        {/* Create New Application Card */}
        <div className="bg-white w-full md:w-[25vw] border-2 border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-blue-50 transition">
          <p className="text-blue-600 font-semibold mb-2 text-center">
            Want to create a new application?
          </p>
          <button
            onClick={() => {
              setShowModal(true);
            }} // <-- implement this function
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md mt-2"
          >
            Create New Application
          </button>
        </div>
      </div>
      <div className="">
        <span className="text-lg md:text-xl font-semibold">
          Recent Applications
        </span>
      </div>
      {showModal && (
        <div className="fixed w-[95vw] md:w-[85vw] h-[88vh] backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full  md:w-[25vw]">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Select Admission Type
            </h2>
            <div className="flex flex-col space-y-5">
              <div className="flex flex-col space-y-3">
                <Link
                  href={"/dashboard/application/management/lateral-entry"}
                  className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                >
                  Management Quota - Lateral Entry
                </Link>
                <Link
                  href={"/dashboard/application/management/merit-lateral-entry"}
                  className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                >
                  Management Merit - Lateral Entry
                </Link>
                <Link
                  href={"/dashboard/application/management/regular"}
                  className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                >
                  Management Quota - Regular
                </Link>
                <Link
                  href={"/dashboard/application/management/merit-regular"}
                  className="px-4 py-3 bg-primary-600 text-white rounded hover:bg-blue-700"
                >
                  Management Merit - Regular
                </Link>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-[15px] text-sm text-red-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid mt-2 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {allApplications.slice(0, 5).map((app, index) => (
          <div
            key={app.id || index}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              {app?.firstName ? (
                <>
                  {" "}
                  {app.firstName} {app.lastName}
                </>
              ) : (
                "N/A"
              )}
            </h3>
            <p className="text-gray-600 text-sm">Email: {app.email}</p>
            <p className="text-gray-600 text-sm">
              Submitted on: {app.createdAt?.toDate().toLocaleString() || "N/A"}
            </p>
            <p className="text-gray-600 text-sm">
              Application ID: {app.generatedId || "N/A"}
            </p>
          </div>
        ))}
        <div className="bg-white w-full mb-5 md:w-[25vw] border-2 border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-blue-50 transition">
          <Link
            href={"/dashboard/application"}
            onClick={() => {
              setShowModal(true);
            }} // <-- implement this function
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md mt-2"
          >
            View all applications
          </Link>
        </div>
      </div>
    </div>
  );
}
