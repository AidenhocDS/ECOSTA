// Khởi tạo object rỗng
export const seatViewsData = {};

// Định nghĩa các Section VIP và Lower
const vipSections = [10, 11, 17, 18, 1, 2, 8, 9];
const lowerSections = [3, 4, 5, 6, 7, 12, 13, 14, 15, 16];

// VÒNG LẶP TỰ ĐỘNG TẠO DATA CHO 55 SECTIONS
for (let i = 1; i <= 55; i++) {
  const isVip = vipSections.includes(i);
  const isLower = lowerSections.includes(i);
  
  let sectionType = isVip ? 'VIP' : isLower ? 'Lower' : 'Higher';
  let sectionName = `${sectionType} Section ${i}`;
  
  // Mảng các ký tự Row mẫu (Dựa theo dữ liệu Drive của bạn)
  // Bạn có thể tùy chỉnh thêm bớt chữ cái ở đây nếu muốn
  let availableRows = isVip 
    ? ['A', 'D', 'G'] 
    : isLower 
      ? ['F', 'H', 'O', 'R'] 
      : ['AA', 'BB', 'DD', 'FF', 'KK', 'MM', 'PP'];
  
  // Trộn ngẫu nhiên và chọn ra 2-3 hàng (Row) để hiển thị cho mỗi Section
  let displayRows = availableRows.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Ghi data tự động vào Object
  seatViewsData[`sec-${i}`] = {
    name: sectionName,
    views: displayRows.map(rowLetter => ({
      row: rowLetter,
      // ĐÂY LÀ KHÚC ĂN TIỀN: Tự động ghép pattern s[Số]r[Chữ].jpg
      img: `/assets/views/s${i}r${rowLetter}.jpg`, 
      tag: isVip ? 'Courtside Experience' : isLower ? 'Great Action View' : 'Panoramic View'
    }))
  };
}