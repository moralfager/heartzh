import Link from "next/link";
import { Heart, Star, Clock, Search, Filter } from "lucide-react";
import { TestMeta } from "@/lib/types";

// Force dynamic rendering to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

// Get tests from API (database)
async function getTests(): Promise<TestMeta[]> {
  try {
    console.log('🔍 Fetching tests from API...');
    
    // Build absolute URL for fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heartofzha.ru';
    const apiUrl = `${baseUrl}/api/admin/tests`;
    
    console.log('🌐 Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      // Short cache to surface new imports quickly
      next: { revalidate: 5 },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API response not OK:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('📊 API response data:', data);
    const tests = data.tests || [];
    
    console.log(`✅ Found ${tests.length} tests from API`);
    
    // Transform to TestMeta format and filter only published tests
    const publishedTests = tests
      .filter((test: any) => test.published)
      .map((test: any) => ({
        id: test.id,
        slug: test.slug,
        title: test.title,
        subtitle: test.description || '',
        category: 'relationships', // Default category
        tags: [], // Can be added to DB schema later
        estMinutes: Math.ceil(test._count.questions / 7),
        questionsCount: test._count.questions,
        isPseudo: true,
        languages: ['ru'],
        rating: test.rating || 4.8,
      }));
    
    console.log(`🚀 Returning ${publishedTests.length} published tests`);
    return publishedTests;
  } catch (error) {
    console.error('❌ Error fetching tests:', error);
    return [];
  }
}

export default async function TestsPage() {
  const tests = await getTests();
  
  console.log(`🎯 TestsPage: received ${tests.length} tests`);
  
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
            <Link href="/tests" className="text-pink-600 font-medium">
              Тесты
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors">
              О проекте
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Каталог тестов
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите тест, который поможет вам лучше понять себя и свои отношения
          </p>
          {/* Debug info */}
          <p className="text-sm text-gray-500 mt-2">
            Найдено тестов: {tests.length}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск тестов..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
              <option value="">Все категории</option>
              <option value="relationships">Отношения</option>
              <option value="personality">Личность</option>
              <option value="values">Ценности</option>
              <option value="intelligence">Интеллект</option>
              <option value="communication">Общение</option>
              <option value="wellbeing">Благополучие</option>
            </select>

            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
              <option value="">Любая длительность</option>
              <option value="short">≤5 мин</option>
              <option value="medium">5–10 мин</option>
              <option value="long">&gt;10 мин</option>
            </select>

            <button className="btn-primary px-6 py-3">
              <Filter className="h-4 w-4 mr-2" />
              Применить
            </button>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/tests/${test.slug}`}
              className="card p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{test.title}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{test.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {test.subtitle}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{test.estMinutes} мин</span>
                </div>
                <span>{test.questionsCount} вопросов</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {test.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {test.tags.length > 2 && (
                  <span className="text-gray-400 text-xs">
                    +{test.tags.length - 2} ещё
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Скоро появятся
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Тип личности в любви</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">—</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Узнай, как твой тип личности влияет на отношения
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>8 мин</span>
                </div>
                <span>45 вопросов</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  личность
                </span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  скоро
                </span>
              </div>
            </div>

            <div className="card p-6 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Стиль общения</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">—</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Определи свой стиль общения в отношениях
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>6 мин</span>
                </div>
                <span>35 вопросов</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                  общение
                </span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  скоро
                </span>
              </div>
            </div>

            <div className="card p-6 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Готовность к отношениям</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">—</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Оцени свою готовность к серьёзным отношениям
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>5 мин</span>
                </div>
                <span>25 вопросов</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                  готовность
                </span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  скоро
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
