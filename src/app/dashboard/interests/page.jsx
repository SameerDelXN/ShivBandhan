"use client"
import { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  Eye, 
  CheckCircle, 
  X,
  Clock,
  MapPin,
  Calendar,
  Award,
  Star,
  MessageCircle,
  UserCheck,
  UserX,
  Badge,
  Briefcase,
  Camera,
  Sparkles,
  Users,
  Search,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Send,
  Mail
} from 'lucide-react';

export default function InterestsPage() {
  const [activeTab, setActiveTab] = useState('received');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock data for interests
  const sentInterests = [
    {
      id: 1,
      name: "Ananya Patel",
      age: 26,
      caste: "Gujarati",
      location: "Ahmedabad, Gujarat",
      occupation: "Marketing Manager",
      education: "MBA",
      image: null,
      status: "pending",
      sentDate: "2024-06-03",
      isOnline: true,
      badges: ["Recently Active"]
    },
    {
      id: 2,
      name: "Kavya Reddy",
      age: 24,
      caste: "Telugu",
      location: "Hyderabad, Telangana",
      occupation: "Software Developer",
      education: "B.Tech",
      image: null,
      status: "declined",
      sentDate: "2024-06-01",
      isOnline: false,
      badges: []
    },
    {
      id: 3,
      name: "Meera Sharma",
      age: 27,
      caste: "Rajasthani",
      location: "Jaipur, Rajasthan",
      occupation: "Doctor",
      education: "MBBS",
      image: null,
      status: "accepted",
      sentDate: "2024-05-30",
      isOnline: true,
      badges: ["Premium"]
    }
  ];

  const receivedInterests = [
    {
      id: 4,
      name: "Aarav Gupta",
      age: 28,
      caste: "Punjabi",
      location: "Delhi, NCR",
      occupation: "Business Analyst",
      education: "MBA",
      image: null,
      status: "pending",
      receivedDate: "2024-06-04",
      isOnline: true,
      badges: ["New", "Verified"]
    },
    {
      id: 5,
      name: "Vikram Singh",
      age: 30,
      caste: "Rajput",
      location: "Mumbai, Maharashtra",
      occupation: "Engineer",
      education: "B.Tech",
      image: null,
      status: "pending",
      receivedDate: "2024-06-03",
      isOnline: false,
      badges: ["Premium"]
    },
    {
      id: 6,
      name: "Rohit Jain",
      age: 26,
      caste: "Marwari",
      location: "Pune, Maharashtra",
      occupation: "CA",
      education: "Chartered Accountant",
      image: null,
      status: "accepted",
      receivedDate: "2024-06-02",
      isOnline: true,
      badges: ["Recently Active"]
    }
  ];

  const mutualInterests = [
    {
      id: 7,
      name: "Arjun Kumar",
      age: 29,
      caste: "Tamil",
      location: "Chennai, Tamil Nadu",
      occupation: "Product Manager",
      education: "MBA",
      image: null,
      status: "mutual",
      matchDate: "2024-05-28",
      isOnline: true,
      badges: ["Premium", "Verified"],
      lastMessage: "Hi! Thanks for accepting my interest 😊"
    },
    {
      id: 8,
      name: "Karthik Nair",
      age: 27,
      caste: "Malayalam",
      location: "Kochi, Kerala",
      occupation: "Data Scientist",
      education: "M.Tech",
      image: null,
      status: "mutual",
      matchDate: "2024-05-25",
      isOnline: false,
      badges: ["Recently Active"],
      lastMessage: "Would love to know more about you!"
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Declined
          </span>
        );
      case 'mutual':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <Heart className="w-3 h-3 mr-1" />
            Mutual Match
          </span>
        );
      default:
        return null;
    }
  };

  const getBadgeStyle = (badge) => {
    switch(badge) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Premium':
        return 'bg-amber-100 text-amber-800';
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Recently Active':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const InterestCard = ({ person, type }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300 hover:border-rose-200">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-rose-500" />
          </div>
          {person.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                {person.badges.includes('Verified') && (
                  <Shield className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {person.age} years
                </span>
                <span>{person.caste}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {person.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-1" />
                {person.occupation} • {person.education}
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(person.status)}
            </div>
          </div>

          {/* Badges */}
          {person.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {person.badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(badge)}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Last Message for Mutual Matches */}
          {type === 'mutual' && person.lastMessage && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 italic">"{person.lastMessage}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {type === 'sent' && `Sent: ${new Date(person.sentDate).toLocaleDateString()}`}
              {type === 'received' && `Received: ${new Date(person.receivedDate).toLocaleDateString()}`}
              {type === 'mutual' && `Matched: ${new Date(person.matchDate).toLocaleDateString()}`}
            </div>
            
            <div className="flex space-x-2">
              {type === 'received' && person.status === 'pending' && (
                <>
                  <button className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Decline
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Accept
                  </button>
                </>
              )}
              
              {type === 'sent' && person.status === 'pending' && (
                <button className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              )}
              
              {type === 'mutual' && (
                <>
                  <button className="flex items-center px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                </>
              )}
              
              {(type === 'sent' || type === 'received') && person.status !== 'pending' && (
                <button className="flex items-center px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getTabData = () => {
    switch(activeTab) {
      case 'sent':
        return sentInterests;
      case 'received':
        return receivedInterests;
      case 'mutual':
        return mutualInterests;
      default:
        return [];
    }
  };

  const getTabStats = () => {
    const pendingSent = sentInterests.filter(p => p.status === 'pending').length;
    const pendingReceived = receivedInterests.filter(p => p.status === 'pending').length;
    const mutualCount = mutualInterests.length;
    
    return { pendingSent, pendingReceived, mutualCount };
  };

  const stats = getTabStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">💌 Interests</h1>
                  <p className="text-gray-600">Manage your sent and received interests</p>
                </div>
                
                {/* Stats Overview */}
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">{stats.pendingReceived}</div>
                    <div className="text-xs text-gray-500">Pending Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.pendingSent}</div>
                    <div className="text-xs text-gray-500">Pending Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.mutualCount}</div>
                    <div className="text-xs text-gray-500">Mutual Matches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'received', label: 'Received', icon: Mail, count: receivedInterests.length },
                  { id: 'sent', label: 'Sent', icon: Send, count: sentInterests.length },
                  { id: 'mutual', label: 'Mutual', icon: Heart, count: mutualInterests.length }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-rose-500 text-rose-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
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
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {getTabData().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'sent' && 'No Interests Sent Yet'}
                    {activeTab === 'received' && 'No Interests Received Yet'}
                    {activeTab === 'mutual' && 'No Mutual Matches Yet'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'sent' && 'Start browsing profiles and express your interest!'}
                    {activeTab === 'received' && 'Your perfect match might be just around the corner!'}
                    {activeTab === 'mutual' && 'Keep exploring to find your mutual connections!'}
                  </p>
                  <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center mx-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Profiles
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getTabData().map((person) => (
                    <InterestCard key={person.id} person={person} type={activeTab} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}