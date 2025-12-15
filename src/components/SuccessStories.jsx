"use client";
import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const successStories = [
    {
      id: 1,
      name: "Ravi & Priya",
      location: "Mumbai, India",
      story:
        "We connected instantly through our shared values and interests. After 6 months of getting to know each other, we knew we were meant to be.",
      image: "/images/couple1.jpeg",
    },
    {
      id: 2,
      name: "John & Sarah",
      location: "Toronto, Canada",
      story:
        "Despite living in different cities, we found each other here and knew it was fate.",
      image: "/images/couple2.jpeg",
    },
    {
      id: 3,
      name: "Ahmed & Fatima",
      location: "Dubai, UAE",
      story:
        "Traditional values with a modern approach helped us find true compatibility.",
      image: "/images/couple3.jpeg",
    },
  ];

  /* Auto slide */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === successStories.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [successStories.length]);

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === successStories.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? successStories.length - 1 : prev - 1
    );
  };

  const story = successStories[activeIndex];

  return (
    <section className="relative w-full py-24 bg-[#8b1d1d] overflow-visible">
      {/* Header */}
      <div className="text-center text-white mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Celebrating Successful Matches
        </h2>
        <p className="max-w-2xl mx-auto text-white/80">
          Real love stories from couples who found their life partner with us.
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Navigation */}
        <div className="absolute inset-y-1/2 left-2 right-2 md:left-0 md:right-0 flex justify-between z-20">
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-white text-[#8b1d1d] flex items-center justify-center shadow"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full bg-white text-[#8b1d1d] flex items-center justify-center shadow"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Card */}
        <div
          className="
            relative bg-white rounded-3xl shadow-2xl 
            flex flex-col md:flex-row
            h-auto md:h-[320px]
            overflow-visible
            px-6
          "
        >
          {/* Image */}
          <div
            className="
              relative md:absolute
              md:-top-12 md:-bottom-12
              w-full md:w-56
              h-64 md:h-[380px]
              rounded-2xl
              overflow-hidden
              shadow-xl
              border-4 border-orange-500
              mx-auto md:mx-0
            "
          >
            <img
              src={story.image}
              alt={story.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div
            className="
              mt-6 md:mt-0
              md:ml-56
              p-4 md:p-8
              flex flex-col
              justify-center
              text-center md:text-left
            "
          >
            <Quote className="text-[#8b1d1d] mb-3 mx-auto md:mx-0" />

            <p className="text-gray-700 italic mb-6">
              "{story.story}"
            </p>

            <h4 className="font-semibold text-gray-900">
              {story.name}
            </h4>

            <p className="text-sm text-[#8b1d1d] font-medium">
              {story.location}
            </p>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {successStories.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "bg-orange-500 scale-125"
                : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
