import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Психология Любви - Психологические тесты онлайн',
    template: '%s | Психология Любви'
  },
  description: 'Проходите психологические тесты онлайн: тип привязанности, язык любви, ценности в отношениях. Узнайте больше о себе и своих отношениях.',
  keywords: [
    'психологические тесты',
    'тесты на отношения',
    'тип привязанности',
    'язык любви',
    'психология любви',
    'тесты онлайн',
    'самопознание',
    'отношения'
  ],
  authors: [{ name: 'Психология Любви' }],
  creator: 'Психология Любви',
  publisher: 'Психология Любви',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/',
      'kz-KZ': '/kz',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
    title: 'Психология Любви - Психологические тесты онлайн',
    description: 'Проходите психологические тесты онлайн: тип привязанности, язык любви, ценности в отношениях.',
    siteName: 'Психология Любви',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Психология Любви - Психологические тесты онлайн',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Психология Любви - Психологические тесты онлайн',
    description: 'Проходите психологические тесты онлайн: тип привязанности, язык любви, ценности в отношениях.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export function generateTestMetadata(testTitle: string, testDescription: string): Metadata {
  return {
    title: testTitle,
    description: testDescription,
    openGraph: {
      title: testTitle,
      description: testDescription,
      type: 'article',
      images: [
        {
          url: '/og-test.jpg',
          width: 1200,
          height: 630,
          alt: testTitle,
        },
      ],
    },
    twitter: {
      title: testTitle,
      description: testDescription,
      images: ['/og-test.jpg'],
    },
  };
}
