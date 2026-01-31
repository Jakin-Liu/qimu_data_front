// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3900';
const API_PREFIX = '/api/v1';

// 获取认证 token（从 localStorage 或其他地方）
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // 确保endpoint以/开头，并添加api/v1前缀
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullEndpoint = `${API_PREFIX}${normalizedEndpoint}`;
  const fullUrl = `${API_BASE_URL}${fullEndpoint}`;

  console.log('📡 发起HTTP请求:', {
    method: options.method || 'GET',
    url: fullUrl,
    headers: {
      ...headers,
      Authorization: token ? 'Bearer ***' : '无',
    },
    body: options.body,
  });

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.log('📥 HTTP响应:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    url: response.url,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    console.error('❌ HTTP错误:', {
      status: response.status,
      error,
    });
    throw new Error(error.message || `请求失败: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ HTTP响应数据:', data);
  return data;
}

// GET 请求
export async function get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  // 过滤掉空值并转换为字符串
  const filteredParams = params
    ? Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    : {};
  
  const queryString = Object.keys(filteredParams).length > 0
    ? '?' + new URLSearchParams(filteredParams).toString()
    : '';
  
  const fullUrl = `${endpoint}${queryString}`;
  
  console.log('🌐 GET 请求:', {
    endpoint,
    params,
    filteredParams,
    queryString,
    fullUrl,
  });
  
  return request<T>(fullUrl, { method: 'GET' });
}

// POST 请求
export async function post<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT 请求
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE 请求
export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

