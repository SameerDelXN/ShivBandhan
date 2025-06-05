"use client"
import { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  Eye, 
  CheckCircle, 
  Edit3, 
  Crown, 
  Camera,
  MapPin,
  Calendar,
  Award,
  Star,
  Gift,
  Sparkles,
  Settings,
  EyeOff,
  UserCheck,
  Upload,
  Briefcase,
  GraduationCap,
  Home,
  Users,
  Search,
  Clock,
  Bell,
  Shield,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function MyProfilePage() {
  const [profileCompletion, setProfileCompletion] = useState(72);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [isVisible, setIsVisible] = useState(true);
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const profileSections = [
    { id: 'basic', label: 'Basic Information', icon: User, completion: 90 },
    { id: 'religious', label: 'Religious & Community', icon: Star, completion: 80 },
    { id: 'education', label: 'Education & Profession', icon: GraduationCap, completion: 85 },
    { id: 'lifestyle', label: 'Lifestyle & Hobbies', icon: Heart, completion: 60 },
    { id: 'family', label: 'Family Details', icon: Users, completion: 70 },
    { id: 'preferences', label: 'Partner Preferences', icon: Search, completion: 55 },
    { id: 'photos', label: 'Photos & Media', icon: Camera, completion: 40 },
  ];

  const recentActivity = [
    { type: "view", message: "12 people viewed your profile today", time: "2 hours ago", icon: Eye },
    { type: "match", message: "3 new matches found", time: "5 hours ago", icon: Star },
    { type: "interest", message: "2 new interests received", time: "1 day ago", icon: Heart },
  ];

  const handlePhotoUpload = (photoId) => {
    // Simulate photo upload
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, url: `https://via.placeholder.com/200x250/f43f5e/white?text=Photo+${photoId}` }
        : photo
    ));
  };

  const handleMakePrimary = (photoId) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    })));
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value="Priya Sharma" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" value="1999-03-15" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>5'4" (162 cm)</option>
                    <option>5'3" (160 cm)</option>
                    <option>5'5" (165 cm)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>Never Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>Hindi</option>
                    <option>English</option>
                    <option>Marathi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current City</label>
                  <input type="text" value="Mumbai, Maharashtra" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
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
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>Hindu</option>
                    <option>Muslim</option>
                    <option>Christian</option>
                    <option>Sikh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                  <input type="text" placeholder="Enter your caste" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-caste</label>
                  <input type="text" placeholder="Enter your sub-caste" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gothra</label>
                  <input type="text" placeholder="Enter your gothra" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
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
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input type="text" value="Computer Science" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                  <input type="text" value="Mumbai University" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input type="text" value="Software Engineer" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input type="text" value="Tech Solutions Pvt Ltd" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
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
                  <div className="aspect-[4/5] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                    {photo.url ? (
                      <img src={photo.url} alt={`Photo ${photo.id}`} className="w-full h-full object-cover" />
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
                      onClick={() => handlePhotoUpload(photo.id)}
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
              ))}
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-rose-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <button className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">Priya Sharma</h1>
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          25 years
                        </span>
                        <span>5'4"</span>
                        <span>Hindu</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        Mumbai, Maharashtra
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Profile
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="bg-rose-50 rounded-lg p-4 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-bold text-rose-600">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <button className="w-full bg-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
                      Complete Your Profile
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
                {profileSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        activeTab === section.id 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-200">
                          <div 
                            className="h-2 rounded-full bg-green-500 transition-all duration-300"
                            style={{ width: `${section.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{section.completion}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Premium Plan</h3>
                <Crown className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/80">Status:</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Expires:</span>
                  <span className="font-medium">Dec 15, 2024</span>
                </div>
              </div>
              <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
                Manage Plan
              </button>
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
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
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profileSections.find(s => s.id === activeTab)?.label}
                  </h2>
                  <button className="flex items-center text-rose-600 hover:text-rose-700 font-medium">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {renderTabContent()}
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Activity & Stats */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                <Bell className="w-4 h-4 text-rose-500" />
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-rose-50/50 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                        <Icon className="w-3 h-3 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-3 text-rose-600 hover:text-rose-700 font-medium text-sm">
                View All
              </button>
            </div>

            {/* Profile Stats */}
            <div className="bg-white rounded-xl p-4 shadow-lg border border-rose-100/50">
              <h3 className="font-bold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Profile Views</span>
                  </div>
                  <span className="font-bold text-blue-600">89</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-gray-700">Interests Received</span>
                  </div>
                  <span className="font-bold text-red-600">23</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700">Mutual Matches</span>
                  </div>
                  <span className="font-bold text-yellow-600">7</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl p-4 text-white shadow-lg">
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Matches
                </button>
                <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center">
                  <Gift className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}