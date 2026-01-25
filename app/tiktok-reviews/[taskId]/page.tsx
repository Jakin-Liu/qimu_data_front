'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import TikTokReviewTaskDetail from '@/components/TikTokReviewTaskDetail';

export default function TikTokReviewTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const handleBack = () => {
    router.push('/tiktok-reviews');
  };

  return (
    <DashboardLayout>
      <TikTokReviewTaskDetail taskId={taskId} onBack={handleBack} />
    </DashboardLayout>
  );
}

