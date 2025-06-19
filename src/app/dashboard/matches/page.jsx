"use client"
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { 
  Heart,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Star,
  CheckCircle,
  Lock,
  Camera,
  Clock,
  Crown,
  Sparkles,
  Filter,
  ArrowUpDown,
  Bookmark,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
  Navigation,
  Zap,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';

// Utility function to mask first names
const maskFirstName = (fullName) => {
  if (!fullName) return '****';
  const names = fullName.split(' ');
  if (names.length > 1) {
    return `${'*'.repeat(names[0].length)} ${names.slice(1).join(' ')}`;
  }
  return '****';
};

export default function MatchesPage() {
  const { user } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('compatibility');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  
  // Quick filter states
  const [quickFilters, setQuickFilters] = useState({
    withPhoto: false,
    verified: false,
    activeRecently: false,
    sameCity: false
  });

  useEffect(() => {
    setIsLoaded(true);
    fetchUsers(); 
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const calculateCompatibility = (userProfile, matchProfile) => {
  // List of expectation fields to compare with basic info
  const expectationFields = [
    { expectation: 'expectedCaste', matchField: 'caste' },
    { expectation: 'preferredCity', matchField: 'currentCity' },
    { expectation: 'expectedEducation', matchField: 'education' },
    { expectation: 'expectedHeight', matchField: 'height' },
    { expectation: 'expectedIncome', matchField: 'income' },
    { expectation: 'gotraDevak', matchField: 'gotraDevak' },
    { expectation: 'expectedAgeDifference', matchField: 'age' },
    // Add any additional fields here to maintain equal weightage
  ];

  const totalFields = expectationFields.length;
  const percentagePerField = 100 / totalFields; // 12.5% per field for 8 fields
  let matchedPercentage = 0;

  expectationFields.forEach(({ expectation, matchField }) => {
    const expectedValue = userProfile[expectation];
    const matchValue = matchProfile[matchField];
    
    // Skip if either value is missing
    if (!expectedValue || !matchValue) return;
    
    // Special handling for age difference
    if (expectation === 'expectedAgeDifference') {
      const userAge = calculateAge(userProfile.dob);
      const matchAge = matchProfile.age;
      const ageDiff = Math.abs(userAge - matchAge);
      
      if (expectedValue === '±1 year' && ageDiff <= 1) {
        matchedPercentage += percentagePerField;
      } else if (expectedValue === '±2 years' && ageDiff <= 2) {
        matchedPercentage += percentagePerField;
      } else if (expectedValue === '±3 years' && ageDiff <= 3) {
        matchedPercentage += percentagePerField;
      } else if (expectedValue === '±5 years' && ageDiff <= 5) {
        matchedPercentage += percentagePerField;
      }
    } 
    // For height ranges (e.g., "5'0" - 5'5"")
    else if (expectation === 'expectedHeight' && matchField === 'height') {
      const expectedRange = expectedValue.split('-').map(s => s.trim());
      if (expectedRange.length === 2) {
        const matchHeight = parseInt(matchValue.split("'")[0]);
        const minHeight = parseInt(expectedRange[0].split("'")[0]);
        const maxHeight = parseInt(expectedRange[1].split("'")[0]);
        
        if (matchHeight >= minHeight && matchHeight <= maxHeight) {
          matchedPercentage += percentagePerField;
        }
      }
    }
    // For income ranges (e.g., "₹5-10 Lakhs")
    else if (expectation === 'expectedIncome' && matchField === 'income') {
      if (expectedValue === matchValue) {
        matchedPercentage += percentagePerField;
      }
    }
    // For exact matches (caste, city, education, etc.)
    else if (expectedValue === matchValue) {
      matchedPercentage += percentagePerField;
    }
  });

  // Round to nearest integer percentage
  return Math.round(matchedPercentage);
};
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // First fetch the current user's full profile including expectations
      const currentUserRes = await fetch('/api/users/me');
      const currentUserData = await currentUserRes.json();
      
      // Then fetch potential matches
      const res = await fetch('/api/users/fetchAllUsers?limit=20&page=1');
      const data = await res.json();
      
      if (data.success) {
        const enriched = data.data.map(matchUser => {
          const compatibility = calculateCompatibility(currentUserData, {
            ...matchUser,
            age: calculateAge(matchUser.dob)
          });
          
          return {
            ...matchUser,
            age: calculateAge(matchUser.dob),
            profilePhoto: matchUser.profilePhoto || 'https://via.placeholder.com/200x250?text=Profile',
            hasPhoto: !!matchUser.profilePhoto,
            isBlurred: matchUser.subscription?.plan !== 'Premium',
            matchType: 'all',
            mutualMatch: false,
            interestSent: false,
            shortlisted: false,
            compatibility,
            bio: matchUser.bio || 'Looking for a compatible life partner.',
          };
        });
        
        setMatches(enriched);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Matches', count: matches.filter(m => m.compatibility > 0).length, icon: Users },
    { id: 'preferred', label: 'Preferred', count: matches.filter(m => m.compatibility >= 70).length, icon: Star },
    { id: 'new', label: 'New', count: matches.filter(m => m.isNew).length, icon: Sparkles },
    { id: 'nearby', label: 'Nearby', count: matches.filter(m => m.currentCity === user?.user?.currentCity).length, icon: Navigation }
  ];

  const filteredMatches = matches.filter(match => {
    if (match.compatibility <= 0) return false;
    if (activeTab !== 'all') {
      if (activeTab === 'preferred' && match.compatibility < 70) return false;
      if (activeTab === 'new' && !match.isNew) return false;
      if (activeTab === 'nearby' && match.currentCity !== user?.user?.currentCity) return false;
    }
    if (quickFilters.withPhoto && !match.hasPhoto) return false;
    if (quickFilters.verified && !match.isVerified) return false;
    if (quickFilters.activeRecently && match.lastActive.includes('day')) return false;
    if (quickFilters.sameCity && match.currentCity !== user?.user?.currentCity) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'compatibility') return b.compatibility - a.compatibility;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'recently_active') return new Date(b.lastActive) - new Date(a.lastActive);
    if (sortBy === 'age_low') return a.age - b.age;
    if (sortBy === 'age_high') return b.age - a.age;
    return 0;
  });

  const handleSendInterest = async (senderId, receiverId) => {
    try {
      const res = await fetch('/api/interest/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          receiverId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Interest sent:', data);
      } else {
        console.error('Failed to send interest:', data.message);
      }
    } catch (error) {
      console.error('Error sending interest:', error);
    }
  };

  const handleShortlist = (profileId) => {
    console.log('Shortlist profile:', profileId);
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const closeProfilePopup = () => {
    setSelectedProfile(null);
  };

  const ProfilePopup = ({ profile, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{maskFirstName(profile.name)}'s Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3">
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-amber-100 rounded-lg overflow-hidden">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={`${maskFirstName(profile.name)} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{maskFirstName(profile.name)}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600">{profile.age} years</span>
                    <span className="text-gray-600">{profile.height}</span>
                    <span className="text-gray-600">{profile.caste}</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-rose-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{profile.compatibility}% Match</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p>{profile.currentCity}, {profile.state}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span className="font-medium">Education</span>
                  </div>
                  <p>{profile.education}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="font-medium">Profession</span>
                  </div>
                  <p>{profile.occupation} at {profile.company}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">About</span>
                  </div>
                  <p>{profile.bio || 'No information provided'}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleSendInterest(user?.user?.id, profile._id)}
                  className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-rose-600 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Send Interest
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2 inline" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-bold text-lg mb-4">More Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Religion</h5>
                <p>{profile.religion || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Mother Tongue</h5>
                <p>{profile.motherTongue || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Marital Status</h5>
                <p>{profile.maritalStatus || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Blood Group</h5>
                <p>{profile.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Complexion</h5>
                <p>{profile.complexion || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Gotra/Devak</h5>
                <p>{profile.gotraDevak || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Rashi</h5>
                <p>{profile.rashi || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Nakshira</h5>
                <p>{profile.nakshira || 'Not specified'}</p>
              </div>
              <div>
                <h5 className="text-gray-500 text-sm mb-1">Last Active</h5>
                <p>{profile.lastActive || 'Recently'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MatchCard = ({ match }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {/* Mutual Match Banner */}
        {match.mutualMatch && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 px-3 z-10">
            <div className="flex items-center justify-center">
              <Heart className="w-3 h-3 mr-1 fill-current" />
              <span className="text-xs font-medium">It's a Match!</span>
            </div>
          </div>
        )}

        {/* Profile Image */}
        <div className={`aspect-[4/5] bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center relative ${match.mutualMatch ? 'mt-8' : ''}`}>
          {match.profilePhoto ? (
            <div className={`w-full h-full ${match.isBlurred ? 'blur-md' : ''}`}>
              <img
                src={match.profilePhoto}
                alt={`${maskFirstName(match.name)} profile`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No Photo</p>
            </div>
          )}
          
        

          {/* Badges */}
          <div className="absolute top-1 left-1 flex flex-col space-y-1">
            {match.isVerified && (
              <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
                <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                Verified
              </div>
            )}
            {match.subscription?.plan === 'Premium' && (
              <div className="bg-gradient-to-r from-amber-400 to-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
                <Crown className="w-2.5 h-2.5 mr-0.5" />
                Premium
              </div>
            )}
          </div>

          {/* Compatibility Score - Color Coded */}
          <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            <div className="flex items-center">
              <Star className={`w-2.5 h-2.5 mr-0.5 
                ${
                  match.compatibility >= 90 ? 'text-green-500' :
                  match.compatibility >= 70 ? 'text-orange-500' :
                  match.compatibility >= 50 ? 'text-yellow-500' :
                  'text-rose-500'
                }`} />
              <span className={`text-[10px] font-medium 
                ${
                  match.compatibility >= 90 ? 'text-green-700' :
                  match.compatibility >= 70 ? 'text-orange-700' :
                  match.compatibility >= 50 ? 'text-yellow-700' :
                  'text-rose-700'
                }`}>
                {match.compatibility}%
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{maskFirstName(match.name)}</h3>
            <div className="flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-[10px] text-gray-500">{match.lastActive}</span>
            </div>
          </div>
          
          <div className="space-y-0.5 text-xs text-gray-600 mb-2">
            <div className="flex items-center">
              <Calendar className="w-2.5 h-2.5 mr-1" />
              <span>{match.age} yrs • {match.height}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-2.5 h-2.5 mr-1" />
              <span>{match.currentCity}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-2.5 h-2.5 mr-1" />
              <span className="truncate">{match.education}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1.5">
            {match.mutualMatch ? (
              <button className="flex-1 bg-green-50 text-green-600 py-1 px-2 rounded text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center">
                <MessageCircle className="w-3 h-3 mr-0.5" />
                Chat
              </button>
            ) : match.interestSent ? (
              <button className="flex-1 bg-gray-100 text-gray-500 py-1 px-2 rounded text-xs font-medium cursor-not-allowed">
                Interest Sent
              </button>
            ) : (
              <button 
                onClick={() => handleSendInterest(user?.user?.id, match._id)}
                className="flex-1 bg-rose-50 text-rose-600 py-1 px-2 rounded text-xs font-medium hover:bg-rose-100 transition-colors flex items-center justify-center"
              >
                <Heart className="w-3 h-3 mr-0.5" />
                Interest
              </button>
            )}
            
            <button 
              onClick={() => handleViewProfile(match)}
              className="flex-1 bg-gray-50 text-gray-600 py-1 px-2 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              View
            </button>
            
            <button 
              onClick={() => handleShortlist(match.id)}
              className={`p-1.5 rounded transition-colors ${
                match.shortlisted 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${match.shortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-rose-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Try updating your preferences or keep checking back — someone special may join soon!
      </p>
      <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors">
        Edit Preferences
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden mb-4 sm:mb-6">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Your Personalized Matches</h1>
              <p className="text-rose-100 text-sm sm:text-base">Discover profiles selected just for you</p>
            </div>
          </div>
        </div>

        {/* Match Type Tabs */}
        <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-rose-100/50 p-1 sm:p-2 mb-4 sm:mb-6">
            <div className="flex overflow-x-auto space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white shadow-sm sm:shadow-md'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{tab.label}</span>
                    <span className={`ml-1 sm:ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Filters & Sorting */}
        <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-rose-100/50 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              
              {/* Quick Filters */}
              <div className="flex-1">
                <button
                  onClick={() => setShowQuickFilters(!showQuickFilters)}
                  className="flex items-center text-gray-700 hover:text-rose-600 transition-colors text-sm"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="font-medium">Quick Filters</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 transition-transform ${showQuickFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showQuickFilters && (
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={quickFilters.withPhoto}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, withPhoto: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                      />
                      <span>With Photo</span>
                    </label>
                    
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={quickFilters.verified}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, verified: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                      />
                      <span>Verified Only</span>
                    </label>
                    
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={quickFilters.activeRecently}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, activeRecently: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                      />
                      <span>Active Recently</span>
                    </label>
                    
                    <label className="flex items-center text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={quickFilters.sameCity}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, sameCity: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                      />
                      <span>Same City</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-xs sm:text-sm"
                >
                  <option value="compatibility">Most Compatible</option>
                  <option value="newest">Newest First</option>
                  <option value="recently_active">Recently Active</option>
                  <option value="age_low">Age: Low to High</option>
                  <option value="age_high">Age: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                <span>{filteredMatches.length} matches found</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-rose-600">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                <span>Upgrade to see more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Results */}
        <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {filteredMatches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredMatches.length > 0 && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="bg-white border border-rose-300 text-rose-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? 'Loading...' : 'Load More Matches'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Popup */}
      {selectedProfile && (
        <ProfilePopup profile={selectedProfile} onClose={closeProfilePopup} />
      )}
    </div>
  );
}