"use client";

import { Settings as SettingsIcon, Database, Shield, Bell, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Настройки</h2>
        <p className="text-gray-600 mt-1">
          Управление настройками системы и администрирование
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Database Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">База данных</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Автоочистка результатов
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                <option value="24">24 часа (по умолчанию)</option>
                <option value="48">48 часов</option>
                <option value="72">72 часа</option>
                <option value="168">7 дней</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Результаты тестов автоматически удаляются через указанный период
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-2">Статистика базы данных</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Тестов:</span>
                  <span className="font-medium text-gray-800 ml-2">2</span>
                </div>
                <div>
                  <span className="text-gray-600">Вопросов:</span>
                  <span className="font-medium text-gray-800 ml-2">100</span>
                </div>
                <div>
                  <span className="text-gray-600">Активных сессий:</span>
                  <span className="font-medium text-gray-800 ml-2">5</span>
                </div>
                <div>
                  <span className="text-gray-600">Результатов:</span>
                  <span className="font-medium text-gray-800 ml-2">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-800">Безопасность</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Включить аутентификацию администратора</span>
                  <p className="text-sm text-gray-500">Требовать пароль для доступа к админ-панели</p>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Автоматическая очистка cookie</span>
                  <p className="text-sm text-gray-500">Удалять cookie после истечения TTL сессии</p>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Логировать действия администратора</span>
                  <p className="text-sm text-gray-500">Сохранять историю изменений в базе данных</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Уведомления</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Email уведомления</span>
                  <p className="text-sm text-gray-500">Получать уведомления о новых результатах тестов</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email администратора
              </label>
              <input 
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="h-6 w-6 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-800">Общие настройки</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название сайта
              </label>
              <input 
                type="text"
                defaultValue="Психология Любви"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea 
                rows={3}
                defaultValue="Профессиональные психологические тесты для понимания себя и своих отношений"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium">
            <Save className="h-5 w-5 mr-2" />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}

