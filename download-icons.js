const https = require('https');
const fs = require('fs');

// Download a simple 1x1 pixel PNG from a reliable source
const downloadValidPNG = async () => {
  try {
    // Using a simple 1x1 transparent PNG from Wikipedia (reliable source)
    const url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';
    
    const response = await https.get(url);
    const imageData = [];
    
    response.on('data', (chunk) => {
      imageData.push(chunk);
    });
    
    response.on('end', () => {
      const buffer = Buffer.concat(imageData);
      
      // Write to all required files
      fs.writeFileSync('assets/icon.png', buffer);
      fs.writeFileSync('assets/adaptive-icon.png', buffer);
      fs.writeFileSync('assets/splash.png', buffer);
      
      console.log('✅ Downloaded valid PNG files!');
      console.log(`File size: ${buffer.length} bytes`);
    });
    
  } catch (error) {
    console.error('❌ Error downloading PNG:', error);
    // Fallback: create a larger simple PNG
    createFallbackPNG();
  }
};

// Create a larger fallback PNG
const createFallbackPNG = () => {
  const width = 512;
  const height = 512;
  
  // Create a simple 512x512 PNG with more data
  const pixels = width * height * 4; // RGBA
  const pixelData = Buffer.alloc(pixels, 0); // All transparent black pixels
  
  // Simple PNG header and data (this is still minimal but larger)
  const pngData = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG signature
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // IHDR length
    Buffer.from('IHDR'), // IHDR
    Buffer.from([
      (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF
    ]), // Width
    Buffer.from([
      (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF
    ]), // Height
    Buffer.from([0x08, 0x06, 0x00, 0x00, 0x00]), // 8-bit RGBA, no compression
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC IHDR
    Buffer.from([0x00, 0x00, 0x0D, 0x00]), // IDAT length (32768)
    Buffer.from('IDAT'), // IDAT
    Buffer.from([0x78, 0x9C]), // Zlib header
    pixelData, // Raw pixel data
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC IDAT
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // IEND length
    Buffer.from('IEND'), // IEND
    Buffer.from([0xAE, 0x42, 0x60, 0x82]) // CRC IEND
  ]);
  
  fs.writeFileSync('assets/icon.png', pngData);
  fs.writeFileSync('assets/adaptive-icon.png', pngData);
  fs.writeFileSync('assets/splash.png', pngData);
  
  console.log('✅ Created fallback PNG files!');
  console.log(`File size: ${pngData.length} bytes`);
};

downloadValidPNG();
