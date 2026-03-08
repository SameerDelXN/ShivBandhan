import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Database,
  Settings,
  Share2,
  Sliders,
  ShieldCheck,
  HardDrive,
  Cookie,
  UserCheck,
  RefreshCw,
  Mail,
  Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-500"></div>
            <div className="bg-gradient-to-br from-orange-50 to-white px-8 py-12 text-center relative overflow-hidden">
              <Link href="/" className="absolute top-6 left-6 text-orange-600 hover:text-orange-800 flex items-center gap-2 transition-colors bg-white/80 py-2 px-4 rounded-full shadow-sm hover:shadow backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              
              <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6 text-orange-600 shadow-inner">
                <Shield className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            
            <div className="px-8 py-8 md:px-12 bg-white">
              <p className="text-lg text-gray-600 leading-relaxed text-center font-medium">
                At <span className="text-orange-600 font-bold">Shivbandhan Matrimony LLP</span> ("We", "Us", or "Our"), we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website.
              </p>
            </div>
          </div>

          {/* Cards Content */}
          <div className="space-y-6">
            
            {/* 1. Information We Collect */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Database className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-gray-800">To provide effective matchmaking services, we collect the following types of information:</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <strong className="text-gray-900 block mb-1">Personal & Contact Info</strong>
                    <p className="text-sm">Name, gender, DOB, marital status, photographs, email, phone number, and residential address.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <strong className="text-gray-900 block mb-1">Matrimonial Details</strong>
                    <p className="text-sm">Religion, caste, mother tongue, physical attributes, education, occupation, income, and family background.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <strong className="text-gray-900 block mb-1">Verification Documents</strong>
                    <p className="text-sm">Optional or mandatory upload of Govt-issued IDs (Aadhar, PAN, Passport) for "Verified" badges.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <strong className="text-gray-900 block mb-1">Technical Data</strong>
                    <p className="text-sm">IP address, browser type, device information, and cookies to improve website performance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                  <Settings className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <div className="text-gray-600">
                <ul className="list-none space-y-4 pl-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-4 flex-shrink-0"></div>
                    <div><strong className="text-gray-900">Matchmaking:</strong> To display your profile to other registered members and suggest compatible matches.</div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-4 flex-shrink-0"></div>
                    <div><strong className="text-gray-900">Communication:</strong> To send alerts regarding matches, account updates, and promotional offers.</div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-4 flex-shrink-0"></div>
                    <div><strong className="text-gray-900">Verification & Personalization:</strong> To verify user authenticity, maintain safety, and improve website features.</div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-4 flex-shrink-0"></div>
                    <div><strong className="text-gray-900">Legal Compliance:</strong> To comply with legal obligations or law enforcement requests.</div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3 & 4. Sharing and Privacy Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 3. Sharing */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">3. Information Sharing <br/>& Disclosure</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4 font-medium">We do not sell or rent your personal information.</p>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Other Users:</strong> They view your profile based on your privacy settings.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Service Providers:</strong> For operations like payment gateways and SMS.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Legal Necessity:</strong> If required by law or to prevent illegal activities.</span>
                  </li>
                </ul>
              </div>

              {/* 4. Privacy Settings */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-sky-50 p-3 rounded-2xl text-sky-600">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">4. Privacy Settings <br/>& Control</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4 font-medium">We empower you with tools to control your privacy:</p>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Photo Privacy:</strong> Visible to all, premium only, or accepted matches.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Contact Privacy:</strong> Control who can view your phone and email.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span><strong className="text-gray-800">Profile Deletion:</strong> Instantly remove your entire profile from visibility.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 5, 6, 7. Security, Retention, Cookies */}
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex bg-rose-50 w-12 h-12 rounded-2xl text-rose-600 items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Security</h2>
                <p className="text-sm text-gray-600">We employ industry-standard encryption, firewalls, and secure servers. However, no internet transmission is 100% secure.</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex bg-teal-50 w-12 h-12 rounded-2xl text-teal-600 items-center justify-center mb-4">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Retention</h2>
                <p className="text-sm text-gray-600">We retain your data as long as your account is active, necessary for services, or required to comply with legal/tax obligations.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex bg-orange-50 w-12 h-12 rounded-2xl text-orange-600 items-center justify-center mb-4">
                  <Cookie className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookies</h2>
                <p className="text-sm text-gray-600">Cookies enhance your experience by recognizing return visits. Disabling cookies may disable certain website features.</p>
              </div>
            </div>

            {/* 8. DPDP Act */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Your Rights (DPDP Act Compliance)</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-gray-800">As a "Data Principal" under Indian law, you have the right to:</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-2xl">
                    <strong className="text-amber-900 block mb-1">Access & Correction</strong>
                    <p className="text-sm text-amber-800">Review and update your personal information at any time.</p>
                  </div>
                  <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-2xl">
                    <strong className="text-amber-900 block mb-1">Withdraw Consent</strong>
                    <p className="text-sm text-amber-800">Withdraw your consent for data processing by deleting your account.</p>
                  </div>
                  <div className="bg-amber-50/50 p-4 border border-amber-100 rounded-2xl">
                    <strong className="text-amber-900 block mb-1">Grievance Redressal</strong>
                    <p className="text-sm text-amber-800">Lodge a complaint regarding data handling with our Grievance Officer.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 9 & 10 */}
            <div className="grid md:grid-cols-2 gap-6 pb-12">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex bg-gray-100 w-12 h-12 rounded-2xl text-gray-600 items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to this Policy</h2>
                <p className="text-sm text-gray-600">Shivbandhan Matrimony LLP reserves the right to update this Privacy Policy at any time. Significant changes will be notified via email or a prominent notice upon login.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-200 bg-gradient-to-br from-white to-orange-50 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 blur-sm">
                  <Mail className="w-48 h-48 text-orange-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-600 p-2.5 rounded-xl text-white">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">10. Grievance Officer</h2>
                  </div>
                  <p className="text-xs text-orange-800 mb-4 font-medium uppercase tracking-wide">As per IT Act 2000 & DPDP Act 2023</p>
                  <div className="space-y-2 text-sm text-gray-800">
                    <p><strong className="text-gray-900">Entity:</strong> Shivbandhan Matrimony LLP</p>
                    <p><strong className="text-gray-900">Address:</strong> Karve Nagar, Pune, Maharashtra 411052</p>
                    <p className="pt-2">
                      <strong className="text-gray-900">Email:</strong>{' '}
                      <a href="mailto:support@shivbandhan.com" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">support@shivbandhan.com</a>
                    </p>
                    <p>
                      <strong className="text-gray-900">Phone:</strong> <span className="text-orange-600 font-semibold">+91-8888438693</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
