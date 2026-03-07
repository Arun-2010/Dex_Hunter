const fs = require('fs');

// Create a simple 1024x1024 PNG icon (larger file)
const createIconPNG = () => {
  // This creates a larger PNG file that should work better
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x04, 0x00, // IHDR chunk length (1024)
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x04, 0x00, // Width: 1024
    0x00, 0x00, 0x04, 0x00, // Height: 1024
    0x08, 0x02, 0x00, 0x00, // Bit depth: 8, Color type: 2 (RGB)
    0x00, 0x00, 0x00, 0x00, // Compression: 0, Filter: 0
    0x00, 0x00, 0x00, 0x00, // Interlace: 0
    0x00, 0x00, 0x00, 0x00, // Padding
    0x52, 0x7D, 0x3E, 0x1C, // CRC
    0x00, 0x00, 0x0C, 0x00, // IDAT chunk length (3072 bytes of simple data)
    0x49, 0x44, 0x41, 0x54, // IDAT
    ...Array(3072).fill(0x00), // Simple image data (all transparent)
    0x00, 0x00, 0x00, 0x00, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return Buffer.concat([header]);
};

try {
  const iconData = createIconPNG();
  
  fs.writeFileSync('assets/icon.png', iconData);
  fs.writeFileSync('assets/adaptive-icon.png', iconData);
  fs.writeFileSync('assets/splash.png', iconData);
  
  console.log('✅ Icon files created successfully!');
  console.log(`Icon size: ${iconData.length} bytes`);
} catch (error) {
  console.error('❌ Error creating icons:', error);
}
