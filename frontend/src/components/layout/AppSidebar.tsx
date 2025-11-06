"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Award,
  CheckCircle,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
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
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { address, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await disconnect();
    router.push("/");
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src="/attesta.jpg"
            alt="Attesta Logo"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
            Attesta
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors",
                    isActive
                      ? "bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 shrink-0",
                      isActive
                        ? "text-fuchsia-600 dark:text-fuchsia-400"
                        : "text-gray-400 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Info & Actions */}
        <div className="space-y-3 border-t pt-4">
          {/* User Address */}
          {address && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <div className="flex-shrink-0 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 p-2">
                <User className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {truncateAddress(address)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Connected
                </p>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-0.5" />
              <span className="ml-7">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </Button>
          )}

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
}
