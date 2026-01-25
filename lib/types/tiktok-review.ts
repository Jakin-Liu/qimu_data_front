export interface TikTokReviewTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  urls: string[];
  createdAt: string;
  completedAt?: string;
  csvUrl?: string;
  error?: string;
  remark?: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  url: string;
  productId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  startedAt?: string;
  completedAt?: string;
  errorAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSummary {
  totalSubTasks: number;
  completedSubTasks: number;
  failedSubTasks: number;
  processingSubTasks: number;
  pendingSubTasks: number;
  totalReviews: number;
  completionRate: number;
}

export interface Review {
  id: number;
  subTaskId: string;
  taskId: string;
  reviewId?: string;
  productId?: string;
  skuId?: string;
  productName?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerAvatarUrl?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewImages?: string[];
  displayImageUrl?: string;
  reviewTime?: number | string;
  reviewTimeParsed?: string;
  reviewCountry?: string;
  skuSpecification?: string;
  isVerifiedPurchase?: boolean;
  isIncentivizedReview?: boolean;
  rawData?: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

