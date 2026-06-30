"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Users, TrendingUp, AlertCircle, CheckCircle, XCircle,
  Download, Filter, ChevronLeft, ChevronRight, Loader2,
  BarChart3, PieChart as PieChartIcon,
} from "lucide-react";

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#eab308'];
const PIE_COLORS_PAYMENT = ['#22c55e', '#ef4444'];
const PIE_COLORS_PROFILE = ['#3b82f6', '#f97316'];
const PIE_COLORS_GENDER = ['#3b82f6', '#ec4899', '#a855f7', '#94a3b8'];

export default function ReportsAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReport, setActiveReport] = useState("successful");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/reports");
        if (!response.ok) throw new Error("Failed to fetch report data");
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Data fetch failed");
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeReport, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { summary, charts, reports } = data;

  // Report tabs
  const reportTabs = [
    { id: "successful", label: "Successful Payments", icon: CheckCircle, color: "text-green-600" },
    { id: "unsuccessful", label: "Unsuccessful Payments", icon: XCircle, color: "text-red-600" },
    { id: "all", label: "All Transactions", icon: BarChart3, color: "text-blue-600" },
    { id: "incomplete", label: "Incomplete Profiles", icon: AlertCircle, color: "text-orange-600" },
    { id: "gender", label: "Male & Female Count", icon: Users, color: "text-purple-600" },
  ];

  // Get active report data
  const getReportData = () => {
    let reportData = [];
    let columns = [];

    switch (activeReport) {
      case "successful":
        reportData = reports.successfulTransactions || [];
        columns = ["Name", "Phone", "SB ID", "Plan", "Transaction ID", "Date"];
        break;
      case "unsuccessful":
        reportData = reports.unsuccessfulTransactions || [];
        columns = ["Name", "Phone", "SB ID", "Plan", "Status", "Date"];
        break;
      case "all":
        reportData = reports.allTransactions || [];
        columns = ["Name", "Phone", "SB ID", "Plan", "Transaction ID", "Status", "Date"];
        break;
      case "incomplete":
        reportData = reports.incompleteProfiles || [];
        columns = ["Name", "Phone", "Email", "SB ID", "Gender", "Completion %", "Joined"];
        break;
      case "gender":
        reportData = [
          { label: "Male", count: summary.maleCount, percentage: ((summary.maleCount / summary.totalUsers) * 100).toFixed(1) },
          { label: "Female", count: summary.femaleCount, percentage: ((summary.femaleCount / summary.totalUsers) * 100).toFixed(1) },
          { label: "Other", count: summary.otherGenderCount, percentage: ((summary.otherGenderCount / summary.totalUsers) * 100).toFixed(1) },
          { label: "Unspecified", count: summary.unspecifiedGenderCount, percentage: ((summary.unspecifiedGenderCount / summary.totalUsers) * 100).toFixed(1) },
        ].filter(r => r.count > 0);
        columns = ["Gender", "Count", "Percentage"];
        break;
    }

    // Apply search filter
    if (searchTerm && activeReport !== "gender") {
      const term = searchTerm.toLowerCase();
      reportData = reportData.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.phone?.toLowerCase().includes(term) ||
          item.email?.toLowerCase().includes(term) ||
          item.shivbandhanId?.toLowerCase().includes(term)
      );
    }

    return { reportData, columns };
  };

  const { reportData, columns } = getReportData();
  const totalPages = Math.ceil(reportData.length / rowsPerPage);
  const paginatedData = reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // CSV Export
  const exportCSV = () => {
    const { reportData, columns } = getReportData();
    let csvContent = columns.join(",") + "\n";

    reportData.forEach((row) => {
      let values = [];
      if (activeReport === "gender") {
        values = [row.label, row.count, `${row.percentage}%`];
      } else if (activeReport === "incomplete") {
        values = [row.name, row.phone, row.email, row.shivbandhanId, row.gender, `${row.profileCompletion}%`, new Date(row.createdAt).toLocaleDateString()];
      } else {
        values = [row.name, row.phone, row.shivbandhanId, row.plan, row.transactionId || row.status, row.status || '', new Date(row.createdAt).toLocaleDateString()];
      }
      csvContent += values.map(v => `"${v || ''}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeReport}_report.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderTableRow = (row, index) => {
    if (activeReport === "gender") {
      return (
        <tr key={index} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
          <td className="py-3 px-4 font-medium text-gray-900">{row.label}</td>
          <td className="py-3 px-4 text-gray-700">{row.count.toLocaleString()}</td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${row.percentage}%` }}></div>
              </div>
              <span className="text-sm text-gray-600">{row.percentage}%</span>
            </div>
          </td>
        </tr>
      );
    }

    if (activeReport === "incomplete") {
      return (
        <tr key={row._id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 text-gray-600">{row.phone}</td>
          <td className="py-3 px-4 text-gray-600 text-xs">{row.email}</td>
          <td className="py-3 px-4 text-orange-600 font-mono text-sm">{row.shivbandhanId || '-'}</td>
          <td className="py-3 px-4 text-gray-600">{row.gender}</td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                <div className={`h-2 rounded-full ${row.profileCompletion >= 70 ? 'bg-green-500' : row.profileCompletion >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${row.profileCompletion}%` }}></div>
              </div>
              <span className="text-xs text-gray-600">{row.profileCompletion}%</span>
            </div>
          </td>
          <td className="py-3 px-4 text-gray-500 text-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
        </tr>
      );
    }

    // Transaction rows
    return (
      <tr key={row._id || index} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
        <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
        <td className="py-3 px-4 text-gray-600">{row.phone}</td>
        <td className="py-3 px-4 text-orange-600 font-mono text-sm">{row.shivbandhanId || '-'}</td>
        <td className="py-3 px-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.plan === 'free' ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800'}`}>
            {row.plan}
          </span>
        </td>
        {activeReport === "successful" && <td className="py-3 px-4 text-gray-600 font-mono text-xs">{row.transactionId}</td>}
        {activeReport === "unsuccessful" && (
          <td className="py-3 px-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{row.status}</span>
          </td>
        )}
        {activeReport === "all" && (
          <>
            <td className="py-3 px-4 text-gray-600 font-mono text-xs">{row.transactionId}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {row.status}
              </span>
            </td>
          </>
        )}
        <td className="py-3 px-4 text-gray-500 text-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
      </tr>
    );
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: summary.totalUsers, icon: Users, color: "from-blue-500 to-blue-600" },
          { label: "Male Users", value: summary.maleCount, icon: Users, color: "from-indigo-500 to-indigo-600" },
          { label: "Female Users", value: summary.femaleCount, icon: Users, color: "from-pink-500 to-pink-600" },
          { label: "Complete Profiles", value: summary.completeProfiles, icon: CheckCircle, color: "from-green-500 to-green-600" },
          { label: "Incomplete Profiles", value: summary.incompleteProfiles, icon: AlertCircle, color: "from-orange-500 to-orange-600" },
          { label: "Successful Payments", value: summary.successfulPayments, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
          { label: "Unsuccessful Payments", value: summary.unsuccessfulPayments, icon: XCircle, color: "from-red-500 to-red-600" },
          { label: "Payment Success Rate", value: summary.totalUsers > 0 ? `${((summary.successfulPayments / summary.totalUsers) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, color: "from-purple-500 to-purple-600" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                <div className={`w-8 h-8 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Registration Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Monthly Registrations</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.monthlyRegistrations} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" name="Female" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Gender Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.genderDistribution}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {charts.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_GENDER[index % PIE_COLORS_GENDER.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Payment Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.paymentStatus}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {charts.paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_PAYMENT[index % PIE_COLORS_PAYMENT.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Plan Distribution Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Subscription Plans</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.planDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Users" radius={[6, 6, 0, 0]}>
                {charts.planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Reports</h3>
          <p className="text-sm text-gray-500 mt-1">Generate and export detailed reports</p>
        </div>

        {/* Report Tabs */}
        <div className="px-6 py-3 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-2">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeReport === tab.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters & Export */}
        <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeReport !== "gender" && (
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, ID..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <span className="text-sm text-gray-500">{reportData.length} records</span>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => renderTableRow(row, index))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({reportData.length} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
