"use client"
import { useState, useEffect } from 'react';
import { Heart, User, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MatrimonialNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image 
            src={"/logo.png"} 
            width={1920} 
            height={1080} 
            className='w-12 h-12 rounded-full' 
            alt='logo'
          />
          <span className="font-serif text-2xl font-bold text-[#7b2b2a]">
            Shiv<span className="text-orange-600">Bandhan</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Home', 'Browse Profiles', 'Success Stories', 'About Us', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-[#7b2b2a] font-medium hover:text-orange-600 transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-orange-600 border border-orange-600 rounded-full hover:bg-orange-50 transition-colors duration-300 hover:shadow-md"
          >
            Login
          </Link>
          {/* Register button if needed - keeping commented for now
          <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center hover:translate-y-px">
            <span>Register</span>
            <User size={16} className="ml-2" />
          </button>
          */}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#7b2b2a] hover:text-orange-600 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {['Home', 'Browse Profiles', 'Success Stories', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[#7b2b2a] py-2 hover:text-orange-600 transition-colors duration-200 border-b border-orange-50 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                href={"/login"} 
                className="w-full py-2 text-center text-orange-600 border border-orange-600 rounded-full hover:bg-orange-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              {/* Register button for mobile if needed
              <button className="w-full py-2 text-center bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-md">
                Register
              </button>
              */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}