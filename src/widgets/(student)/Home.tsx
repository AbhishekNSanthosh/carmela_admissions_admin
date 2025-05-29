"use client";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { app } from "@lib/firebase";
import { Application } from "../../common/interface/interface";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const db = getFirestore(app);

  const [stats, setStats] = useState({
    total: 0,
    mgmtLateral: 0,
    meritLateral: 0,
    mgmtRegular: 0,
    meritRegular: 0,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admission_application"));
        const applications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];

        setAllApplications(applications);

        const counts = {
          total: applications.length,
          mgmtLateral: applications.filter(app => app.category === "management_quota_lateral_entry").length,
          meritLateral: applications.filter(app => app.category === "management_merit_lateral_entry").length,
          mgmtRegular: applications.filter(app => app.category === "management_quota_regular").length,
          meritRegular: applications.filter(app => app.category === "management_merit_regular").length,
        };

        setStats(counts);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Total Applications" value={stats.total} />
      <StatCard title="Mgmt Quota - Lateral Entry" value={stats.mgmtLateral} />
      <StatCard title="Mgmt Merit - Lateral Entry" value={stats.meritLateral} />
      <StatCard title="Mgmt Quota - Regular" value={stats.mgmtRegular} />
      <StatCard title="Mgmt Merit - Regular" value={stats.meritRegular} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}
