'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin, Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff, UserCheck, Upload, Briefcase, GraduationCap, Home, Users, Search, Clock, Bell, Shield, ChevronRight, Plus, X, AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';

const DynamicProfileForm = () => {
  const { user } = useSession();
  const [formSections, setFormSections] = useState([]);
   const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({});
  const [adminWillFill, setAdminWillFill] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('Unverified');
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);

  // Field name mappings between form sections and user data
  const fieldNameMappings = {
    // Basic Information
    'Full Name': 'name',
    'Height': 'height',
    'Weight': 'weight',
    'Date of Birth': 'dob',
    'Marital Status': 'maritalStatus',
    'Mother Tongue': 'motherTongue',
    'Current City': 'currentCity',
    'Email Address': 'email',
    'Permanent Address': 'permanentAddress',
    'Gender': 'gender',
    'Blood Group': 'bloodGroup',
    'Wears Lens': 'wearsLens',
    'Complexion': 'complexion',

    // Education & Profession
    'Highest Education': 'education',
    'Occupation': 'occupation',
    'Field of Study': 'fieldOfStudy',
    'Company': 'company',
    'College/University': 'college',
    'Annual Income': 'income',

    // Relative Information
    "Father's Name": 'fatherName',
    "Mother's Name": 'mother',
    "Parent's Residence City": 'parentResidenceCity',
    "Number of Brothers": 'brothers',
    "Number of Sisters": 'sisters',
    "Married Brothers": 'marriedBrothers',
    "Married Sisters": 'marriedSisters',
    "Native District": 'nativeDistrict',
    "Native City": 'nativeCity',
    "Family Wealth": 'familyWealth',
    "Mama's Surname": 'mamaSurname',
    "Parent's Occupation": 'parentOccupation',
    "Relative Surnames": 'relativeSurname',

    // Religious & Community
    "Religion": 'religion',
    "Sub Caste": 'subCaste',
    "Caste": 'caste',
    "Gothra": 'gothra',

    // Horoscope Information
    "Rashi": 'rashi',
    "Nadi": 'nadi',
    "Nakshira": 'nakshira',
    "Mangal Dosha": 'mangal',
    "Charan": 'charan',
    "Birth Place": 'birthPlace',
    "Birth Time": 'birthTime',
    "Gan": 'gan',
    "Gotra Devak": 'gotraDevak',

    // Expectations
    "Expected Caste": 'expectedCaste',
    "Preferred City": 'preferredCity',
    "Expected Age Difference": 'expectedAgeDifference',
    "Expected Education": 'expectedEducation',
    "Accept Divorcee": 'divorcee',
    "Expected Height": 'expectedHeight',
    "Expected Income": 'expectedIncome'
  };

  // Helper function to normalize field names for comparison
  const normalizeFieldName = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch form sections structure
        const sectionsRes = await fetch('/api/admin/form-sections');
        const sectionsData = await sectionsRes.json();

        // Transform sections data to match our expected format
        const transformedSections = sectionsData.map(section => ({
          ...section,
          id: section._id,
          fields: section.fields.map(field => ({
            ...field,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            options: field.options || [],
            placeholder: field.placeholder || ''
          }))
        }));

        setFormSections(transformedSections);

        // Set active tab to first section if available
        if (transformedSections.length > 0) {
          setActiveTab(transformedSections[0]._id);
        }

        // Fetch user data
        const userRes = await fetch('/api/users/me');
        const userData = await userRes.json();

        // Create initial form data state by mapping user data to form fields
        const initialFormData = {};

        // Map user data to form fields using field mappings
        transformedSections.forEach(section => {
          section.fields.forEach(field => {
            // Try to find matching field in user data
            const mappingEntry = Object.entries(fieldNameMappings).find(
              ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name)
            );

            if (mappingEntry) {
              const [_, backendField] = mappingEntry;
              if (userData[backendField] !== undefined) {
                initialFormData[field.name] = userData[backendField];
              }
            } else if (userData[field.name] !== undefined) {
              initialFormData[field.name] = userData[field.name];
            }
          });
        });

        // Include any additional user data fields not in form sections
        Object.keys(userData).forEach(key => {
          if (!initialFormData[key]) {
            initialFormData[key] = userData[key];
          }
        });

        setFormData(initialFormData);

        // Update photos with profile photo if exists
        if (userData.profilePhoto) {
          setPhotos(prevPhotos =>
            prevPhotos.map(photo =>
              photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo
            )
          );
        }

        // Set admin fill preference
        if (userData.profileSetup?.willAdminFill !== undefined) {
          setAdminWillFill(userData.profileSetup.willAdminFill);
        }

        // Set verification status
        if (userData.verificationStatus) {
          setVerificationStatus(userData.verificationStatus);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0 && formSections.length > 0) {
      setProfileCompletion(calculateProfileCompletion());
    }
  }, [formData, formSections]);

  const calculateProfileCompletion = (formDataToCheck = formData) => {
    if (!formSections.length) return 0;

    // Define the required fields we want to check
    const requiredFields = [
      'Full Name',
      'Height',
      'Weight',
      'Date of Birth',
      'Marital Status',
      'Mother Tongue',
      'Current City',
      'Email Address',
      'Permanent Address',
      'Gender',
      'Blood Group',
      'Wears Lens',
      'Complexion',
      'Highest Education',
      'Occupation',
      'Field of Study',
      'Company',
      'College/University',
      'Annual Income',
      "Father's Name",
      "Mother's Name",
      "Parent's Residence City",
      "Number of Brothers",
      "Number of Sisters",
      "Married Brothers",
      "Married Sisters",
      "Native District",
      "Native City",
      "Family Wealth",
      "Mama's Surname",
      "Parent's Occupation",
      "Relative Surnames",
      "Religion",
      "Sub Caste",
      "Caste",
      "Gothra",
      "Rashi",
      "Nadi",
      "Nakshira",
      "Mangal Dosha",
      "Charan",
      "Birth Place",
      "Birth Time",
      "Gan",
      "Gotra Devak",
      "Expected Caste",
      "Preferred City",
      "Expected Age Difference",
      "Expected Education",
      "Accept Divorcee",
      "Expected Height",
      "Expected Income"
    ];

    let totalFields = requiredFields.length;
    let filledFields = 0;

    requiredFields.forEach(fieldName => {
      const value = formDataToCheck[fieldName];

      // Check if the value is filled
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0 && value.some(item => item.trim() !== '')) {
            filledFields++;
          }
        } else if (typeof value === 'boolean') {
          // Boolean fields are always considered filled
          filledFields++;
        } else if (typeof value === 'string' && value.trim() !== '') {
          filledFields++;
        } else if (typeof value === 'number') {
          filledFields++;
        }
      }
    });

    // Add photo as a required field
    totalFields++;
    if (formDataToCheck.profilePhoto || (photos[0] && photos[0].url)) {
      filledFields++;
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const transformFormDataForBackend = (formData) => {
    const transformed = {};

    // First pass - map all fields that have direct mappings
    Object.keys(formData).forEach(formField => {
      // Skip internal fields we don't want to send
      if (formField === 'profileSetup' || formField === 'subscription') {
        return;
      }

      // Find if this form field has a mapping
      const mappingEntry = Object.entries(fieldNameMappings).find(
        ([key]) => normalizeFieldName(key) === normalizeFieldName(formField)
      );

      if (mappingEntry) {
        const [_, backendField] = mappingEntry;
        // Handle different value types appropriately
        if (Array.isArray(formData[formField])) {
          transformed[backendField] = formData[formField].filter(item => item.trim() !== '');
        } else if (typeof formData[formField] === 'boolean') {
          transformed[backendField] = formData[formField];
        } else {
          transformed[backendField] = formData[formField] || null;
        }
      } else {
        // If no mapping exists, include the field as-is
        transformed[formField] = formData[formField];
      }
    });

    // Handle special cases
    if (formData.profilePhoto) {
      transformed.profilePhoto = formData.profilePhoto;
    }
    //sample
    // Handle relative surnames specifically
    if (formData['Relative Surnames']) {
      if (Array.isArray(formData['Relative Surnames'])) {
        transformed.relativeSurname = formData['Relative Surnames'].filter(s => s.trim() !== '');
      } else if (typeof formData['Relative Surnames'] === 'string') {
        transformed.relativeSurname = formData['Relative Surnames'].split(',').map(s => s.trim()).filter(s => s !== '');
      }
    }

    return transformed;
  };

  const handleInputChange = (fieldName, value) => {
    console.log("field Name = ", fieldName)
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldName]: value
      };

      // Recalculate completion whenever form data changes
      setProfileCompletion(calculateProfileCompletion(newData));

      return newData;
    });
  };
  console.log("Input change form data = ", formData)

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // Create a deep copy of the current formData
      const currentFormData = JSON.parse(JSON.stringify(formData));
      console.log("current = ", currentFormData)
      // Transform the data to match your schema
      const transformedData = {
        name: currentFormData["Full Name"],
        email: currentFormData["Email Address"],
        gender: currentFormData["Gender"],
        dob: currentFormData["Date of Birth"],
        height: currentFormData["Height"],
        religion: currentFormData["Religion"],
        currentCity: currentFormData["Current City"],
        education: currentFormData["Highest Education"],
        maritalStatus: currentFormData["Marital Status"],
        motherTongue: currentFormData["Mother Tongue"],
        caste: currentFormData["Caste"],
        subCaste: currentFormData["Sub Caste"],
        gothra: currentFormData["Gothra"],
        fieldOfStudy: currentFormData["Field of Study"],
        college: currentFormData["College/University"],
        occupation: currentFormData["Occupation"],
        company: currentFormData["Company"],
        weight: currentFormData["Weight"],
        permanentAddress: currentFormData["Permanent Address"],
        profilePhoto: currentFormData['profilePhoto'],
        complexion: currentFormData["Complexion"],
        income: currentFormData["Annual Income"],
        bloodGroup: currentFormData["Blood Group"],
        wearsLens: currentFormData["Wears Lens"],
        fatherName: currentFormData["Father's Name"],
        parentResidenceCity: currentFormData["Parent's Residence City"],
        mother: currentFormData["Mother's Name"],
        brothers: currentFormData["Number of Brothers"],
        marriedBrothers: currentFormData["Married Brothers"],
        sisters: currentFormData["Number of Sisters"],
        marriedSisters: currentFormData["Married Sisters"],
        nativeDistrict: currentFormData["Native District"],
        nativeCity: currentFormData["Native City"],
        familyWealth: currentFormData["Family Wealth"],
        relativeSurname: currentFormData["Relative Surnames"],
        parentOccupation: currentFormData["Parent's Occupation"],
        mamaSurname: currentFormData["Mama's Surname"],
        rashi: currentFormData["Rashi"],
        nakshira: currentFormData["Nakshira"],
        charan: currentFormData["Charan"],
        gan: currentFormData["Gan"],
        nadi: currentFormData["Nadi"],
        mangal: currentFormData["Mangal Dosha"],
        birthPlace: currentFormData["Birth Place"],
        birthTime: currentFormData["Birth Time"],
        gotraDevak: currentFormData["Gotra Devak"],
        expectedCaste: currentFormData["Expected Caste"],
        preferredCity: currentFormData["Preferred City"],
        expectedAgeDifference: currentFormData["Expected Age Difference"],
        expectedEducation: currentFormData["Expected Education"],
        divorcee: currentFormData["Accept Divorcee"],
        expectedHeight: currentFormData["Expected Height"],
        expectedIncome: currentFormData["Expected Income"]
      };

      // Prepare the final payload
      const payload = {
        ...transformedData,
        userId: user?.user?.id || user?.id
      };

      console.log("Sending payload to backend:", payload);

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      alert('Profile updated successfully!');

      if (profileCompletion === 100 && verificationStatus === 'Unverified') {
        // await handleVerificationSubmit();
      }
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
          verificationSubmittedAt: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit verification');

      const result = await response.json();
      setVerificationStatus('Pending');
      alert('Verification submitted successfully!');
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert(`Error submitting verification: ${error.message}`);
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
      handleInputChange('profilePhoto', url);
    }
  };
  
  const handleMakePrimary = (photoId) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    })));
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

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        profileSetup: {
          ...prev.profileSetup,
          willAdminFill: enabled
        }
      }));
    } catch (error) {
      console.error("Error updating admin fill setting:", error);
      // Revert if failed
      setAdminWillFill(!enabled);
    }
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderFieldInput = (field) => {
    const value = formData[field.name] ?? '';

    switch (field.type.toLowerCase()) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <select
            value={value ? 'Yes' : 'No'}
            onChange={(e) => handleInputChange(field.name, e.target.value === 'Yes')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={formatDateToYYYYMMDD(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );

      default: // text, email, etc.
        return (
          <input
            type={field.type.toLowerCase()}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );
    }
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

  const renderTabContent = () => {
    const currentSection = formSections.find(s => s._id === activeTab);

    if (!currentSection) return null;

    if (currentSection.label.toLowerCase().includes('photo')) {
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
                  options={{ multiple: false, sources: ['local'], maxFiles: 1 }}
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
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSection.fields.map((field) => (
            <div key={field._id} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }
//sample
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
  <div className="max-w-7xl mx-auto space-y-6">
    {/* Profile Header */}
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="xs:flex-col lg:flex-row flex items-center space-x-6 mb-6 lg:mb-0">
            <div className="relative">
              {/* Fixed CldUploadWidget with minimal styling */}
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
                  <div className="inline-block relative"> {/* Added inline-block container */}
                    {formData?.profilePhoto ? (
                      <div 
                        onClick={() => open()}
                        className="cursor-pointer"
                      >
                        <img
                          src={formData.profilePhoto}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
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
                      className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                    >
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
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
                onClick={handleProfileUpdate}
                className="w-full bg-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Left Sidebar - Profile Sections */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
          <h3 className="font-bold text-gray-900 mb-4">Profile Sections</h3>
          <div className="space-y-2">
            {formSections.map((section) => {
              const Icon = getIconComponent(section.icon || 'User');
              const label = section.label.split(' ')[0] === 'Education'
                ? 'Education & Profession'
                : section.label.split(' ')[0] === 'Religious'
                  ? 'Religious & Community'
                  : section.label;

              return (
                <button
                  key={section._id}
                  onClick={() => setActiveTab(section._id)}
                  className={`w-full px-4 flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === section._id
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'text-gray-700'
                    }`}
                >
                  <div className="flex items-center whitespace-nowrap">
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{formData.subscription?.plan || 'Free Plan'}</h3>
            <Crown className="w-5 h-5 text-yellow-200" />
          </div>
          <div className="space-y-4 text-sm w-full">
            <div className="flex justify-between">
              <span className="text-white/80">Status:</span>
              <span className="font-medium">
                {formData.subscription?.isSubscribed ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Expires:</span>
              <span className="font-medium">
                {formData.subscription?.expiresAt ?
                  new Date(formData.subscription.expiresAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) :
                  'Never'}
              </span>
            </div>
            <Link href="/dashboard/subscription" className="w-full cursor-pointer bg-white/20 text-white p-3 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
              Manage Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {formSections.find(s => s._id === activeTab)?.label || 'Profile Section'}
              </h2>
            </div>
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setActiveTab(formSections[0]?._id)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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

// Helper function to get icon component by name
function getIconComponent(iconName) {
  const icons = {
    User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin,
    Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff,
    UserCheck, Upload, Briefcase, GraduationCap, Home, Users,
    Search, Clock, Bell, Shield, ChevronRight, Plus, X,
    AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone
  };
  return icons[iconName] || User;
}

export default DynamicProfileForm;