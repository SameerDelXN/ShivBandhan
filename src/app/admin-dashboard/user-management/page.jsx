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
          email: user.email,
          phone: user.phone,
          status: user.isVerified ? 'Active' : (user.verificationStatus === 'Pending' ? 'Pending' : 'Inactive'),
          plan: user.subscription?.plan || 'Free',
          joined: new Date(user.createdAt).toLocaleDateString('en-US'),
          age: user.dob ? Math.floor((new Date() - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A',
          dob: user.dob ? new Date(user.dob).toLocaleDateString('en-US') : 'N/A',
          address: user.currentCity || user.permanentAddress || 'N/A',
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
          adminWillFill: user.profileSetup?.willAdminFill || false,
          
          // Additional Relative Info
          fatherName: user.fatherName,
          parentResidenceCity: user.parentResidenceCity,
          mother: user.mother,
          brothers: user.brothers,
          marriedBrothers: user.marriedBrothers,
          sisters: user.sisters,
          marriedSisters: user.marriedSisters,
          nativeDistrict: user.nativeDistrict,
          nativeCity: user.nativeCity,
          familyWealth: user.familyWealth,
          relativeSurname: Array.isArray(user.relativeSurname) ? user.relativeSurname.join(', ') : user.relativeSurname,
          parentOccupation: user.parentOccupation,
          mamaSurname: user.mamaSurname,
          complexion: user.complexion,
          bloodGroup: user.bloodGroup,
          wearsLens: user.wearsLens,

          // Additional Horoscope Info
          rashi: user.rashi,
          nakshira: user.nakshira,
          charan: user.charan,
          gan: user.gan,
          nadi: user.nadi,
          mangal: user.mangal,
          birthPlace: user.birthPlace,
          birthTime: user.birthTime,
          gotraDevak: user.gotraDevak,

          // Additional Expectations
          expectedCaste: user.expectedCaste,
          preferredCity: user.preferredCity,
          expectedAgeDifference: user.expectedAgeDifference,
          expectedEducation: user.expectedEducation,
          divorcee: user.divorcee,
          expectedHeight: user.expectedHeight,
          expectedIncome: user.expectedIncome,
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
      const colorText = rgb(0, 0, 0);       // Pure Black text
      const colorLine = rgb(0.2, 0.2, 0.2); // Dark line color

      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let cursorY = height - pageMargin;

      // Helper function for PDF text encoding
      const safeText = (text) => {
        if (!text && text !== 0) return '-';
        return String(text).replace(/₹/g, 'Rs. ').replace(/[^\x00-\xFF]/g, '');
      };

      // Helper function to figure out line wrapping
      const getWrappedLines = (text, maxWidth, textFont, textSize) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = textFont.widthOfTextAtSize(testLine, textSize);
          
          if (testWidth > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // Helper function to render a label-value pair in grid and RETURN height consumed
      const drawGridItem = (label, value, x, y, colWidth) => {
        const labelWidth = 100;
        const valueWidth = colWidth - labelWidth;
        const cleanValue = safeText(value);
        
        // Draw the label
        page.drawText(label || '', { x, y, size: 10, font, color: colorText });
        
        // Wrap and draw the value
        const lines = getWrappedLines(cleanValue, valueWidth, font, 10);
        let startY = y;
        
        for (const line of lines) {
          page.drawText(line, { x: x + labelWidth, y: startY, size: 10, font, color: colorText });
          startY -= 12; // line height
        }
        
        // Returns the Y drop amount (minus 18 is the base spacing)
        return Math.max(18, lines.length * 12 + 6);
      };

      // Header Section
      page.drawText('BIODATA', { x: width / 2 - 40, y: cursorY, size: 16, font: boldFont, color: colorText });
      cursorY -= 30;

      // Draw Logo (Left)
      try {
        const logoRes = await fetch('/logo.png');
        const logoBytes = await logoRes.arrayBuffer();
        const logoImg = await pdfDoc.embedPng(logoBytes);
        const logoScale = Math.min(60 / logoImg.width, 60 / logoImg.height);
        page.drawImage(logoImg, { x: pageMargin, y: cursorY - 40, width: logoImg.width * logoScale, height: logoImg.height * logoScale });
      } catch (e) {
        console.warn('Logo not found');
      }

      // Draw Company Address (Center/Right-ish)
      page.drawText('Durga Prasad Apartments, S. No. 26/6, Flat No. 1, Above Udyam Vikas Bank,', { x: 120, y: cursorY, size: 9, font });
      page.drawText('Hingne KD, Sinhagad Road, Pune 411051, Maharashtra, India', { x: 120, y: cursorY - 12, size: 9, font });
      page.drawText('Mobile : +91-8888438693 / +91-8888438694', { x: 120, y: cursorY - 24, size: 9, font });
      page.drawText(`Email : support@shivbandhan.com | info@shivbandhan.com`, { x: 120, y: cursorY - 36, size: 9, font });
      page.drawText('Website : www.shivbandhan.com', { x: 120, y: cursorY - 48, size: 9, font });
      
      cursorY -= 65;
      page.drawLine({ start: { x: pageMargin, y: cursorY }, end: { x: width - pageMargin, y: cursorY }, thickness: 1, color: colorLine });
      cursorY -= 5;
      page.drawLine({ start: { x: pageMargin, y: cursorY }, end: { x: width - pageMargin, y: cursorY }, thickness: 1, color: colorLine });
      cursorY -= 20;

      // Profile Photo & Basic Details
      const photoWidth = 100;
      const photoHeight = 120;
      if (user?.profilePhoto) {
        try {
          const res = await fetch(user.profilePhoto, { mode: 'cors' });
          const imgBytes = await res.arrayBuffer();
          const lower = user.profilePhoto.toLowerCase();
          const img = lower.endsWith('.png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
          const scale = Math.min(photoWidth / img.width, photoHeight / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          page.drawImage(img, { x: pageMargin, y: cursorY - photoHeight, width: drawW, height: drawH });
        } catch (err) {
          page.drawRectangle({ x: pageMargin, y: cursorY - photoHeight, width: photoWidth, height: photoHeight, borderColor: colorLine, borderWidth: 1 });
          page.drawText('Photo', { x: pageMargin + 30, y: cursorY - photoHeight / 2, size: 10, font });
        }
      } else {
        page.drawRectangle({ x: pageMargin, y: cursorY - photoHeight, width: photoWidth, height: photoHeight, borderColor: colorLine, borderWidth: 1 });
        page.drawText('No Photo', { x: pageMargin + 25, y: cursorY - photoHeight / 2, size: 10, font });
      }

      const basicInfoX = pageMargin + photoWidth + 20;
      let basicInfoY = cursorY - 10;
      page.drawText(safeText(user?.name), { x: basicInfoX, y: basicInfoY, size: 11, font: boldFont });
      basicInfoY -= 15;
      page.drawText(`DOB : ${safeText(user?.dob)}`, { x: basicInfoX, y: basicInfoY, size: 10, font });
      basicInfoY -= 15;
      page.drawText(`Gender : ${safeText(user?.gender)}`, { x: basicInfoX, y: basicInfoY, size: 10, font });
      basicInfoY -= 15;
      page.drawText(`Education : ${safeText(user?.education)}`, { x: basicInfoX, y: basicInfoY, size: 10, font });
      basicInfoY -= 15;
      page.drawText(`Income : ${safeText(user?.income)}`, { x: basicInfoX, y: basicInfoY, size: 10, font });
      basicInfoY -= 15;
      page.drawText(`Caste : ${safeText(user?.caste)}`, { x: basicInfoX, y: basicInfoY, size: 10, font });

      cursorY -= (photoHeight + 15);
      page.drawLine({ start: { x: pageMargin, y: cursorY }, end: { x: width - pageMargin, y: cursorY }, thickness: 1, color: colorLine });
      cursorY -= 20;

      // Method to ensure we have space
      const ensureSpace = (needed) => {
        if (cursorY - needed < pageMargin) {
          page = pdfDoc.addPage();
          cursorY = height - pageMargin;
        }
      };

      // General Section Renderer
      const drawSection = (title, items) => {
        ensureSpace(40 + Math.ceil(items.length / 2) * 20);
        
        page.drawText(title, { x: pageMargin, y: cursorY, size: 12, font: boldFont, color: colorText });
        cursorY -= 15;
        page.drawLine({ start: { x: pageMargin, y: cursorY }, end: { x: width - pageMargin, y: cursorY }, thickness: 0.5, color: colorLine });
        cursorY -= 15;
        
        const col1X = pageMargin;
        const col2X = width / 2 + 10;
        
        for (let i = 0; i < items.length; i += 2) {
          let h1 = 18;
          let h2 = 18;
          if(items[i]) h1 = drawGridItem(items[i].label, items[i].value, col1X, cursorY, 200);
          if(items[i + 1]) h2 = drawGridItem(items[i + 1].label, items[i + 1].value, col2X, cursorY, 200);
          
          cursorY -= Math.max(h1, h2);
        }
        cursorY -= 5;
        page.drawLine({ start: { x: pageMargin, y: cursorY }, end: { x: width - pageMargin, y: cursorY }, thickness: 1, color: colorLine });
        cursorY -= 25;
      };

      // Personal Info
      drawSection('Personal Info', [
        { label: 'Name :', value: user?.name },
        { label: 'Mobile :', value: user?.phone },
        { label: 'Email :', value: user?.email },
        { label: 'DOB :', value: user?.dob },
        { label: 'Marital Status :', value: user?.maritalStatus },
        { label: 'Community :', value: user?.religion },
        { label: 'Caste :', value: user?.caste },
        { label: 'Sub Caste :', value: user?.subCaste },
        { label: 'Mother Tongue :', value: user?.motherTongue },
        { label: 'Height :', value: user?.height },
        { label: 'Weight :', value: user?.weight },
        { label: 'Blood Group :', value: user?.bloodGroup },
        { label: 'Complexion :', value: user?.complexion },
        { label: 'Lens :', value: user?.wearsLens },
        { label: 'Permanent Address :', value: user?.address }
      ]);

      // Education Info
      drawSection('Education Info', [
        { label: 'Education Area :', value: user?.fieldOfStudy },
        { label: 'Educational Spec. :', value: user?.education },
        { label: 'College :', value: user?.college },
        { label: 'Occupation :', value: user?.familyBackground },
        { label: 'Company :', value: user?.company },
        { label: 'Annual Income :', value: user?.income }
      ]);

      // Relative Info
      drawSection('Relative Info', [
        { label: 'Father Name :', value: user?.fatherName },
        { label: 'Parent Res. City :', value: user?.parentResidenceCity },
        { label: 'Mother :', value: user?.mother },
        { label: 'Brothers :', value: user?.brothers },
        { label: 'Married Brothers :', value: user?.marriedBrothers },
        { label: 'Sisters :', value: user?.sisters },
        { label: 'Married Sisters :', value: user?.marriedSisters },
        { label: 'Native District :', value: user?.nativeDistrict },
        { label: 'Native City :', value: user?.nativeCity },
        { label: 'Family Wealth :', value: user?.familyWealth },
        { label: 'Relative Surname :', value: user?.relativeSurname },
        { label: 'Parent Occupation :', value: user?.parentOccupation },
        { label: 'Mama Surname :', value: user?.mamaSurname }
      ]);

      // Horoscope Info
      drawSection('Horoscope Info', [
        { label: 'Rashi :', value: user?.rashi },
        { label: 'Nakshtra :', value: user?.nakshira },
        { label: 'Charan :', value: user?.charan },
        { label: 'Gan :', value: user?.gan },
        { label: 'Nadi :', value: user?.nadi },
        { label: 'Mangal :', value: user?.mangal },
        { label: 'Birth Place :', value: user?.birthPlace },
        { label: 'Birth Time :', value: user?.birthTime },
        { label: 'Gotra/Devak :', value: user?.gotraDevak }
      ]);

      // Expectation
      drawSection('Expectation', [
        { label: 'Expected Caste :', value: user?.expectedCaste },
        { label: 'Mangal :', value: user?.mangal },
        { label: 'Preferred City :', value: user?.preferredCity },
        { label: 'Expected Age Diff :', value: user?.expectedAgeDifference },
        { label: 'Expected Education :', value: user?.expectedEducation },
        { label: 'Divorcee :', value: user?.divorcee },
        { label: 'Expected Height :', value: user?.expectedHeight },
        { label: 'Expected Income :', value: user?.expectedIncome }
      ]);

      // Save and Download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(user?.name || 'user').toLowerCase().replace(/\s+/g, '_')}_biodata.pdf`;
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