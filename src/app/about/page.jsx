import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  HeartHandshake,
  Globe,
  Users,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden mb-12 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
            
            <div className="px-8 py-16 md:py-24 text-center relative overflow-hidden bg-gradient-to-b from-orange-50/50 to-white">
              {/* Decorative background elements */}
              <div className="absolute top-10 left-10 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
              <div className="absolute top-10 right-10 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

              <Link href="/" className="absolute top-6 left-6 text-orange-600 hover:text-orange-800 flex items-center gap-2 transition-colors bg-white/80 py-2 px-4 rounded-full shadow-sm hover:shadow backdrop-blur-sm z-10">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6 text-orange-600 shadow-inner">
                  <Building className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">About Our Company</h1>
                <p className="text-xl text-orange-600 font-medium max-w-2xl mx-auto leading-relaxed">
                  "Marriages are made in heaven but we solemnize them at Shivbandhan Vadhu Var."
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Story Section */}
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                  <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
                </div>
                
                <div className="prose prose-orange max-w-none text-gray-600">
                  <p className="text-lg leading-relaxed mb-6">
                    <strong className="text-gray-900">Shivbandhan Vadhu Var</strong> is an online
                    marriage bureau based in Pune, dedicated to help people meet
                    their life partners for marriage in a comfortable environment.
                  </p>
                  <p className="text-lg leading-relaxed mb-6">
                    We understand that finding the right partner is one of the most important decisions in a person's life. 
                    That is why our platform is designed to provide a secure, seamless, and dignified experience for individuals and their families as they embark on this beautiful journey.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Shivbandhan is an LLP which incorporated in <strong className="text-gray-900">Feb 2019</strong>. We are proud 
                    to provide comprehensive matrimonial services to clients all over India and abroad, connecting hearts across borders.
                  </p>
                </div>
              </div>

            </div>

            {/* Sidebar / Quick Stats */}
            <div className="md:col-span-4 space-y-6">
              
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <HeartHandshake className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-bold mb-6 relative z-10">Company at a Glance</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-orange-50 text-sm font-medium">Established</p>
                      <p className="font-bold text-lg">February 2019</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-orange-50 text-sm font-medium">Service Area</p>
                      <p className="font-bold text-lg">India & Abroad</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-orange-50 text-sm font-medium">Headquarters</p>
                      <p className="font-bold text-lg">Pune, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Registered LLP</h4>
                  <p className="text-sm text-gray-500">Officially verified and trusted by thousands of families.</p>
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
