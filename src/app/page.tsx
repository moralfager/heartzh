import Link from "next/link";
import { Heart, Shield, Users, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Психология Любви</span>
          </div>
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Узнай свою{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              психологию любви
            </span>{" "}
            за 7 минут
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            50 вопросов — и ты увидишь, как любишь, чего ждёшь и как решаешь конфликты. 
            Открой для себя свой тип привязанности, язык любви и стиль отношений.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/tests/love-psychology" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              Начать тест
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/tests" className="btn-secondary text-lg px-8 py-4">
              Все тесты
            </Link>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <Shield className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Не клинический инструмент</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <Users className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Анонимно</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Бесплатно</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Тип привязанности</h3>
            <p className="text-gray-600">
              Узнай, как ты строишь близкие отношения: надёжно, тревожно или избегающе
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Язык любви</h3>
            <p className="text-gray-600">
              Пойми, как ты выражаешь и получаешь любовь: словами, временем, подарками, заботой или прикосновениями
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Стиль конфликтов</h3>
            <p className="text-gray-600">
              Узнай, как ты решаешь разногласия: через сотрудничество, компромисс или избегание
            </p>
          </div>
        </div>

        {/* Popular Tests */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Популярные тесты
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link href="/tests/love-psychology" className="card p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Психология Любви</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.8</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Комплексный тест на тип привязанности, ценности, язык любви и стиль конфликтов
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>7 мин • 50 вопросов</span>
                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs">
                  для пары
                </span>
              </div>
            </Link>

            <div className="card p-6 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Совместимость</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.6</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Узнай, насколько вы подходите друг другу в отношениях
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>5 мин • 30 вопросов</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  скоро
                </span>
              </div>
            </div>

            <div className="card p-6 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Эмоциональный интеллект</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.7</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Оцени свой уровень эмоционального интеллекта в отношениях
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>6 мин • 40 вопросов</span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  скоро
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Психология Любви</strong> — развлекательный проект для самопознания
            </p>
            <p className="text-sm">
              Не является заменой профессиональной психологической помощи
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="/privacy" className="text-sm hover:text-pink-600 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/about" className="text-sm hover:text-pink-600 transition-colors">
                О проекте
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}