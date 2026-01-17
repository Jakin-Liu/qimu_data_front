// 商家店铺数据类型
export interface Shop {
  id?: number;
  shopId: number | string;
  name: string;
  platform: string;
  status: string;
  siteCode?: string | null;
  authExpiredStatus: string;
  onlineShopId?: string | null;
  shopGroupVOList?: any;
  createTime: number | string;
  currency?: string | null;
  expireTime?: number | string | null;
  isDeleted?: number;
  message?: string | null;
  timeZoneId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 查询店铺信息DTO
export interface QueryShopDto {
  page?: number;
  pageSize?: number;
  platform?: string;
  status?: string;
  siteCode?: string;
  name?: string;
  authExpiredStatus?: string;
}

// 店铺列表响应
export interface ShopListResponse {
  data: {
    list: Shop[];
    total: number;
    page: number | string;
    pageSize: number | string;
  };
  code: number;
  message: string;
}

// 同步店铺信息响应
export interface SyncShopResponse {
  data?: {
    success: boolean;
    message: string;
    count: number;
  };
  success?: boolean;
  message?: string;
  count?: number;
  code?: number;
}

