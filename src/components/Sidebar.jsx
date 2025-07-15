"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Search, 
  Heart, 
  UserPlus, 
  MessageCircle, 
  CreditCard, 
  Settings,
  Sparkles,
  Crown,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen = false, setMobileOpen }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/profile/me", label: "My Profile", icon: User },
    { href: "/dashboard/matches", label: "Matches", icon: Heart },
    { href: "/dashboard/interests", label: "Interests", icon: UserPlus },
    // { href: "/dashboard/chat", label: "Chat", icon: MessageCircle },
    { href: "/dashboard/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <aside className={`
        fixed lg:sticky top-0 left-0 z-30
        w-72 bg-gradient-to-b from-white to-rose-50/30 shadow-xl border-r border-rose-100/50 
        h-screen flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <button 
          className="lg:hidden absolute top-4 right-4 p-1 rounded-full bg-rose-100 text-rose-600"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header Section */}
        <div className="p-6 border-b border-rose-100/50 bg-gradient-to-r from-rose-50 to-amber-50/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                ShivBandhan
              </h1>
              <p className="text-xs text-gray-500 font-medium">Find Your Perfect Match</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 
          scrollbar-thin 
          scrollbar-thumb-gradient-to-b scrollbar-thumb-from-rose-300 scrollbar-thumb-to-rose-400 
          scrollbar-track-rose-50/50 
          hover:scrollbar-thumb-from-rose-400 hover:scrollbar-thumb-to-rose-500 
          scrollbar-thumb-rounded-full 
          scrollbar-track-rounded-full">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Navigation
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-200 transform scale-[1.02]"
                    : "hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 text-gray-700 hover:text-rose-600 hover:shadow-md hover:transform hover:scale-[1.02]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-transparent animate-pulse"></div>
                )}
                
                <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 shadow-sm" 
                    : "group-hover:bg-white/80 group-hover:shadow-sm"
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? "text-white" 
                      : "text-gray-500 group-hover:text-rose-500"
                  }`} />
                </div>
                
                <span className={`font-medium relative z-10 transition-all duration-300 ${
                  isActive 
                    ? "text-white" 
                    : "group-hover:text-rose-600"
                }`}>
                  {item.label}
                </span>
                
                {/* Sparkle effect for active item */}
                {isActive && (
                  <div className="absolute right-4 opacity-60">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Premium Banner Section */}
        <div className="p-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-amber-400 via-rose-400 to-rose-500 rounded-2xl p-4 text-white shadow-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-200" />
              <span className="font-bold text-sm">Premium Features</span>
            </div>
            <p className="text-xs text-white/90 mb-3">
              Unlock unlimited matches and advanced filters
            </p>
            <Link href={"/dashboard/subscription"} className="w-full p-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold  rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/20">
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-32 -right-8 w-16 h-16 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full blur-xl opacity-30"></div>
        <div className="absolute bottom-32 -left-4 w-12 h-12 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full blur-lg opacity-40"></div>
      </aside>
    </>
  );
}