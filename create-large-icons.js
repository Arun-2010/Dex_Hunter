const fs = require('fs');

// Create a 512x512 PNG with substantial data
const createLargePNG = () => {
  const width = 512;
  const height = 512;
  
  // Create pixel data (512x512 RGBA = 1,048,576 bytes)
  const pixelData = Buffer.alloc(width * height * 4);
  
  // Fill with some pattern (not all transparent)
  for (let i = 0; i < pixelData.length; i += 4) {
    pixelData[i] = Math.floor(Math.random() * 50);     // R
    pixelData[i + 1] = Math.floor(Math.random() * 50);   // G  
    pixelData[i + 2] = Math.floor(Math.random() * 50);   // B
    pixelData[i + 3] = 255; // A (fully visible)
  }
  
  // Compress with simple deflate (just store raw data for now)
  const compressedData = Buffer.concat([
    Buffer.from([0x78, 0x01]), // Simple deflate header
    Buffer.from([0x01]), // Block header (final, static)
    Buffer.from([0x00]), // Block length (256 bytes)
    pixelData.slice(0, 256), // First 256 bytes
    Buffer.from([0x00, 0x00]), // Block CRC
    Buffer.from([0x01]), // Block header (final, static)
    Buffer.from([0x00]), // Block length (remaining data)
    pixelData.slice(256), // Remaining data
    Buffer.from([0x00, 0x00]), // Block CRC
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Final block
  ]);
  
  // Construct PNG
  const ihdrCRC = calculateCRC(Buffer.concat([
    Buffer.from('IHDR'),
    Buffer.from([
      (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF
    ]),
    Buffer.from([
      (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF
    ]),
    Buffer.from([0x08, 0x06, 0x00, 0x00, 0x00])
  ]));
  
  const idatCRC = calculateCRC(Buffer.concat([
    Buffer.from('IDAT'),
    compressedData
  ]));
  
  const iendCRC = calculateCRC(Buffer.from('IEND'));
  
  const pngData = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG signature
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // IHDR length (13)
    Buffer.from('IHDR'), // IHDR
    Buffer.from([
      (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF
    ]), // Width
    Buffer.from([
      (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF
    ]), // Height
    Buffer.from([0x08, 0x06, 0x00, 0x00, 0x00]), // Bit depth, color type, compression, filter, interlace
    ihdrCRC, // CRC IHDR
    Buffer.from([0x00, 0x00, 0x08, 0x00]), // IDAT length (2048)
    Buffer.from('IDAT'), // IDAT
    compressedData, // Compressed image data
    idatCRC, // CRC IDAT
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // IEND length (0)
    Buffer.from('IEND'), // IEND
    iendCRC // CRC IEND
  ]);
  
  return pngData;
};

// Simple CRC32 calculation
function calculateCRC(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 0x1 ? 0xEDB88320 : 0);
      crc = crc << 31 | crc >>> 1;
    }
  }
  return Buffer.from([(crc ^ 0xFFFFFFFF) >>> 24, (crc ^ 0xFFFFFFFF) >>> 16, (crc ^ 0xFFFFFFFF) >>> 8, (crc ^ 0xFFFFFFFF)]);
}

try {
  const iconData = createLargePNG();
  
  fs.writeFileSync('assets/icon.png', iconData);
  fs.writeFileSync('assets/adaptive-icon.png', iconData);
  fs.writeFileSync('assets/splash.png', iconData);
  
  console.log('✅ Large PNG files created!');
  console.log(`File size: ${iconData.length} bytes`);
  
} catch (error) {
  console.error('❌ Error creating icons:', error);
}
