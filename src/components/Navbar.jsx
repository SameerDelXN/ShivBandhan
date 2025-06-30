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
          {/* <Heart className="text-rose-600" size={24} /> */}
          <Image src={"/logo.png"} width={1920} height={1080} className='w-12 h-12 rounded-full' alt='logo'/>
          <span className="font-serif text-2xl font-bold text-gray-800">
            Shiv<span className="text-rose-600">Bandhan</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Home', 'Browse Profiles', 'Success Stories', 'About Us', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-gray-700 font-medium hover:text-rose-600 transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 text-rose-600 border border-rose-600 rounded-full hover:bg-rose-50 transition-colors duration-300">
            Login
          </Link>
          {/* <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-colors duration-300 flex items-center">
            <span>Register</span>
            <User size={16} className="ml-2" />
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:text-rose-600 transition-colors duration-200"
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
                className="text-gray-700 py-2 hover:text-rose-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Link href={"/login"} className="w-full py-2 text-center text-rose-600 border border-rose-600 rounded-full hover:bg-rose-50 transition-colors duration-200">
                Login
              </Link>
             
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}