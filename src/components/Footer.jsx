"use client"
import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { 
  Facebook as LucideFacebook, 
  Twitter as LucideTwitter, 
  Instagram as LucideInstagram, 
  Linkedin as LucideLinkedin 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  const handlePolicyClick = (policy) => {
    const policyRoutes = {
      'Privacy Policy': '/policies/privacy-policy',
      'Terms of Service': '/policies/terms-of-service',
      'Safety Guidelines': '/policies/safety-guidelines',
      'Refund Policy': '/policies/refund-policy',
      'Community Standards': '/policies/community-standards'
    };
    
    if (policyRoutes[policy]) {
      router.push(policyRoutes[policy]);
    }
  };

  return (
    <footer className="w-full bg-rose-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Heart className="text-rose-400" size={24} />
              <span className="text-2xl font-serif font-medium">ShivBandhan</span>
            </div>
            <p className="text-rose-100/80 font-sans leading-relaxed">
              Helping you find meaningful connections that last a lifetime. Our thoughtful matchmaking honors tradition while embracing modern relationships.
            </p>
           <div className="flex space-x-4 pt-2">
  {['facebook'].map((social) => {
    const Icon = {
      facebook: LucideFacebook,
      twitter: LucideTwitter,
      instagram: LucideInstagram,
      linkedin: LucideLinkedin
    }[social];
    
    return (
      <a 
        key={social} 
        href="https://www.facebook.com/profile.php?id=61579366196814" 
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

          {/* Policies */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-medium border-b border-rose-900/50 pb-2">
              Policies
            </h3>
            <ul className="space-y-3 font-sans">
              {['Privacy Policy', 'Terms of Service', 'Safety Guidelines', 'Refund Policy', 'Community Standards'].map((policy) => (
                <li key={policy}>
                  <button 
                    onClick={() => handlePolicyClick(policy)}
                    className="text-rose-100/80 hover:text-rose-50 transition-colors duration-200 flex items-center group w-full text-left"
                  >
                    <span className="w-1 h-1 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {policy}
                  </button>
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
                <a href="mailto:shivbandhanmatromonial@gmail.com" className="text-rose-100/80 hover:text-rose-50">
                  shivbandhanmatromonial@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-rose-300" size={18} />
                <a href="tel:+911234567890" className="text-rose-100/80 hover:text-rose-50">
                 +91 940-423-3327
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
            © {new Date().getFullYear()} ShivBandhan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;