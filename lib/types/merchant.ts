// 商户状态枚举
export enum MerchantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// 商户实体
export interface Merchant {
  id: number;
  name: string;
  description: string | null;
  status: MerchantStatus;
  createdAt: string;
  updatedAt: string;
  admin?: {
    email: string;
    name: string;
  };
}

// 创建商户 DTO
export interface CreateMerchantDto {
  name: string;
  description?: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
}

// 更新商户 DTO
export interface UpdateMerchantDto {
  name?: string;
  description?: string;
  status?: MerchantStatus;
}

// 查询商户 DTO
export interface QueryMerchantDto {
  status?: MerchantStatus;
}

