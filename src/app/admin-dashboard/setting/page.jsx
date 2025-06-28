"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  User, 
  Shield, 
  Bell, 
  Trash2, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  MessageCircle, 
  Info, 
  LogOut,
  AlertTriangle,
  Check,
  X
} from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const [accountData, setAccountData] = useState({
    email: "admin@shivbandhan.com",
    phone: "+91 98765 43210"
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfileToRegistered: true,
    blurPhotoUntilAccepted: false,
    hideProfileTemporarily: false,
    contactDetailsVisibility: "Only mutual matches"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    masterNotifications: true,
    emailForNewInterests: true,
    smsForChatMessages: true,
    pushForProfileViews: true,
    securityAlerts: true,
    userReports: true,
    systemStatus: true,
    newUserRegistrations: false,
    adminTasks: true
  });

  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleAdminLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin-login');
      } else {
        throw new Error('Admin logout failed');
      }
    } catch (error) {
      console.error('Admin logout error:', error);
      // You might want to show an error toast here
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation === 'DELETE') {
      try {
        // Call your admin account deletion API here
        const response = await fetch('/api/admin/delete-account', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ reason: deleteReason }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          router.push('/admin-login');
        } else {
          throw new Error('Account deletion failed');
        }
      } catch (error) {
        console.error('Account deletion error:', error);
        // You might want to show an error toast here
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderToggle = (isOn) => (
    <div className={`w-12 h-6 rounded-full ${isOn ? 'bg-red-500' : 'bg-gray-300'} relative transition-colors cursor-pointer`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
    </div>
  );

  const renderCheckbox = (isChecked) => (
    <div className={`w-5 h-5 rounded ${isChecked ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
      {isChecked && <span className="text-white text-xs">✓</span>}
    </div>
  );

  const navigationItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'delete', label: 'Delete\nAccount', icon: Trash2, action: () => setActiveTab('delete') },
    { id: 'logout', label: 'Log Out', icon: LogOut, action: () => setShowLogoutModal(true) }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0 w-80 h-screen overflow-y-auto bg-gray-50 p-6 border-r border-gray-200">
        {/* Settings Navigation Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id && !item.action
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="whitespace-pre-line">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Mail className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Email Address</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Current Email</label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData(prev => ({...prev, email: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <button className="bg-red-50 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  Verify Email
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Phone className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Phone Number</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) => setAccountData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <button className="bg-red-50 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  Verify with OTP
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="bg-red-50 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Eye className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Profile Visibility</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Admin Profile Visibility</h3>
                      <p className="text-gray-500 text-sm">Show admin profile to other admins only</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('showProfileToRegistered')}>
                      {renderToggle(privacySettings.showProfileToRegistered)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Admin Dashboard Access</h3>
                      <p className="text-gray-500 text-sm">Require two-factor authentication for dashboard access</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('blurPhotoUntilAccepted')}>
                      {renderToggle(privacySettings.blurPhotoUntilAccepted)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Admin Activity Logging</h3>
                      <p className="text-gray-500 text-sm">Log all admin actions and profile changes</p>
                    </div>
                    <button onClick={() => handlePrivacyToggle('hideProfileTemporarily')}>
                      {renderToggle(privacySettings.hideProfileTemporarily)}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageCircle className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Contact Details Visibility</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Who can view my contact details?</label>
                  <select
                    value={privacySettings.contactDetailsVisibility}
                    onChange={(e) => setPrivacySettings(prev => ({...prev, contactDetailsVisibility: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Only mutual matches">Visible to super admins only</option>
                    <option value="All verified users">Visible to all admin levels</option>
                    <option value="Premium members only">Hidden from all users</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Bell className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Master Notifications</h3>
                      <p className="text-gray-500 text-sm">Enable or disable all notifications</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('masterNotifications')}>
                      {renderToggle(notificationSettings.masterNotifications)}
                    </button>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Security & Login Alerts</h3>
                      <p className="text-gray-500 text-sm">Get notified of suspicious login activity and security threats</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('securityAlerts')}>
                      {renderCheckbox(notificationSettings.securityAlerts)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">User Report Notifications</h3>
                      <p className="text-gray-500 text-sm">Immediate alerts when users report issues or policy violations</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('userReports')}>
                      {renderCheckbox(notificationSettings.userReports)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">System Status Alerts</h3>
                      <p className="text-gray-500 text-sm">Get notified when the platform experiences technical issues</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('systemStatus')}>
                      {renderCheckbox(notificationSettings.systemStatus)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">New User Registrations</h3>
                      <p className="text-gray-500 text-sm">Stay informed about new users joining the platform</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('newUserRegistrations')}>
                      {renderCheckbox(notificationSettings.newUserRegistrations)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Admin Task Assignments</h3>
                      <p className="text-gray-500 text-sm">Get notified when tasks are assigned or require immediate attention</p>
                    </div>
                    <button onClick={() => handleNotificationToggle('adminTasks')}>
                      {renderCheckbox(notificationSettings.adminTasks)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Tab */}
          {activeTab === 'delete' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Trash2 className="text-red-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Delete Admin Account</h2>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="text-red-500" size={20} />
                    <h3 className="font-semibold text-red-800">Important Information</h3>
                  </div>
                  <ul className="text-red-700 text-sm space-y-1 ml-6">
                    <li>• Your admin account will be permanently deleted</li>
                    <li>• All admin privileges and access will be revoked</li>
                    <li>• All pending admin tasks will be reassigned</li>
                    <li>• Access to admin dashboard and user data will be immediately terminated</li>
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-600 mb-2">Reason for leaving (required)</label>
                  <select
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="leaving-organization">Leaving organization/company</option>
                    <option value="role-transfer">Role transfer to another admin</option>
                    <option value="security-breach">Security breach/compromise</option>
                    <option value="policy-violation">Policy violation</option>
                    <option value="end-of-contract">End of contract/employment</option>
                    <option value="voluntary-resignation">Voluntary resignation from admin role</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    disabled={!deleteReason}
                  >
                    Delete Admin Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <LogOut className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
            </div>
            
            <p className="text-gray-600 mb-6">Are you sure you want to log out from the admin dashboard?</p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              This action cannot be undone. To confirm, please type <strong>DELETE</strong> in the box below.
            </p>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  deleteConfirmation === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}