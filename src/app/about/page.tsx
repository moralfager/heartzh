import Link from "next/link";
import { Heart, Shield, Users, Star, ArrowLeft } from "lucide-react";

export default function AboutPage() {
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
            <Link href="/about" className="text-pink-600 font-medium">
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
              О проекте
            </h1>
            <p className="text-xl text-gray-600">
              Развлекательный инструмент для самопознания в сфере отношений
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Наша миссия
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                «Психология Любви» — это развлекательный проект, созданный для того, чтобы помочь людям 
                лучше понять себя в контексте отношений. Мы верим, что самопознание — это первый шаг 
                к построению здоровых и счастливых отношений.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Наши тесты основаны на популярных психологических концепциях, но адаптированы для 
                развлекательного формата. Они не заменяют профессиональную психологическую помощь, 
                но могут стать отправной точкой для размышлений о себе и своих отношениях.
              </p>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Что мы предлагаем
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Психологические тесты</h3>
                    <p className="text-gray-600 text-sm">
                      Интерактивные тесты на основе научных концепций, адаптированные для развлекательного формата
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Персональные результаты</h3>
                    <p className="text-gray-600 text-sm">
                      Детальный анализ ваших ответов с персональными рекомендациями и советами
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Star className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Анонимность</h3>
                    <p className="text-gray-600 text-sm">
                      Все тесты проходят анонимно. Мы не собираем персональные данные без вашего согласия
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Безопасность</h3>
                    <p className="text-gray-600 text-sm">
                      Ваши ответы хранятся локально в браузере и не передаются третьим лицам
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Методология
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Наши тесты основаны на проверенных психологических концепциях:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Теория привязанности</h3>
                  <p className="text-gray-600 text-sm">
                    Концепция Джона Боулби о том, как люди формируют эмоциональные связи в отношениях
                  </p>
                </div>

                <div className="border-l-4 border-rose-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Языки любви</h3>
                  <p className="text-gray-600 text-sm">
                    Теория Гэри Чепмена о пяти способах выражения и получения любви
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Стили разрешения конфликтов</h3>
                  <p className="text-gray-600 text-sm">
                    Модель Томаса-Килмана о различных подходах к решению разногласий
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Ценности в отношениях</h3>
                  <p className="text-gray-600 text-sm">
                    Исследования о том, что люди ценят больше всего в партнёрских отношениях
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Важное замечание
              </h2>
              <div className="text-blue-700 space-y-4">
                <p>
                  <strong>Этот проект носит развлекательный характер</strong> и не является 
                  заменой профессиональной психологической помощи или терапии.
                </p>
                <p>
                  Результаты тестов основаны на ваших ответах и носят рекомендательный характер. 
                  Они могут быть полезны для самопознания и размышлений, но не должны восприниматься 
                  как медицинский или психологический диагноз.
                </p>
                <p>
                  Если у вас есть серьёзные проблемы в отношениях, эмоциональные трудности или 
                  другие психологические проблемы, рекомендуем обратиться к квалифицированному 
                  специалисту.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Связь с нами
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Если у вас есть вопросы, предложения или вы хотите сообщить об ошибке, 
                мы будем рады услышать от вас.
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> hello@psychology-love.ru
              </p>
            </div>

            {/* Special Gift Section */}
            <Link href="/egg" className="block group">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">❤️</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Подарок для Жаният
                      </h2>
                      <p className="text-gray-600">
                        Интерактивный романтический квест из 5 глав
                      </p>
                    </div>
                  </div>
                  <Heart className="h-8 w-8 text-pink-500 group-hover:text-pink-600 transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

