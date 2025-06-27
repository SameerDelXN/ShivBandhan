"use client"
import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Crown,
  Settings,
  Shield,
  BarChart3,
  Flag,
  Bell
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
//sample
export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('');
  const Router = useRouter();
  const { user } = useAuth();
  const [filteredSections, setFilteredSections] = useState([]);

  const allAdminSections = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, route: "/admin-dashboard", permissionKey: "overview" },
    { id: 'user-management', label: 'User Management', icon: Users, route: "/admin-dashboard/user-management", permissionKey: "userManagement" },
    { id: 'emp-management', label: 'Emp Management', icon: Users, route: "/admin-dashboard/emp-management", permissionKey: "empManagement" },
    { id: 'Verification', label: 'Profile Verification', icon: CheckCircle, route: "/admin-dashboard/verification", permissionKey: "verification" },
    { id: 'Payment', label: 'Payments & Plans', icon: FaRupeeSign, route: "/admin-dashboard/payment", permissionKey: "payment" },
    { id: 'Report', label: 'Reports & Complaints', icon: Flag, route: "/admin-dashboard/report", permissionKey: "report" },
    { id: 'setting', label: 'System Settings', icon: Settings, route: "/admin-dashboard/setting", permissionKey: "setting" },
  ];

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        // Admin gets access to all sections
        setFilteredSections(allAdminSections);
        setActiveTab('overview');
        Router.push("/admin-dashboard");
      } else if (user.role === 'Employee') {
        // Filter sections based on employee's permissions
        const allowedSections = allAdminSections.filter(section => {
          // Check if user has permission for this section
          return user.permissions?.[section.permissionKey];
        });
        
        setFilteredSections(allowedSections);
        
        if (allowedSections.length > 0) {
          // Set the first allowed section as active
          setActiveTab(allowedSections[0].id);
          Router.push(allowedSections[0].route);
        } else {
          // If no sections are allowed, redirect to unauthorized
          Router.push('/unauthorized');
        }
      } else {
        // For other roles, redirect to home
        Router.push('/');
      }
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
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
                  <p className="text-xs text-gray-500">
                    {user.role === 'admin' ? 'Matrimonial Platform' : `Employee: ${user.name}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4">
              <div className="space-y-2">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveTab(section.id);
                        Router.push(section.route);
                      }}
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
            <div className="bg-rose-500 shadow-lg rounded-lg mx-6 mt-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {filteredSections.find(s => s.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-white">Welcome back, {user.name}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button className="relative bg-rose-100 text-rose-600 p-2 rounded-lg hover:bg-rose-200 transition-colors">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-white text-sm">
                        {user.role === 'admin' ? 'Super Admin' : 'Employee'}
                      </p>
                      <p className="text-xs text-white">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}