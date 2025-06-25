"use client"
import { useState, useEffect } from 'react';
import { 
  User, Heart, Eye, CheckCircle, Clock, Crown, ArrowRight, Bell, MapPin, Calendar, Award, TrendingUp, Star, Gift, Sparkles, UserPlus, MessageCircle, Camera
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import Link from 'next/link';


export default function MatrimonialDashboard() {
  const { user } = useSession();
  const [userData, setUserData] = useState({ name: '', profileCompletion: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const fetchUserData = async () => {
    try {
      const response = await fetch('/dashboard/profile/me');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { name: 'User', profileCompletion: 0 };
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = await fetchUserData();
      setUserData({
        name: data.name || user?.user?.name || 'User',
        profileCompletion: data.profileCompletion || 0
      });
      setIsLoaded(true);
    };
    
    loadData();
  }, [user]);

  // Skeleton components
  const SkeletonCard = ({ className = '', height = 'h-32' }) => (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${height} ${className}`}></div>
  );

  const SkeletonCircle = ({ size = 'w-12 h-12' }) => (
    <div className={`bg-gray-200 rounded-full animate-pulse ${size}`}></div>
  );

  const SkeletonText = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${width} ${height} mb-2`}></div>
  );

  const quickMatches = [
    { id: 1, name: "A***a", age: 25, location: "Mumbai", compatibility: 92 },
    { id: 2, name: "P***i", age: 27, location: "Delhi", compatibility: 88 },
    { id: 3, name: "S***a", age: 24, location: "Bangalore", compatibility: 85 },
    { id: 4, name: "R***i", age: 26, location: "Pune", compatibility: 90 },
  ];

  const recentActivity = [
    { type: "view", message: "Someone viewed your profile", time: "2 hours ago", icon: Eye },
    { type: "interest", message: "New interest received", time: "5 hours ago", icon: Heart },
    { type: "match", message: "You have a new match!", time: "1 day ago", icon: Star },
    { type: "message", message: "Someone sent you a message", time: "2 days ago", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section Skeleton */}
        {!isLoaded ? (
          <SkeletonCard height="h-32" />
        ) : (
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || user?.user?.name}! 👋</h1>
                    <p className="text-rose-100">Your perfect match is just a click away</p>
                  </div>
                  <div className="hidden md:block">
                    <Sparkles className="w-12 h-12 text-rose-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Completion & Stats Row Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Total Matches */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Total Matches</h3>
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">147</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12 this week
                </div>
              </div>
            </div>

            {/* Profile Views */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Profile Views</h3>
                <Eye className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="flex items-center text-sm text-blue-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Last 30 days
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Premium Plan</h3>
                <Crown className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold">Active</div>
                <div className="text-sm text-white/80">Expires: Dec 15, 2024</div>
                <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Profile & Quick Actions Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonCard height="h-64" />
            <div className="lg:col-span-2 space-y-4">
              <SkeletonText width="w-1/3" height="h-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} height="h-40" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* My Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-rose-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{user?.name || user?.user?.name}</h3>
                <div className="flex items-center justify-center mb-4">
                  <Award className="w-4 h-4 text-green-500 mr-1" />
                  <span className={`text-sm ${user?.isVerified || user?.user?.isVerified ? "text-green-600" : "text-slate-400"} font-medium`}>
                    {user?.isVerified || user?.user?.isVerified ? "Verified Profile" : "Unverified Profile"}
                  </span>
                </div>
                <Link href={"/dashboard/profile/me"} className="w-full bg-gradient-to-r px-3 from-rose-500 to-rose-600 text-white py-2 rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-all duration-300">
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Quick Match Suggestions */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Quick Match Suggestions</h3>
                <button className="flex items-center text-rose-600 hover:text-rose-700 font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickMatches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-rose-500" />
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-700">{match.compatibility}%</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{match.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{match.age} years • {match.location}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-rose-50 text-rose-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
                        <Heart className="w-4 h-4 inline mr-1" />
                        Interest
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity & Notifications Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SkeletonText width="w-1/3" height="h-6" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg">
                  <SkeletonCircle />
                  <div className="flex-1 space-y-2">
                    <SkeletonText width="w-3/4" />
                    <SkeletonText width="w-1/2" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <SkeletonText width="w-1/3" height="h-6" />
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} height="h-24" />
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
                <Bell className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-rose-50/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-4 text-rose-600 hover:text-rose-700 font-medium text-sm">
                View All Activities
              </button>
            </div>

            {/* Interests Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Interests Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Interests Received</p>
                      <p className="text-sm text-gray-600">People interested in you</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-xs text-gray-500">New: 5</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Interests Sent</p>
                      <p className="text-sm text-gray-600">Your sent interests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-500">Pending: 8</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Mutual Matches</p>
                      <p className="text-sm text-gray-600">Perfect connections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rose-600">7</div>
                    <div className="text-xs text-gray-500">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Skeleton */}
        {!isLoaded ? (
          <SkeletonCard height="h-24" />
        ) : (
          <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-xl mb-2">Ready to find your perfect match?</h3>
                  <p className="text-rose-100">Explore personalized matches based on your preferences</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Browse Matches
                  </button>
                  <button className="bg-white text-rose-600 px-6 py-3 rounded-lg font-medium hover:bg-rose-50 transition-all duration-300 flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}