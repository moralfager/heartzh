"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LayoutDashboard, FileText, BarChart3, Settings, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  const navigation = [
    {
      name: "Панель управления",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Тесты",
      href: "/admin/tests",
      icon: FileText,
      current: pathname?.startsWith("/admin/tests"),
    },
    {
      name: "Результаты",
      href: "/admin/results",
      icon: BarChart3,
      current: pathname?.startsWith("/admin/results"),
    },
    {
      name: "Настройки",
      href: "/admin/settings",
      icon: Settings,
      current: pathname?.startsWith("/admin/settings"),
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  // Authenticated - show admin layout
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Психология Любви
                </h1>
                <p className="text-sm text-gray-500">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                На главную
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          item.current
                            ? "bg-pink-50 text-pink-600 font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

