'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { motion } from 'framer-motion';
import AudioController from '@/app/egg/_components/layout/AudioController';
import BackButton from '@/app/egg/_components/layout/BackButton';
import Chapter1 from '@/app/egg/_components/chapters/Chapter1';
import Chapter2 from '@/app/egg/_components/chapters/Chapter2';
import Chapter3 from '@/app/egg/_components/chapters/Chapter3';
import Chapter4 from '@/app/egg/_components/chapters/Chapter4';
import Chapter5 from '@/app/egg/_components/chapters/Chapter5';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { isChapterAccessible, setCurrentChapter } = useProgressStore();
  const [isClient, setIsClient] = useState(false);

  const chapterId = `ch${params.id}` as 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5';
  const chapterNum = parseInt(params.id as string);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if chapter is accessible
    if (!isChapterAccessible(chapterId)) {
      router.push('/egg');
      return;
    }

    // Set as current chapter
    setCurrentChapter(chapterId);
  }, [chapterId, isClient, isChapterAccessible, router, setCurrentChapter]);

  if (!isClient) {
    return null;
  }

  // Render appropriate chapter component
  const renderChapter = () => {
    switch (chapterNum) {
      case 1:
        return <Chapter1 />;
      case 2:
        return <Chapter2 />;
      case 3:
        return <Chapter3 />;
      case 4:
        return <Chapter4 />;
      case 5:
        return <Chapter5 />;
      default:
        router.push('/egg');
        return null;
    }
  };

  return (
    <>
      <AudioController />
      {chapterNum > 1 && <BackButton />}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderChapter()}
      </motion.div>
    </>
  );
}
