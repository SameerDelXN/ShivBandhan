"use client"
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Heart } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import Link from 'next/link';
export default function SearchMatchesWidget() {
  const {user} = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 25,
    ageMax: 35,
    gender: '',
    location: '',
    religion: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search filters:', filters);
    // Handle search submission
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl overflow-hidden transform -mt-8 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className={`p-1 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Updated background gradient to match hero section */}
        <div className="bg-gradient-to-l from-orange-50 via-amber-50 to-orange-100 rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center gap-2 md:gap-4">
              {/* Updated title with hero section colors */}
              <h3 className="text-[#7b2b2a] font-semibold text-lg flex items-center md:mr-2 lg:mr-4 md:pr-2 lg:pr-4 md:border-r md:border-orange-200">
                <Heart className="text-orange-600 mr-2" size={20} />
                <span className="whitespace-nowrap">Find Matches</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
                {/* Age Range Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-orange-500">
                    <Calendar size={18} />
                  </div>
                  <div className="flex items-center w-full">
                    <select 
                      name="ageMin" 
                      value={filters.ageMin}
                      onChange={handleChange}
                      className="pl-10 py-2 pr-2 bg-white rounded-l-lg border border-r-0 border-orange-200 text-gray-700 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none w-full transition-colors duration-200 hover:border-orange-300"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 18).map(age => (
                        <option key={`min-${age}`} value={age}>{age}</option>
                      ))}
                    </select>
                    <span className="bg-white border-t border-b border-orange-200 py-2 px-2 text-orange-600 text-sm whitespace-nowrap">to</span>
                    <select 
                      name="ageMax" 
                      value={filters.ageMax}
                      onChange={handleChange}
                      className="pr-4 py-2 pl-2 bg-white rounded-r-lg border border-l-0 border-orange-200 text-gray-700 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none w-full transition-colors duration-200 hover:border-orange-300"
                    >
                      {Array.from({ length: 42 }, (_, i) => i + 18).map(age => (
                        <option key={`max-${age}`} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-orange-500">
                    <Users size={18} />
                  </div>
                  <select 
                    name="gender" 
                    value={filters.gender}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-orange-200 text-gray-700 w-full text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none appearance-none transition-colors duration-200 hover:border-orange-300"
                  >
                    <option value="">Looking for</option>
                    <option value="female">Bride</option>
                    <option value="male">Groom</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-orange-500">
                    <MapPin size={18} />
                  </div>
                  <select 
                    name="location" 
                    value={filters.location}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-orange-200 text-gray-700 w-full text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none appearance-none transition-colors duration-200 hover:border-orange-300"
                  >
                    <option value="">Any Location</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="international">International</option>
                  </select>
                </div>

                {/* Religion/Caste Filter */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-3 text-orange-500">
                    <Heart size={18} />
                  </div>
                  <select 
                    name="religion" 
                    value={filters.religion}
                    onChange={handleChange}
                    className="pl-10 py-2 pr-4 bg-white rounded-lg border border-orange-200 text-gray-700 w-full text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none appearance-none transition-colors duration-200 hover:border-orange-300"
                  >
                    <option value="">Any Religion</option>
                    <option value="hindu">Hindu</option>
                    <option value="muslim">Muslim</option>
                    <option value="christian">Christian</option>
                    <option value="sikh">Sikh</option>
                    <option value="jain">Jain</option>
                    <option value="buddhist">Buddhist</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              {/* Updated button to match hero section */}
              <button 
                type="submit" 
                className="flex-shrink-0 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-px flex items-center justify-center whitespace-nowrap w-full sm:w-auto group"
              >
                <Search size={18} className="mr-2 transform group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}