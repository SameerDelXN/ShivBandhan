"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Conversations Before Marriage",
    category: "Relationship Advice",
    excerpt: "Discover the key discussions every couple should have to build a strong foundation for their married life.",
    image: "/blogImages/blog1.png",
    readTime: "5 min read",
    date: "May 15, 2024"
  },
  {
    id: 2,
    title: "Balancing Tradition & Modernity in Relationships",
    category: "Cultural Insights",
    excerpt: "How to honor family traditions while creating a partnership that works for today's world.",
    image: "/blogImages/blog2.png",
    readTime: "7 min read",
    date: "April 28, 2024"
  },
  {
    id: 3,
    title: "The Psychology of Successful Matches",
    category: "Matchmaking Science",
    excerpt: "What research tells us about the factors that create lasting compatibility between partners.",
    image: "/blogImages/blog3.png",
    readTime: "8 min read",
    date: "April 10, 2024"
  },
  {
    id: 4,
    title: "Wedding Planning Without the Stress",
    category: "Practical Guides",
    excerpt: "A step-by-step approach to organizing your special day while keeping the joy intact.",
    image: "/blogImages/blog4.png",
    readTime: "6 min read",
    date: "March 22, 2024"
  }
];

export default function BlogPreview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose-50 blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-50 blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <span className="px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
            Insights & Advice
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mt-4 mb-6 font-serif">
            Relationship <span className="text-rose-600">Wisdom</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
            Expert advice and thoughtful perspectives to guide your journey
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {blogPosts.map((post) => (
            <article key={post.id} className="group">
              <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-medium">
                  {post.category}
                </span>
              </div>
              
              <div className="px-2">
                <div className="flex items-center text-xs text-gray-500 mb-2 font-sans">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 font-serif leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 font-sans">
                  {post.excerpt}
                </p>
                
                <a 
                  href="#" 
                  className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium font-sans transition-colors duration-300"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl font-sans">
            View All Articles
          </button>
        </div>
      </div>
    </div>
  );
}