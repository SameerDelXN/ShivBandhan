"use client";
import { useState, useEffect } from "react";
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
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modify the fetchUsers function to fetch all users at once
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/fetchAllUsers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("data = ", data.data);
        const transformedUsers = data.data.map(user => ({
          id: user._id,
          name: user.name || 'N/A',
          email: user.phone,
          phone: user.phone,
          status: user.isVerified ? 'Active' : (user.verificationStatus === 'Pending' ? 'Pending' : 'Inactive'),
          plan: user.subscription?.plan || 'Free',
          joined: new Date(user.createdAt).toLocaleDateString('en-US'),
          age: user.dob ? Math.floor((new Date() - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
          dob: user.dob ? new Date(user.dob).toLocaleDateString('en-US') : 'N/A',
          address: user.currentCity || 'N/A',
          education: user.education || 'N/A',
          familyBackground: user.occupation || 'N/A',
          height: user.height || 'N/A',
          weight: user.weight ? `${user.weight}kg` : 'N/A',
          hobbies: 'N/A',
          gender: user.gender || 'N/A',
          maritalStatus: user.maritalStatus || 'N/A',
          motherTongue: user.motherTongue || 'N/A',
          religion: user.religion || 'N/A',
          caste: user.caste || 'N/A',
          subCaste: user.subCaste || 'N/A',
          gothra: user.gothra || 'N/A',
          college: user.college || 'N/A',
          company: user.company || 'N/A',
          fieldOfStudy: user.fieldOfStudy || 'N/A',
          profilePhoto: user.profilePhoto || '',
          income: user.income || 'N/A',
          lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US') : 'Never',
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified,
          verificationStatus: user.verificationStatus || 'Unverified',
          adminWillFill: user.profileSetup?.willAdminFill || false
        }));
        
        setUsers(transformedUsers);
        setAllUsers(transformedUsers);
        setTotalUsers(transformedUsers.length);
        setTotalPages(Math.ceil(transformedUsers.length / usersPerPage));
        setCurrentPage(page);
      } else {
        throw new Error('API response indicates failure');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allUsers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (planFilter !== "All Plans") {
      filtered = filtered.filter(user => user.plan === planFilter);
    }

    setUsers(filtered);
    setTotalUsers(filtered.length);
    setTotalPages(Math.ceil(filtered.length / usersPerPage));
    setCurrentPage(1);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (allUsers.length > 0) {
      applyFilters();
    }
  }, [searchTerm, statusFilter, planFilter]);

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
    setEditingUser(null);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData(user);
    setSelectedUser(null);
  };

  // Handle save edited user
  const handleSaveEdit = () => {
    setUsers(users.map(user => 
      user.id === editingUser.id ? { ...user, ...editFormData } : user
    ));
    setAllUsers(allUsers.map(user => 
      user.id === editingUser.id ? { ...user, ...editFormData } : user
    ));
    setEditingUser(null);
  };

  // PDF Export Function - Same format as your matches page
  const handleExportUser = async (user) => {
    console.log("user ==========", user);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageMargin = 40;
      const colorPrimary = rgb(0.86, 0.25, 0.35);
      const colorAccent = rgb(0.98, 0.78, 0.38);
      const colorTextMuted = rgb(0.5, 0.5, 0.5);
      const colorText = rgb(0.12, 0.12, 0.12);
      const colorMuted = rgb(0.55, 0.55, 0.55);

      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let cursorY = height - pageMargin;
      
      const headerHeight = 72;

      // ============ UNIQUE MAGAZINE-STYLE LAYOUT ============
      
      // Full-width colored header with diagonal pattern
      const diagPatternSize = 20;
      for (let x = 0; x < width; x += diagPatternSize) {
        for (let y = height - headerHeight; y < height; y += diagPatternSize) {
          const isDark = ((x + y) / diagPatternSize) % 2 === 0;
          page.drawRectangle({
            x, y, 
            width: diagPatternSize, 
            height: diagPatternSize,
            color: isDark ? rgb(0.82, 0.22, 0.32) : rgb(0.86, 0.25, 0.35),
            opacity: 0.95
          });
        }
      }
      
      // Overlay gradient for depth
      for (let i = 0; i < 10; i++) {
        page.drawRectangle({
          x: 0, y: height - headerHeight, 
          width, height: headerHeight / 10,
          color: rgb(0, 0, 0),
          opacity: 0.02 * (10 - i)
        });
        page.drawLine({
          start: { x: 0, y: height - headerHeight + (i * headerHeight / 10) },
          end: { x: width, y: height - headerHeight + (i * headerHeight / 10) },
          thickness: 0.3,
          color: rgb(1, 1, 1),
          opacity: 0.05
        });
      }

      // Bold brand name with embossed effect
      page.drawText('ShivBandhan', { 
        x: pageMargin + 2, 
        y: height - 26, 
        size: 28, 
        font: boldFont, 
        color: rgb(0, 0, 0), 
        opacity: 0.3 
      });
      page.drawText('ShivBandhan', { 
        x: pageMargin, 
        y: height - 24, 
        size: 28, 
        font: boldFont, 
        color: rgb(1, 1, 1) 
      });
      
      // Tagline with golden accent
      page.drawRectangle({ x: pageMargin, y: height - 50, width: 4, height: 18, color: colorAccent });
      page.drawText('MATRIMONY PROFILE', { 
        x: pageMargin + 10, 
        y: height - 47, 
        size: 10, 
        font: boldFont, 
        color: rgb(1, 1, 1), 
        opacity: 0.9 
      });

      cursorY = height - headerHeight - 20;

      // ============ HORIZONTAL PHOTO BANNER ============
      const bannerHeight = 200;
      const photoWidth = 160;
      const infoStartX = pageMargin + photoWidth + 30;
      
      // Photo container with frame effect
      page.drawRectangle({ 
        x: pageMargin - 3, 
        y: cursorY - bannerHeight - 3, 
        width: photoWidth + 6, 
        height: bannerHeight + 6, 
        color: colorAccent 
      });
      
      page.drawRectangle({ 
        x: pageMargin, 
        y: cursorY - bannerHeight, 
        width: photoWidth, 
        height: bannerHeight, 
        color: rgb(0.95, 0.95, 0.95) 
      });

      if (user?.profilePhoto) {
        try {
          const res = await fetch(user.profilePhoto, { mode: 'cors' });
          const imgBytes = await res.arrayBuffer();
          const lower = user.profilePhoto.toLowerCase();
          const img = lower.endsWith('.png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
          const scale = Math.min(photoWidth / img.width, bannerHeight / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const imgX = pageMargin + (photoWidth - drawW) / 2;
          const imgY = cursorY - bannerHeight + (bannerHeight - drawH) / 2;
          page.drawImage(img, { x: imgX, y: imgY, width: drawW, height: drawH });
        } catch (err) {
          page.drawText('Photo\nUnavailable', { 
            x: pageMargin + 40, 
            y: cursorY - bannerHeight / 2, 
            size: 12, 
            font: boldFont, 
            color: colorMuted 
          });
        }
      }

      // ============ INFO CARDS NEXT TO PHOTO ============
      const nameDisplay = user?.name || 'N/A';
      const ageDisplay = user?.age || '-';
      const heightDisplay = user?.height || '-';
      const cityDisplay = user?.address || '-';
      
      let infoY = cursorY - 15;
      
      // Name card with accent
      page.drawRectangle({ 
        x: infoStartX - 5, 
        y: infoY - 28, 
        width: width - infoStartX - pageMargin + 5, 
        height: 32, 
        color: rgb(0.98, 0.96, 0.96) 
      });
      page.drawRectangle({ x: infoStartX - 5, y: infoY - 28, width: 5, height: 32, color: colorPrimary });
      page.drawText(nameDisplay, { 
        x: infoStartX + 5, 
        y: infoY - 18, 
        size: 18, 
        font: boldFont, 
        color: colorPrimary 
      });
      
      infoY -= 50;

      // Stats grid
      const statBox = (label, value, x, y, color) => {
        page.drawRectangle({ x, y: y - 42, width: 90, height: 45, color: rgb(0.99, 0.97, 0.97) });
        page.drawRectangle({ x, y: y - 42, width: 90, height: 3, color });
        page.drawText(label, { x: x + 8, y: y - 15, size: 8, font, color: colorMuted });
        page.drawText(String(value), { x: x + 8, y: y - 32, size: 12, font: boldFont, color: colorText });
      };

      statBox('Age', `${ageDisplay} years`, infoStartX, infoY, rgb(0.2, 0.6, 0.8));
      statBox('Height', heightDisplay, infoStartX + 100, infoY, rgb(0.8, 0.4, 0.6));
      statBox('City', cityDisplay, infoStartX + 200, infoY, rgb(0.4, 0.7, 0.5));

      infoY -= 60;

      // Quick info pills
      const drawPill = (text, x, y, bgColor) => {
        const textWidth = text.length * 5;
        page.drawRectangle({ 
          x, y: y - 16, 
          width: textWidth + 16, 
          height: 18, 
          color: bgColor 
        });
        page.drawText(text, { x: x + 8, y: y - 11, size: 9, font, color: rgb(1, 1, 1) });
        return textWidth + 24;
      };

      let pillX = infoStartX;
      if (user?.gender) {
        pillX += drawPill(user.gender, pillX, infoY, rgb(0.5, 0.3, 0.7));
      }
      if (user?.maritalStatus) {
        pillX += drawPill(user.maritalStatus, pillX, infoY, rgb(0.3, 0.6, 0.7));
      }
      if (user?.education) {
        pillX += drawPill(user.education, pillX, infoY, rgb(0.7, 0.5, 0.3));
      }

      cursorY -= bannerHeight + 40;

      // ============ GRID LAYOUT FOR SECTIONS ============
      const createSection = (title, data, startY, isLeftColumn) => {
        const sectionWidth = (width - 3 * pageMargin) / 2;
        const x = isLeftColumn ? pageMargin : pageMargin + sectionWidth + pageMargin;
        let y = startY;
        
        // Section header with icon bar
        page.drawRectangle({ x, y: y - 35, width: sectionWidth, height: 38, color: rgb(0.97, 0.95, 0.95) });
        page.drawRectangle({ x, y: y - 35, width: 8, height: 38, color: colorAccent });
        page.drawText(title.toUpperCase(), { 
          x: x + 18, 
          y: y - 22, 
          size: 12, 
          font: boldFont, 
          color: colorPrimary 
        });
        
        y -= 48;
        
        // Data rows with alternating background
        data.forEach((item, idx) => {
          if (idx % 2 === 0) {
            page.drawRectangle({ 
              x, y: y - 18, 
              width: sectionWidth, 
              height: 20, 
              color: rgb(0.995, 0.99, 0.99) 
            });
          }
          
          page.drawText(item.label, { 
            x: x + 10, 
            y: y - 13, 
            size: 9, 
            font: boldFont, 
            color: colorMuted 
          });
          
          page.drawText(String(item.value || '-'), { 
            x: x + 140, 
            y: y - 13, 
            size: 9.5, 
            font, 
            color: colorText 
          });
          
          y -= 22;
        });
        
        return y - 15;
      };

      // Left column sections
      let leftY = cursorY;
      
      leftY = createSection('Personal Details', [
        { label: 'Gender', value: user?.gender },
        { label: 'Marital Status', value: user?.maritalStatus },
        { label: 'Mother Tongue', value: user?.motherTongue },
        { label: 'Religion', value: user?.religion },
        { label: 'Weight', value: user?.weight },
        { label: 'Phone', value: user?.phone }
      ], leftY, true);

      leftY = createSection('Education', [
        { label: 'Highest Degree', value: user?.education },
        { label: 'Field of Study', value: user?.fieldOfStudy },
        { label: 'College/University', value: user?.college }
      ], leftY, true);

      leftY = createSection('Family Background', [
        { label: 'Occupation', value: user?.familyBackground }
      ], leftY, true);

      // Right column sections
      let rightY = cursorY;
      
      rightY = createSection('Location', [
        { label: 'Current City', value: user?.address },
        { label: 'Email', value: user?.email }
      ], rightY, false);

      rightY = createSection('Professional', [
        { label: 'Occupation', value: user?.familyBackground },
        { label: 'Company', value: user?.company },
        { label: 'Annual Income', value: user?.income }
      ], rightY, false);

      rightY = createSection('Religious Details', [
        { label: 'Caste', value: user?.caste },
        { label: 'Sub Caste', value: user?.subCaste },
        { label: 'Gothra', value: user?.gothra }
      ], rightY, false);

      // Account Information Section (Full width at bottom)
      // rightY = createSection('Account Information', [
      //   { label: 'Status', value: user?.status },
      //   { label: 'Plan', value: user?.plan },
      //   { label: 'Joined', value: user?.joined },
      //   { label: 'Last Login', value: user?.lastLogin },
      //   { label: 'Verification', value: user?.verificationStatus }
      // ], rightY, false);

      // Footer on all pages
      const __pages = pdfDoc.getPages();
      const __total = __pages.length;
      const __dateStr = new Date().toLocaleDateString('en-IN');
      __pages.forEach((p, idx) => {
        const { width: __pw } = p.getSize();
        p.drawLine({ start: { x: pageMargin, y: 28 }, end: { x: __pw - pageMargin, y: 28 }, thickness: 0.5, color: colorTextMuted });
        p.drawText('Generated by ShivBandhan', { x: pageMargin, y: 14, size: 9, font, color: colorTextMuted });
        p.drawText(`${__dateStr}`, { x: __pw / 2 - 20, y: 14, size: 9, font, color: colorTextMuted });
        p.drawText(`Page ${idx + 1} of ${__total}`, { x: __pw - pageMargin - 80, y: 14, size: 9, font, color: colorTextMuted });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(user?.name || 'user').toLowerCase().replace(/\s+/g, '_')}_shivbandhan.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting user:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle toggle admin can fill
  const handleToggleAdminFill = async (userId, currentValue) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          profileSetup: {
            willAdminFill: !currentValue
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin fill setting');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, adminWillFill: !currentValue } : user
      ));
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, adminWillFill: !currentValue } : user
      ));

    } catch (error) {
      console.error("Error updating admin fill setting:", error);
    }
  };

  // Handle ban/suspend user
  const handleBanUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "Suspended" } : user
    ));
    setAllUsers(allUsers.map(user => 
      user.id === userId ? { ...user, status: "Suspended" } : user
    ));
  };

  // Get unique statuses and plans for filter dropdowns
  const uniqueStatuses = ["All Status", ...new Set(allUsers.map(user => user.status))];
  const uniquePlans = ["All Plans", ...new Set(allUsers.map(user => user.plan))];

  // Calculate display range for pagination
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={() => fetchUsers(currentPage)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage all registered users and their profiles ({totalUsers} total users)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            {uniquePlans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Login</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Admin Can Fill</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(startIndex, endIndex).map((user, index) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-300 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Pending"
                          ? "bg-amber-300 text-amber-800"
                          : user.status === "Inactive"
                          ? "bg-gray-100 text-gray-800"
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
                          ? "bg-amber-300 text-amber-800"
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
                  <td className="py-4 px-6 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleAdminFill(user.id, user.adminWillFill)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        user.adminWillFill ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          user.adminWillFill ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                      {user.adminWillFill ? (
                        <ToggleRight className="absolute left-1 w-3 h-3 text-white" />
                      ) : (
                        <ToggleLeft className="absolute right-1 w-3 h-3 text-gray-600" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-700 p-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-700 p-1"
                        onClick={() => handleExportUser(user)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-amber-600 hover:text-amber-700 p-1"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-700 p-1"
                        onClick={() => handleBanUser(user.id)}
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
              Showing {startIndex + 1} to {endIndex} of {totalUsers} users
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
                          ? 'bg-orange-500 text-white'
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
          <div className="bg-white rounded-xl shadow-2xl border border-orange-100/50 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-150 px-6 py-4 border-b border-orange-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-orange-800">User Profile</h3>
                <p className="text-sm text-orange-600/80">Detailed information about {selectedUser.name}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-orange-400 hover:text-orange-600 transition-colors p-1 rounded-full hover:bg-orange-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Avatar and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-400 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                    <div className="flex space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : selectedUser.status === "Pending"
                            ? "bg-amber-300 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.plan === "Premium" || selectedUser.plan === "Gold"
                            ? "bg-amber-300 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedUser.plan === "Premium" || selectedUser.plan === "Gold" ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : null}
                        {selectedUser.plan}
                      </span>
                      {selectedUser.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedUser.adminWillFill}
                          onChange={(e) => handleToggleAdminFill(selectedUser.id, selectedUser.adminWillFill)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Admin Can Fill
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Personal Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-500" />
                    Personal Details
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium">{selectedUser.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">{selectedUser.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">{selectedUser.dob}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Marital Status</p>
                      <p className="font-medium">{selectedUser.maritalStatus}</p>
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

                {/* Religious Details Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-orange-500" />
                    Religious & Cultural Details
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Religion</p>
                      <p className="font-medium">{selectedUser.religion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Caste</p>
                      <p className="font-medium">{selectedUser.caste}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sub Caste</p>
                      <p className="font-medium">{selectedUser.subCaste}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gothra</p>
                      <p className="font-medium">{selectedUser.gothra}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Mother Tongue</p>
                      <p className="font-medium">{selectedUser.motherTongue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Address Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h5>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>

                {/* Education & Career Card */}
                <div className="bg-gray-50/70 rounded-lg p-4 border border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Education & Career
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-gray-500">Education</p>
                        <p className="font-medium">{selectedUser.education}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Field of Study</p>
                        <p className="font-medium">{selectedUser.fieldOfStudy}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">College</p>
                        <p className="font-medium">{selectedUser.college}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Occupation</p>
                        <p className="font-medium">{selectedUser.familyBackground}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Company</p>
                        <p className="font-medium">{selectedUser.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Income</p>
                        <p className="font-medium">{selectedUser.income}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-orange-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Close
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => handleEditUser(selectedUser)}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-800/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-orange-100/50 w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-150 px-6 py-4 border-b border-orange-100 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-orange-800">Edit User</h3>
                <p className="text-sm text-orange-600/80">Update information for {editingUser.name}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-orange-400 hover:text-orange-600 transition-colors p-1 rounded-full hover:bg-orange-100/50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={editFormData.status || ''}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                      <option value="Gold">Gold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={editFormData.gender || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    name="education"
                    value={editFormData.education || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={editFormData.religion || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                  <input
                    type="text"
                    name="caste"
                    value={editFormData.caste || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Caste</label>
                  <input
                    type="text"
                    name="subCaste"
                    value={editFormData.subCaste || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    name="motherTongue"
                    value={editFormData.motherTongue || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={editFormData.education || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    name="familyBackground"
                    value={editFormData.familyBackground || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income</label>
                  <input
                    type="text"
                    name="income"
                    value={editFormData.income || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-orange-100 flex justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}