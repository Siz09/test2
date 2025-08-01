import React, { useState,useEffect  } from "react";
import PartnerRequests from "./PartnerRequests";
import RecentBookings from "./RecentBookings";



const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
   const [stats, setStats] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("jwtToken");  // Ensure the key matches how you saved it at login

  if (!token) {
    console.error("No JWT token found, user might not be logged in");
    return;
  }

  fetch("http://localhost:8080/api/stats", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setStats([
        { label: "Users", value: data.users },
        { label: "Partners", value: data.partners },
        { label: "Venues", value: data.venues },
        { label: "Bookings", value: data.bookings },
      ]);
    })
    .catch(console.error);
}, []);

  return (
    <main className="dashboard" style={{ flex: 1 }}>
      <div className="breadcrumb">Admin > Dashboard</div>
      <h1>Admin Dashboard</h1>
      <p>Manage the entire platform</p>
      <div className="stats-row">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Partners
        </button>
        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Recent Bookings
        </button>
      </div>
      {activeTab === "pending" ? <PartnerRequests /> : <RecentBookings />}
    </main>
  );
};

export default Dashboard;