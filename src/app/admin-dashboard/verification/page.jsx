"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Verification() {
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    family: true,
    horoscope: true,
    expectations: true
  });
  const [showFullImage, setShowFullImage] = useState(false);

  // Calculate age from birth date
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Fetch profiles from API and calculate ages
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/admin/pendingProfile");
        const data = await res.json();
        if (res.ok) {
          const profilesWithAge = data.users.map(profile => ({
            ...profile,
            age: calculateAge(profile.dob) || profile.age
          }));
          setPendingProfiles(profilesWithAge);
        } else {
          console.error("Fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles();
  }, []);

  // Accept or Reject verification
  const handleVerification = async (userId, action) => {
    try {
      const res = await fetch('/api/admin/verifyProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        setPendingProfiles(prev => prev.filter(user => user._id !== userId));
        alert(`User ${action.toLowerCase()} successfully!`);
      }
    } catch (error) {
      alert('Failed to update verification status');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="relative p-6 bg-gray-50 min-h-screen">
      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedProfile?.profilePhoto || "/images/default-user.jpg"}
                alt={selectedProfile?.name}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pending Verifications</h1>
          <div className="text-sm bg-gradient-to-r from-rose-100 to-blue-100 text-rose-800 px-4 py-2 rounded-full">
            {pendingProfiles.length} pending
          </div>
        </div>
        
        {pendingProfiles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No profiles pending verification</h3>
            <p className="text-gray-500 mt-1">All profiles are verified and up to date</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pendingProfiles.map((u) => (
              <motion.div
                key={u._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedProfile(u)}
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-rose-300 overflow-hidden relative">
                        <img
                          src={u.profilePhoto || "/images/default-user.jpg"}
                          alt={u.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/default-user.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{u.name}</h2>
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">{u.email || u.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {u.age} • {u.gender} • {u.currentCity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {u.verificationStatus}
                    </span>
                    <div className="relative w-1/2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-rose-400 rounded-full" 
                          style={{ width: `${u.profileCompletion}%` }}
                        />
                      </div>
                      <span className="absolute -top-5 right-0 text-xs font-medium text-gray-500">
                        {u.profileCompletion}% complete
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProfile(u)}
                      className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex-1 border border-gray-200 transition-colors"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Detailed Profile Modal */}
        <AnimatePresence>
          {selectedProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row gap-0">
                  {/* Left Column - Profile Info */}
                  <div className="md:w-1/3 bg-gradient-to-b from-rose-50 to-blue-50 p-6 sticky top-0">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center cursor-pointer"
                    >
                      <div 
                        className="relative mx-auto w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden mb-5"
                        onClick={() => setShowFullImage(true)}
                      >
                        <img
                          src={selectedProfile.profilePhoto || "/images/default-user.jpg"}
                          alt={selectedProfile.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/default-user.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedProfile.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedProfile.email || selectedProfile.phone}
                      </p>
                      
                      <div className="mt-6 flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleVerification(selectedProfile._id, "Verified");
                            setSelectedProfile(null);
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle size={18} /> Approve Verification
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleVerification(selectedProfile._id, "Rejected");
                            setSelectedProfile(null);
                          }}
                          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <XCircle size={18} /> Reject Profile
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="md:w-2/3 p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-0 rounded-lg border border-gray-100 overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleSection('basic')}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                        {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      <AnimatePresence>
                        {expandedSections.basic && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <DetailItem label="Age" value={selectedProfile.age} />
                              <DetailItem label="Gender" value={selectedProfile.gender} />
                              <DetailItem label="Date of Birth" value={selectedProfile.dob && new Date(selectedProfile.dob).toLocaleDateString()} />
                              <DetailItem label="Height" value={selectedProfile.height} />
                              <DetailItem label="Religion" value={selectedProfile.religion} />
                              <DetailItem label="Caste" value={selectedProfile.caste} />
                              <DetailItem label="Sub Caste" value={selectedProfile.subCaste} />
                              <DetailItem label="Mother Tongue" value={selectedProfile.motherTongue} />
                              <DetailItem label="Marital Status" value={selectedProfile.maritalStatus} />
                              <DetailItem label="Location" value={selectedProfile.currentCity} />
                              <DetailItem label="Education" value={selectedProfile.education} />
                              <DetailItem label="Occupation" value={selectedProfile.occupation} />
                              <DetailItem label="Income" value={selectedProfile.income} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Family Info */}
                    <div className="bg-white p-0 rounded-lg border border-gray-100 overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleSection('family')}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">Family Information</h3>
                        {expandedSections.family ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      <AnimatePresence>
                        {expandedSections.family && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <DetailItem label="Father's Name" value={selectedProfile.fatherName} />
                              <DetailItem label="Mother's Name" value={selectedProfile.mother} />
                              <DetailItem label="Brothers" value={`${selectedProfile.brothers} (${selectedProfile.marriedBrothers} married)`} />
                              <DetailItem label="Sisters" value={`${selectedProfile.sisters} (${selectedProfile.marriedSisters} married)`} />
                              <DetailItem label="Native City" value={selectedProfile.nativeCity} />
                              <DetailItem label="Native District" value={selectedProfile.nativeDistrict} />
                              <DetailItem label="Parent Occupation" value={selectedProfile.parentOccupation} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Horoscope Info */}
                    {(selectedProfile.rashi || selectedProfile.nakshira) && (
                      <div className="bg-white p-0 rounded-lg border border-gray-100 overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleSection('horoscope')}
                        >
                          <h3 className="text-lg font-semibold text-gray-800">Horoscope Details</h3>
                          {expandedSections.horoscope ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <AnimatePresence>
                          {expandedSections.horoscope && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-4 pb-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem label="Rashi" value={selectedProfile.rashi} />
                                <DetailItem label="Nakshira" value={selectedProfile.nakshira} />
                                <DetailItem label="Charan" value={selectedProfile.charan} />
                                <DetailItem label="Gan" value={selectedProfile.gan} />
                                <DetailItem label="Nadi" value={selectedProfile.nadi} />
                                <DetailItem label="Mangal" value={selectedProfile.mangal ? "Yes" : "No"} />
                                <DetailItem label="Gotra" value={selectedProfile.gothra} />
                                <DetailItem label="Gotra Devak" value={selectedProfile.gotraDevak} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Expectations */}
                    <div className="bg-white p-0 rounded-lg border border-gray-100 overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleSection('expectations')}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">Partner Expectations</h3>
                        {expandedSections.expectations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      <AnimatePresence>
                        {expandedSections.expectations && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <DetailItem label="Expected Age Range" value={`${selectedProfile.preferences?.ageRange?.min || 'N/A'} - ${selectedProfile.preferences?.ageRange?.max || 'N/A'}`} />
                              <DetailItem label="Expected Caste" value={selectedProfile.expectedCaste} />
                              <DetailItem label="Expected Education" value={selectedProfile.expectedEducation} />
                              <DetailItem label="Expected Height" value={selectedProfile.expectedHeight} />
                              <DetailItem label="Expected Income" value={selectedProfile.expectedIncome} />
                              <DetailItem label="Preferred City" value={selectedProfile.preferredCity} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper component for displaying detail items
function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </p>
    </div>
  );
}