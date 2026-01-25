'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import TikTokSubTaskDetail from '@/components/TikTokSubTaskDetail';

export default function TikTokSubTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;
  const subTaskId = params.subTaskId as string;

  const handleBack = () => {
    router.push(`/tiktok-reviews/${taskId}`);
  };

  return (
    <DashboardLayout>
      <TikTokSubTaskDetail
        subTaskId={subTaskId}
        taskId={taskId}
        onBack={handleBack}
      />
    </DashboardLayout>
  );
}

