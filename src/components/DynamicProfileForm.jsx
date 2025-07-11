// components/DynamicProfileForm.jsx
'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin, Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff, UserCheck, Upload, Briefcase, GraduationCap, Home, Users, Search, Clock, Bell, Shield, ChevronRight, Plus, X, AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';

const DynamicProfileForm = () => {
  const { user } = useSession();
  const [formSections, setFormSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [adminWillFill, setAdminWillFill] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('Unverified');
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);

  useEffect(() => {
    fetchFormConfig();
    fetchUserData();
  }, []);

  const fetchFormConfig = async () => {
    try {
      const res = await fetch('/api/form-config');
      const data = await res.json();
      setFormSections(data);
    } catch (error) {
      console.error('Error fetching form config:', error);
    }
  };
  useEffect(() => {
  if (formData.profileSetup?.willAdminFill !== undefined) {
    setAdminWillFill(formData.profileSetup.willAdminFill);
  }
}, [formData]);
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      
      const initialFormData = {
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
        profilePhoto: data?.profilePhoto || "",
        
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
        relativeSurname: data.relativeSurname || [],
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
        admincanFill : data.profileSetup.willAdminFill || false,
      };

      setFormData(initialFormData);
      setVerificationStatus(data.verificationStatus || 'Unverified');
      
      // Update photos with profile photo if exists
      if (data.profilePhoto) {
        setPhotos(prevPhotos => 
          prevPhotos.map(photo => 
            photo.id === 1 ? { ...photo, url: data.profilePhoto } : photo
          )
        );
      }
      
      calculateCompletion(initialFormData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAdminFillToggle = async (enabled) => {
  setAdminWillFill(enabled);
  
  try {
    const response = await fetch('/api/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.user?.id || user?.id,
        profileSetup: {
          willAdminFill: enabled,
          dontAskAgain: formData.profileSetup?.dontAskAgain || false
        }
      }),
    });
    
    if (!response.ok) throw new Error('Failed to update admin fill setting');
    fetchUserData()
  } catch (error) {
    console.error("Error updating admin fill setting:", error);
    // Revert if failed
    setAdminWillFill(!enabled);
  }
};
 const calculateCompletion = (data) => {
  const sections = {
    basic: ['name', 'dob', 'height', 'gender', 'maritalStatus', 'motherTongue', 'currentCity', 'weight', 'email', 'permanentAddress', 'wearsLens', 'bloodGroup', 'complexion'],
    religious: ['religion', 'caste', 'subCaste', 'gothra'],
    education: ['education', 'fieldOfStudy', 'college', 'occupation', 'company', 'income'],
    relative: ['fatherName', 'parentResidenceCity', 'mother', 'brothers', 'marriedBrothers', 'sisters', 'marriedSisters', 'nativeDistrict', 'nativeCity', 'familyWealth', 'relativeSurname', 'parentOccupation', 'mamaSurname'],
    horoscope: ['rashi', 'nakshira', 'charan', 'gan', 'nadi', 'mangal', 'birthPlace', 'birthTime', 'gotraDevak'],
    expectations: ['expectedCaste', 'preferredCity', 'expectedAgeDifference', 'expectedEducation', 'divorcee', 'expectedHeight', 'expectedIncome']
  };

  let totalCompletion = 0;
  let sectionCount = 0;

  Object.entries(sections).forEach(([section, fields]) => {
    const filledFields = fields.filter(field => {
      const value = data[field];
      
      // Handle different field types appropriately
      if (Array.isArray(value)) {
        return true; // Count array fields as complete even if empty
      }
      if (typeof value === 'number') {
        return true; // Count number fields as complete even if 0
      }
      if (typeof value === 'boolean') {
        return true; // Count boolean fields as complete
      }
      
      // For strings, check if not empty
      return value !== null && value !== undefined && value !== '';
    }).length;

    const sectionCompletion = (filledFields / fields.length) * 100;
    totalCompletion += sectionCompletion;
    sectionCount++;
  });

  // Use Math.ceil to ensure 100% when very close
  const completion = Math.min(Math.ceil(totalCompletion / sectionCount), 100);
  setProfileCompletion(completion);
  return completion;
};

  const handleChange = (fieldName, value) => {
    const updatedData = {
      ...formData,
      [fieldName]: value
    };
    setFormData(updatedData);
    calculateCompletion(updatedData);
  };

  const handleArrayChange = (fieldName, index, value) => {
    const updatedArray = [...(formData[fieldName] || [])];
    updatedArray[index] = value;
    handleChange(fieldName, updatedArray);
  };

  const handleAddArrayItem = (fieldName) => {
    handleChange(fieldName, [...(formData[fieldName] || []), '']);
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    const filteredArray = (formData[fieldName] || []).filter((_, i) => i !== index);
    handleChange(fieldName, filteredArray);
  };

  const handleSubmit = async () => {
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
      
      // If profile completion reaches 100% after save, automatically trigger verification
      if (profileCompletion === 100 && verificationStatus === 'Unverified') {
        await handleVerificationSubmit();
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error: ${error.message}`);
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
      setVerificationStatus('Pending');
    } catch (error) {
      console.error("Error submitting verification:", error);
    }
  };

  const handlePhotoUploadSuccess = (result, photoId) => {
    const url = result.info.secure_url;
    
    setPhotos(prevPhotos => 
      prevPhotos.map(photo =>
        photo.id === photoId
          ? { ...photo, url }
          : photo
      )
    );
    
    if (photoId === 1) {
      handleChange('profilePhoto', url);
    }
  };

  const handleMakePrimary = (photoId) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    })));
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const VerificationBadge = ({ status }) => {
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
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.name] || 0}
            onChange={(e) => handleChange(field.name, parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={formatDateToYYYYMMDD(formData[field.name])}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <select
            value={formData[field.name] ? 'Yes' : 'No'}
            onChange={(e) => handleChange(field.name, e.target.value === 'Yes')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        );
      case 'array':
        return (
          <div>
            {(formData[field.name] || []).map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(field.name, index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem(field.name)}
              className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Add {field.label}
            </button>
          </div>
        );
      case 'photos':
        return (
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
        );
      case 'height':
        return (
          <select
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">Select Height</option>
            {Array.from({ length: 24 }, (_, i) => {
              const feet = 4 + Math.floor((i + 6) / 12);
              const inches = (i + 6) % 12;
              const cm = Math.round((feet * 30.48) + (inches * 2.54));
              return (
                <option key={i} value={`${feet}'${inches}" (${cm} cm)`}>
                  {feet}'{inches}" ({cm} cm)
                </option>
              );
            })}
          </select>
        );
      default:
        return null;
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
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
                    <VerificationBadge status={verificationStatus} />
                  </div>
<div className="flex items-center mt-3">
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      checked={formData?.admincanFill}
      onChange={(e) => handleAdminFillToggle(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
    <span className="ml-2 text-sm font-medium text-gray-700">
      Admin can Fill
    </span>
  </label>
</div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="bg-rose-50 rounded-lg p-4 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-rose-600">
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    className="w-full bg-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : (
                      profileCompletion === 100 ?
                      (
                        verificationStatus === 'Pending' ? 'Verification Pending' :
                        verificationStatus === 'Verified' ? 'Profile Verified' :
                        'Save Profile'
                      ) : 'Save Profile'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Sections */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <h3 className="font-bold text-gray-900 mb-4">Profile Sections</h3>
              <div className="space-y-2">
                {[
                  { id: 'basic', label: 'Basic Information', icon: User },
                  { id: 'religious', label: 'Religious & Community', icon: Star },
                  { id: 'education', label: 'Education & Profession', icon: GraduationCap },
                  { id: 'relative', label: 'Relative Info', icon: Users },
                  { id: 'horoscope', label: 'Horoscope Info', icon: Sparkles },
                  { id: 'expectations', label: 'Expectations', icon: Heart }
                ].map((section) => (
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
                      <section.icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {[
                      { id: 'basic', label: 'Basic Information' },
                      { id: 'religious', label: 'Religious & Community' },
                      { id: 'education', label: 'Education & Profession' },
                      { id: 'relative', label: 'Relative Info' },
                      { id: 'horoscope', label: 'Horoscope Info' },
                      { id: 'expectations', label: 'Expectations' }
                    ].find(s => s.id === activeTab)?.label || 'Profile'}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder='Enter your full name'
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                          <input
                            type="date"
                            value={formatDateToYYYYMMDD(formData.dob)}
                            onChange={(e) => handleChange('dob', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                          <select
                            value={formData.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          >
                            <option value="">Select Height</option>
                            {Array.from({ length: 24 }, (_, i) => {
                              const feet = 4 + Math.floor((i + 6) / 12);
                              const inches = (i + 6) % 12;
                              const cm = Math.round((feet * 30.48) + (inches * 2.54));
                              return (
                                <option key={i} value={`${feet}'${inches}" (${cm} cm)`}>
                                  {feet}'{inches}" ({cm} cm)
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                          <input 
                            type="text"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            placeholder="Enter your weight"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
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
                            value={formData.bloodGroup}
                            onChange={(e) => handleChange('bloodGroup', e.target.value)}
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
                            value={formData.complexion}
                            onChange={(e) => handleChange('complexion', e.target.value)}
                            placeholder="E.g. Fair, Wheatish, etc."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                          <select
                            value={formData.maritalStatus}
                            onChange={(e) => handleChange('maritalStatus', e.target.value)}
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
                            value={formData.motherTongue}
                            onChange={(e) => handleChange('motherTongue', e.target.value)}
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
                            value={formData.currentCity}
                            onChange={(e) => handleChange('currentCity', e.target.value)}
                            placeholder="Enter your city"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Address</label>
                          <input 
                            type="text"
                            value={formData.permanentAddress}
                            onChange={(e) => handleChange('permanentAddress', e.target.value)}
                            placeholder='Enter your permanent address'
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Wears Lens</label>
                          <select
                            value={formData.wearsLens ? 'Yes' : 'No'}
                            onChange={(e) => handleChange('wearsLens', e.target.value === 'Yes')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'religious' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                          <select
                            value={formData.religion}
                            onChange={(e) => handleChange('religion', e.target.value)}
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
                            value={formData.caste}
                            onChange={(e) => handleChange('caste', e.target.value)}
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
                            value={formData.subCaste || ""}
                            onChange={(e) => handleChange('subCaste', e.target.value)}
                                                        placeholder="Enter your sub-caste"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gothra</label>
                          <input
                            type="text"
                            value={formData.gothra || ""}
                            onChange={(e) => handleChange('gothra', e.target.value)}
                            placeholder="Enter your gothra"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
                          <select
                            value={formData.education}
                            onChange={(e) => handleChange('education', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          >
                            <option value="">Select Education</option>
                            <option>High School</option>
                            <option>Bachelor's Degree</option>
                            <option>Master's Degree</option>
                            <option>Doctorate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                          <input
                            type="text"
                            value={formData.fieldOfStudy || ""}
                            onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                            placeholder="Enter your field of study"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                          <input
                            type="text"
                            value={formData.college || ""}
                            onChange={(e) => handleChange('college', e.target.value)}
                            placeholder="Enter your college/university"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                          <input
                            type="text"
                            value={formData.occupation || ""}
                            onChange={(e) => handleChange('occupation', e.target.value)}
                            placeholder="Enter your occupation"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={formData.company || ""}
                            onChange={(e) => handleChange('company', e.target.value)}
                            placeholder="Enter your company name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                          <input
                            type="text"
                            value={formData.income || ""}
                            onChange={(e) => handleChange('income', e.target.value)}
                            placeholder="Enter your annual income"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'relative' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                          <input
                            type="text"
                            value={formData.fatherName || ""}
                            onChange={(e) => handleChange('fatherName', e.target.value)}
                            placeholder="Enter father's name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                          <input
                            type="text"
                            value={formData.mother || ""}
                            onChange={(e) => handleChange('mother', e.target.value)}
                            placeholder="Enter mother's name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Residence City</label>
                          <input
                            type="text"
                            value={formData.parentResidenceCity || ""}
                            onChange={(e) => handleChange('parentResidenceCity', e.target.value)}
                            placeholder="Enter city"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Brothers</label>
                          <input
                            type="number"
                            value={formData.brothers || 0}
                            onChange={(e) => handleChange('brothers', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Married Brothers</label>
                          <input
                            type="number"
                            value={formData.marriedBrothers || 0}
                            onChange={(e) => handleChange('marriedBrothers', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sisters</label>
                          <input
                            type="number"
                            value={formData.sisters || 0}
                            onChange={(e) => handleChange('sisters', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Married Sisters</label>
                          <input
                            type="number"
                            value={formData.marriedSisters || 0}
                            onChange={(e) => handleChange('marriedSisters', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Native District</label>
                          <input
                            type="text"
                            value={formData.nativeDistrict || ""}
                            onChange={(e) => handleChange('nativeDistrict', e.target.value)}
                            placeholder="Enter native district"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Native City</label>
                          <input
                            type="text"
                            value={formData.nativeCity || ""}
                            onChange={(e) => handleChange('nativeCity', e.target.value)}
                            placeholder="Enter native city"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Family Wealth</label>
                          <input
                            type="text"
                            value={formData.familyWealth || ""}
                            onChange={(e) => handleChange('familyWealth', e.target.value)}
                            placeholder="Describe family wealth"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relative Surnames</label>
                        {(formData.relativeSurname || []).map((surname, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={surname}
                              onChange={(e) => handleArrayChange('relativeSurname', index, e.target.value)}
                              placeholder="Enter relative surname"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveArrayItem('relativeSurname', index)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddArrayItem('relativeSurname')}
                          className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        >
                          Add Surname
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mama's Surname</label>
                        <input
                          type="text"
                          value={formData.mamaSurname || ""}
                          onChange={(e) => handleChange('mamaSurname', e.target.value)}
                          placeholder="Enter mama's surname"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Occupation</label>
                        <input
                          type="text"
                          value={formData.parentOccupation || ""}
                          onChange={(e) => handleChange('parentOccupation', e.target.value)}
                          placeholder="Enter parent's occupation"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'horoscope' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rashi</label>
                          <input
                            type="text"
                            value={formData.rashi || ""}
                            onChange={(e) => handleChange('rashi', e.target.value)}
                            placeholder="Enter your rashi"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nakshira</label>
                          <input
                            type="text"
                            value={formData.nakshira || ""}
                            onChange={(e) => handleChange('nakshira', e.target.value)}
                            placeholder="Enter your nakshira"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Charan</label>
                          <input
                            type="text"
                            value={formData.charan || ""}
                            onChange={(e) => handleChange('charan', e.target.value)}
                            placeholder="Enter charan"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gan</label>
                          <input
                            type="text"
                            value={formData.gan || ""}
                            onChange={(e) => handleChange('gan', e.target.value)}
                            placeholder="Enter gan"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nadi</label>
                          <input
                            type="text"
                            value={formData.nadi || ""}
                            onChange={(e) => handleChange('nadi', e.target.value)}
                            placeholder="Enter nadi"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mangal Dosha</label>
                          <select
                            value={formData.mangal ? 'Yes' : 'No'}
                            onChange={(e) => handleChange('mangal', e.target.value === 'Yes')}
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
                            value={formData.birthPlace || ""}
                            onChange={(e) => handleChange('birthPlace', e.target.value)}
                            placeholder="Enter birth place"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                          <input
                            type="text"
                            value={formData.birthTime || ""}
                            onChange={(e) => handleChange('birthTime', e.target.value)}
                            placeholder="Enter birth time"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gotra Devak</label>
                          <input
                            type="text"
                            value={formData.gotraDevak || ""}
                            onChange={(e) => handleChange('gotraDevak', e.target.value)}
                            placeholder="Enter gotra devak"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'expectations' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Caste</label>
                          <input
                            type="text"
                            value={formData.expectedCaste || ""}
                            onChange={(e) => handleChange('expectedCaste', e.target.value)}
                            placeholder="Enter expected caste"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred City</label>
                          <input
                            type="text"
                            value={formData.preferredCity || ""}
                            onChange={(e) => handleChange('preferredCity', e.target.value)}
                            placeholder="Enter preferred city"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Age Difference</label>
                          <input
                            type="text"
                            value={formData.expectedAgeDifference || ""}
                            onChange={(e) => handleChange('expectedAgeDifference', e.target.value)}
                            placeholder="Enter age difference"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Education</label>
                          <input
                            type="text"
                            value={formData.expectedEducation || ""}
                            onChange={(e) => handleChange('expectedEducation', e.target.value)}
                            placeholder="Enter expected education"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Accept Divorcee</label>
                          <select
                            value={formData.divorcee ? 'Yes' : 'No'}
                            onChange={(e) => handleChange('divorcee', e.target.value === 'Yes')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Height</label>
                          <input
                            type="text"
                            value={formData.expectedHeight || ""}
                            onChange={(e) => handleChange('expectedHeight', e.target.value)}
                            placeholder="Enter expected height"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Income</label>
                          <input
                            type="text"
                            value={formData.expectedIncome || ""}
                            onChange={(e) => handleChange('expectedIncome', e.target.value)}
                            placeholder="Enter expected income"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="w-full bg-rose-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
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
};

export default DynamicProfileForm;