"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@lib/firebase";
import { Application } from "../../common/interface/interface";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  // Data for Pie Chart
  const pieData = [
    { name: "Mgmt Quota - Lateral", value: stats.mgmtLateral },
    { name: "Mgmt Merit - Lateral", value: stats.meritLateral },
    { name: "Mgmt Quota - Regular", value: stats.mgmtRegular },
    { name: "Mgmt Merit - Regular", value: stats.meritRegular },
  ];

  // Data for Bar Chart
  const barData = [
    { name: "Mgmt Lateral", applications: stats.mgmtLateral },
    { name: "Merit Lateral", applications: stats.meritLateral },
    { name: "Mgmt Regular", applications: stats.mgmtRegular },
    { name: "Merit Regular", applications: stats.meritRegular },
  ];

  // Color palette for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Applications" value={stats.total} />
        <StatCard title="Mgmt Quota - Lateral" value={stats.mgmtLateral} />
        <StatCard title="Mgmt Merit - Lateral" value={stats.meritLateral} />
        <StatCard title="Mgmt Quota - Regular" value={stats.mgmtRegular} />
        <StatCard title="Mgmt Merit - Regular" value={stats.meritRegular} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#8884d8" name="Applications">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
    </div>
  );
}