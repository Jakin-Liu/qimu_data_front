export interface Task {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  urls: string[];
  createdAt: string;
  completedAt?: string;
  csvUrl?: string;
  error?: string;
  remark?: string;
}

export interface TaskProgress {
  id: number;
  taskId: string;
  url: string;
  currentPage: number;
  totalPages: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  errorAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskProgressSummary {
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  processingUrls: number;
  pendingUrls: number;
  totalPages: number;
  maxPages: number;
  completionRate: number;
}

