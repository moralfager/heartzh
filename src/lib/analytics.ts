// Мониторинг производительности для продакшена
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
}

// Расширяем интерфейс Window для gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (id: string, action: string, target: string, params?: Record<string, unknown>) => void;
  }
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Отправка метрик в аналитику (Google Analytics, Yandex Metrica и т.д.)
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Yandex Metrica
    if (typeof window.ym !== 'undefined' && process.env.NEXT_PUBLIC_YANDEX_METRICA_ID) {
      window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID, 'reachGoal', 'web-vitals', {
        metric: metric.name,
        value: metric.value,
        id: metric.id,
      });
    }

    // Логирование в консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric);
    }
  }
}

// Функция для отслеживания ошибок
export function reportError(error: Error, errorInfo?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    // Логирование в консоль
    console.error('Application Error:', error, errorInfo);
  }
}
