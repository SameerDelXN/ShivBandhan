import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw, 
  CreditCard, 
  AlertCircle, 
  XCircle, 
  CheckCircle2, 
  Mail, 
  Globe 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RefundPolicy() {
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
                <RefreshCw className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Refund and Cancellation Policy</h1>
              <p className="text-lg text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            
            <div className="px-8 py-8 md:px-12 bg-white">
              <p className="text-lg text-gray-600 leading-relaxed text-center font-medium">
                At <span className="text-orange-600 font-bold">ShivBandhan Matrimony LLP</span>, we strive to provide the best matchmaking experience. However, since our services are digital and service-based, we follow a strict refund policy. By purchasing a premium membership or service, you agree to the following terms:
              </p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 1. General Policy */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. General Policy</h2>
              </div>
              <ul className="list-none space-y-3 pl-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                  <span>All payments made for ShivBandhan Matrimony services are <strong className="text-gray-900">non-refundable</strong>.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>
                  <span>Once a premium membership is activated and the user gains access to the database/contact details, the service is considered "consumed," and no refund will be issued.</span>
                </li>
              </ul>
            </div>

            {/* 2. Exceptions */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-emerald-100 pb-5">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Exceptions (When a Refund may be considered)</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-gray-800">A refund may only be processed under the following specific circumstances:</p>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">Double Payment</strong>
                    <p className="text-sm text-emerald-800">If charged twice for the same transaction due to a technical glitch, the duplicate amount will be refunded after verification.</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">Service Non-Activation</strong>
                    <p className="text-sm text-emerald-800">If payment was successful but premium features were not activated within 48 working hours, and our team is unable to resolve it.</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">Technical Errors</strong>
                    <p className="text-sm text-emerald-800">If a technical error on our platform prevents you from using paid features, and we are unable to fix it within a reasonable timeframe.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Non-Refundable Scenarios */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 border-b border-red-100 pb-5">
                <div className="bg-red-50 p-3 rounded-2xl text-red-500">
                  <XCircle className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Non-Refundable Scenarios</h2>
              </div>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-gray-800">Refunds will <strong className="text-red-600 uppercase">not</strong> be provided in the following cases:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>If the user decides to cancel the membership midway through the duration.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>If the user finds a partner through another source or outside the platform before the membership expires.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>If the user’s account is suspended or deleted due to a violation of our Terms and Conditions (e.g., fake profiles, harassment, or misuse of data).</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0"></div>
                    <span>If the user is unsatisfied with the number of responses or matches received (as matchmaking is a subjective process).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Refund Process & Cancellation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">4. Refund Process</h2>
                </div>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>To request a refund (in case of double payment or technical failure), email us within 24-48 hours of the transaction.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Email must include the <strong className="text-gray-800">Transaction ID</strong>, <strong className="text-gray-800">Date of Payment</strong>, and <strong className="text-gray-800">Reason for Refund</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Approved refunds will be processed back to the original payment method within 7 to 10 working days.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-600">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">5. Cancellation</h2>
                </div>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Users can choose not to renew their membership at the end of their current plan.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>ShivBandhan Matrimony LLP does not offer "pro-rata" refunds for early cancellations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Email Callout */}
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between shadow-inner mt-4 text-orange-900">
              <div className="flex items-center gap-4">
                <div className="bg-orange-600 text-white p-3 rounded-full">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Need Help with a Refund?</h3>
                  <p className="text-sm opacity-80">Contact our support team with your transaction details.</p>
                </div>
              </div>
              <a href="mailto:support@shivbandhan.com" className="font-bold text-orange-600 hover:text-orange-800 hover:underline px-4 py-2 border border-orange-200 bg-white rounded-lg transition-colors">
                support@shivbandhan.com
              </a>
            </div>

            {/* MARATHI SECTION */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl transform -rotate-1 scale-105 opacity-30"></div>
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-orange-200 shadow-lg relative z-10">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-orange-100 pb-6">
                  <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-sm">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">शिवबंधन मॅट्रिमोनी LLP</h2>
                    <h3 className="text-xl text-orange-600 font-semibold mt-1">परतावा (Refund) आणि रद्दीकरण धोरण</h3>
                  </div>
                </div>

                <div className="space-y-8 text-gray-700">
                  
                  {/* Marathi point 1 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-orange-100 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">१</span>
                      सामान्य धोरण:
                    </h4>
                    <ul className="list-none space-y-2 pl-9">
                      <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-orange-500">
                        शिवबंधन मॅट्रिमोनीसाठी दिलेले कोणतेही शुल्क <strong className="text-gray-900">विना-परतावा (Non-refundable)</strong> आहे.
                      </li>
                      <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-orange-500">
                        एकदा का प्रीमियम सेवा सक्रिय झाली आणि तुम्हाला इतर सभासदांची माहिती दिसू लागली की, ती सेवा वापरली गेली असे मानले जाते, त्यामुळे पैसे परत दिले जाणार नाहीत.
                      </li>
                    </ul>
                  </div>

                  {/* Marathi point 2 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-orange-100 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">२</span>
                      परताव्यासाठी अपवाद:
                    </h4>
                    <p className="mb-3 pl-9 font-medium text-gray-600">खालील परिस्थितीत परतावा विचारात घेतला जाऊ शकतो:</p>
                    <ul className="list-none space-y-3 pl-9">
                      <li className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block mb-1">दुहेरी पेमेंट:</strong>
                        तांत्रिक चुकीमुळे एकाच प्लॅनसाठी दोनदा पैसे कापले गेल्यास, पडताळणीनंतर वाढीव रक्कम परत केली जाईल.
                      </li>
                      <li className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block mb-1">सेवा सक्रिय न होणे:</strong>
                        पैसे कापले गेले परंतु ४८ तासांनंतरही तुमची सेवा सुरू झाली नाही आणि आमची तांत्रिक टीम ती सुरू करण्यास असमर्थ ठरली तरच परतावा मिळेल.
                      </li>
                    </ul>
                  </div>

                  {/* Marathi point 3 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-red-100 text-red-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">३</span>
                      परतावा कोणत्या परिस्थितीत मिळणार नाही?
                    </h4>
                    <ul className="list-none space-y-2 pl-9 text-gray-600">
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                        <span>वापरकर्त्याने स्वतःहून सदस्यत्व रद्द केल्यास.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                        <span>आमच्या प्लॅटफॉर्मबाहेरून किंवा इतर कुठूनही जोडीदार मिळाल्यास.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                        <span>गैरवर्तन किंवा चुकीची माहिती दिल्याने तुमचे खाते निलंबित (Suspend) झाले असल्यास.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                        <span>अपेक्षित प्रतिसाद मिळत नाही, या कारणास्तव परतावा मिळणार नाही.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Marathi point 4 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">४</span>
                      परतावा प्रक्रिया:
                    </h4>
                    <ul className="list-none space-y-2 pl-9">
                      <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-blue-500">
                        परताव्यासाठी विनंती करण्यासाठी <a href="mailto:support@shivbandhan.com" className="text-blue-600 font-semibold hover:underline">support@shivbandhan.com</a> यावर २४ ते ४८ तासांच्या आत ईमेल करणे आवश्यक आहे.
                      </li>
                      <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-blue-500">
                        मंजूर झालेला परतावा ७ ते १० कामकाजाच्या दिवसांत तुमच्या मूळ पेमेंट खात्यात जमा केला जाईल.
                      </li>
                    </ul>
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
