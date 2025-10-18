import Link from "next/link";
import { Heart, ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Психология Любви</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/tests" className="text-gray-600 hover:text-pink-600 transition-colors">
              Тесты
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors">
              О проекте
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Вернуться на главную
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-gray-600">
              Как мы защищаем ваши данные и обеспечиваем приватность
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Последнее обновление: 15 декабря 2024
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="h-6 w-6 text-green-500 mr-3" />
                Общие принципы
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Мы серьёзно относимся к защите вашей конфиденциальности. Этот документ объясняет, 
                как мы собираем, используем и защищаем вашу информацию при использовании нашего сайта.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Основной принцип:</strong> мы собираем минимум данных, необходимых для 
                функционирования сервиса, и никогда не передаём вашу личную информацию третьим лицам 
                без вашего явного согласия.
              </p>
            </div>

            {/* Data Collection */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Database className="h-6 w-6 text-blue-500 mr-3" />
                Какие данные мы собираем
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Данные, которые вы предоставляете:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Ответы на вопросы тестов (хранятся локально в вашем браузере)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Email адрес (только если вы добровольно его предоставляете для получения результатов)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Данные, собираемые автоматически:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>IP адрес (для обеспечения безопасности и предотвращения злоупотреблений)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Информация о браузере и устройстве (для оптимизации работы сайта)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Время и дата посещения страниц (для аналитики использования)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Usage */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Eye className="h-6 w-6 text-purple-500 mr-3" />
                Как мы используем ваши данные
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Предоставление сервиса</h3>
                  <p className="text-gray-600 text-sm">
                    Для обработки ваших ответов и генерации персональных результатов тестов
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Улучшение сервиса</h3>
                  <p className="text-gray-600 text-sm">
                    Для анализа использования сайта и улучшения пользовательского опыта
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Безопасность</h3>
                  <p className="text-gray-600 text-sm">
                    Для предотвращения злоупотреблений и обеспечения безопасности сервиса
                  </p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Коммуникация</h3>
                  <p className="text-gray-600 text-sm">
                    Для ответа на ваши вопросы и предоставления поддержки (если вы связались с нами)
                  </p>
                </div>
              </div>
            </div>

            {/* Data Storage */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Lock className="h-6 w-6 text-red-500 mr-3" />
                Хранение и защита данных
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Локальное хранение</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ваши ответы на тесты хранятся локально в вашем браузере (localStorage). 
                    Это означает, что данные не передаются на наши серверы и остаются только на вашем устройстве.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Серверные данные</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Минимальные технические данные (IP, время посещения) хранятся на защищённых серверах 
                    в течение ограниченного времени, необходимого для обеспечения работы сервиса.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Безопасность</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Мы используем современные методы шифрования и защиты данных. Все соединения 
                    защищены протоколом HTTPS.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Ваши права
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Право на доступ</h3>
                      <p className="text-gray-600 text-sm">Вы можете запросить информацию о том, какие данные мы храним о вас</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Право на удаление</h3>
                      <p className="text-gray-600 text-sm">Вы можете запросить удаление ваших данных</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-purple-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Право на исправление</h3>
                      <p className="text-gray-600 text-sm">Вы можете запросить исправление неточных данных</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-pink-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Право на отзыв согласия</h3>
                      <p className="text-gray-600 text-sm">Вы можете в любой момент отозвать согласие на обработку данных</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Файлы cookie
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Мы используем минимальное количество файлов cookie, необходимых для функционирования сайта:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Технические cookie для сохранения настроек и сессий</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Аналитические cookie для понимания использования сайта (анонимно)</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Вопросы о конфиденциальности
              </h2>
              <p className="text-blue-700 leading-relaxed mb-4">
                Если у вас есть вопросы о нашей политике конфиденциальности или вы хотите 
                воспользоваться своими правами, свяжитесь с нами:
              </p>
              <p className="text-blue-700">
                <strong>Email:</strong> privacy@psychology-love.ru
              </p>
            </div>

            {/* Changes */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Изменения в политике
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Мы можем время от времени обновлять эту политику конфиденциальности. 
                О любых существенных изменениях мы уведомим вас через уведомление на сайте 
                или по email (если вы предоставили его). Рекомендуем периодически проверять 
                эту страницу на предмет обновлений.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

