/**
 * Format số tiền thành định dạng USD ($)
 * @param {number|string} price - Giá cần format (VNĐ)
 * @returns {string} - Giá đã được format (ví dụ: "$40", "$4,000")
 * 
 * @example
 * formatPriceDollar(1000000) // "$40" (1,000,000 / 25,000)
 * formatPriceDollar(100000000) // "$4,000" (100,000,000 / 25,000)
 */
export const formatPriceDollar = (price) => {
  // Chuyển đổi về số nếu là string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Kiểm tra nếu không phải số hợp lệ
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '$0';
  }
  
  // Chia cho 25000 để chuyển từ VNĐ sang USD
  const usdPrice = numPrice / 25000;
  
  // Làm tròn đến 2 chữ số thập phân
  const roundedPrice = Math.round(usdPrice * 100) / 100;
  
  // Format với dấu phẩy làm phân cách hàng nghìn và dấu chấm cho thập phân
  const formattedPrice = roundedPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `$${formattedPrice}`;
};

export default formatPriceDollar;

