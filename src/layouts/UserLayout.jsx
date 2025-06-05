import Sidebar from "@/components/Sidebar";

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}
