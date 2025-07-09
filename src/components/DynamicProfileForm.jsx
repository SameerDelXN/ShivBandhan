// components/DynamicProfileForm.jsx
'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin, Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff, UserCheck, Upload, Briefcase, GraduationCap, Home, Users, Search, Clock, Bell, Shield, ChevronRight, Plus, X, AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone } from 'lucide-react';

const DynamicProfileForm = () => {
  const { user } = useSession();
  const [formSections, setFormSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileCompletion, setProfileCompletion] = useState(0);

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

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/users/me');
      const data = await res.json();
      setFormData(data);
      calculateCompletion(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletion = (data) => {
    if (!data) return 0;
    let filledFields = 0;
    let totalFields = 0;

    formSections.forEach(section => {
      section.fields.forEach(field => {
        totalFields++;
        if (data[section.name]?.[field.name] && data[section.name][field.name] !== '') {
          filledFields++;
        }
      });
    });

    const completion = Math.round((filledFields / totalFields) * 100);
    setProfileCompletion(completion);
    return completion;
  };

  const handleChange = (sectionName, fieldName, value) => {
    const updatedData = {
      ...formData,
      [sectionName]: {
        ...formData[sectionName],
        [fieldName]: value
      }
    };
    setFormData(updatedData);
    calculateCompletion(updatedData);
  };

 const handleSubmit = async () => {
  setIsSaving(true);
  try {
    const res = await fetch('/api/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.id,
        formData: formData
      }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    // Show success message
    alert('Profile updated successfully!');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(error.message || 'Failed to update profile');
  } finally {
    setIsSaving(false);
  }
};

  const renderField = (section, field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            value={formData[section.name]?.[field.name] || ''}
            onChange={(e) => handleChange(section.name, field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        );
      case 'select':
        return (
          <select
            value={formData[section.name]?.[field.name] || ''}
            onChange={(e) => handleChange(section.name, field.name, e.target.value)}
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData[section.name]?.[field.name] || false}
              onChange={(e) => handleChange(section.name, field.name, e.target.checked)}
              className="h-4 w-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500"
            />
            <label className="ml-3 block text-sm text-gray-700">
              {field.label}
            </label>
          </div>
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
      

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Sections */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Sections Navigation */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <h3 className="font-bold text-gray-900 mb-4">Profile Sections</h3>
              <div className="space-y-2">
                {formSections.map((section) => {
                  const iconMap = {
                    'basic': User,
                    'religious': Star,
                    'education': GraduationCap,
                    'relative': Users,
                    'horoscope': Sparkles,
                    'expectations': Heart
                  };
                  const Icon = iconMap[section.name.toLowerCase()] || User;
                  
                  return (
                    <button
                      key={section.name}
                      onClick={() => setActiveTab(section.name)}
                      className={`w-full px-4 flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        activeTab === section.name
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {formSections.find(s => s.name === activeTab)?.label || 'Profile'}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {formSections
                    .filter(section => section.name === activeTab)
                    .map((section) => (
                      <div key={section.name} className="border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">{section.label}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.fields.map((field) => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {renderField(section, field)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
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
};

export default DynamicProfileForm;