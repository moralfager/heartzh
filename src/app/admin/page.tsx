"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, FileText, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface DashboardStats {
  totalTests: number;
  publishedTests: number;
  totalResults: number;
  todayResults: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    publishedTests: 0,
    totalResults: 0,
    todayResults: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // TODO: Load real stats from API
      // For now, using mock data
      setStats({
        totalTests: 2,
        publishedTests: 2,
        totalResults: 15,
        todayResults: 3,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading stats:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Всего тестов",
      value: stats.totalTests,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      name: "Опубликовано",
      value: stats.publishedTests,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      name: "Всего результатов",
      value: stats.totalResults,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      name: "Сегодня",
      value: stats.todayResults,
      icon: TrendingUp,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
  ];

  const quickActions = [
    {
      name: "Создать тест",
      href: "/admin/tests/new",
      icon: FileText,
      description: "Добавить новый психологический тест",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      name: "Просмотр тестов",
      href: "/admin/tests",
      icon: FileText,
      description: "Управление существующими тестами",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Просмотр результатов",
      href: "/admin/results",
      icon: BarChart3,
      description: "Аналитика и результаты пользователей",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Панель управления</h2>
        <p className="text-gray-600 mt-1">
          Добро пожаловать в админ-панель психологических тестов
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Быстрые действия
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {action.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Последняя активность
          </h3>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800">Тест "Психология любви" пройден</p>
              <p className="text-gray-500 text-xs">2 часа назад</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800">Тест "Языки любви" пройден</p>
              <p className="text-gray-500 text-xs">5 часов назад</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800">3 новых результата</p>
              <p className="text-gray-500 text-xs">Сегодня</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
