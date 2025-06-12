"use client";
import { useState } from "react";
import { Plus, Trash2, Edit, Search } from "lucide-react";

export default function AdminPlansTable() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Premium",
      price: "₹999",
      status: "ENABLED",
      features: ["Unlimited Profile Views", "Priority Support"],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      name: "Free", 
      price: "Free",
      status: "DISABLED",
      features: ["Limited Profile Views", "Basic Support"],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    }
  ]);

  const [filter, setFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    status: "ENABLED",
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");

  // Filter plans based on status and search query
  const filteredPlans = plans
    .filter(plan => 
      filter === "All Status" 
        ? true 
        : filter === "Active" 
          ? plan.status === "ENABLED" 
          : plan.status === "DISABLED"
    )
    .filter(plan => 
      planFilter === "All Plans" 
        ? true 
        : plan.name === planFilter
    )
    .filter(plan => 
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.features.some(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"} ago`;
    
    return "just now";
  };

  // Handle adding a new plan
  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.price) return;
    
    const plan = {
      id: plans.length > 0 ? Math.max(...plans.map(p => p.id)) + 1 : 1,
      name: newPlan.name,
      price: newPlan.price,
      status: newPlan.status,
      features: newPlan.features,
      createdAt: new Date(),
    };
    
    setPlans([...plans, plan]);
    setNewPlan({
      name: "",
      price: "",
      status: "ENABLED",
      features: [],
    });
    setShowAddPlanModal(false);
  };

  // Handle editing a plan
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price,
      status: plan.status,
      features: [...plan.features],
    });
    setShowAddPlanModal(true);
  };

  // Handle updating a plan
  const handleUpdatePlan = () => {
    if (!newPlan.name || !newPlan.price) return;
    
    setPlans(plans.map(plan => 
      plan.id === editingPlan.id 
        ? { 
            ...plan, 
            name: newPlan.name,
            price: newPlan.price,
            status: newPlan.status,
            features: newPlan.features,
          } 
        : plan
    ));
    
    setEditingPlan(null);
    setNewPlan({
      name: "",
      price: "",
      status: "ENABLED",
      features: [],
    });
    setShowAddPlanModal(false);
  };

  // Handle deleting a plan
  const handleDeletePlan = (id) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  // Add a feature to the new plan
  const addFeature = () => {
    if (newFeature.trim() && !newPlan.features.includes(newFeature.trim())) {
      setNewPlan({
        ...newPlan,
        features: [...newPlan.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  // Remove a feature from the new plan
  const removeFeature = (featureToRemove) => {
    setNewPlan({
      ...newPlan,
      features: newPlan.features.filter(feature => feature !== featureToRemove),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Plans Management</h1>
        <p className="text-sm text-gray-600">Manage all subscription plans and their features</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search plans..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            {["All Status", "Active", "Disabled"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            {["All Plans", "Premium", "Free"].map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>

          <button className="border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            More Filters
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            onClick={() => {
              setEditingPlan(null);
              setNewPlan({
                name: "",
                price: "",
                status: "ENABLED",
                features: [],
              });
              setShowAddPlanModal(true);
            }}
          >
            <Plus size={16} /> Add Plan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl shadow-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-rose-100 text-rose-700 text-left">
            <tr>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <tr key={plan.id} className="border-b hover:bg-white transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{plan.name}</div>
                    <div className="text-gray-600 text-xs">{plan.features.join(", ")}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        plan.status === "ENABLED"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {plan.status === "ENABLED" ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{plan.price}</td>
                  <td className="p-4 text-gray-600">{formatRelativeTime(plan.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Plan Modal */}
        {showAddPlanModal && (
        <div className="fixed inset-0 bg-gray-500/ flex items-center justify-center p-4 z-50">
          <div 
             className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md"
             onClick={(e) => e.stopPropagation()}
       >
            <div className="p-5">
              <h2 className="text-lg font-bold mb-4">
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="Enter plan name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                    placeholder="Enter price (e.g., ₹999 or Free)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newPlan.status}
                    onChange={(e) => setNewPlan({...newPlan, status: e.target.value})}
                  >
                    <option value="ENABLED">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Enter feature"
                      onKeyDown={(e) => e.key === "Enter" && addFeature()}
                    />
                    <button 
                      className="bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm"
                      onClick={addFeature}
                    >
                      Add
                    </button>
                  </div>
                  
                  {newPlan.features.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                      {newPlan.features.map((feature, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span className="truncate">{feature}</span>
                          <button 
                            className="text-red-500 hover:text-red-700 ml-2"
                            onClick={() => removeFeature(feature)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setShowAddPlanModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm"
                  onClick={editingPlan ? handleUpdatePlan : handleAddPlan}
                  disabled={!newPlan.name || !newPlan.price}
                >
                  {editingPlan ? "Update Plan" : "Add Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}