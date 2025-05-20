"use client"
import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { 
  Facebook as LucideFacebook, 
  Twitter as LucideTwitter, 
  Instagram as LucideInstagram, 
  Linkedin as LucideLinkedin 
} from 'lucide-react';
const Footer = () => {
  return (
    <footer className="w-full bg-rose-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Heart className="text-rose-400" size={24} />
              <span className="text-2xl font-serif font-medium">Matrimony</span>
            </div>
            <p className="text-rose-100/80 font-sans leading-relaxed">
              Helping you find meaningful connections that last a lifetime. Our thoughtful matchmaking honors tradition while embracing modern relationships.
            </p>
           <div className="flex space-x-4 pt-2">
  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => {
    const Icon = {
      facebook: LucideFacebook,
      twitter: LucideTwitter,
      instagram: LucideInstagram,
      linkedin: LucideLinkedin
    }[social];
    
    return (
      <a 
        key={social} 
        href="#" 
        className="w-10 h-10 rounded-full bg-rose-900/30 hover:bg-rose-900/50 flex items-center justify-center transition-colors duration-300"
        aria-label={social}
      >
        <span className="sr-only">{social}</span>
        <Icon className="w-5 h-5 opacity-80 text-white" />
      </a>
    );
  })}
</div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-medium border-b border-rose-900/50 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 font-sans">
              {['Home', 'Search', 'Matches', 'Success Stories', 'Pricing'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-rose-100/80 hover:text-rose-50 transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-medium border-b border-rose-900/50 pb-2">
              Policies
            </h3>
            <ul className="space-y-3 font-sans">
              {['Privacy Policy', 'Terms of Service', 'Safety Guidelines', 'Refund Policy', 'Community Standards'].map((policy) => (
                <li key={policy}>
                  <a 
                    href="#" 
                    className="text-rose-100/80 hover:text-rose-50 transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {policy}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-medium border-b border-rose-900/50 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4 font-sans">
              <li className="flex items-start space-x-3">
                <MapPin className="text-rose-300 mt-1 flex-shrink-0" size={18} />
                <span className="text-rose-100/80">
                 Pune,Maharashtra
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-rose-300" size={18} />
                <a href="mailto:hello@matrimony.com" className="text-rose-100/80 hover:text-rose-50">
                  info@shivbandhan.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-rose-300" size={18} />
                <a href="tel:+911234567890" className="text-rose-100/80 hover:text-rose-50">
                 +1 888-843-8693
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-rose-900/50 my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-rose-100/60 text-sm font-sans">
            © {new Date().getFullYear()} Matrimony. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-rose-100/60 hover:text-rose-50 text-sm transition-colors duration-200">
              Sitemap
            </a>
            <a href="#" className="text-rose-100/60 hover:text-rose-50 text-sm transition-colors duration-200">
              FAQ
            </a>
            <a href="#" className="text-rose-100/60 hover:text-rose-50 text-sm transition-colors duration-200">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;