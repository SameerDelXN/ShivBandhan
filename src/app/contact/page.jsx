"use client";
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Map as MapIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  const contactDetails = [
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Our Office",
      content: "Yashganga Complex, F No- 306, Nr Hotel Deccan Pavilion Navale Bridge, Katraj Bypass Road, Narhe, Pune- 411041, Maharashtra, India",
      link: "https://maps.google.com/?q=Yashganga+Complex+Narhe+Pune"
    },
    {
      icon: <Phone className="w-8 h-8 text-orange-600" />,
      title: "Phone Number",
      content: "+91 91683 19090",
      link: "tel:+919168319090"
    },
    {
      icon: <Mail className="w-8 h-8 text-orange-600" />,
      title: "Email Address",
      content: "info@shivbandhan.com",
      link: "mailto:info@shivbandhan.com"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Working Hours",
      content: "Monday - Saturday: 10:00 AM - 7:00 PM",
      link: null
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, link: "#", name: "Facebook" },
    { icon: <Instagram className="w-6 h-6" />, link: "#", name: "Instagram" },
    { icon: <Twitter className="w-6 h-6" />, link: "#", name: "Twitter" },
    { icon: <Linkedin className="w-6 h-6" />, link: "#", name: "LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-amber-50/50">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <img
            src="/assest/mandala.png"
            alt="mandala"
            className="absolute -top-24 -right-24 w-96 h-96 animate-spin-slow"
          />
          <img
            src="/assest/mandala.png"
            alt="mandala"
            className="absolute -bottom-24 -left-24 w-96 h-96 animate-spin-slow-reverse"
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-orange-600">Touch</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you find your perfect life partner. Reach out to us for any queries about our Maratha matrimonial services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-20 px-4 bg-white relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-orange-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {detail.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{detail.title}</h3>
                {detail.link ? (
                  <a
                    href={detail.link}
                    className="text-gray-600 hover:text-orange-600 transition-colors break-words leading-relaxed"
                    target={detail.link.startsWith('http') ? "_blank" : undefined}
                    rel={detail.link.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    {detail.content}
                  </a>
                ) : (
                  <p className="text-gray-600 leading-relaxed">{detail.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <Footer />

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-reverse 35s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
