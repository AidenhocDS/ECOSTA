// Initialize an empty object
export const seatViewsData = {};

// Define VIP and Lower sections
const vipSections = [10, 11, 17, 18, 1, 2, 8, 9];
const lowerSections = [3, 4, 5, 6, 7, 12, 13, 14, 15, 16];

// List of rows that have real images from your zip file
const actualImages = {
  1: ['G'], 4: ['O'], 5: ['L'], 6: ['S'], 7: ['P'], 8: ['D', 'H', 'R'],
  9: ['L'], 10: ['F'], 11: ['R'], 13: ['S'], 14: ['K', 'P'], 15: ['R'],
  16: ['CS VIP'], 18: ['F'], 20: ['GG'], 21: ['MM'], 28: ['KK'], 30: ['KK'],
  34: ['MM'], 37: ['CC'], 38: ['FF', 'PP'], 40: ['DD'], 43: ['CC', 'FF'],
  46: ['FF', 'NN', 'UU'], 47: ['MM'], 48: ['BB', 'FF', 'GG', 'JJ'],
  49: ['FF2', 'LL'], 51: ['EE'], 52: ['NN'], 54: ['AA']
};

// Auto-generate data for 55 sections
for (let i = 1; i <= 55; i++) {
  const isVip = vipSections.includes(i);
  const isLower = lowerSections.includes(i);
  
  let sectionType = isVip ? 'VIP' : isLower ? 'Lower' : 'Higher';
  let sectionName = `${sectionType} Section ${i}`;
  let defaultTag = isVip ? 'Courtside Experience' : isLower ? 'Great Action View' : 'Panoramic View';
  
  let displayViews = [];

  // Step 1: If real images exist, use them for display
  if (actualImages[i]) {
    displayViews = actualImages[i].map(rowLetter => ({
      row: rowLetter,
      // Make sure your public/assets/views/ folder contains these files
      img: `/assets/views/s${i}r${rowLetter}.jpg`, 
      tag: 'Actual View'
    }));
  } 
  // Step 2: If no real images exist, generate random data so ViewPanel uses placeholders
  else {
    let availableRows = isVip 
      ? ['A', 'D', 'G'] 
      : isLower 
        ? ['F', 'H', 'O', 'R'] 
        : ['AA', 'BB', 'DD', 'FF', 'KK', 'MM', 'PP'];
    
    // Shuffle randomly and pick 2 sample rows
    let displayRows = availableRows.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    displayViews = displayRows.map(rowLetter => ({
      row: rowLetter,
      img: `/assets/views/s${i}r${rowLetter}.jpg`, // This URL may fail; ViewPanel handles it with onError
      tag: defaultTag
    }));
  }

  // Write generated data into the object
  seatViewsData[`sec-${i}`] = {
    name: sectionName,
    views: displayViews
  };
}