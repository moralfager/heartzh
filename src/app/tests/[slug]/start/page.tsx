"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowLeft, ArrowRight, Pause } from "lucide-react";
import { TestDefinition, SessionAnswer } from "@/lib/types";
import { generateSessionId } from "@/lib/utils";

// Get test data from API (database)
async function getTest(slug: string): Promise<TestDefinition | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/tests/${slug}`, {
      cache: 'no-store', // Don't cache during test taking
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

interface TestTakingPageProps {
  params: Promise<{ slug: string }>;
}

export default function TestTakingPage({ params }: TestTakingPageProps) {
  const router = useRouter();
  const [test, setTest] = useState<TestDefinition | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const loadTest = async () => {
      const { slug: currentSlug } = await params;
      setSlug(currentSlug);
      const testData = await getTest(currentSlug);
      setTest(testData);
      
      // Generate or retrieve session ID
      const existingSessionId = localStorage.getItem(`test-session-${currentSlug}`);
      if (existingSessionId) {
        setSessionId(existingSessionId);
        // Load existing answers
        const savedAnswers = localStorage.getItem(`test-answers-${existingSessionId}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      } else {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        localStorage.setItem(`test-session-${currentSlug}`, newSessionId);
      }
      
      setIsLoading(false);
    };

    loadTest();
  }, [params]);

  useEffect(() => {
    if (sessionId && answers.length > 0) {
      localStorage.setItem(`test-answers-${sessionId}`, JSON.stringify(answers));
    }
  }, [answers, sessionId]);

  const handleAnswerChange = (value: string | number) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (currentAnswer !== null && test) {
      const currentQuestion = test.questions[currentQuestionIndex];
      const newAnswer: SessionAnswer = {
        questionId: currentQuestion.id,
        value: currentAnswer,
        timestamp: Date.now(),
      };

      const updatedAnswers = [...answers];
      const existingAnswerIndex = updatedAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }

      setAnswers(updatedAnswers);

      if (currentQuestionIndex < test.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Load next question's answer if exists
        const nextQuestion = test.questions[currentQuestionIndex + 1];
        const nextAnswer = updatedAnswers.find((a) => a.questionId === nextQuestion.id);
        setCurrentAnswer(nextAnswer?.value as string | number || null);
      } else {
        // Test completed
        router.push(`/tests/${slug}/results?session=${sessionId}`);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = test?.questions[currentQuestionIndex - 1];
      if (prevQuestion) {
        const prevAnswer = answers.find((a) => a.questionId === prevQuestion.id);
        setCurrentAnswer(prevAnswer?.value as string | number || null);
      }
    }
  };

  const handlePause = () => {
    router.push(`/tests/${slug}`);
  };

  if (isLoading || !test) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем тест...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-lg font-bold text-gray-800">Психология Любви</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePause}
                className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Pause className="h-4 w-4 mr-2" />
                Пауза
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {test.meta.title}
              </h1>
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} из {test.questions.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Блок {currentQuestion.block}</span>
              <span>{Math.round(progress)}% завершено</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option.id}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    currentAnswer === (currentQuestion.scale === 'likert' ? parseInt(option.id) : option.id)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type={currentQuestion.scale === 'likert' ? 'radio' : 'radio'}
                    name="answer"
                    value={currentQuestion.scale === 'likert' ? parseInt(option.id) : option.id}
                    checked={currentAnswer === (currentQuestion.scale === 'likert' ? parseInt(option.id) : option.id)}
                    onChange={() => handleAnswerChange(currentQuestion.scale === 'likert' ? parseInt(option.id) : option.id)}
                    className="sr-only"
                  />
                  <span className="text-gray-800 font-medium">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-white'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </button>

            <button
              onClick={handleNext}
              disabled={currentAnswer === null}
              className={`flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                currentAnswer === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {currentQuestionIndex === test.questions.length - 1 ? 'Завершить' : 'Далее'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Выберите ответ, который лучше всего описывает вас. Нет правильных или неправильных ответов.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
