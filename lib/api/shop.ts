import { get, post } from '../api';
import type {
  Shop,
  QueryShopDto,
  ShopListResponse,
  SyncShopResponse,
} from '../types/shop';

// 同步店铺信息列表（从千易API拉取并保存到数据库）
export async function syncStoreInfo(): Promise<SyncShopResponse> {
  return post<SyncShopResponse>('/store-info/sync');
}

// 查询店铺信息列表
export async function getStoreInfoList(params?: QueryShopDto): Promise<ShopListResponse> {
  return get<ShopListResponse>('/store-info', params);
}

