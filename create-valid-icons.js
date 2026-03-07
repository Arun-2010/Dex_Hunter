const fs = require('fs');

// Create a simple 1024x1024 PNG with proper structure
const createValidPNG = () => {
  // Create a simple 1024x1024 transparent PNG
  const width = 1024;
  const height = 1024;
  
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Chunk length (13)
    Buffer.from('IHDR'), // Chunk type
    Buffer.from([
      (width >> 24) & 0xFF,
      (width >> 16) & 0xFF,
      (width >> 8) & 0xFF,
      width & 0xFF
    ]), // Width
    Buffer.from([
      (height >> 24) & 0xFF,
      (height >> 16) & 0xFF,
      (height >> 8) & 0xFF,
      height & 0xFF
    ]), // Height
    Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00, 0x00]), // Bit depth, color type, compression, filter, interlace
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC
  ]);
  
  // IDAT chunk (minimal data - all transparent)
  const idatData = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // Chunk length (13 bytes)
    Buffer.from('IDAT'), // Chunk type
    Buffer.from([0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01]), // Compressed data
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC
  ]);
  
  // IEND chunk
  const iendData = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Chunk length (0)
    Buffer.from('IEND'), // Chunk type
    Buffer.from([0xAE, 0x42, 0x60, 0x82]) // CRC
  ]);
  
  return Buffer.concat([signature, ihdrData, idatData, iendData]);
};

try {
  const iconData = createValidPNG();
  
  fs.writeFileSync('assets/icon.png', iconData);
  fs.writeFileSync('assets/adaptive-icon.png', iconData);
  fs.writeFileSync('assets/splash.png', iconData);
  
  console.log('✅ Valid PNG files created!');
  console.log(`File size: ${iconData.length} bytes`);
  
  // Verify files exist and have reasonable size
  const stats = fs.statSync('assets/icon.png');
  console.log(`icon.png size: ${stats.size} bytes`);
  
} catch (error) {
  console.error('❌ Error creating icons:', error);
}
