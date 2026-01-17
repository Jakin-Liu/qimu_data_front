// 同步千易订单DTO
export interface SyncQianyiOrderDto {
  merchantId?: number;
  page?: number;
  pageSize?: number;
  status?: string;
  shop?: string;
  orderNumber?: string;
  onlineOrderNumber?: string;
  fuzzyOnlineOrderNumber?: string;
  includesSoftDel?: boolean;
  orderTag?: number;
}

// 同步订单响应
export interface SyncOrderResponse {
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

