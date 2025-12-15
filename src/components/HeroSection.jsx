"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

export default function MatrimonialHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fixed watermark positions with same size and opacity for all
  const watermarkElements = [
    // Row 1
    // { left: '5%', top: '10%', rotation: 'rotate-12' },
    { left: "25%", top: "15%", rotation: "-rotate-6" },
    { left: "45%", top: "8%", rotation: "rotate-45" },
    { left: "65%", top: "12%", rotation: "-rotate-12" },
    // { left: '85%', top: '9%', rotation: 'rotate-6' },

    // Row 2
    // { left: '10%', top: '35%', rotation: '-rotate-45' },
    { left: "30%", top: "40%", rotation: "rotate-90" },
    { left: "50%", top: "37%", rotation: "-rotate-90" },
    { left: "70%", top: "42%", rotation: "rotate-15" },
    // { left: '90%', top: '38%', rotation: '-rotate-15' },

    // Row 3
    // { left: '15%', top: '65%', rotation: 'rotate-30' },
    { left: "35%", top: "70%", rotation: "-rotate-30" },
    { left: "55%", top: "67%", rotation: "rotate-60" },
    { left: "75%", top: "72%", rotation: "-rotate-60" },
    // { left: '95%', top: '68%', rotation: 'rotate-0' },

    // Row 4
    { left: "8%", top: "88%", rotation: "-rotate-20" },
    { left: "40%", top: "85%", rotation: "rotate-20" },
    { left: "60%", top: "90%", rotation: "-rotate-40" },
    { left: "80%", top: "87%", rotation: "rotate-40" },
  ];

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
      <div className="container mx-auto w-full h-full px-0 md:px-4 py-8 sm:py-10 md:py-16 lg:py-20">
        <div
          className={`relative overflow-visible transition-all duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Main Container with Gradient Background AND Watermark Text */}
          <div className="flex flex-col lg:flex-row min-h-[80vh] rounded-3xl overflow-hidden relative bg-amber-50 border border-orange-200">
            {/* Watermark ShivBandhan text overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {watermarkElements.map((item, i) => (
                <div
                  key={i}
                  className={`absolute pointer-events-none select-none ${item.rotation}`}
                  style={{
                    left: item.left,
                    top: item.top,
                    color: "#fb923c", // orange-500
                    opacity: 0.15, // Same opacity for all
                    zIndex: 0,
                    fontFamily:
                      "'Noto Sans Devanagari', 'Mangal', 'Arial', sans-serif",
                    fontWeight: 700,
                    fontSize: "2rem", // Same medium size for all
                  }}
                >
                  शिवबंधन
                </div>
              ))}
            </div>

            {/* Overlay gradient from left to right - dark to faint */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-orange-400/2 to-transparent pointer-events-none"></div> */}

            {/* Floating decorative hearts - on top of watermark */}
            <div className="absolute top-6 right-6 animate-float z-30">
              <Heart
                className="w-8 h-8 text-orange-400/60"
                fill="currentColor"
              />
            </div>
            <div
              className="absolute bottom-6 left-6 animate-float z-30"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="w-6 h-6 text-amber-500/60" />
            </div>

            {/* Left Content - on top of watermark */}
            <div className="w-full lg:w-[60%] pt-6 px-6 sm:px-8 md:px-10 lg:px-12 pb-6 sm:pb-8 md:pb-10 lg:pb-12 relative z-20 flex flex-col justify-center">
              <div
                className={`max-w-2xl transition-all duration-1000 transform ${
                  isLoaded ? "translate-y-0" : "translate-y-6"
                }`}
              >
                {/* Badge with icon */}
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-semibold shadow-sm border border-orange-200/50 mb-2 z-30 mt-5">
                  <Sparkles className="w-4 h-4" />
                  <span>Trusted by 10,000+ Maratha Families</span>
                </div>

                {/* Main heading - only 'Love' in orange */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight sm:leading-tight md:leading-tight relative z-30 text-gray-900">
                  <span>Where Tradition</span>
                  <br />
                  <span>
                    Meets <span className="text-orange-600">Love</span>
                  </span>
                </h1>

                {/* Subheading */}
                <p className="mt-4 text-base sm:text-lg text-black font-small leading-relaxed max-w-xl relative z-30">
                  ShivBandhan Maratha Matrimonial — A sacred platform for
                  finding your perfect life partner within our rich Maratha
                  heritage.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 relative z-30">
                  <button className="group px-8 py-4 bg-orange-600 text-white rounded-full hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform flex items-center justify-center text-base font-semibold">
                    <span>Start Your Journey Free</span>
                    <ArrowRight
                      size={20}
                      className="ml-3 transform group-hover:translate-x-2 transition-transform duration-200"
                    />
                  </button>

                  <button className="px-8 py-4 bg-white/90 text-orange-700 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-200/50 flex items-center justify-center text-base font-semibold">
                    <span>Explore Success Stories</span>
                  </button>
                </div>

                {/* Social proof section */}

               {/* Social proof section */}
<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-5 relative z-30">
  {/* Avatar Group with gradient borders */}
  <div className="flex -space-x-2 sm:-space-x-3 md:-space-x-4">
    {["/people/rohan.jpg", "/people/ananya.jpg", "/people/sneha.jpg", "/people/vikram.jpg"].map(
      (src, index) => (
        <div
          key={index}
          className="rounded-full p-0.5 bg-gradient-to-r from-orange-500 to-amber-500 animate-[float_3s_ease-in-out_infinite]"
          style={{ animationDelay: `${index * 0.4}s` }}
        >
          <img
            src={src}
            alt="user"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-sm"
          />
        </div>
      )
    )}
  </div>

  {/* Text with gradient theme */}
  <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium text-center sm:text-left px-3 sm:px-0">
    <span className="font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
      Join 20,000+
    </span>{" "}
    members finding love every day
  </p>
</div>



              </div>
            </div>

            {/* Right Content with Mandala */}
            <div className="hidden lg:block lg:w-[40%] relative overflow-hidden">
              {/* Mandala Container */}
              <div className="absolute inset-0">
                {/* Container with clipPath - shows only right half of mandala */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: "inset(0 0 0 50%)" }}
                >
                  <img
                    src="/assest/mandala.png"
                    alt="Decorative mandala pattern"
                    className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 object-contain pointer-events-none select-none animate-[spin_40s_linear_infinite]"
                    style={{
                      width: "200%",
                      height: "200%",
                      filter:
                        "sepia(0.5) hue-rotate(-10deg) drop-shadow(0 0 20px rgba(255, 106, 0, 0.1))",
                      transformOrigin: "center center",
                      willChange: "transform",
                      zIndex: 10,
                    }}
                  />
                </div>

                {/* Overlay gradient for better contrast */}
                {/* <div className="absolute inset-0 bg-gradient-to-l from-orange-50/20 via-transparent to-transparent"></div> */}

                {/* Decorative text overlay */}
                {/* <div className="absolute bottom-12 left-12 transform -rotate-90 origin-left z-20">
                  <span className="text-xs tracking-[0.3em] font-semibold text-orange-600/40 uppercase">
                    शिवबंधन • ShivBandhan
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
