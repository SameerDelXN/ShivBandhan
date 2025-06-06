"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Verification() {
  const [verifiedProfiles, setVerifiedProfiles] = useState([]);

  useEffect(() => {
    setVerifiedProfiles([
      {
        id: 101,
        name: "Sneha Gupta",
        email: "sneha@example.com",
        age: 28,
        gender: "Female",
        location: "Pune",
        photo: "https://randomuser.me/api/portraits/women/62.jpg",
        profileCompletion: 100,
      },
      {
        id: 102,
        name: "Arjun Mehta",
        email: "arjun@example.com",
        age: 30,
        gender: "Male",
        location: "Mumbai",
        photo: "https://randomuser.me/api/portraits/men/46.jpg",
        profileCompletion: 100,
      },
    ]);
  }, []);

  const handleVerification = (id, action) => {
    setVerifiedProfiles((prev) => prev.filter((u) => u.id !== id));
    alert(`Profile ${action === "accept" ? "accepted" : "rejected"}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {verifiedProfiles.length === 0 && (
          <p className="text-gray-500">No profiles ready for verification.</p>
        )}
        {verifiedProfiles.map((u) => (
          <div
            key={u.id}
            className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-6"
          >
            {/* User Image */}
            <img
              src={u.photo}
              alt={u.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-rose-400 flex-shrink-0"
            />

            {/* User Details stacked vertically */}
            <div className="flex flex-col flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{u.name}</h2>
              <p className="text-sm text-gray-600 truncate">{u.email}</p>
              <p className="text-sm text-gray-600">
                {u.age} • {u.gender} • {u.location}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Completion: {u.profileCompletion}%
              </p>
            </div>

            {/* Buttons aligned vertically on right */}
            <div className="flex flex-col space-y-3 flex-shrink-0">
              <button
                onClick={() => handleVerification(u.id, "accept")}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle size={18} /> Accept
              </button>
              <button
                onClick={() => handleVerification(u.id, "reject")}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
