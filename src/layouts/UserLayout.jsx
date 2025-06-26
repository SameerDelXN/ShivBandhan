"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/context/SessionContext";
//sample
export default function UserLayout({ children }) {
  const { isAuthenticated, loading, user, logout } = useSession();
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    console.log("[Auth Debug] Current session:", {
      isAuthenticated,
      loading,
      user,
      path: pathname
    });

    if (!loading) {
      if (!isAuthenticated) {
        console.log("[Auth Debug] No session - redirecting to login");
        // Store intended path for post-login redirect
        sessionStorage.setItem('redirectPath', pathname);
        router.replace("/login");
      } else {
        console.log("[Auth Debug] Valid session - user:", user);
        // Verify user data is present
        if (!user || !user.id) {
          console.log("[Auth Debug] Session exists but user data missing");
          logout();
          router.replace("/login");
        } else {
          setShouldRender(true);
        }
      }
    }
  }, [loading, isAuthenticated, user, router, pathname, logout]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logout') {
        console.log("[Auth Debug] Received logout event from another tab");
        logout();
        router.replace("/login");
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, logout]);

  // Block rendering until we verify auth state
  if (loading || !shouldRender) {
    console.log("[Auth Debug] Waiting for auth verification...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Final render for authenticated users
  console.log("[Auth Debug] Rendering protected content for:", user);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}