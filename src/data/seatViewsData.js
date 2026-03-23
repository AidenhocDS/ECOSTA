// Khởi tạo object rỗng
export const seatViewsData = {};

// Định nghĩa các Section VIP và Lower
const vipSections = [10, 11, 17, 18, 1, 2, 8, 9];
const lowerSections = [3, 4, 5, 6, 7, 12, 13, 14, 15, 16];

// Danh sách các hàng (Row) CÓ ẢNH THỰC TẾ từ file zip của bạn
const actualImages = {
  1: ['G'], 4: ['O'], 5: ['L'], 6: ['S'], 7: ['P'], 8: ['D', 'H', 'R'],
  9: ['L'], 10: ['F'], 11: ['R'], 13: ['S'], 14: ['K', 'P'], 15: ['R'],
  16: ['CS VIP'], 18: ['F'], 20: ['GG'], 21: ['MM'], 28: ['KK'], 30: ['KK'],
  34: ['MM'], 37: ['CC'], 38: ['FF', 'PP'], 40: ['DD'], 43: ['CC', 'FF'],
  46: ['FF', 'NN', 'UU'], 47: ['MM'], 48: ['BB', 'FF', 'GG', 'JJ'],
  49: ['FF2', 'LL'], 51: ['EE'], 52: ['NN'], 54: ['AA']
};

// VÒNG LẶP TỰ ĐỘNG TẠO DATA CHO 55 SECTIONS
for (let i = 1; i <= 55; i++) {
  const isVip = vipSections.includes(i);
  const isLower = lowerSections.includes(i);
  
  let sectionType = isVip ? 'VIP' : isLower ? 'Lower' : 'Higher';
  let sectionName = `${sectionType} Section ${i}`;
  let defaultTag = isVip ? 'Courtside Experience' : isLower ? 'Great Action View' : 'Panoramic View';
  
  let displayViews = [];

  // BƯỚC 1: NẾU CÓ ẢNH THẬT -> Lấy ảnh thật để hiển thị
  if (actualImages[i]) {
    displayViews = actualImages[i].map(rowLetter => ({
      row: rowLetter,
      // Đảm bảo thư mục public/assets/views/ của bạn chứa đúng các file này
      img: `/assets/views/s${i}r${rowLetter}.jpg`, 
      tag: 'Actual View'
    }));
  } 
  // BƯỚC 2: NẾU KHÔNG CÓ ẢNH THẬT -> Sinh random data để ViewPanel dùng ảnh Placeholder
  else {
    let availableRows = isVip 
      ? ['A', 'D', 'G'] 
      : isLower 
        ? ['F', 'H', 'O', 'R'] 
        : ['AA', 'BB', 'DD', 'FF', 'KK', 'MM', 'PP'];
    
    // Trộn ngẫu nhiên và chọn ra 2 hàng làm mẫu
    let displayRows = availableRows.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    displayViews = displayRows.map(rowLetter => ({
      row: rowLetter,
      img: `/assets/views/s${i}r${rowLetter}.jpg`, // URL này sẽ lỗi, ViewPanel sẽ tự bắt lỗi onError
      tag: defaultTag
    }));
  }

  // Ghi data tự động vào Object
  seatViewsData[`sec-${i}`] = {
    name: sectionName,
    views: displayViews
  };
}