// 市场收入统计数据
export interface StatisticsData {
  key: string;
  week: string;
  date: string;
  productName: string;
  visitorCount: number;
  addToCart: number;
  orderCount: number;
  itemCount: number;
  salesAmount: number;
  orderRevenue: number;
  platformFee: number;
  platformFeeRatio: number;
  procurementCost: number;
  mainSku: string;
  rttFee: number;
  productGrossProfit: number;
  productGrossProfitMargin: number;
  advertisingCost: number;
  affiliateMarketing: number;
  reviewCost: number;
  marketingCost: number;
  marketingRatio: number;
  marketGrossProfit: number;
  marketGrossProfitMargin: number;
  addToCartRate: number;
  visitToOrderRate: number;
  cartToOrderRate: number;
  cacPerOrder: number;
  cacRatioPerOrder: number;
  cacPerItem: number;
  roi: number;
  avgOrderValue: number;
  netProfitPerOrder: number;
  netProfitPerItem: number;
  costPerUv: number;
  costPerAddToCart: number;
  notes: number;
}

export const marketIncomeData: StatisticsData[] = [
  {
    key: '1',
    week: '25年5月WK4',
    date: '5.19-5.25',
    productName: 'DT002',
    visitorCount: 1250,
    addToCart: 89,
    orderCount: 23,
    itemCount: 45,
    salesAmount: 12500,
    orderRevenue: 12500,
    platformFee: 0,
    platformFeeRatio: 0,
    procurementCost: 0,
    mainSku: '',
    rttFee: 0,
    productGrossProfit: 9012,
    productGrossProfitMargin: 72.12,
    advertisingCost: 3500,
    affiliateMarketing: 1200,
    reviewCost: 0,
    marketingCost: 4700,
    marketingRatio: 37.6,
    marketGrossProfit: 4312,
    marketGrossProfitMargin: 34.5,
    addToCartRate: 7.12,
    visitToOrderRate: 1.84,
    cartToOrderRate: 25.84,
    cacPerOrder: 204.35,
    cacRatioPerOrder: 16.35,
    cacPerItem: 104.44,
    roi: 2.66,
    avgOrderValue: 543.48,
    netProfitPerOrder: 187.39,
    netProfitPerItem: 95.82,
    costPerUv: 3.76,
    costPerAddToCart: 52.81,
    notes: 8.5,
  },
  {
    key: '2',
    week: '25年5月WK4',
    date: '5.19-5.25',
    productName: 'DT008',
    visitorCount: 890,
    addToCart: 45,
    orderCount: 12,
    itemCount: 18,
    salesAmount: 6800,
    orderRevenue: 6800,
    platformFee: 0,
    platformFeeRatio: 0,
    procurementCost: 0,
    mainSku: '',
    rttFee: 0,
    productGrossProfit: 4896,
    productGrossProfitMargin: 72.0,
    advertisingCost: 2800,
    affiliateMarketing: 800,
    reviewCost: 0,
    marketingCost: 3600,
    marketingRatio: 52.94,
    marketGrossProfit: 1296,
    marketGrossProfitMargin: 19.06,
    addToCartRate: 5.06,
    visitToOrderRate: 1.35,
    cartToOrderRate: 26.67,
    cacPerOrder: 300.0,
    cacRatioPerOrder: 22.06,
    cacPerItem: 200.0,
    roi: 1.89,
    avgOrderValue: 566.67,
    netProfitPerOrder: 108.0,
    netProfitPerItem: 72.0,
    costPerUv: 4.04,
    costPerAddToCart: 80.0,
    notes: 8.5,
  },
  {
    key: '3',
    week: '25年5月WK4',
    date: '5.19-5.25',
    productName: '合计',
    visitorCount: 2140,
    addToCart: 134,
    orderCount: 35,
    itemCount: 63,
    salesAmount: 19300,
    orderRevenue: 19300,
    platformFee: 0,
    platformFeeRatio: 0,
    procurementCost: 0,
    mainSku: '',
    rttFee: 0,
    productGrossProfit: 13908,
    productGrossProfitMargin: 72.06,
    advertisingCost: 6300,
    affiliateMarketing: 2000,
    reviewCost: 0,
    marketingCost: 8300,
    marketingRatio: 43.01,
    marketGrossProfit: 5608,
    marketGrossProfitMargin: 29.05,
    addToCartRate: 6.26,
    visitToOrderRate: 1.64,
    cartToOrderRate: 26.12,
    cacPerOrder: 237.14,
    cacRatioPerOrder: 19.43,
    cacPerItem: 131.75,
    roi: 2.33,
    avgOrderValue: 551.43,
    netProfitPerOrder: 160.23,
    netProfitPerItem: 88.95,
    costPerUv: 3.88,
    costPerAddToCart: 61.94,
    notes: 8.5,
  },
];

// 链接数据统计
export interface LinkData {
  key: string;
  linkName: string;
  visitorCount: number;
  clickCount: number;
  orderCount: number;
  salesAmount: number;
  conversionRate: number;
  avgOrderValue: number;
}

export const linkData: LinkData[] = [
  {
    key: '1',
    linkName: '推广链接A',
    visitorCount: 1250,
    clickCount: 890,
    orderCount: 23,
    salesAmount: 12500,
    conversionRate: 2.58,
    avgOrderValue: 543.48,
  },
  {
    key: '2',
    linkName: '推广链接B',
    visitorCount: 2100,
    clickCount: 1560,
    orderCount: 42,
    salesAmount: 23500,
    conversionRate: 2.0,
    avgOrderValue: 559.52,
  },
];

// 产品加购数据
export interface ProductCartData {
  key: string;
  productName: string;
  visitorCount: number;
  addToCart: number;
  addToCartRate: number;
  orderCount: number;
  conversionRate: number;
  salesAmount: number;
}

export const productCartData: ProductCartData[] = [
  {
    key: '1',
    productName: 'DT002',
    visitorCount: 1250,
    addToCart: 89,
    addToCartRate: 7.12,
    orderCount: 23,
    conversionRate: 25.84,
    salesAmount: 12500,
  },
  {
    key: '2',
    productName: 'DT019',
    visitorCount: 2100,
    addToCart: 156,
    addToCartRate: 7.43,
    orderCount: 42,
    conversionRate: 26.92,
    salesAmount: 23500,
  },
  {
    key: '3',
    productName: 'DT030',
    visitorCount: 1850,
    addToCart: 112,
    addToCartRate: 6.05,
    orderCount: 28,
    conversionRate: 25.0,
    salesAmount: 15200,
  },
];

// 日数据
export interface DailyData {
  key: string;
  platform: string;
  shop: string;
  week: string;
  date: string;
  marketingCost: number | null;
  orderCount: number | null;
  salesAmount: number | null;
  marketingShare: number | null;
  isSummary?: boolean;
  isEvaluation?: boolean;
}

export const dailyData: DailyData[] = [
  {
    key: '1',
    platform: 'shopee',
    shop: '家居mall',
    week: '25年10月WK5',
    date: '10/28/25',
    marketingCost: 2498,
    orderCount: 42,
    salesAmount: 23718,
    marketingShare: 10.53,
  },
  {
    key: '2',
    platform: '',
    shop: '测评',
    week: '25年10月WK5',
    date: '10/28/25',
    marketingCost: 666,
    orderCount: null,
    salesAmount: null,
    marketingShare: null,
    isEvaluation: true,
  },
  {
    key: '3',
    platform: '',
    shop: '家居汇总-฿',
    week: '',
    date: '',
    marketingCost: 3164,
    orderCount: 42,
    salesAmount: 23718,
    marketingShare: 13.34,
    isSummary: true,
  },
  {
    key: '4',
    platform: 'shopee',
    shop: '家具mall',
    week: '25年10月WK5',
    date: '10/28/25',
    marketingCost: 0,
    orderCount: 0,
    salesAmount: 0,
    marketingShare: 0.0,
  },
  {
    key: '5',
    platform: 'lazada',
    shop: '家具mall',
    week: '25年10月WK5',
    date: '10/28/25',
    marketingCost: 666,
    orderCount: 30,
    salesAmount: 40912,
    marketingShare: 1.63,
  },
  {
    key: '6',
    platform: '',
    shop: '汇总-RMB',
    week: '',
    date: '',
    marketingCost: 2540,
    orderCount: 117,
    salesAmount: 29816,
    marketingShare: 8.52,
    isSummary: true,
  },
];

