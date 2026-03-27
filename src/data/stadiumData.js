// ==========================================
// SHARED MATH FUNCTION FOR COORDINATE CALCULATION
// ==========================================
const getPoint = (angle, rx, ry) => {
  const rad = (angle - 90) * (Math.PI / 180);
  const cosT = Math.cos(rad);
  const sinT = Math.sin(rad);
  const n = 2.8; 
  const cx = 500; 
  const cy = 400; 

  const x = cx + Math.sign(cosT) * Math.pow(Math.abs(cosT), 2/n) * rx;
  const y = cy + Math.sign(sinT) * Math.pow(Math.abs(sinT), 2/n) * ry;
  return { x, y };
};

function generateStadiumPath(startAngle, endAngle, innerRx, innerRy, outerRx, outerRy) {
  const step = 2; 
  let path = '';
  for (let a = startAngle; a <= endAngle; a += step) {
    const pt = getPoint(a, innerRx, innerRy);
    path += (a === startAngle ? `M ${pt.x} ${pt.y} ` : `L ${pt.x} ${pt.y} `);
  }
  const ptInnerEnd = getPoint(endAngle, innerRx, innerRy);
  path += `L ${ptInnerEnd.x} ${ptInnerEnd.y} `;

  for (let a = endAngle; a >= startAngle; a -= step) {
    const pt = getPoint(a, outerRx, outerRy);
    path += `L ${pt.x} ${pt.y} `;
  }
  const ptOuterStart = getPoint(startAngle, outerRx, outerRy);
  path += `L ${ptOuterStart.x} ${ptOuterStart.y} Z`;
  return path;
}

// ==========================================
// AUTO ROUTING PATH GENERATION ALGORITHM
// ==========================================
export const routeData = {};

function createRoute(secId, targetAngle, targetRx, targetRy) {
  const gates = {
    0: { name: 'NORTH GATE', x: 500, y: 50 },
    90: { name: 'EAST GATE', x: 950, y: 400 },
    180: { name: 'SOUTH GATE', x: 500, y: 750 },
    270: { name: 'WEST GATE', x: 50, y: 400 }
  };

  let normA = (targetAngle % 360 + 360) % 360;
  let gateAngle = 270; 
  if (normA >= 315 || normA < 45) gateAngle = 0;    
  else if (normA >= 45 && normA < 135) gateAngle = 90;   
  else if (normA >= 135 && normA < 225) gateAngle = 180; 

  const gate = gates[gateAngle];

  const corrRx = 305;
  const corrRy = 225;

  let path = `M ${gate.x} ${gate.y} `;
  const entry = getPoint(gateAngle, corrRx, corrRy);
  path += `L ${entry.x} ${entry.y} `;

  let currentA = gateAngle;
  let step = (targetAngle > gateAngle) ? 2 : -2;
  
  let diff = targetAngle - gateAngle;
  if (diff > 180) { step = -2; targetAngle -= 360; }
  if (diff < -180) { step = 2; targetAngle += 360; }

  while (Math.abs(currentA - targetAngle) > 2) {
    currentA += step;
    const p = getPoint(currentA, corrRx, corrRy);
    path += `L ${p.x} ${p.y} `;
  }

  const exitPt = getPoint(targetAngle, targetRx, targetRy);
  path += `L ${exitPt.x} ${exitPt.y}`;

  routeData[secId] = {
    gateName: gate.name,
    gateLocation: { x: gate.x, y: gate.y },
    path: path
  };
}

// ==========================================
// GENERATE STADIUM DATA & INTEGRATE ROUTING & LABELING
// ==========================================
const vipSections = [];
const lowerBowlSections = [];
const upperBowlSections = [];

// 1. INNER RING (VIP & Lower - 1 to 18)
const innerSectionsCount = 18;
const innerAngleStep = 360 / innerSectionsCount;

// Compact dimensions (In: 220x140, Out: 300x220)
// -> Section center (label location) is around R_x=260, R_y=180
const innerInRx = 220, innerInRy = 140, innerOutRx = 300, innerOutRy = 220;
const innerLabelRx = 260, innerLabelRy = 180;

for (let i = 0; i < innerSectionsCount; i++) {
  const secNum = i + 1;
  const startAngle = i * innerAngleStep + 0.5; 
  const endAngle = (i + 1) * innerAngleStep - 0.5;
  const midAngle = (startAngle + endAngle) / 2;
  
  const isVIP = [17, 18, 1, 2, 8, 9, 10, 11].includes(secNum);

  const secObject = {
    id: `sec-${secNum}`, 
    name: (isVIP ? 'VIP Section ' : 'Lower Section ') + secNum, 
    subtext: isVIP ? 'Premium Courtside Action' : 'Great Baseline View',
    path: generateStadiumPath(startAngle, endAngle, innerInRx, innerInRy, innerOutRx, innerOutRy),
    // Add displayed section number and center label coordinates X,Y
    label: secNum.toString(),
    labelLocation: getPoint(midAngle, innerLabelRx, innerLabelRy),
    colorClass: isVIP 
      ? 'fill-amber-500/20 stroke-amber-400 hover:fill-amber-400/50 hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] z-10'
      : 'fill-cyan-500/20 stroke-cyan-400 hover:fill-cyan-400/50 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]'
  };

  if (isVIP) vipSections.push(secObject);
  else lowerBowlSections.push(secObject);
  
  createRoute(`sec-${secNum}`, midAngle, innerLabelRx, innerLabelRy);
}

// 2. OUTER RING (Upper - 20 to 55)
const outerSectionsCount = 36;
const outerAngleStep = 360 / outerSectionsCount;

// Dimensions (In: 310x230, Out: 430x350)
// -> Section center is around R_x=370, R_y=290
const outerInRx = 310, outerInRy = 230, outerOutRx = 430, outerOutRy = 350;
const outerLabelRx = 370, outerLabelRy = 290;

for (let i = 0; i < outerSectionsCount; i++) {
  const secNum = i + 20; 
  const startAngle = i * outerAngleStep + 0.5;
  const endAngle = (i + 1) * outerAngleStep - 0.5;
  const midAngle = (startAngle + endAngle) / 2;

  upperBowlSections.push({
    id: `sec-${secNum}`, name: `Higher Section ${secNum}`, subtext: 'Panoramic Stadium View',
    path: generateStadiumPath(startAngle, endAngle, outerInRx, outerInRy, outerOutRx, outerOutRy),
    // Add displayed section number and center label coordinates X,Y
    label: secNum.toString(),
    labelLocation: getPoint(midAngle, outerLabelRx, outerLabelRy),
    colorClass: 'fill-blue-500/15 stroke-blue-500 hover:fill-blue-400/40 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]'
  });

  createRoute(`sec-${secNum}`, midAngle, outerLabelRx, outerLabelRy);
}

export const allStadiumSections = [...vipSections, ...lowerBowlSections, ...upperBowlSections];