// app/admin-dashboard/form-builder/page.jsx
'use client'
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ChevronUp, ChevronDown, X, Settings, Eye, EyeOff } from 'lucide-react';

const fieldTypes = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'number', label: 'Number Input', icon: '🔢' },
  { value: 'select', label: 'Dropdown Select', icon: '📋' },
  { value: 'date', label: 'Date Picker', icon: '📅' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'textarea', label: 'Text Area', icon: '📄' },
];

export default function FormBuilder() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedFields, setExpandedFields] = useState({});

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/form-sections');
      const data = await res.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleField = (sectionIndex, fieldIndex) => {
    const key = `${sectionIndex}-${fieldIndex}`;
    setExpandedFields(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addSection = () => {
    const newIndex = sections.length;
    setSections([...sections, {
      name: `section-${Date.now()}`,
      label: 'New Section',
      icon: 'User',
      fields: [],
      order: sections.length
    }]);
    setExpandedSections(prev => ({ ...prev, [newIndex]: true }));
  };

  const addField = (sectionIndex) => {
    const updatedSections = [...sections];
    const newFieldIndex = updatedSections[sectionIndex].fields.length;
    updatedSections[sectionIndex].fields.push({
      name: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      options: [],
      placeholder: '',
      order: newFieldIndex
    });
    setSections(updatedSections);
    
    const key = `${sectionIndex}-${newFieldIndex}`;
    setExpandedFields(prev => ({ ...prev, [key]: true }));
  };

  const removeField = (sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields.splice(fieldIndex, 1);
    setSections(updatedSections);
  };

  const addOption = (sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options.push('');
    setSections(updatedSections);
  };

  const removeOption = (sectionIndex, fieldIndex, optionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    setSections(updatedSections);
  };

  const updateOption = (sectionIndex, fieldIndex, optionIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].options[optionIndex] = value;
    setSections(updatedSections);
  };

  const saveSections = async () => {
    try {
      const res = await fetch('/api/admin/form-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections })
      });
      if (res.ok) {
        alert('Form configuration saved successfully!');
        fetchSections();
      }
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Section Header */}
                <div className="p-6 border-b border-slate-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {sectionIndex + 1}
                      </div>
                      <div className="text-xl font-semibold px-2 py-1 cursor-not-allowed select-none">
                        {section.label}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{section.fields.length} fields</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => saveSections()}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save Section"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => toggleSection(sectionIndex)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={expandedSections[sectionIndex] ? "Collapse" : "Expand"}
                      >
                        {expandedSections[sectionIndex] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section Fields */}
                {expandedSections[sectionIndex] !== false && (
                  <div className="p-6 space-y-4">
                    {section.fields.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 mb-4">No fields in this section yet</p>
                        <button
                          onClick={() => addField(sectionIndex)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first field
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {section.fields.map((field, fieldIndex) => {
                          const fieldKey = `${sectionIndex}-${fieldIndex}`;
                          const isExpanded = expandedFields[fieldKey];
                          const fieldType = fieldTypes.find(t => t.value === field.type);
                          
                          return (
                            <div key={fieldIndex} className="bg-slate-50/50 rounded-xl border border-slate-200/50 overflow-hidden">
                              {/* Field Header */}
                              <div className="p-4 bg-white/50 border-b border-slate-200/30">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm border border-slate-200/50">
                                      {fieldType?.icon}
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-800 cursor-not-allowed select-none">
                                        {field.label || 'Unnamed Field'}
                                      </div>
                                      <div className="text-sm text-slate-500">{fieldType?.label}</div>
                                    </div>
                                    {field.required && (
                                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleField(sectionIndex, fieldIndex)}
                                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title={isExpanded ? "Collapse" : "Expand"}
                                    >
                                      <Settings size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Field Configuration */}
                              {isExpanded && (
                                <div className="p-6 space-y-6">
                                  {/* Basic Settings */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-slate-700">Field Label</label>
                                      <div className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed select-none">
                                        {field.label}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-slate-700">Field Name</label>
                                      <div className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed select-none">
                                        {field.name}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-slate-700">Field Type</label>
                                      <select
                                        value={field.type}
                                        onChange={(e) => {
                                          const updated = [...sections];
                                          updated[sectionIndex].fields[fieldIndex].type = e.target.value;
                                          if (e.target.value !== 'select') {
                                            updated[sectionIndex].fields[fieldIndex].options = [];
                                          }
                                          setSections(updated);
                                        }}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      >
                                        {fieldTypes.map((type) => (
                                          <option key={type.value} value={type.value}>
                                            {type.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="flex items-center justify-center">
                                      <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={field.required}
                                          onChange={(e) => {
                                            const updated = [...sections];
                                            updated[sectionIndex].fields[fieldIndex].required = e.target.checked;
                                            setSections(updated);
                                          }}
                                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                        />
                                        <span className="font-medium text-slate-700">Required Field</span>
                                      </label>
                                    </div>
                                  </div>

                                  {/* Placeholder for text inputs */}
                                  {(field.type === 'text' || field.type === 'number' || field.type === 'textarea') && (
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-slate-700">Placeholder Text</label>
                                      <input
                                        type="text"
                                        value={field.placeholder || ''}
                                        onChange={(e) => {
                                          const updated = [...sections];
                                          updated[sectionIndex].fields[fieldIndex].placeholder = e.target.value;
                                          setSections(updated);
                                        }}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter placeholder text"
                                      />
                                    </div>
                                  )}

                                  {/* Options for select fields */}
                                  {field.type === 'select' && (
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-slate-700">Dropdown Options</label>
                                        <button
                                          onClick={() => addOption(sectionIndex, fieldIndex)}
                                          className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                          <Plus size={14} />
                                          Add Option
                                        </button>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        {field.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                                              {optionIndex + 1}
                                            </div>
                                            <input
                                              type="text"
                                              value={option}
                                              onChange={(e) => updateOption(sectionIndex, fieldIndex, optionIndex, e.target.value)}
                                              className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                              placeholder={`Option ${optionIndex + 1}`}
                                            />
                                            <button
                                              onClick={() => removeOption(sectionIndex, fieldIndex, optionIndex)}
                                              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                              <X size={16} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Start Building Your Form</h3>
              <p className="text-slate-500 mb-6">Create sections and add fields to design your custom form</p>
              <button
                onClick={addSection}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                Create First Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//sample