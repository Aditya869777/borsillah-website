const fs = require('fs');
const path = require('path');

const woff2Path = path.join(__dirname, 'public', 'fonts', 'BeausiteClassic-Light.woff2');
const woffPath = path.join(__dirname, 'public', 'fonts', 'BeausiteClassic-Light.woff');

console.log('woff2 exists:', fs.existsSync(woff2Path), fs.statSync(woff2Path).size);
console.log('woff exists:', fs.existsSync(woffPath), fs.statSync(woffPath).size);
