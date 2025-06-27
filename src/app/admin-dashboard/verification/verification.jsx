"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Verification() {
  const [verifiedProfiles, setVerifiedProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
    setSelectedProfile(null);
    alert(`Profile ${action === "accept" ? "accepted" : "rejected"}`);
  };

  return (
    <div className="space-y-6 relative">
      {verifiedProfiles.length === 0 && (
        <p className="text-gray-500">No profiles ready for verification.</p>
      )}

      {/* Profile Cards (unchanged layout) */}
      {verifiedProfiles.map((u) => (
        <div
          key={u.id}
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 relative"
        >
          <div
            className="flex items-center gap-4 flex-1 cursor-pointer"
            onClick={() => setSelectedProfile(u)}
          >
            <img
              src={u.photo}
              alt={u.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-rose-400"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{u.name}</h2>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-sm text-gray-600">
                {u.age} • {u.gender} • {u.location}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Completion: {u.profileCompletion}%
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => handleVerification(u.id, "accept")}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={18} /> Accept
            </button>
            <button
              onClick={() => handleVerification(u.id, "reject")}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <XCircle size={18} /> Reject
            </button>
          </div>
        </div>
      ))}

      {/* Modal with blurred background */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-[500px] p-6 relative">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <img
                src={selectedProfile.photo}
                alt={selectedProfile.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-rose-500"
              />
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {selectedProfile.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedProfile.email}</p>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p><strong>User ID:</strong> {selectedProfile.id}</p>
              <p><strong>Age:</strong> {selectedProfile.age}</p>
              <p><strong>Gender:</strong> {selectedProfile.gender}</p>
              <p><strong>Location:</strong> {selectedProfile.location}</p>
              <p><strong>Profile Completion:</strong> {selectedProfile.profileCompletion}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
