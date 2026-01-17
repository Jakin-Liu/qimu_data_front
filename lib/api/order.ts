import { post } from '../api';
import type {
  SyncQianyiOrderDto,
  SyncOrderResponse,
} from '../types/order';

// 同步千易订单（固定获取付款时间前一天的订单）
export async function syncQianyiOrders(
  dto: SyncQianyiOrderDto
): Promise<SyncOrderResponse> {
  return post<SyncOrderResponse>('/order/sync', dto);
}

