"use client"
import { useState, useEffect } from 'react';
import { 
  User, Heart, Eye, CheckCircle, X, Clock, MapPin, Calendar, 
  Briefcase, Shield, ThumbsUp, ThumbsDown, Send, Mail, 
  Loader2, RefreshCw, Search, ChevronDown, ChevronUp, Phone, Globe, MessageSquare
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterestsPage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('received');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    professional: false,
    family: false,
    lifestyle: false
  });

  const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchInterests = async (type) => {
    try {
      if (!user?.id ? user.id : user?.user?.id) return [];
      const endpoint = type === 'send' 
        ? `/api/interest/send?userId=${user?.id ? user.id : user.user.id}`
        : `/api/interest/received?userId=${user?.id ? user.id : user.user.id}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch data');
      return await data;
    } catch (err) {
      throw err;
    }
  };

  const loadAllData = async () => {
    if (!user?.id ? user.id : user?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [sent, received] = await Promise.all([
        fetchInterests('send'),
        fetchInterests('received')
      ]);
      setSentInterests(sent.interests || []);
      setReceivedInterests(received.interests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  const handleInterestAction = async (action, interestId) => {
    try {
      const response = await fetch('/api/interest/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, interestId })
      });
      if (!response.ok) throw new Error('Action failed');
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewProfile = (person, type) => {
    const profileData = type === 'sent' ? person.receiver : person.sender;
    setSelectedProfile({
      ...profileData,
      image: profileData.profilePhoto || profileData.image
    });
    setShowModal(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>;
      case 'accepted':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Accepted
        </span>;
      case 'declined':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Declined
        </span>;
      default: return null;
    }
  };

  const getBadgeStyle = (badge) => {
    switch(badge) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-amber-100 text-amber-800';
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Recently Active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatName = (name, type, status) => {
    if (!name) return '';
    // Always show full name in received section
    if (type === 'received') return name;
    // For sent section, show full name only if accepted
    if (status === 'accepted') return name;
    
    // Split name into parts
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return '****'; // If only one name
    
    // Mask first name and show last name
    const maskedFirstName = '****';
    const lastName = nameParts[nameParts.length - 1];
    return `${maskedFirstName} ${lastName}`;
  };

  const InterestCard = ({ person, type }) => {
    const profile = type === 'sent' ? person.receiver : person.sender;
    const profileImage = profile.profilePhoto || profile.image;
    
    return (
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300 hover:border-rose-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-rose-300 transition-all"
              onClick={() => profileImage && setExpandedImage(profileImage)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profileImage ? (
                <img src={profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-rose-500" />
              )}
            </motion.div>
            {profile.isOnline && (
              <motion.div 
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                  {profile.badges?.includes('Verified') && <Shield className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {calculateAge(profile.dob)} years
                  </span>
                  <span>{profile.caste}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.currentCity}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {profile.occupation} • {profile.education}
                </div>
              </div>
              <div className="text-right">{getStatusBadge(person.status)}</div>
            </div>

            {profile.badges?.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {profile.badges.map((badge, index) => (
                  <motion.span 
                    key={index} 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(badge)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.2 + (index * 0.1),
                      type: "spring",
                      stiffness: 500,
                      damping: 15
                    }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {type === 'sent' ? `Sent: ${new Date(person.createdAt).toLocaleDateString()}` : 
                 `Received: ${new Date(person.createdAt).toLocaleDateString()}`}
              </div>
              
              <div className="flex space-x-2">
                {type === 'received' && person.status === 'pending' && (
                  <>
                    <motion.button 
                      onClick={() => handleInterestAction('declined', person._id)}
                      className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" /> Decline
                    </motion.button>
                    <motion.button 
                      onClick={() => handleInterestAction('accepted', person._id)}
                      className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" /> Accept
                    </motion.button>
                  </>
                )}
                
                {type === 'sent' && person.status === 'pending' && (
                  <motion.button 
                    onClick={() => handleInterestAction('cancel', person._id)}
                    className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </motion.button>
                )}
                
                {(type === 'sent' || type === 'received') && person.status === 'accepted' && (
                  <motion.button 
                    onClick={() => handleViewProfile(person, type)}
                    className="flex items-center px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View Profile
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ProfileDetailItem = ({ icon: Icon, label, value }) => (
    <motion.div 
      className="flex items-start mb-3"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="w-5 h-5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-gray-900">{value || 'Not specified'}</div>
      </div>
    </motion.div>
  );

  const ProfileSection = ({ title, children, sectionKey }) => (
    <div className="mb-6">
      <motion.button 
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
        whileHover={{ color: "#f43f5e" }}
      >
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const getTabData = () => activeTab === 'sent' ? sentInterests : receivedInterests;
  const getTabStats = () => ({
    pendingSent: sentInterests?.filter(p => p.status === 'pending').length,
    pendingReceived: receivedInterests?.filter(p => p.status === 'pending').length
  });

  const stats = getTabStats();

  if (isLoading && !isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading your interests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading interests</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      {/* Expanded Image Viewer */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 z-60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div 
              className="relative bg-white rounded-lg shadow-xl border-2 border-rose-500 overflow-hidden w-full max-w-md mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring" }}
            >
              {/* Header */}
              <div className="bg-rose-500 p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Profile Picture</span>
                </div>
                <motion.button
                  onClick={() => setExpandedImage(null)}
                  className="p-1 rounded-full hover:bg-rose-600 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              
              {/* Image container */}
              <div className="p-4">
                <div className="relative pt-[100%]">
                  <img 
                    src={expandedImage} 
                    alt="Expanded profile" 
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-rose-50 p-3 border-t border-rose-200 flex justify-center">
                <span className="text-rose-800 text-sm font-medium">
                  Shivbandhan Matrimony
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">💌 Interests</h1>
                <p className="text-gray-600">Manage your sent and received interests</p>
              </div>
              
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Pending Received</div>
                  <div className="text-lg font-bold">{stats.pendingReceived || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Pending Sent</div>
                  <div className="text-lg font-bold">{stats.pendingSent || 0}</div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <motion.button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.8 }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-rose-100/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'received', label: 'Received', icon: Mail, count: receivedInterests.length },
                { id: 'sent', label: 'Sent', icon: Send, count: sentInterests.length }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-rose-100 text-rose-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {getTabData().length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'sent' ? 'No Interests Sent Yet' : 'No Interests Received Yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'sent' 
                    ? 'Start browsing profiles and express your interest!' 
                    : 'Your perfect match might be just around the corner!'}
                </p>
                <motion.button 
                  className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Profiles
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getTabData()?.map((person, index) => (
                  <InterestCard 
                    key={person._id} 
                    person={person} 
                    type={activeTab}
                    custom={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile Modal with Framer Motion */}
      <AnimatePresence>
        {showModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <motion.div 
                className="sticky top-0 bg-gradient-to-r from-rose-500 to-amber-500 p-4 z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <motion.h2 
                    className="text-xl font-bold text-white"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedProfile.name}'s Profile
                  </motion.h2>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Modal Content */}
              <div className="overflow-y-auto p-6">
                {/* Profile Header with Animation */}
                <motion.div 
                  className="flex items-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative mr-6">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-4 hover:ring-rose-200 transition-all"
                      onClick={() => (selectedProfile.profilePhoto || selectedProfile.image) && setExpandedImage(selectedProfile.profilePhoto || selectedProfile.image)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedProfile.profilePhoto ? (
                        <img 
                          src={selectedProfile.profilePhoto} 
                          alt={selectedProfile.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : selectedProfile.image ? (
                        <img 
                          src={selectedProfile.image} 
                          alt={selectedProfile.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-rose-500" />
                      )}
                    </motion.div>
                    {selectedProfile.isOnline && (
                      <motion.div 
                        className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      />
                    )}
                  </div>
                  
                  <div>
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-1"
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {selectedProfile.name}
                    </motion.h3>
                    <motion.div 
                      className="flex items-center text-gray-600 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="mr-3">{calculateAge(selectedProfile.dob)} years</span>
                      <span>{selectedProfile.height}</span>
                    </motion.div>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {selectedProfile.badges?.map((badge, index) => (
                        <motion.span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(badge)}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            delay: 0.6 + (index * 0.1),
                            type: "spring",
                            stiffness: 500,
                            damping: 15
                          }}
                        >
                          {badge}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Sections with Accordion Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <ProfileSection title="Basic Information" sectionKey="basic">
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <ProfileDetailItem icon={User} label="Gender" value={selectedProfile.gender} />
                      <ProfileDetailItem 
                        icon={Calendar} 
                        label="Date of Birth" 
                        value={selectedProfile.dob ? new Date(selectedProfile.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not specified'}
                      />
                      <ProfileDetailItem icon={MapPin} label="Current City" value={selectedProfile.currentCity} />
                      <ProfileDetailItem icon={MapPin} label="Hometown" value={selectedProfile.hometown} />
                      <ProfileDetailItem icon={Shield} label="Religion" value={selectedProfile.religion} />
                      <ProfileDetailItem icon={Shield} label="Caste" value={selectedProfile.caste} />
                      <ProfileDetailItem icon={Shield} label="Subcaste" value={selectedProfile.subcaste} />
                      <ProfileDetailItem icon={Shield} label="Marital Status" value={selectedProfile.maritalStatus} />
                    </motion.div>
                  </ProfileSection>
                  
                  <ProfileSection title="Professional Information" sectionKey="professional">
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <ProfileDetailItem icon={Briefcase} label="Occupation" value={selectedProfile.occupation} />
                      <ProfileDetailItem icon={Briefcase} label="Employer" value={selectedProfile.employer} />
                      <ProfileDetailItem icon={Briefcase} label="Annual Income" value={selectedProfile.income} />
                      <ProfileDetailItem icon={Briefcase} label="Education" value={selectedProfile.education} />
                      <ProfileDetailItem icon={Briefcase} label="Degree" value={selectedProfile.degree} />
                      <ProfileDetailItem icon={Briefcase} label="College" value={selectedProfile.college} />
                    </motion.div>
                  </ProfileSection>
                  
                  <ProfileSection title="Family Details" sectionKey="family">
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <ProfileDetailItem icon={User} label="Father's Occupation" value={selectedProfile.fatherOccupation} />
                      <ProfileDetailItem icon={User} label="Mother's Occupation" value={selectedProfile.motherOccupation} />
                      <ProfileDetailItem icon={User} label="Siblings" value={selectedProfile.siblings} />
                      <ProfileDetailItem icon={User} label="Family Type" value={selectedProfile.familyType} />
                      <ProfileDetailItem icon={User} label="Family Values" value={selectedProfile.familyValues} />
                      <ProfileDetailItem icon={User} label="Family Status" value={selectedProfile.familyStatus} />
                    </motion.div>
                  </ProfileSection>
                  
                  <ProfileSection title="Lifestyle & Preferences" sectionKey="lifestyle">
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <ProfileDetailItem icon={Heart} label="Diet" value={selectedProfile.diet} />
                      <ProfileDetailItem icon={Heart} label="Drink" value={selectedProfile.drink} />
                      <ProfileDetailItem icon={Heart} label="Smoke" value={selectedProfile.smoke} />
                      <ProfileDetailItem icon={Heart} label="Hobbies" value={selectedProfile.hobbies} />
                      <ProfileDetailItem icon={Heart} label="Languages" value={selectedProfile.languages} />
                    </motion.div>
                  </ProfileSection>
                </motion.div>
                
                {/* Action Buttons with Animation */}
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button 
                    className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Send Message
                  </motion.button>
                  <motion.button 
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 4px 12px rgba(244, 63, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Request Contact
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}