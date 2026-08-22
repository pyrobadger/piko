// Generate minimal valid PNG icons for the Chrome extension.
// Run: node scripts/create-icons.cjs

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(size) {
  // PNG file signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function writeCrc(buf) {
    const table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = (table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcInput = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(writeCrc(crcInput), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // IHDR chunk: width, height, bit depth (8), color type (6 = RGBA)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Generate pixel data (RGBA)
  const rawData = Buffer.alloc((size * 4 + 1) * size);
  const center = size / 2;
  const radius = size * 0.45;
  const cornerRadius = size * 0.18;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    rawData[rowStart] = 0; // filter byte: None

    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      
      // Rounded rectangle check
      const inRect = isInRoundedRect(x, y, 0, 0, size, size, cornerRadius);
      
      if (inRect) {
        // Gradient: top-left is #7C3AED, bottom-right is #5B21B6
        const t = (x + y) / (2 * size);
        const r = Math.round(124 - t * 33);  // 124 -> 91
        const g = Math.round(58 - t * 25);   // 58 -> 33
        const b = Math.round(237 - t * 55);  // 237 -> 182

        // Draw arrow in center area
        const dx = x - center;
        const dy = y - center;
        
        // Simple arrow shape: vertical line + chevron
        const arrowWidth = Math.max(1, size * 0.04);
        const arrowTop = size * 0.28;
        const arrowBottom = size * 0.72;
        const chevronY = size * 0.38;
        const chevronSpread = size * 0.15;
        
        let isArrow = false;
        
        // Vertical line of arrow
        if (Math.abs(x - center) < arrowWidth && y > arrowTop && y < arrowBottom) {
          isArrow = true;
        }
        
        // Chevron (V shape pointing up)
        const chevronDist = Math.abs(y - chevronY);
        if (y < chevronY + chevronSpread && y > arrowTop - arrowWidth * 2) {
          const expectedX = center + (y - chevronY) * (chevronSpread / chevronSpread);
          const expectedX2 = center - (y - chevronY) * (chevronSpread / chevronSpread);
          if (Math.abs(x - expectedX) < arrowWidth * 1.5 || Math.abs(x - expectedX2) < arrowWidth * 1.5) {
            if (chevronDist < chevronSpread) {
              isArrow = true;
            }
          }
        }
        
        if (isArrow) {
          rawData[px] = 255;     // R
          rawData[px + 1] = 255; // G
          rawData[px + 2] = 255; // B
          rawData[px + 3] = 255; // A
        } else {
          rawData[px] = r;
          rawData[px + 1] = g;
          rawData[px + 2] = b;
          rawData[px + 3] = 255;
        }
      } else {
        // Transparent
        rawData[px] = 0;
        rawData[px + 1] = 0;
        rawData[px + 2] = 0;
        rawData[px + 3] = 0;
      }
    }
  }

  function isInRoundedRect(x, y, rx, ry, rw, rh, r) {
    // Check if point is inside a rounded rectangle
    if (x < rx || x >= rx + rw || y < ry || y >= ry + rh) return false;
    
    // Check corners
    const corners = [
      [rx + r, ry + r],           // top-left
      [rx + rw - r, ry + r],      // top-right
      [rx + r, ry + rh - r],      // bottom-left
      [rx + rw - r, ry + rh - r], // bottom-right
    ];
    
    // If in corner region, check circle distance
    if (x < rx + r && y < ry + r) {
      return dist(x, y, corners[0][0], corners[0][1]) <= r;
    }
    if (x >= rx + rw - r && y < ry + r) {
      return dist(x, y, corners[1][0], corners[1][1]) <= r;
    }
    if (x < rx + r && y >= ry + rh - r) {
      return dist(x, y, corners[2][0], corners[2][1]) <= r;
    }
    if (x >= rx + rw - r && y >= ry + rh - r) {
      return dist(x, y, corners[3][0], corners[3][1]) <= r;
    }
    
    return true;
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  // Compress the raw data with zlib deflate
  const compressed = zlib.deflateSync(rawData);

  // Assemble PNG
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Create output directory
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

// Generate icons
[16, 48, 128].forEach(size => {
  const png = createPng(size);
  const outPath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Created ${outPath} (${png.length} bytes)`);
});

console.log('Done! Icons generated.');
