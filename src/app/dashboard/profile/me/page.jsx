"use client"
import { useState, useEffect } from 'react';
import { User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin, Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff, UserCheck, Upload, Briefcase, GraduationCap, Home, Users, Search, Clock, Bell, Shield, ChevronRight, Plus, X, AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
//sample
export default function MyProfilePage() {
  const { user } = useSession();
  
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [isVisible, setIsVisible] = useState(true);
  const [updatedSurname, setUpdatedSurname] = useState('');
  const [filteredSurname, setFilteredSurname] = useState('');
  const [showCompletionUpdate, setShowCompletionUpdate] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('Unverified');
  const [photos, setPhotos] = useState([
    { id: 1, url: user?.profilePhoto || null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);
  
console.log("User Data", user)
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      setIsLoaded(true);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (user?.user?.id) {
      setFormData(prev => ({
        ...prev,
        userId: user.user.id,
        
      }));
    }
  }, [user]);

 
    
  const calculateCompletion = (section) => {
    if (!formData) return 0; 
    const fields = {
      basic: ['name', 'dob', 'height', 'gender', 'maritalStatus', 'motherTongue', 'currentCity', 'weight', 'email', 'permanentAddress', 'wearsLens', 'bloodGroup', 'complexion'],
      religious: ['religion', 'caste', 'subCaste', 'gothra'],
      education: ['education', 'fieldOfStudy', 'college', 'occupation', 'company', 'income'],
      relative: ['fatherName', 'parentResidenceCity', 'mother', 'brothers', 'marriedBrothers', 'sisters', 'marriedSisters', 'nativeDistrict', 'nativeCity', 'familyWealth', 'relativeSurname', 'parentOccupation', 'mamaSurname',],
      horoscope: ['rashi', 'nakshira', 'charan', 'gan', 'nadi', 'mangal', 'birthPlace', 'birthTime', 'gotraDevak'],
      expectations: ['expectedCaste', 'preferredCity', 'expectedAgeDifference', 'expectedEducation', 'divorcee', 'expectedHeight', 'expectedIncome',]
    };
  

    if (!fields[section]) return 0;
    
    const sectionFields = fields[section];
    const filledFields = sectionFields.filter(field => {
      const value = formData[field];
      return value !== null && value !== undefined && value !== '';
    }).length;

    return Math.round((filledFields / sectionFields.length) * 100);
  };
  useEffect(() => {
  if (formData && Object.keys(formData).length > 0) {
    const sections = getProfileSections(formData);
    const totalCompletion = sections.reduce(
      (sum, section) => sum + section.completion, 
      0
    ) / sections.length;
    
    setProfileCompletion(Math.round(totalCompletion));
  }
}, [formData]); // Recalculate when formData changes
  const getProfileSections = (formData) => {
    return [
      { 
        id: 'basic', 
        label: 'Basic Information', 
        icon: User,
        completion: calculateCompletion('basic',formData)
      },
      { 
        id: 'religious', 
        label: 'Religious & Community', 
        icon: Star,
        completion: calculateCompletion('religious',formData) 
      },
      { 
        id: 'education', 
        label: 'Education & Profession', 
        icon: GraduationCap,
        completion: calculateCompletion('education',formData) 
      },
       { 
        id: 'relative', 
        label: 'Relative Info', 
        icon: Users,
        completion: calculateCompletion('relative',formData) 
      },
      { 
        id: 'horoscope', 
        label: 'Horoscope Info', 
        icon: Sparkles,
        completion: calculateCompletion('horoscope',formData) 
      },
      { 
        id: 'expectations', 
        label: 'Expectations', 
        icon: Heart,
        completion: calculateCompletion('expectations',formData) 
      },
    ];
  };

  const recentActivity = [
    { type: "view", message: "12 people viewed your profile today", time: "2 hours ago", icon: Eye },
    { type: "match", message: "3 new matches found", time: "5 hours ago", icon: Star },
    { type: "interest", message: "2 new interests received", time: "1 day ago", icon: Heart },
  ];

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      console.log("User Data: profile", data);
      setProfileCompletion(data.profileCompletion || 0);
      setVerificationStatus(data.verificationStatus || 'Unverified');
     

      const InitailFormData = {
        name: data.name || '',
        dob: data.dob || '',
        height: data.height || '',
        gender: data.gender || '',
        maritalStatus: data.maritalStatus || '',
        motherTongue: data.motherTongue || '',
        currentCity: data.currentCity || '',
        religion: data.religion || '',
        caste: data.caste || '',
        subCaste: data.subCaste || '',
        gothra: data.gothra || '',
        education: data.education || '',
        fieldOfStudy: data.fieldOfStudy || '',
        college: data.college || '',
        occupation: data.occupation || '',
        company: data.company || '',
        income: data.income || '',
        weight: data.weight || '',
        email: data.email || '',
        wearsLens: data.wearsLens || false,
        bloodGroup: data.bloodGroup || '',
        complexion: data.complexion || '',
        permanentAddress: data.permanentAddress || '',
        userId: user?.user?.id || '',
        verificationStatus: data?.verificationStatus || 'Unverified',
profilePhoto:data?.profilePhoto || "",
         // Relative Info
        fatherName: data.fatherName || '',
        parentResidenceCity: data.parentResidenceCity || '',
        mother: data.mother || '',
        brothers: data.brothers || 0,
        marriedBrothers: data.marriedBrothers || 0,
        sisters: data.sisters || 0,
        marriedSisters: data.marriedSisters || 0,
        nativeDistrict: data.nativeDistrict || '',
        nativeCity: data.nativeCity || '',
        familyWealth: data.familyWealth || '',
        relativeSurname: data.relativeSurname || '',
        parentOccupation: data.parentOccupation || '',
        mamaSurname: data.mamaSurname || '',
        // Horoscope Info
        rashi: data.rashi || '',
        nakshira: data.nakshira || '',
        charan: data.charan || '',
        gan: data.gan || '',
        nadi: data.nadi || '',
        mangal: data.mangal || false,
        birthPlace: data.birthPlace || '',
        birthTime: data.birthTime || '',
        gotraDevak: data.gotraDevak || '',
        
        // Expectations
        expectedCaste: data.expectedCaste || '',
        preferredCity: data.preferredCity || '',
        expectedAgeDifference: data.expectedAgeDifference || '',
        expectedEducation: data.expectedEducation || '',
        divorcee: data.divorcee || false,
        expectedHeight: data.expectedHeight || '',
        expectedIncome: data.expectedIncome || '',
      };
      setFormData(InitailFormData)
      // Calculate initial profile completion
      const sections = getProfileSections(InitailFormData);
      const totalCompletion = sections.reduce(
        (sum, section) => sum + section.completion, 
        0
      ) / sections.length;
      
      setProfileCompletion(Math.round(totalCompletion));
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfileUpdate = async () => {


    const prevCompletion = profileCompletion;
    setIsSaving(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.user?.id || user?.id
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const result = await response.json();
      
      // Calculate new completion percentages
      const updatedSections = getProfileSections();
      const totalCompletion = updatedSections.reduce(
        (sum, section) => sum + section.completion, 
        0
      ) / updatedSections.length;
      
      setProfileCompletion(Math.round(totalCompletion));
      
      // Show completion update notification if increased
      if (Math.round(totalCompletion) > prevCompletion) {
        setShowCompletionUpdate(true);
        setTimeout(() => setShowCompletionUpdate(false), 1000);
      }
      // If profile completion reaches 100% after save, automatically trigger verification
      if (Math.round(totalCompletion) === 100 && prevCompletion < 100 && verificationStatus === 'Unverified') {
        await handleVerificationSubmit();
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.user?.id,
          verificationStatus: 'Pending',
          createdAt: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit verification');
      
      const result = await response.json();
      setVerificationStatus(true);
    } catch (error) {
      console.error("Error submitting verification:", error);
    }
  };

const handlePhotoUploadSuccess = (result, photoId) => {
  const url = result.info.secure_url;
  
  // Update photos state
  setPhotos(prevPhotos => 
    prevPhotos.map(photo =>
      photo.id === photoId
        ? { ...photo, url }
        : photo
    )
  );
  
  // If this is the primary photo (id=1), update formData
  if (photoId === 1) {
    setFormData(prev => ({
      ...prev,
      profilePhoto: url
    }));
  }
};

  const handleMakePrimary = (photoId) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    })));
  };

  function VerificationBadge({ status }) {
    const statusConfig = {
      Unverified: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: null,
        label: 'Unverified'
      },
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-3 h-3 mr-1" />,
        label: 'Pending Verification'
      },
      Verified: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <Shield className="w-3 h-3 mr-1" />,
        label: 'Verified Profile'
      },
      Rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-3 h-3 mr-1" />,
        label: 'Verification Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig.Unverified;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  }
 function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  console.log(formData)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    value={formData?.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='Enter your full name'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                   type="date"
                   value={formatDateToYYYYMMDD(formData?.dob)}
                   onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                   />

                </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                 <select
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                 >
                 <option value="">Select Height</option>
                   {Array.from({ length: 24 }, (_, i) => {
                   // Starting from 4'6" (138cm) to 6'5" (196cm)
                     const feet = 4 + Math.floor((i + 6) / 12);
                      const inches = (i + 6) % 12;
                      const cm = Math.round((feet * 30.48) + (inches * 2.54));
                      return (
                          <option 
                             key={i} 
                              value={`${feet}'${inches}" (${cm} cm)`}
                           >
                           {feet}'{inches}" ({cm} cm)
                            </option>
                            );
                        })}
                  </select>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">weight</label>
                  <input 
                    type="text"
                    value={formData?.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Enter your weight"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData?.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select
                  value={formData?.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                <input
                  type="text"
                  value={formData?.complexion}
                  onChange={(e) => setFormData({ ...formData, complexion: e.target.value })}
                  placeholder="E.g. Fair, Wheatish, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    value={formData?.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option>Unmarried</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                  <select
                    value={formData?.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select language</option>
                    <option>Hindi</option>
                    <option>English</option>
                    <option>Marathi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current City</label>
                  <input 
                    type="text"
                    value={formData?.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                       <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email"
                  value={formData?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Address</label>
                  <input 
                    type="text"
                    value={formData?.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    placeholder='Enter your permanent address'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wears Lens</label>
                <select
                  value={formData?.wearsLens ? 'Yes' : 'No'}
                  onChange={(e) => setFormData({ ...formData, wearsLens: e.target.value === 'Yes' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              </div>
            </div>
          </div>
        );

      case 'religious':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <select
                    value={formData?.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Religion</option>
                    <option>Hindu</option>
                    <option>Muslim</option>
                    <option>Christian</option>
                    <option>Sikh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                  <input 
                    type="text"
                    value={formData?.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                    placeholder="Enter your caste" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-caste</label>
                  <input
                    type="text"
                    value={formData?.subCaste || ""}
                    onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })}
                    placeholder="Enter your sub-caste"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gothra</label>
                  <input 
                    type="text"
                    value={formData?.gothra}
                    onChange={(e) => setFormData({ ...formData, gothra: e.target.value })}
                    placeholder="Enter your gothra" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
                  <select
                    value={formData?.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input 
                    type="text"
                    value={formData?.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder='Enter your study field'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                  <input 
                    type="text"
                    value={formData?.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder='Enter your college name'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input 
                    type="text"
                    value={formData?.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder='Enter your occupation'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input 
                    type="text"
                    value={formData?.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder='Enter your company name'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <select
                    value={formData?.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Income</option>
                    <option>₹5-10 Lakhs</option>
                    <option>₹10-15 Lakhs</option>
                    <option>₹15-20 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Add more photos to increase profile visibility</p>
                  <p className="text-xs text-amber-700 mt-1">Profiles with 3+ photos get 5x more interest!</p>
                </div>
              </div>
            </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {photos.map((photo) => (
    <div key={photo.id} className="relative">
      <CldUploadWidget
        uploadPreset="shivbandhan"
        options={{
          multiple: false,
          sources: ['local'],
          maxFiles: 1
        }}
        onSuccess={(result) => handlePhotoUploadSuccess(result, photo.id)}
      >
        {({ open }) => (
          <div>
            <div 
              className="aspect-[4/5] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden cursor-pointer"
              onClick={() => open()}
            >
              {photo.url ? (
                <img 
                  src={photo.url} 
                  alt={`Photo ${photo.id}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Add Photo</p>
                </div>
              )}
              {photo.isPrimary && photo.url && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Primary
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => open()}
                className="w-full bg-rose-50 text-rose-600 py-1 px-2 rounded text-xs font-medium hover:bg-rose-100 transition-colors"
              >
                {photo.url ? 'Change' : 'Upload'}
              </button>
              {photo.url && !photo.isPrimary && (
                <button
                  onClick={() => handleMakePrimary(photo.id)}
                  className="w-full bg-gray-50 text-gray-600 py-1 px-2 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  Make Primary
                </button>
              )}
            </div>
          </div>
        )}
      </CldUploadWidget>
    </div>
  ))}
</div>
          </div>
        );
case 'relative':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                  <input 
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                  <input 
                    type="text"
                    value={formData.mother}
                    onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
                    placeholder="Enter mother's name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Brothers</label>
                  <input 
                    type="number"
                    value={formData.brothers}
                    onChange={(e) => setFormData({ ...formData, brothers: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Married Brothers</label>
                  <input 
                    type="number"
                    value={formData.marriedBrothers}
                    onChange={(e) => setFormData({ ...formData, marriedBrothers: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sisters</label>
                  <input 
                    type="number"
                    value={formData.sisters}
                    onChange={(e) => setFormData({ ...formData, sisters: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Married Sisters</label>
                  <input 
                    type="number"
                    value={formData.marriedSisters}
                    onChange={(e) => setFormData({ ...formData, marriedSisters: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                 {/* Relative Surnames Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relative Surnames</label>
            {formData.relativeSurname?.map((surname, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => {
                    const updatedSurnames = [...formData.relativeSurname];
                    updatedSurnames[index] = e.target.value;
                    setFormData({
                      ...formData,
                      relativeSurname: updatedSurnames
                    });
                  }}
                  placeholder="Enter surname"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const filteredSurnames = formData.relativeSurname.filter((_, i) => i !== index);
                    setFormData({
                      ...formData,
                      relativeSurname: filteredSurnames
                    });
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  relativeSurname: [...(formData.relativeSurname || []), ""]
                });
              }}
              className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Add Surname
            </button>
          </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Native District</label>
                  <input 
                    type="text"
                    value={formData.nativeDistrict}
                    onChange={(e) => setFormData({ ...formData, nativeDistrict: e.target.value })}
                    placeholder="Enter native district"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Native City</label>
                  <input 
                    type="text"
                    value={formData.nativeCity}
                    onChange={(e) => setFormData({ ...formData, nativeCity: e.target.value })}
                    placeholder="Enter native city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family Wealth</label>
                  <input 
                    type="text"
                    value={formData.familyWealth}
                    onChange={(e) => setFormData({ ...formData, familyWealth: e.target.value })}
                    placeholder="Enter family wealth details"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Occupation</label>
                  <input 
                    type="text"
                    value={formData.parentOccupation}
                    onChange={(e) => setFormData({ ...formData, parentOccupation: e.target.value })}
                    placeholder="Enter parent occupation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Residence City</label>
                  <input 
                    type="text"
                    value={formData.parentResidenceCity}
                    onChange={(e) => setFormData({ ...formData, parentResidenceCity: e.target.value })}
                    placeholder="Enter parent residence city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mama Surname</label>
                  <input 
                    type="text"
                    value={formData.mamaSurname}
                    onChange={(e) => setFormData({ ...formData, mamaSurname: e.target.value })}
                    placeholder="Enter mama surname"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                
              </div>
            </div>
          </div>
        );

      case 'horoscope':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rashi</label>
                  <input 
                    type="text"
                    value={formData.rashi}
                    onChange={(e) => setFormData({ ...formData, rashi: e.target.value })}
                    placeholder="Enter your rashi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nakshira</label>
                  <input 
                    type="text"
                    value={formData.nakshira}
                    onChange={(e) => setFormData({ ...formData, nakshira: e.target.value })}
                    placeholder="Enter your nakshira"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Charan</label>
                  <input 
                    type="text"
                    value={formData.charan}
                    onChange={(e) => setFormData({ ...formData, charan: e.target.value })}
                    placeholder="Enter your charan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gan</label>
                  <input 
                    type="text"
                    value={formData.gan}
                    onChange={(e) => setFormData({ ...formData, gan: e.target.value })}
                    placeholder="Enter your gan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gotra/Devak</label>
                  <input 
                    type="text"
                    value={formData.gotraDevak}
                    onChange={(e) => setFormData({ ...formData, gotraDevak: e.target.value })}
                    placeholder="Enter gotra/devak"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nadi</label>
                  <input 
                    type="text"
                    value={formData.nadi}
                    onChange={(e) => setFormData({ ...formData, nadi: e.target.value })}
                    placeholder="Enter your nadi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mangal</label>
                  <select
                    value={formData.mangal ? 'Yes' : 'No'}
                    onChange={(e) => setFormData({ ...formData, mangal: e.target.value === 'Yes' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                  <input 
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="Enter birth place"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                  <input 
                    type="text"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    placeholder="Enter birth time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
               
              </div>
            </div>
          </div>
        );
        case 'expectations':
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Caste</label>
            <input 
              type="text"
              value={formData.expectedCaste}
              onChange={(e) => setFormData({ ...formData, expectedCaste: e.target.value })}
              placeholder="Enter expected caste"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred City</label>
            <input 
              type="text"
              value={formData.preferredCity}
              onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
              placeholder="Enter preferred city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Age Difference</label>
            <select
              value={formData.expectedAgeDifference}
              onChange={(e) => setFormData({ ...formData, expectedAgeDifference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select age difference</option>
              <option>±1 year</option>
              <option>±2 years</option>
              <option>±3 years</option>
              <option>±5 years</option>
            </select>
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Income</label>
            <select
              value={formData.expectedIncome}
              onChange={(e) => setFormData({ ...formData, expectedIncome: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select income range</option>
              <option>₹5-10 Lakhs</option>
              <option>₹10-15 Lakhs</option>
              <option>₹15-20 Lakhs</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Education</label>
            <select
              value={formData.expectedEducation}
              onChange={(e) => setFormData({ ...formData, expectedEducation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select education level</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accept Divorcee</label>
            <select
              value={formData.divorcee ? 'Yes' : 'No'}
              onChange={(e) => setFormData({ ...formData, divorcee: e.target.value === 'Yes' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Height</label>
            <select
              value={formData.expectedHeight}
              onChange={(e) => setFormData({ ...formData, expectedHeight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select height range</option>
              <option>5'0" - 5'5"</option>
              <option>5'5" - 5'10"</option>
              <option>5'10" - 6'0"</option>
            </select>
          </div>
          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gotra/Devak</label>
                  <input 
                    type="text"
                    value={formData.gotraDevak}
                    onChange={(e) => setFormData({ ...formData, gotraDevak: e.target.value })}
                    placeholder="Expected gotra"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                  />
                </div>
        </div>
      </div>
    </div>
  );
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        );
    }
  };
  
  return (
   !isLoaded ?<div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Simple Spinner */}
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading Text */}
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div> : <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="flex flex-col  lg:flex-row items-start lg:items-center justify-between">
                <div className="xs:flex-col lg:flex-row flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
  <CldUploadWidget 
  uploadPreset="shivbandhan" 
  options={{ 
    multiple: false,
    sources: ['local', 'camera'],
    maxFiles: 1
  }}
  onSuccess={(result) => handlePhotoUploadSuccess(result, 1)}
>
  {({ open }) => (
    <>
      {formData?.profilePhoto ? (
        <div onClick={() => open()}>
          <img 
            src={formData.profilePhoto} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-white shadow-md"
          />
        </div>
      ) : (
        <div 
          className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md"
          onClick={() => open()}
        >
          <User className="w-12 h-12 text-rose-500" />
        </div>
      )}
      <button 
        className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        <Camera className="w-3 h-3 text-white" />
      </button>
    </>
  )}
</CldUploadWidget>
  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
    <CheckCircle className="w-3 h-3 text-white" />
  </div>
</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{formData?.name || 'Your Name'}</h1>
                      {verificationStatus === 'Verified' && <Award className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center space-x-4 text-sm">
                        {/* {formData.dob && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date().getFullYear() - new Date(formData.dob).getFullYear()} years
                          </span>
                        )} */}
                        {formData?.height && <span>{formData?.height}</span>}
                        {formData?.religion && <span>{formData?.religion}</span>}
                      </div>
                      {formData?.currentCity && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {formData?.currentCity}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-2">
                      <VerificationBadge status={formData?.verificationStatus} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 relative">
                  {showCompletionUpdate && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                      +{profileCompletion}%
                    </div>
                  )}
                  <div className="bg-rose-50 rounded-lg p-4 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-bold text-rose-600">
                        {isLoaded ? `${profileCompletion}%` : 'Loading...'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${isLoaded ? profileCompletion : 0}%` }}
                      ></div>
                    </div>
                    <button 
                      onClick={handleVerificationSubmit}
                      className="w-full bg-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                      disabled={verificationStatus === 'Pending' || isSaving}
                    >
                      {isSaving ? 'Saving...' : (
                        profileCompletion === 100 ?
                        (
                          verificationStatus === 'Pending' ? 'Verification Pending' :
                          verificationStatus === 'Verified' ? 'Profile Verified' :
                          'Sent for Verification'
                        ) : 'Save Profile'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          {/* Left Sidebar - Profile Sections */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Sections Navigation */}
<div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
  <h3 className="font-bold text-gray-900 mb-4">Profile Sections</h3>
  <div className="space-y-2">
    {getProfileSections().map((section) => {
      const Icon = section.icon;
      return (
        <button
          key={section.id}
          onClick={() => setActiveTab(section.id)}
          className={`w-full px-4 flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeTab === section.id
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{section.label}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-200 mr-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${section.completion}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">
              {section.completion}%
            </span>
          </div>
        </button>
      );
    })}
  </div>
</div>

            {/* Subscription Info */}
            <div className="bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{user?.subscription?.plan}</h3>
                <Crown className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-4 text-sm w-full">
                <div className="flex justify-between">
                  <span className="text-white/80">Status:</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Expires:</span>
                 <span className="font-medium">
  {new Date(user?.subscription?.expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
</span>
                </div>
                 <Link href={"/dashboard/subscription"} className="w-full cursor-pointer  bg-white/20 text-white p-3 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
                Manage Plan
              </Link>
              </div>
             
            </div>

            {/* Profile Settings */}
            {/* <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <h3 className="font-bold text-gray-900 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Profile Visibility</p>
                    <p className="text-xs text-gray-500">Show profile in search</p>
                  </div>
                  <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="p-1"
                  >
                    {isVisible ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  View as Others See
                </button>

                <button className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                  Deactivate Temporarily
                </button>
              </div>
            </div> */}
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {getProfileSections().find(s => s.id === activeTab)?.label}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
}