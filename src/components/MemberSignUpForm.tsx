import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { User, Phone, Mail, MapPin, FileText, Heart, Plus } from 'lucide-react';

interface MemberSignUpFormProps {
  planType: 'single' | 'family' | 'extended';
  onClose?: () => void;
}

const MemberSignUpForm: React.FC<MemberSignUpFormProps> = ({ planType, onClose }) => {
  const { isDark } = useTheme();
  const [policyNumber, setPolicyNumber] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Generate policy number on mount
  useEffect(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    setPolicyNumber(`GFT-${year}-${random}`);
  }, []);

  const getPlanTitle = () => {
    switch (planType) {
      case 'single':
        return 'BRONZE Plan';
      case 'family':
        return 'SILVER Plan';
      case 'extended':
        return 'GOLD Plan';
      default:
        return 'Member Plan';
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          {/* Header with Logo */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 75C50 75 25 60 25 40C25 30 32 25 40 25C45 25 50 28 50 28C50 28 55 25 60 25C68 25 75 30 75 40C75 60 50 75 50 75Z" 
                  className={isDark ? 'fill-emerald-400' : 'fill-emerald-600'} />
                <path d="M35 45C35 45 35 50 40 55L45 50" 
                  className={isDark ? 'stroke-emerald-200' : 'stroke-emerald-800'} 
                  strokeWidth="2" strokeLinecap="round" />
                <path d="M65 45C65 45 65 50 60 55L55 50" 
                  className={isDark ? 'stroke-emerald-200' : 'stroke-emerald-800'} 
                  strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getPlanTitle()} - Sign Up
            </h1>
            <div className={`flex items-center justify-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <FileText className="w-5 h-5" />
              <span className="font-mono font-semibold">Policy #: {policyNumber}</span>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h2>
              <button
                type="button"
                onClick={() => {
                  // QuickScan functionality will trigger the document scanner
                  alert('QuickScan will open your camera to scan ID document');
                }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                QuickScan - Auto Fill
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <User className="w-4 h-4 inline mr-1" />
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <User className="w-4 h-4 inline mr-1" />
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter last name"
                  required
                />
              </div>

              {/* ID Number */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FileText className="w-4 h-4 inline mr-1" />
                  ID Number *
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter ID number"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="0860 111 222"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter street address"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Enter city"
                  required
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="0000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Scanner Section */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Fill
            </h2>
            <div className={`p-6 rounded-lg border-2 border-dashed ${
              isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="text-center">
                <FileText className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Scan ID Document
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload or scan your ID to auto-fill personal information
                </p>
                <div className="flex gap-3 justify-center">
                  <label className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer">
                    Upload Document
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          alert(`File selected: ${file.name}`);
                          // File processing will be implemented here
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className={`px-6 py-2 rounded-lg font-semibold border-2 transition-colors ${
                      isDark
                        ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                    }`}
                    onClick={() => {
                      // Camera scanner functionality will be implemented
                      alert('Camera scanner will be integrated here');
                    }}
                  >
                    Scan Document
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plan-Specific Fields */}
          {(planType === 'family' || planType === 'extended') && (
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {planType === 'family' ? 'Spouse/Partner Information' : 'Family Members'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Spouse First Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    placeholder="Enter spouse first name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Spouse Last Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                    placeholder="Enter spouse last name"
                  />
                </div>
              </div>
              
              {/* Add Family Members Button */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    alert('Add additional family members (children, parents, etc.)');
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed transition-all ${
                    isDark
                      ? 'border-emerald-500/50 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10'
                      : 'border-emerald-600/50 text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Add Family Members</span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    (Children, Parents, etc.)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Children Section for Extended Family */}
          {planType === 'extended' && (
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Children Information
              </h2>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Number of Children (Max 4)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={`w-10 h-10 rounded-lg font-bold ${
                        isDark 
                          ? 'bg-gray-600 text-white hover:bg-gray-500' 
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      -
                    </button>
                    <span className={`text-xl font-bold min-w-[2ch] text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      0
                    </span>
                    <button
                      type="button"
                      className={`w-10 h-10 rounded-lg font-bold ${
                        isDark 
                          ? 'bg-gray-600 text-white hover:bg-gray-500' 
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add children details after selecting the number above
                </p>
              </div>
            </div>
          )}

          {/* Digital Signature Section */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Digital Signature
            </h2>
            <div className={`p-4 rounded-lg border-2 ${
              isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-white'
            }`}>
              <div className={`h-40 rounded border-2 border-dashed mb-4 flex items-center justify-center ${
                isDark ? 'border-gray-500 bg-gray-800' : 'border-gray-300 bg-gray-50'
              }`}>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sign here with mouse or touch
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-8">
            <div className={`p-4 rounded-lg space-y-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  required
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  I agree to the terms and conditions, and I confirm that all information provided is accurate. 
                  I understand that this is a binding agreement for funeral service coverage.
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  required
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  I consent to receiving email and text communications from Gift AI regarding my policy, 
                  updates, and services in accordance with the Protection of Personal Information Act (POPIA).
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Submit Application
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberSignUpForm;
