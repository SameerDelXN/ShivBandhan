"use client"
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Briefcase, Heart } from 'lucide-react';
import Image from 'next/image';

export default function FeaturedProfilesDynamic() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);
  const autoPlayRef = useRef(null);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/users/fetchAllUsers?limit=12&page=1', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load featured profiles');
        }
        const mapped = (data?.data || [])
          .filter(Boolean)
          .map((u) => ({
            name: u.name || 'Member',
            age: calculateAge(u.dob),
            city: u.currentCity || '—',
            profession: u.occupation || u.education || '—',
            photo: u.profilePhoto || 'https://via.placeholder.com/600x800?text=Profile',
          }));
        setProfiles(mapped);
      } catch (e) {
        setError(e?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [profiles.length]);

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (!profiles || profiles.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === profiles.length - 1 ? 0 : prevIndex + 1;

        if (cardsRef.current[nextIndex]) {
          const card = cardsRef.current[nextIndex];
          const container = carouselRef.current;
          const cardLeft = card.offsetLeft;
          const cardWidth = card.offsetWidth;
          const containerWidth = container.offsetWidth;
          const scrollLeft = cardLeft - containerWidth / 2 + cardWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
        return nextIndex;
      });
    }, 3000);
  };

  const scrollToIndex = (index) => {
    if (!profiles || profiles.length === 0) return;
    let newIndex;
    if (index < 0) newIndex = profiles.length - 1;
    else if (index >= profiles.length) newIndex = 0;
    else newIndex = index;
    setCurrentIndex(newIndex);

    if (cardsRef.current[newIndex] && carouselRef.current) {
      const card = cardsRef.current[newIndex];
      const container = carouselRef.current;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = cardLeft - containerWidth / 2 + cardWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    startAutoPlay();
  };

  const scrollLeft = () => scrollToIndex(currentIndex - 1);
  const scrollRight = () => scrollToIndex(currentIndex + 1);
  const handleDotClick = (index) => scrollToIndex(index);

  return (
    <div className="relative py-24 w-full overflow-hidden bg-gradient-to-l from-orange-50 via-amber-50 to-orange-100 lg:px-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-orange-200/40 to-amber-200/40 blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-orange-200/30 to-amber-200/30 blur-3xl opacity-50"></div>
        <div className="absolute top-60 right-1/4 w-60 h-60 rounded-full bg-gradient-to-r from-orange-200/30 to-amber-200/30 blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">Featured Profiles</h2>
          <p className="text-lg text-[#7b2b2a] max-w-2xl mx-auto">
            Meet some of our exceptional members looking for meaningful connections
          </p>
        </div>

        <div className="relative">
          {loading && (
            <div className="text-center text-gray-600 py-6">Loading featured profiles...</div>
          )}
          {error && (
            <div className="text-center text-red-600 py-6">{error}</div>
          )}
          {!loading && !error && profiles.length === 0 && (
            <div className="text-center text-gray-600 py-6">No featured profiles available right now.</div>
          )}

          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md text-orange-600 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 md:-left-6 hover:-translate-x-1 border border-orange-100"
            aria-label="Previous profile"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md text-orange-600 rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 md:-right-6 hover:translate-x-1 border border-orange-100"
            aria-label="Next profile"
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {profiles.map((profile, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`flex-shrink-0 w-80 transition-all duration-500 transform snap-center ${
                  index === currentIndex ? 'scale-105 opacity-100' : 'scale-95 opacity-80'
                }`}
                style={{ transitionDelay: `${50 * Math.abs(currentIndex - index)}ms` }}
              >
                <div
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                    index === currentIndex ? 'border-2 border-orange-300' : 'border border-orange-100'
                  }`}
                >
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      width={1920}
                      height={1080}
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/60 transition-all duration-300 hover:scale-110">
                      <Heart size={20} className="text-white hover:text-orange-600 transition-colors duration-300" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-2xl font-semibold mb-1">
                        {profile.name}
                        {profile.age ? `, ${profile.age}` : ''}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 bg-white">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin size={16} className="mr-2 text-orange-600" />
                        <span>{profile.city}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Briefcase size={16} className="mr-2 text-orange-600" />
                        <span>{profile.profession}</span>
                      </div>
                    </div>

                    <button className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-medium hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-orange-600 to-amber-600'
                  : 'w-2 bg-orange-200 hover:bg-orange-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
