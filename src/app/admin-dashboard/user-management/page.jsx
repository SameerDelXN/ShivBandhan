"use client";
import { useState } from "react";
import {
  UserPlus,
  Download,
  Search,
  Filter,
  Users,
  Eye,
  Edit3,
  Ban,
  Crown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const recentUsers = [
  {
    name: "Amit Singh",
    status: "Active",
    plan: "Premium",
    joined: "2024-06-01",
    age: 30,
    dob: "1994-02-10",
    address: "New Delhi, India",
    education: "MBA, IIM Ahmedabad",
    familyBackground: "Business",
    height: "5'10\"",
    weight: "72kg",
    hobbies: "Reading, Traveling",
  },
  {
    name: "Sneha Patel",
    status: "Inactive",
    plan: "Free",
    joined: "2024-05-15",
    age: 27,
    dob: "1997-01-20",
    address: "Ahmedabad, Gujarat",
    education: "B.Tech, Nirma University",
    familyBackground: "Service",
    height: "5'4\"",
    weight: "58kg",
    hobbies: "Dancing, Painting",
  },
  {
    name: "Farhan Ali",
    status: "Pending",
    plan: "Gold",
    joined: "2024-04-20",
    age: 32,
    dob: "1992-07-15",
    address: "Lucknow, UP",
    education: "BBA, AMU",
    familyBackground: "Educated",
    height: "5'8\"",
    weight: "70kg",
    hobbies: "Music, Cricket",
  },
  {
    name: "Ritika Joshi",
    status: "Suspended",
    plan: "Free",
    joined: "2024-03-12",
    age: 26,
    dob: "1998-10-05",
    address: "Pune, Maharashtra",
    education: "MCA, Pune University",
    familyBackground: "Service",
    height: "5'5\"",
    weight: "60kg",
    hobbies: "Yoga, Cooking",
  },
  {
    name: "Rajesh Kumar",
    status: "Active",
    plan: "Premium",
    joined: "2024-02-28",
    age: 35,
    dob: "1989-03-12",
    address: "Mumbai, Maharashtra",
    education: "M.Tech, IIT Bombay",
    familyBackground: "Business",
    height: "5'9\"",
    weight: "75kg",
    hobbies: "Photography, Cycling",
  },
  {
    name: "Priya Sharma",
    status: "Active",
    plan: "Gold",
    joined: "2024-01-15",
    age: 29,
    dob: "1995-08-22",
    address: "Bangalore, Karnataka",
    education: "MBA, ISB Hyderabad",
    familyBackground: "Service",
    height: "5'6\"",
    weight: "55kg",
    hobbies: "Reading, Swimming",
  },
  {
    name: "Vikram Reddy",
    status: "Pending",
    plan: "Free",
    joined: "2023-12-10",
    age: 31,
    dob: "1993-11-05",
    address: "Hyderabad, Telangana",
    education: "B.Tech, NIT Warangal",
    familyBackground: "Educated",
    height: "5'11\"",
    weight: "78kg",
    hobbies: "Gaming, Movies",
  },
  {
    name: "Kavya Menon",
    status: "Inactive",
    plan: "Premium",
    joined: "2023-11-22",
    age: 28,
    dob: "1996-06-18",
    address: "Kochi, Kerala",
    education: "M.Sc, Cochin University",
    familyBackground: "Service",
    height: "5'3\"",
    weight: "52kg",
    hobbies: "Dancing, Cooking",
  },
];

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(recentUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setEditingUser(null); // Close edit mode if open
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData(user);
    setSelectedUser(null); // Close view mode if open
  };

  // Handle save edited user
  const handleSaveEdit = () => {
    setUsers(users.map(user => 
      user.name === editingUser.name ? { ...user, ...editFormData } : user
    ));
    setEditingUser(null);
  };

  // Handle ban/suspend user
  const handleBanUser = (userName) => {
    setUsers(users.map(user => 
      user.name === userName ? { ...user, status: "Suspended" } : user
    ));
  };

  // Handle input change in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

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
            <option>Pending</option>
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
              {currentUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.plan === "Premium" || user.plan === "Gold"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.plan === "Premium" || user.plan === "Gold" ? (
                        <Crown className="w-3 h-3 mr-1" />
                      ) : null}
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.joined}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-700 p-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-700 p-1"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-700 p-1"
                        onClick={() => handleBanUser(user.name)}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center ${
                  currentPage === 1 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'bg-rose-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center ${
                  currentPage === totalPages 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-rose-800">User Profile</h3>
                <p className="text-sm text-rose-600/80">Detailed information about {selectedUser.name}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Avatar and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-8 h-8 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                    <div className="flex space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : selectedUser.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.plan === "Premium" || selectedUser.plan === "Gold"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedUser.plan === "Premium" || selectedUser.plan === "Gold" ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : null}
                        {selectedUser.plan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium">{selectedUser.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">{selectedUser.dob}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Height</p>
                      <p className="font-medium">{selectedUser.height}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{selectedUser.weight}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Address Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </h5>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>

                {/* Education Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    Education & Background
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Education:</span> {selectedUser.education}</p>
                    <p><span className="text-gray-500">Family Background:</span> {selectedUser.familyBackground}</p>
                  </div>
                </div>

                {/* Hobbies Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Hobbies & Interests
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.hobbies.split(", ").map((hobby, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Close
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 flex items-center"
                onClick={() => {
                  setSelectedUser(null);
                  handleEditUser(selectedUser);
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100/50 w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-rose-800">Edit User Profile</h3>
                <p className="text-sm text-rose-600/80">Edit information for {editingUser.name}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-100/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Edit Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={editFormData.status || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                    <select
                      name="plan"
                      value={editFormData.plan || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                      <option value="Gold">Gold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={editFormData.dob || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies (comma separated)</label>
                  <input
                    type="text"
                    name="hobbies"
                    value={editFormData.hobbies || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-rose-100 flex justify-end space-x-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}