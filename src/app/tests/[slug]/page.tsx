import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Star, Clock, Users, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { TestDefinition } from "@/lib/types";

// Mock function to get test data - in real app this would be an API call
async function getTest(slug: string): Promise<TestDefinition | null> {
  if (slug === "love-psychology") {
    const testData = await import("../../../../public/tests/love-psychology.json");
    return testData.default as unknown as TestDefinition;
  }
  if (slug === "love-expressions") {
    const testData = await import("../../../../public/tests/love-expressions.json");
    return testData.default as unknown as TestDefinition;
  }
  return null;
}

export default async function TestLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = await getTest(slug);
  
  if (!test) {
    notFound();
  }

  const { meta } = test;

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
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-pink-600 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/tests" className="hover:text-pink-600 transition-colors">Тесты</Link>
            <span>/</span>
            <span className="text-gray-800">{meta.title}</span>
          </nav>

          {/* Test Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">{meta.title}</h1>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {meta.rating}
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">
                  {meta.subtitle}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{meta.estMinutes} минут</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{meta.questionsCount} вопросов</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Анонимно</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/tests/${meta.slug}/start`}
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center"
                >
                  Начать тест
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              <div className="lg:w-80">
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Что вы узнаете:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Свой тип привязанности</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Ведущие ценности в отношениях</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Основной язык любви</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Стиль решения конфликтов</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Персональные рекомендации</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Test Structure */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Структура теста
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-pink-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Партнёр в любви</h3>
                    <p className="text-gray-600 text-sm">
                      Тип привязанности: как вы строите близкие отношения
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-rose-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Ценности в отношениях</h3>
                    <p className="text-gray-600 text-sm">
                      Что для вас важнее всего в партнёрстве
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Язык любви</h3>
                    <p className="text-gray-600 text-sm">
                      Как вы выражаете и получаете любовь
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Реакции на конфликты</h3>
                    <p className="text-gray-600 text-sm">
                      Как вы решаете разногласия в отношениях
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">
                  Важная информация
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Этот тест является развлекательным инструментом для самопознания и не заменяет 
                  профессиональную психологическую помощь. Результаты носят рекомендательный характер 
                  и основаны на ваших ответах. Если у вас есть серьёзные проблемы в отношениях, 
                  рекомендуем обратиться к специалисту.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={`/tests/${meta.slug}/start`}
              className="btn-primary text-xl px-12 py-5 inline-flex items-center"
            >
              Начать тест прямо сейчас
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Это займёт всего {meta.estMinutes} минут вашего времени
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
