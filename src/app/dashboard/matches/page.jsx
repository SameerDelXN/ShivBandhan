"use client"
import { useState, useEffect } from 'react';
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

export default function MatchesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('compatibility');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Quick filter states
  const [quickFilters, setQuickFilters] = useState({
    withPhoto: true,
    verified: false,
    activeRecently: false,
    sameCity: false
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample match data with different match types
  const sampleMatches = [
    {
      id: 1,
      name: "A***a S***a",
      age: 25,
      height: "5'4\"",
      caste: "Brahmin",
      city: "Mumbai",
      state: "Maharashtra",
      education: "MBA",
      profession: "Marketing Manager",
      company: "Tech Corp",
      verified: true,
      premium: false,
      lastActive: "2 hours ago",
      compatibility: 95,
      hasPhoto: true,
      isBlurred: false,
      matchType: "preferred",
      mutualMatch: false,
      interestSent: false,
      shortlisted: false,
      bio: "Looking for a life partner who shares similar values and dreams"
    },
    {
      id: 2,
      name: "P***i G***a",
      age: 27,
      height: "5'3\"",
      caste: "Kshatriya",
      city: "Delhi",
      state: "Delhi",
      education: "B.Tech",
      profession: "Software Engineer",
      company: "IT Solutions",
      verified: true,
      premium: true,
      lastActive: "1 day ago",
      compatibility: 92,
      hasPhoto: true,
      isBlurred: false,
      matchType: "all",
      mutualMatch: true,
      interestSent: true,
      shortlisted: true,
      bio: "Family-oriented person with a passion for technology"
    },
    {
      id: 3,
      name: "S***a P***l",
      age: 24,
      height: "5'2\"",
      caste: "Vaishya",
      city: "Bangalore",
      state: "Karnataka",
      education: "M.Com",
      profession: "Chartered Accountant",
      company: "Finance Ltd",
      verified: false,
      premium: false,
      lastActive: "3 days ago",
      compatibility: 88,
      hasPhoto: false,
      isBlurred: true,
      matchType: "new",
      mutualMatch: false,
      interestSent: false,
      shortlisted: false,
      bio: "Traditional values with modern outlook"
    },
    {
      id: 4,
      name: "R***i K***r",
      age: 26,
      height: "5'5\"",
      caste: "Brahmin",
      city: "Pune",
      state: "Maharashtra",
      education: "MBBS",
      profession: "Doctor",
      company: "City Hospital",
      verified: true,
      premium: true,
      lastActive: "5 hours ago",
      compatibility: 94,
      hasPhoto: true,
      isBlurred: false,
      matchType: "nearby",
      mutualMatch: false,
      interestSent: false,
      shortlisted: false,
      bio: "Dedicated healthcare professional seeking meaningful connection"
    },
    {
      id: 5,
      name: "M***a T***a",
      age: 23,
      height: "5'1\"",
      caste: "Brahmin",
      city: "Chennai",
      state: "Tamil Nadu",
      education: "B.E.",
      profession: "Software Developer",
      company: "Tech Startup",
      verified: true,
      premium: false,
      lastActive: "6 hours ago",
      compatibility: 90,
      hasPhoto: true,
      isBlurred: false,
      matchType: "new",
      mutualMatch: false,
      interestSent: false,
      shortlisted: false,
      bio: "Creative mind with strong family values"
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Matches', count: 247, icon: Users },
    { id: 'preferred', label: 'Preferred', count: 45, icon: Star },
    { id: 'new', label: 'New', count: 12, icon: Sparkles },
    { id: 'nearby', label: 'Nearby', count: 18, icon: Navigation }
  ];

  const filteredMatches = sampleMatches.filter(match => {
    if (activeTab !== 'all' && match.matchType !== activeTab) return false;
    if (quickFilters.withPhoto && !match.hasPhoto) return false;
    if (quickFilters.verified && !match.verified) return false;
    if (quickFilters.activeRecently && match.lastActive.includes('day')) return false;
    if (quickFilters.sameCity && match.city !== 'Pune') return false;
    return true;
  });

  const handleSendInterest = (profileId) => {
    // Handle send interest logic
    console.log('Send interest to:', profileId);
  };

  const handleShortlist = (profileId) => {
    // Handle shortlist logic
    console.log('Shortlist profile:', profileId);
  };

  const MatchCard = ({ match }) => (
    <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        
        {/* Mutual Match Banner */}
        {match.mutualMatch && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 z-10">
            <div className="flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2 fill-current" />
              <span className="text-sm font-medium">It's a Match! 💚</span>
            </div>
          </div>
        )}

        {/* Profile Image */}
        <div className={`aspect-[4/5] bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center relative ${match.mutualMatch ? 'mt-10' : ''}`}>
          {match.hasPhoto ? (
            <div className={`w-full h-full flex items-center justify-center ${match.isBlurred ? 'blur-md' : ''}`}>
              <User className="w-16 h-16 text-rose-500" />
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No Photo</p>
            </div>
          )}
          
          {/* Overlay for locked profiles */}
          {match.isBlurred && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <Lock className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 text-center">Upgrade to view</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {match.verified && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </div>
            )}
            {match.premium && (
              <div className="bg-gradient-to-r from-amber-400 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            )}
          </div>

          {/* Compatibility Score */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">{match.compatibility}%</span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {match.shortlisted && (
              <div className="bg-blue-500 text-white p-1 rounded-full">
                <Bookmark className="w-3 h-3 fill-current" />
              </div>
            )}
            {match.interestSent && (
              <div className="bg-rose-500 text-white p-1 rounded-full">
                <Heart className="w-3 h-3 fill-current" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">{match.name}</h3>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{match.lastActive}</span>
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{match.age} years • {match.height}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{match.city}, {match.state} • {match.caste}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-3 h-3 mr-1" />
              <span>{match.education}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-3 h-3 mr-1" />
              <span>{match.profession}</span>
            </div>
          </div>

          {/* Bio Preview */}
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{match.bio}</p>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {match.mutualMatch ? (
              <button className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat Now
              </button>
            ) : match.interestSent ? (
              <button className="flex-1 bg-gray-100 text-gray-500 py-2 px-3 rounded-lg text-sm font-medium cursor-not-allowed">
                Interest Sent
              </button>
            ) : (
              <button 
                onClick={() => handleSendInterest(match.id)}
                className="flex-1 bg-rose-50 text-rose-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors flex items-center justify-center"
              >
                <Heart className="w-4 h-4 mr-1" />
                Send Interest
              </button>
            )}
            
            <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              View Profile
            </button>
            
            <button 
              onClick={() => handleShortlist(match.id)}
              className={`p-2 rounded-lg transition-colors ${
                match.shortlisted 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${match.shortlisted ? 'fill-current' : ''}`} />
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
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">Your Personalized Matches</h1>
              <p className="text-rose-100">Discover profiles selected just for you</p>
            </div>
          </div>
        </div>

        {/* Match Type Tabs */}
        <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 p-2 mb-6">
            <div className="flex overflow-x-auto space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    <span>{tab.label}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
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
          <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Quick Filters */}
              <div className="flex-1">
                <button
                  onClick={() => setShowQuickFilters(!showQuickFilters)}
                  className="flex items-center text-gray-700 hover:text-rose-600 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <span className="font-medium">Quick Filters</span>
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showQuickFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showQuickFilters && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quickFilters.withPhoto}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, withPhoto: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">With Photo</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quickFilters.verified}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, verified: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">Verified Only</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quickFilters.activeRecently}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, activeRecently: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">Active Recently</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={quickFilters.sameCity}
                        onChange={(e) => setQuickFilters(prev => ({ ...prev, sameCity: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">Same City</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-3">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
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
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{filteredMatches.length} matches found</span>
              </div>
              <div className="flex items-center text-sm text-rose-600">
                <Sparkles className="w-4 h-4 mr-1" />
                <span>Upgrade to see unlimited matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Results */}
        <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {filteredMatches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredMatches.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="bg-white border border-rose-300 text-rose-600 px-8 py-3 rounded-lg font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More Matches'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}