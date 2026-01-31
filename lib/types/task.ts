// 拆分策略类型
export type SplitStrategy = 'page' | 'url_list';

// 创建任务定义的请求数据
export interface CreateTaskDefinitionDto {
  /** 任务名称 */
  name?: string;
  /** 任务描述 */
  description?: string;
  /** 拆分策略：page / url_list */
  splitStrategy: SplitStrategy;
  /** 配置 JSON：如 totalPage、urls 等 */
  config?: Record<string, unknown>;
}

// 任务定义（TaskDefinition）
export interface TaskDefinition {
  id: number;
  merchantId: number | null;
  userId: number | null;
  definitionId: string;
  name: string;
  description: string | null;
  splitStrategy: SplitStrategy;
  excutor: string;
  config: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// 兼容旧代码，Task 就是 TaskDefinition
export type Task = TaskDefinition;

// 任务实例（TaskInstance）- 基于任务定义执行的任务
export interface TaskInstance {
  id: number;
  taskInstanceId: string;
  definitionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// 子任务（SubTask）- 任务实例的子任务
export interface SubTask {
  id: number;
  subtaskId: string;
  instanceId: number;
  url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentPage?: number;
  totalPages?: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  list: Task[];
  total: number;
  page: number;
  pageSize: number;
}

// 任务实例列表响应
export interface TaskInstanceListResponse {
  list: TaskInstance[];
  total: number;
  page: number;
  pageSize: number;
}

// 子任务列表响应
export interface SubTaskListResponse {
  list: SubTask[];
  total: number;
  page: number;
  pageSize: number;
}

// API 响应包装类型
export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
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

