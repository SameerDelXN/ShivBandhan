"use client"
import { useState, useEffect } from 'react';
import { 
  User, Heart, Eye, CheckCircle, X, Clock, MapPin, Calendar, 
  Briefcase, Shield, ThumbsUp, ThumbsDown, Send, Mail, 
  Loader2, RefreshCw, Search
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function InterestsPage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('received');
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInterests = async (type) => {
    try {
      if (!user?.id ? user.id : user?.user?.id) return [];
      
      const endpoint = type === 'send' 
        ? `/api/interest/send?userId=${user?.id ? user.id : user.user.id}`
        : `/api/interest/received?userId=${user?.id ? user.id : user.user.id}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(`Fetched ${type} interests:`, data);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await data
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
    console.log(`Handling action: ${action} for interest ID: ${interestId}`);
    try {
      const response = await fetch('/api/interest/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status : action, interestId })
      });

      if (!response.ok) throw new Error('Action failed');
      
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

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
        default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        );;
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

  const formatName = (name, status) => {
    if (!name) return '';
    if (status === 'accepted') return name;
    
    // Split name into parts
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return '****'; // If only one name
    
    // Mask first name and show last name
    const maskedFirstName = '****';
    const lastName = nameParts[nameParts.length - 1];
    return `${maskedFirstName} ${lastName}`;
  };

  const InterestCard = ({ person, type }) => (
    console.log('Rendering InterestCard for:', person),
    <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300 hover:border-rose-200">
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
            {person.image ? (
              <img src={person.image} alt={person.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-rose-500" />
            )}
          </div>
          {person.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {type === "sent" 
                    ? formatName(person?.receiver?.name, person.status) 
                    : formatName(person?.sender?.name, person.status)}
                </h3>
                {person.badges?.includes('Verified') && (
                  <Shield className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {type==="sent" ? person.receiver?.dob : person.sender?.dob} years
                </span>
                <span>{type==="sent" ? person.receiver?.caste : person?.sender?.caste}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {type==="sent" ? person.receiver?.currentCity : person.sender?.currentCity}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-1" />
                {type==="sent" ? person.receiver?.occupation : person.sender?.occupation} • {type==="sent" ? person.receiver?.education :person.sender?.education}
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(person.status)}
            </div>
          </div>

          {person.badges?.length > 0 && (
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

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {type === 'sent' && `Sent: ${new Date(person.createdAt).toLocaleDateString()}`}
              {type === 'received' && `Received: ${new Date(person.createdAt).toLocaleDateString()}`}
            </div>
            
            <div className="flex space-x-2">
              {type === 'received' && person.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleInterestAction('declined', person._id)}
                    className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Decline
                  </button>
                  <button 
                    onClick={() => handleInterestAction('accepted', person._id)}
                    className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Accept
                  </button>
                </>
              )}
              
              {type === 'sent' && person.status === 'pending' && (
                <button 
                  onClick={() => handleInterestAction('cancel', person._id)}
                  className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              )}
              
              {(type === 'sent' || type === 'received') && person.status === 'accepted' && (
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
      default:
        return [];
    }
  };

  const getTabStats = () => {
    const pendingSent = sentInterests?.filter(p => p.status === 'pending').length;
    const pendingReceived = receivedInterests?.length > 0 ? receivedInterests?.filter(p => p.status === 'pending').length : null;
    
    return { 
      pendingSent, 
      pendingReceived
    };
  };

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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100/50 relative overflow-hidden">
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
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Pending Sent</div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'received', label: 'Received', icon: Mail, count: receivedInterests.length },
                { id: 'sent', label: 'Sent', icon: Send, count: sentInterests.length }
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

          <div className="p-6">
            {getTabData().length === 0 ? (
              <div className="text-center py-12">
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
                <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center mx-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Profiles
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getTabData()?.length > 0 ? (
                  getTabData()?.map((person) => (
                    <InterestCard key={person.id} person={person} type={activeTab} />
                  ))
                ) : (
                  <div>No data available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}