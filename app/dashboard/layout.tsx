import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-h-screen min-h-0 overflow-hidden bg-white">
      <DashboardSidebar />

      <main className="h-screen min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>
    </div>
  );
}
