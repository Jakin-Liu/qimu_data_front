import { get, post, put, del } from '../api';
import type {
  Merchant,
  CreateMerchantDto,
  UpdateMerchantDto,
  QueryMerchantDto,
} from '../types/merchant';
import type { ApiResponse } from '../types/task';

// 获取商户列表
export async function getMerchantList(params?: QueryMerchantDto): Promise<Merchant[]> {
  const response = await get<ApiResponse<Merchant[]>>('/merchant', params);
  if (response.code !== 0) {
    throw new Error(response.message || '获取商户列表失败');
  }
  return response.data || [];
}

// 获取商户详情
export async function getMerchantById(id: number): Promise<Merchant> {
  return get<Merchant>(`/merchant/${id}`);
}

// 创建商户
export async function createMerchant(data: CreateMerchantDto): Promise<Merchant> {
  return post<Merchant>('/merchant', data);
}

// 更新商户
export async function updateMerchant(
  id: number,
  data: UpdateMerchantDto
): Promise<Merchant> {
  return put<Merchant>(`/merchant/${id}`, data);
}

// 停用商户
export async function deactivateMerchant(id: number): Promise<Merchant> {
  return del<Merchant>(`/merchant/${id}`);
}

