"use client";

import { ProtectedRoute } from "@/components/wallet/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="lg:pl-64">
          <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}

