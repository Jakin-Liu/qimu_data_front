'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import TaskDetail from '@/components/TaskDetail';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const handleBack = () => {
    router.push('/tasks');
  };

  return (
    <DashboardLayout>
      <TaskDetail taskId={taskId} onBack={handleBack} />
    </DashboardLayout>
  );
}

