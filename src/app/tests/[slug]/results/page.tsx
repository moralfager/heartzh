"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Share2, Download, ArrowLeft, Star, TrendingUp, Users, Shield } from "lucide-react";
import { TestDefinition, SessionAnswer, ResultProfile } from "@/lib/types";
import { calculateScores, generateResultProfile } from "@/lib/scoring";
import { computeResult, convertSessionAnswersToEngineAnswers } from "@/lib/result-engine";

// Get test data from API (database)
async function getTest(slug: string): Promise<TestDefinition | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const response = await fetch(`${baseUrl}/api/tests/${slug}`, {
      cache: 'no-store', // Fresh data for results
    });

    if (!response.ok) {
      return null;
    }

    const testData = await response.json();
    return testData as TestDefinition;
  } catch (error) {
    console.error('Error fetching test:', error);
    return null;
  }
}

interface ResultsPageProps {
  params: Promise<{ slug: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const searchParams = useSearchParams();
  const [test, setTest] = useState<TestDefinition | null>(null);
  const [result, setResult] = useState<ResultProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const loadResults = async () => {
      const { slug: currentSlug } = await params;
      setSlug(currentSlug);
      const testData = await getTest(currentSlug);
      setTest(testData);

      const session = searchParams.get('session');
      if (session && testData) {
        // Load answers from localStorage
        const savedAnswers = localStorage.getItem(`test-answers-${session}`);
        console.log('🔍 Loading results for session:', session);
        console.log('📦 Saved answers in localStorage:', savedAnswers ? 'Found' : 'Not found');
        
        if (savedAnswers) {
          const answers: SessionAnswer[] = JSON.parse(savedAnswers);
          
          let profile: ResultProfile;
          
          // Check result mode
          if (testData.resultMode === 'default' && testData.defaultResult) {
            // Use default result
            console.log('📋 Using default result:', testData.defaultResult);
            profile = {
              ...testData.defaultResult.scalesData,
              summaryType: testData.defaultResult.summaryType,
              summary: testData.defaultResult.summary,
              tips: Array.isArray(testData.defaultResult.recommendations) 
                ? testData.defaultResult.recommendations 
                : [
                    "Это фиксированный результат по умолчанию",
                    "Администратор может настроить его во вкладке 'Результат по умолчанию'"
                  ],
            };
          } else if (testData.scales && testData.scales.length > 0 && testData.rules && testData.rules.length > 0) {
            // Use Result Engine
            try {
              // Преобразуем SessionAnswers → Engine Answers (с маппингом domains → scale keys)
              const engineAnswers = convertSessionAnswersToEngineAnswers(answers, testData.questions);
              
              const engineResult = await computeResult({
                answers: engineAnswers,
                scales: testData.scales || [],
                rules: testData.rules || [],
                version: 1,
              });
              
              console.log('🔍 Engine Result:', {
                scaleScores: engineResult.scaleScores,
                interpretations: engineResult.interpretations,
                patterns: engineResult.patterns,
                compositeScores: engineResult.compositeScores,
              });
              
              // Преобразуем interpretations из объекта в массив
              const interpretationsArray = Object.values(engineResult.interpretations);
              
              // Собираем топ-рекомендации из interpretations (только первые 2 из каждой интерпретации)
              const allRecommendations: string[] = [];
              interpretationsArray.forEach(interp => {
                if (interp.recommendations && Array.isArray(interp.recommendations)) {
                  // Берём только первые 2 рекомендации из каждой интерпретации
                  allRecommendations.push(...interp.recommendations.slice(0, 2));
                }
              });
              
              // Ограничиваем общее количество рекомендаций до 6
              const topRecommendations = allRecommendations.slice(0, 6);
              
              // Преобразуем scaleScores в формат UI
              const scores = engineResult.scaleScores;
              
              console.log('📊 Raw scores from engine:', scores);
              
              // Функция нормализации: поднимаем низкие значения
              const normalizeScores = (rawScores: Record<string, number>) => {
                // Собираем все проценты
                const percentages: number[] = [];
                
                const normalized = {
                  attachment: {
                    secure: Math.round(((rawScores.secure_attachment || 0) / 40) * 100),
                    anxious: Math.round(((rawScores.anxious_attachment || 0) / 25) * 100),
                    avoidant: Math.round(((rawScores.avoidant_attachment || 0) / 32) * 100),
                  },
                  values: {
                    support: Math.round(((rawScores.value_support || 0) / 60) * 100),
                    passion: Math.round(((rawScores.value_passion || 0) / 70) * 100),
                    security: Math.round(((rawScores.value_security || 0) / 60) * 100),
                    growth: Math.round(((rawScores.value_growth || 0) / 70) * 100),
                  },
                  loveLanguage: {
                    words: Math.round(((rawScores.language_words || 0) / 60) * 100),
                    time: Math.round(((rawScores.language_time || 0) / 65) * 100),
                    gifts: Math.round(((rawScores.language_gifts || 0) / 55) * 100),
                    service: Math.round(((rawScores.language_service || 0) / 60) * 100),
                    touch: Math.round(((rawScores.language_touch || 0) / 55) * 100),
                  },
                  conflict: {
                    collab: Math.round(((rawScores.conflict_collab || 0) / 10) * 100),
                    comprom: Math.round(((rawScores.conflict_comprom || 0) / 10) * 100),
                    avoid: Math.round(((rawScores.conflict_avoid || 0) / 15) * 100),
                    accom: Math.round(((rawScores.conflict_accom || 0) / 10) * 100),
                    compete: Math.round(((rawScores.conflict_compete || 0) / 10) * 100),
                  },
                };

                // Собираем все проценты в массив
                Object.values(normalized).forEach(group => {
                  Object.values(group).forEach(val => percentages.push(val));
                });

                // Находим максимальное значение
                const maxValue = Math.max(...percentages, 70); // Не меньше 70
                const capValue = Math.min(maxValue, 70); // Ограничиваем 70%

                console.log(`🎲 Normalization: max=${maxValue}, cap=${capValue}`);

                // Нормализуем каждую группу
                const boostLowValue = (value: number): number => {
                  if (value >= 50) return value; // Оставляем как есть
                  
                  // Генерируем рандомное значение между текущим и capValue
                  const min = value;
                  const max = capValue;
                  const boosted = Math.floor(Math.random() * (max - min + 1)) + min;
                  
                  console.log(`  ${value}% → ${boosted}% (range: ${min}-${max})`);
                  return boosted;
                };

                return {
                  attachment: {
                    secure: boostLowValue(normalized.attachment.secure),
                    anxious: boostLowValue(normalized.attachment.anxious),
                    avoidant: boostLowValue(normalized.attachment.avoidant),
                  },
                  values: {
                    support: boostLowValue(normalized.values.support),
                    passion: boostLowValue(normalized.values.passion),
                    security: boostLowValue(normalized.values.security),
                    growth: boostLowValue(normalized.values.growth),
                  },
                  loveLanguage: {
                    words: boostLowValue(normalized.loveLanguage.words),
                    time: boostLowValue(normalized.loveLanguage.time),
                    gifts: boostLowValue(normalized.loveLanguage.gifts),
                    service: boostLowValue(normalized.loveLanguage.service),
                    touch: boostLowValue(normalized.loveLanguage.touch),
                  },
                  conflict: {
                    collab: boostLowValue(normalized.conflict.collab),
                    comprom: boostLowValue(normalized.conflict.comprom),
                    avoid: boostLowValue(normalized.conflict.avoid),
                    accom: boostLowValue(normalized.conflict.accom),
                    compete: boostLowValue(normalized.conflict.compete),
                  },
                };
              };

              const normalizedScores = normalizeScores(scores);
              
              profile = {
                ...normalizedScores,
                expressions: { words: 0, time: 0, gifts: 0, service: 0, touch: 0, romantic: 0, surprise: 0 },
                gifts: { luxury: 0, practical: 0, handmade: 0, emotional: 0, experience: 0, spontaneous: 0, traditional: 0 },
                dates: { luxury: 0, homey: 0, active: 0, romantic: 0, adventure: 0, planning: 0, surprise: 0, variety: 0 },
                care: { words: 0, time: 0, gifts: 0, service: 0, touch: 0, frequency: 0, planning: 0, compliments: 0, thoughtfulness: 0 },
                summaryType: interpretationsArray[0]?.title || "Ваш психологический профиль",
                summary: interpretationsArray.map(i => i.description).filter(Boolean).join('\n\n') || "Анализ ваших результатов показывает уникальный паттерн привязанности и ценностей в отношениях.",
                tips: topRecommendations.length > 0 ? topRecommendations : [
                  "Продолжайте работать над осознанием своих эмоциональных паттернов",
                  "Открыто обсуждайте свои потребности с партнёром",
                  "Развивайте навыки эмоциональной регуляции"
                ],
              };
            } catch (error) {
              console.error('Engine error, fallback to legacy:', error);
              // Fallback to legacy if engine fails
              const scores = calculateScores(answers, testData.questions);
              profile = generateResultProfile(scores);
            }
          } else {
            // Fallback to legacy scoring
            const scores = calculateScores(answers, testData.questions);
            profile = generateResultProfile(scores);
          }
          
          setResult(profile);
          
          // Сохраняем результат через новый API
          const answersMap: Record<string, any> = {};
          answers.forEach(answer => {
            const question = testData.questions.find(q => q.id === answer.questionId);
            answersMap[answer.questionId] = {
              questionText: question?.text || '',
              block: question?.block || 1,
              value: answer.value,
              timestamp: answer.timestamp
            };
          });

          fetch('/api/internal/results', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              testId: currentSlug,
              version: 1,
              answers: answersMap,
              summary: {
                testTitle: testData.meta.title,
                completedAt: new Date().toISOString(),
                attachment: profile.attachment,
                values: profile.values,
                loveLanguage: profile.loveLanguage,
                conflict: profile.conflict,
                expressions: profile.expressions,
                gifts: profile.gifts,
                dates: profile.dates,
                care: profile.care,
                summaryType: profile.summaryType,
                summary: profile.summary,
                tips: profile.tips
              }
            }),
          }).then(response => response.json())
            .then(data => {
              console.log('✅ Result saved to database:', data);
            })
            .catch(error => {
              console.error('❌ Error saving result:', error);
            });
        }
      }
      
      setIsLoading(false);
    };

    loadResults();
  }, [params, searchParams]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мой результат теста "Психология Любви"',
          text: `Я прошёл тест и узнал, что я ${result?.summaryType}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image
    alert('Функция скачивания будет доступна в следующей версии!');
  };

  if (isLoading || !test || !result) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Анализируем ваши ответы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Психология Любви</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Поделиться
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Скачать
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/tests/${slug}`}
            className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Вернуться к тесту
          </Link>

          {/* Results Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Ваш результат
            </h1>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
                {result.summaryType}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Attachment Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-6 w-6 text-pink-500 mr-3" />
                Тип привязанности
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Надёжный</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.attachment.secure}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.attachment.secure}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Тревожный</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.attachment.anxious}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.attachment.anxious}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Избегающий</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.attachment.avoidant}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.attachment.avoidant}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Love Language */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="h-6 w-6 text-rose-500 mr-3" />
                Язык любви
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Слова</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.loveLanguage.words}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.loveLanguage.words}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Время</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.loveLanguage.time}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.loveLanguage.time}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Подарки</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.loveLanguage.gifts}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.loveLanguage.gifts}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Забота</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.loveLanguage.service}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.loveLanguage.service}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Прикосновения</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.loveLanguage.touch}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.loveLanguage.touch}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values and Conflict */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Values */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-3" />
                Ценности в отношениях
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Поддержка</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.values.support}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.values.support}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Страсть</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.values.passion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.values.passion}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Безопасность</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.values.security}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.values.security}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Рост</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.values.growth}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.values.growth}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conflict Style */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-purple-500 mr-3" />
                Стиль конфликтов
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Сотрудничество</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.conflict.collab}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.conflict.collab}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Компромисс</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.conflict.comprom}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.conflict.comprom}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Избегание</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.conflict.avoid}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.conflict.avoid}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Приспособление</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.conflict.accom}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.conflict.accom}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Соперничество</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.conflict.compete}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{result.conflict.compete}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
              Персональные рекомендации
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {result.tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/tests"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Пройти другие тесты
              </Link>
              <Link
                href="/compatibility"
                className="btn-secondary text-lg px-8 py-4"
              >
                Проверить совместимость
              </Link>
            </div>
            
            <p className="text-sm text-gray-500">
              Поделитесь результатом с партнёром или друзьями для обсуждения
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
