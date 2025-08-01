export function formatVnd(vnd: string): string {
  const vndNum = parseFloat(vnd);
  return vndNum.toLocaleString("vi-VN"); // formats with dots as thousand separators
}