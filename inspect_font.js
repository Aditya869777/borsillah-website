const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'public', 'fonts', 'BeausiteClassic-Light.woff2');
const stats = fs.statSync(fontPath);
console.log('File size:', stats.size);

// Read first 100 bytes
const buf = fs.readFileSync(fontPath);
console.log('Magic:', buf.toString('ascii', 0, 4));
