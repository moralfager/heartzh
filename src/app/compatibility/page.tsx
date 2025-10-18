"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Users, Share2, Copy, Check } from "lucide-react";

export default function CompatibilityPage() {
  const [partnerCode, setPartnerCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateMyCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMyCode(code);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(myCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Failed to copy:', err);
    }
  };

  const checkCompatibility = () => {
    if (partnerCode && myCode) {
      // In a real app, this would check compatibility
      alert('Функция проверки совместимости будет доступна после прохождения тестов обоими партнёрами!');
    } else {
      alert('Пожалуйста, введите код партнёра и сгенерируйте свой код');
    }
  };

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
              Проверка совместимости
            </h1>
            <p className="text-xl text-gray-600">
              Узнайте, насколько вы подходите друг другу в отношениях
            </p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Как это работает
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Пройдите тест</h3>
                <p className="text-gray-600 text-sm">
                  Оба партнёра проходят тест &quot;Психология Любви&quot;
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-rose-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Обменяйтесь кодами</h3>
                <p className="text-gray-600 text-sm">
                  Получите персональный код и поделитесь им с партнёром
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Узнайте результат</h3>
                <p className="text-gray-600 text-sm">
                  Получите детальный анализ совместимости
                </p>
              </div>
            </div>
          </div>

          {/* Compatibility Check */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Проверить совместимость
            </h2>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* My Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваш код
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={myCode}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-center font-mono text-lg"
                    placeholder="Сгенерируйте код"
                  />
                  <button
                    onClick={generateMyCode}
                    className="btn-secondary px-6 py-3"
                  >
                    Сгенерировать
                  </button>
                </div>
                {myCode && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-600">Поделитесь этим кодом с партнёром:</span>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Копировать
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Partner Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Код партнёра
                </label>
                <input
                  type="text"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center font-mono text-lg"
                  placeholder="Введите код партнёра"
                  maxLength={6}
                />
              </div>

              {/* Check Button */}
              <div className="text-center">
                <button
                  onClick={checkCompatibility}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Проверить совместимость
                </button>
              </div>
            </div>
          </div>

          {/* What you'll get */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Что вы узнаете
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Общая совместимость</h3>
                    <p className="text-gray-600 text-sm">
                      Процент совместимости по всем аспектам отношений
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Совместимость языков любви</h3>
                    <p className="text-gray-600 text-sm">
                      Насколько хорошо вы понимаете потребности друг друга
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Share2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Стили решения конфликтов</h3>
                    <p className="text-gray-600 text-sm">
                      Как ваши подходы к конфликтам дополняют друг друга
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-pink-600 font-semibold text-sm">+</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Сильные стороны</h3>
                    <p className="text-gray-600 text-sm">
                      Что у вас получается лучше всего в отношениях
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-yellow-600 font-semibold text-sm">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Зоны роста</h3>
                    <p className="text-gray-600 text-sm">
                      Над чем стоит поработать для улучшения отношений
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Персональные советы</h3>
                    <p className="text-gray-600 text-sm">
                      Конкретные рекомендации для вашей пары
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Сначала пройдите тест &quot;Психология Любви&quot;, чтобы получить персональный код
            </p>
            <Link
              href="/tests/love-psychology"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Пройти тест
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
