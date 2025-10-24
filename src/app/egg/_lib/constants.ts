// Chapter codes (pre-hashed for security)
// Generated with bcrypt.hashSync(code, 10)
export const CHAPTER_CODES = {
  // 'роза'
  ch1: '$2b$10$NKGCAqthScOnuQ2CTqBj.ubbJvgPPOxvoScc6SXSeQrn8F0gGnab.',
  // 'взаимодоверие' (used in check-key API)
  ch3: '$2b$10$CNA..JxbFovzbgUsW9T0xuZ99848ZE3Qt7NcPbTKY.90ojC/z0aQO',
  // 'чёрный'
  ch4: '$2b$10$/vDs1fWwG0gdP0NRefI37./y4XtLFvoTbzTxzmacufl/R82icor7a',
  // 'мандарин' (also accepts 'mandarin')
  ch5: '$2b$10$tZQG3h2qLz8K/hJvVzKMuO5L8wYxKH0OzGzpYDqPOGjQYzJqJPQYi',
} as const;

// Animation transitions
export const TRANSITIONS = {
  chapterFade: { duration: 0.8, ease: 'easeInOut' as const },
  audioFade: { duration: 0.6 },
  springy: { type: 'spring' as const, stiffness: 100, damping: 15 },
  gentle: { type: 'spring' as const, stiffness: 80, damping: 20 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25 },
} as const;

// Chapter metadata
export const CHAPTERS = {
  ch1: {
    id: 'ch1',
    title: 'Heart of Zhaniyat',
    description: 'Пробуждение интереса и начало пути',
    path: '/egg/chapter/1',
    letterReveal: 'H',
  },
  ch2: {
    id: 'ch2',
    title: 'История',
    description: 'Как всё началось',
    path: '/egg/chapter/2',
    letterReveal: 'E',
  },
  ch3: {
    id: 'ch3',
    title: 'Доверие',
    description: 'Открытость и намерения',
    path: '/egg/chapter/3',
    letterReveal: 'A',
  },
  ch4: {
    id: 'ch4',
    title: 'Цвет',
    description: 'Символика связи',
    path: '/egg/chapter/4',
    letterReveal: 'R',
  },
  ch5: {
    id: 'ch5',
    title: 'Последний вопрос',
    description: 'Признание',
    path: '/egg/chapter/5',
    letterReveal: 'T',
  },
} as const;

// Comic scenes for Chapter 2 - 6 scenes
export const COMIC_SCENES = [
  {
    id: 1,
    title: 'Школьные коридоры',
    text: 'Мы учились вместе.\nВсё казалось обычным — просто школьные будни.',
    image: '/egg/images/comic/scene1.png',
  },
  {
    id: 2,
    title: 'Разные дороги',
    text: 'После ты уехала в Алматы, а я остался в Астане.\nЖизнь шла вперёд.',
    image: '/egg/images/comic/scene2.png',
  },
  {
    id: 3,
    title: 'Встреча спустя годы',
    text: 'Прошли годы.\nИ вдруг — встреча.',
    image: '/egg/images/comic/scene3.png',
  },
  {
    id: 4,
    title: 'Разговоры',
    text: 'Мы просто говорили.\nБез притворства, без масок.\nВсё было по-настоящему — спокойно, искренне, тепло.',
    image: '/egg/images/comic/scene4.png',
  },
  {
    id: 5,
    title: 'Она',
    text: 'Мы шли рядом по зимней улице.\nСмеялись, молчали, смотрели друг на друга.\nИ понял — просто быть собой могу рядом с тобой.',
    image: '/egg/images/comic/scene5.png',
  },
  {
    id: 6,
    title: 'Сейчас',
    text: 'Сейчас я просто хочу, чтобы ты знала:\nвсё, что я сделал — не ради эффекта.\nЭто искренне. Это от сердца.\nИ, может быть, это начало чего-то настоящего.',
    image: '/egg/images/comic/scene6.png',
  },
] as const;

// Chapter 5 questions
export const FINAL_QUESTIONS = [
  'Тебе понравилось это приключение?',
  'Ты улыбалась хотя бы раз?',
  'Ты чувствуешь, что это было от сердца?',
  'Ты доверяешь тому, кто рядом?',
  'Тебе нравится человек напротив тебя?',
] as const;

// JWT secret (should be in env in production)
export const JWT_SECRET = process.env.JWT_SECRET || 'heart-of-zha-secret-key-change-in-production';

// JWT expiration
export const JWT_EXPIRATION = '30d';

// LocalStorage keys
export const STORAGE_KEYS = {
  progress: 'heartofzha:v1:progress',
  audio: 'heartofzha:v1:audio',
  version: 'v1',
} as const;

// Audio settings
export const AUDIO_CONFIG = {
  defaultVolume: 0.4,
  fadeTime: 700, // ms
  tracks: {
    main: '/egg/audio/ambient-main.mp3',
    chapter1: '/egg/audio/chapter1.mp3',
    chapter2: '/egg/audio/chapter2.mp3',
    chapter3: '/egg/audio/chapter3.mp3',
    chapter4: '/egg/audio/chapter4.mp3',
    chapter5: '/egg/audio/chapter5.mp3',
  },
} as const;

// Colors
export const COLORS = {
  rose: '#F7CAD0',
  blush: '#FFD6E7',
  lavender: '#E8E3FF',
  ink: '#2B2B2B',
  glow: '#FFF7F1',
} as const;

// Hints for codes
export const HINTS = {
  ch1: 'Последний подаренный цветок. Классический символ любви...',
  ch2: 'Найди вопрос на подарке',
  ch3: 'В продуктово магазине или в почтовом ящике разыщи ключик с ответом на вопрос',
  ch4: 'Позвони нашему другу и спроси, какой мой любимый цвет',
} as const;

// Phone number for CTA (replace with actual)
export const CONTACT = {
  phone: '+1234567890', // Replace with actual
  phoneDisplay: '+1 (234) 567-890',
} as const;

