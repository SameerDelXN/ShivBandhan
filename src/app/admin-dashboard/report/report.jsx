"use client";
import { useState } from "react";

export default function Issues() {
  const [reports] = useState([
    { id: 1, user: "Rahul", reason: "Fake profile", date: "2025-06-01" },
    { id: 2, user: "Priya", reason: "Inappropriate messages", date: "2025-06-03" },
  ]);

  const [complaints] = useState([
    { id: 1, user: "Amit", issue: "Payment not processed", date: "2025-06-02" },
    { id: 2, user: "Sneha", issue: "Unable to update profile", date: "2025-06-04" },
  ]);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-rose-600">User Reports & Complaints</h2>

      {/* Reports Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports</h3>
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex justify-between text-sm text-gray-700 border-b pb-2"
            >
              <span><strong>{report.user}</strong>: {report.reason}</span>
              <span className="text-gray-500">{report.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Complaints Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Complaints</h3>
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="flex justify-between text-sm text-gray-700 border-b pb-2"
            >
              <span><strong>{complaint.user}</strong>: {complaint.issue}</span>
              <span className="text-gray-500">{complaint.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
