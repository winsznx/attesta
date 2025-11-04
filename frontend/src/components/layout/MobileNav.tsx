"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Award, CheckCircle, Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useWallet } from "@/components/providers/WalletProvider";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Agreements",
    href: "/dashboard/agreements",
    icon: FileText,
  },
  {
    name: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
  },
  {
    name: "Verify",
    href: "/dashboard/verify",
    icon: CheckCircle,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await disconnect();
    router.push("/");
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="truncate text-[10px]">{item.name}</span>
              </Link>
            );
          })}
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
          >
            {menuOpen ? (
              <>
                <X className="h-5 w-5 mb-1" />
                <span className="truncate text-[10px]">Close</span>
              </>
            ) : (
              <>
                <Menu className="h-5 w-5 mb-1" />
                <span className="truncate text-[10px]">Menu</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background">
          <div className="h-full flex flex-col p-6">
            <div className="flex-1 space-y-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMenuOpen(false);
                }}
                className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-0.5" />
                <span className="ml-7">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
