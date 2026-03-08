import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  MessageSquareWarning, 
  Lock, 
  CreditCard, 
  UserX, 
  AlertTriangle, 
  Scale, 
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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
                <Scale className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            
            <div className="px-8 py-8 md:px-12 bg-white">
              <p className="text-lg text-gray-600 leading-relaxed text-center font-medium">
                Welcome to <span className="text-orange-600 font-bold">Shivbandhan Matrimony LLP</span> (hereinafter referred to as "Shivbandhan," "Website," "Company," or "We"). By registering an account on www.shivbandhan.com, you agree to be bound by the following Terms and Conditions and provide your explicit consent for data processing.
              </p>
            </div>
          </div>

          {/* Cards Content */}
          <div className="space-y-6">
            
            {/* 1. Eligibility */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Eligibility</h2>
              </div>
              <div className="text-gray-600 space-y-4 prose-orange">
                <p>By registering, you certify that:</p>
                <ul className="list-none space-y-3 pl-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>You are of legal marriageable age as per Indian Law (currently 18 years for females and 21 years for males).</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Your intent is to find a life partner for marriage and not for dating or illicit purposes.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>You are either a citizen of India or a Person of Indian Origin (PIO)/Non-Resident Indian (NRI).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. Registration and Account Security */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Registration and Account Security</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <ul className="list-none space-y-3 pl-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>You agree to provide accurate, current, and complete information during the registration process.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>You are responsible for maintaining the confidentiality of your login credentials (Username/OTP/Password).</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Any activity occurring under your account is your sole responsibility.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Role of Shivbandhan Matrimony */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <Users className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Role of Shivbandhan Matrimony</h2>
              </div>
              <div className="text-gray-600 grid gap-6 md:grid-cols-2">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Intermediary Status</h3>
                  <p className="text-sm">Shivbandhan.com is an advertising platform/intermediary. We do not verify the character, financial status, or health of the members.</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">No Guarantee</h3>
                  <p className="text-sm">We do not guarantee a successful match or a proposal.</p>
                </div>
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 md:col-span-2">
                  <h3 className="font-bold text-orange-900 mb-2">Verification Guidance</h3>
                  <p className="text-sm text-orange-800">While we may offer "Verified" badges based on ID uploads, users are strongly advised to conduct their own independent background checks before proceeding with any marriage proposal.</p>
                </div>
              </div>
            </div>

            {/* 4. User Conduct and Content */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-red-50 p-3 rounded-2xl text-red-500">
                  <MessageSquareWarning className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. User Conduct and Content</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-gray-800">You agree NOT to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Post any defamatory, obscene, or hateful content.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Create fake profiles or impersonate others.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Use the platform to solicit money or financial assistance.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Distribute "spam" or commercial advertisements.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>Harass or stalk any member.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Privacy and Consent */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Privacy & Consent (DPDP Act)</h2>
              </div>
              <div className="text-gray-600 space-y-5">
                <p>By clicking "I Agree" or registering, you provide your <strong className="text-gray-900">Explicit Consent</strong> to:</p>
                <div className="space-y-4 pl-4 border-l-2 border-blue-100">
                  <div>
                    <strong className="text-gray-900 block mb-1">Data Collection</strong>
                    <p className="text-sm">Shivbandhan collecting your personal data (Name, Age, Photos, Religion, Caste, Occupation, Income, and contact details).</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Data Visibility</strong>
                    <p className="text-sm">Your profile (excluding private contact details depending on your settings) being visible to other registered members.</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Communication</strong>
                    <p className="text-sm">Receiving calls, SMS, WhatsApp messages, and emails from Shivbandhan regarding your account, matches, and promotional offers.</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Third-Party Disclosure</strong>
                    <p className="text-sm">Shivbandhan sharing your data with service providers (like payment gateways) only to the extent necessary to provide services.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 & 7. Fees and Termination (Combined row for layout) */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">6. Membership Fees <br/>& Refunds</h2>
                </div>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Membership fees are non-refundable once the service has been activated or used.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Disputes regarding payments must be reported within 7 days of the transaction.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-600">
                    <UserX className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">7. Termination <br/>of Account</h2>
                </div>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Shivbandhan reserves the right to terminate your profile without notice if you violate these terms.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>You may delete your profile at any time through settings. Data is retained only per legal requirements.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 8. Limitation of Liability */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    Shivbandhan Matrimony LLP shall not be held liable for any loss, damage, or fraud caused by any interaction between members. Any meeting or exchange of information outside the website is done at your own risk.
                  </p>
                </div>
              </div>
            </div>

            {/* 9. Governing Law */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 flex-shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">9. Governing Law and Jurisdiction</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.
                  </p>
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
