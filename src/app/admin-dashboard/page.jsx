"use client"
import { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  CheckCircle, 
  Crown,
  DollarSign,
  Shield,
  TrendingUp,
  BarChart3,
  XCircle ,
  Flag
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa6';   
import { useAuth } from '@/context/AuthContext';
export default function AdminDashboard() {
  const {user } = useAuth()
  console.log("user = ",user)
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { title: 'Total Users', value: '12,453', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Profiles', value: '8,721', change: '+8%', icon: CheckCircle, color: 'green' },
    { title: 'Premium Members', value: '2,341', change: '+15%', icon: Crown, color: 'amber' },
    { title: 'Daily Matches', value: '456', change: '+23%', icon: Heart, color: 'rose' },
    { title: 'Revenue (₹)', value: '4,56,780', change: '+18%', icon: DollarSign, color: 'emerald' },
    { title: 'Pending Verifications', value: '89', change: '-5%', icon: Shield, color: 'orange' },
  ];

  const recentUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', status: 'Active', plan: 'Premium', joined: '2 hours ago', verified: true },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', status: 'Pending', plan: 'Free', joined: '5 hours ago', verified: false },
    { id: 3, name: 'Anita Patel', email: 'anita@example.com', status: 'Active', plan: 'Gold', joined: '1 day ago', verified: true },
    { id: 4, name: 'Vikash Singh', email: 'vikash@example.com', status: 'Inactive', plan: 'Premium', joined: '2 days ago', verified: true },
  ];

  const pendingVerifications = [
    { id: 1, name: 'Sneha Gupta', type: 'Identity', submitted: '30 mins ago', status: 'pending' },
    { id: 2, name: 'Arjun Mehta', type: 'Education', submitted: '2 hours ago', status: 'pending' },
    { id: 3, name: 'Kavya Reddy', type: 'Income', submitted: '4 hours ago', status: 'pending' },
    { id: 4, name: 'Rohit Jain', type: 'Photos', submitted: '6 hours ago', status: 'pending' },
  ];

  return (
    <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600 bg-blue-100 text-blue-600',
              green: 'from-green-500 to-green-600 bg-green-100 text-green-600',
              amber: 'from-amber-500 to-amber-600 bg-amber-100 text-amber-600',
              rose: 'from-rose-500 to-rose-600 bg-rose-100 text-rose-600',
              emerald: 'from-emerald-500 to-emerald-600 bg-emerald-100 text-emerald-600',
              orange: 'from-orange-500 to-orange-600 bg-orange-100 text-orange-600',
            };
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">vs last week</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color].split(' ')[2]} ${colorClasses[stat.color].split(' ')[3]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <div className="h-64 bg-gradient-to-br from-rose-50 to-amber-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-rose-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Match Success Rate */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Success Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Successful Matches</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pending Interests</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Declined</span>
                  <span className="font-medium">7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-rose-50/50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-600' :
                          user.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {user.status}
                        </span>
                        {user.verified && <Shield className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-lg border border-rose-100/50">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingVerifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-rose-50/50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type} Verification</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <button className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.submitted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}