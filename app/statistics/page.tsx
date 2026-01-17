'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StatisticsPage() {
  const router = useRouter();

  useEffect(() => {
    // 默认重定向到市场收入统计
    router.replace('/statistics/market-income');
  }, [router]);

  return null;
}
