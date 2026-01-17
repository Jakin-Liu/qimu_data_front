// 格式化数字显示
export const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  if (value < 0) return `-${Math.abs(value).toFixed(decimals)}`;
  return value.toFixed(decimals);
};

// 格式化百分比
export const formatPercent = (value: number): string => {
  if (value === 0) return '0.00%';
  if (value < 0) return `-${Math.abs(value).toFixed(2)}%`;
  return `${value.toFixed(2)}%`;
};

// 格式化金额
export const formatCurrency = (value: number): string => {
  if (value === 0) return '0';
  if (value < 0) return `-¥${Math.abs(value).toFixed(2)}`;
  return `¥${value.toFixed(2)}`;
};

// 格式化泰铢金额
export const formatBaht = (value: number | null): string => {
  if (value === null || value === undefined) return '-';
  return `฿${value.toLocaleString()}`;
};

// 格式化RMB金额
export const formatRMB = (value: number | null): string => {
  if (value === null || value === undefined) return '-';
  return `¥${value.toLocaleString()}`;
};

