"use client"
import Verification from '../verification/page';
import { useState, useEffect } from 'react';
//sample
import { 
  Users, 
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
  Search,
  Clock,
  Bell,
  Shield,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  UserPlus,
  UserMinus,
  Flag,
  Mail,
  Phone,
  Ban,
  CheckSquare,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  MessageSquare,
  Zap,
  Target,
  Globe,
  Wifi,
  Database,
  Server,
  MonitorSpeaker
} from 'lucide-react';

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const adminSections = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'Verification', label: 'Profile Verification', icon: CheckCircle },
    { id: 'payments', label: 'Payments & Plans', icon: DollarSign },
    { id: 'reports', label: 'Reports & Complaints', icon: Flag },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const stats = [
    { title: 'Total Users', value: '12,453', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Profiles', value: '8,721', change: '+8%', icon: UserCheck, color: 'green' },
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

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
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
        );
      case 'Verification':  
         return <Verification />;

      case 'users':
        return (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Manage all registered users and their profiles</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Filters */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                  <option>All Plans</option>
                  <option>Free</option>
                  <option>Premium</option>
                  <option>Gold</option>
                </select>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg border border-rose-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.concat(recentUsers).map((user, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            user.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'Premium' || user.plan === 'Gold' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.plan === 'Premium' || user.plan === 'Gold' ? <Crown className="w-3 h-3 mr-1" /> : null}
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.joined}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 p-1">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing 1 to 10 of 12,453 users</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium">1</button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">2</button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">3</button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl border-r border-rose-100/50 min-h-screen">
          {/* Admin Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500">Matrimonial Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <div className="space-y-2">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      activeTab === section.id 
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg' 
                        : 'hover:bg-rose-50 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                  
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">System Online</span>
              </div>
              <p className="text-xs text-green-600 mt-1">All services running smoothly</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
          <div className="bg-rose-500 shadow-lg rounded-lg mx-6 mt-4 p-6 sticky top-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {adminSections.find(s => s.id === activeTab)?.label}
                </h1>
                <p className="text-white">Welcome back, Admin</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* System Alerts */}
                <div className="relative">
                  <button className="relative bg-rose-100 text-rose-600 p-2 rounded-lg hover:bg-rose-200 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"></span>
                  </button>
                </div>
                
                
                
                {/* Admin Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-medium text-white text-sm">Super Admin</p>
                    <p className="text-xs text-white">admin@matrimony.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}