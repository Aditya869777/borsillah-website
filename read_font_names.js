const fs = require('fs');
const path = require('path');

// Let's inspect the WOFF file (not WOFF2, because WOFF is zlib-compressed SFNT, easy to decompress)
const zlib = require('zlib');
const buf = fs.readFileSync(path.join(__dirname, 'public', 'fonts', 'BeausiteClassic-Light.woff'));

console.log('Signature:', buf.toString('ascii', 0, 4));
console.log('Flavor:', buf.toString('hex', 4, 8));
console.log('Length:', buf.readUInt32BE(8));
console.log('NumTables:', buf.readUInt16BE(12));
console.log('TotalSfntSize:', buf.readUInt32BE(16));

// Find 'name' table
let offset = 44;
const numTables = buf.readUInt16BE(12);
let nameTable = null;
for (let i = 0; i < numTables; i++) {
  const tag = buf.toString('ascii', offset, offset + 4);
  const tableOffset = buf.readUInt32BE(offset + 4);
  const compLength = buf.readUInt32BE(offset + 8);
  const origLength = buf.readUInt32BE(offset + 12);
  const origChecksum = buf.readUInt32BE(offset + 16);
  if (tag === 'name') {
    nameTable = { tableOffset, compLength, origLength };
  }
  offset += 20;
}

if (nameTable) {
  const compData = buf.subarray(nameTable.tableOffset, nameTable.tableOffset + nameTable.compLength);
  const uncomp = nameTable.compLength === nameTable.origLength ? compData : zlib.inflateSync(compData);
  const count = uncomp.readUInt16BE(2);
  const stringOffset = uncomp.readUInt16BE(4);
  console.log('Name records count:', count);
  for (let i = 0; i < count; i++) {
    const recOffset = 6 + i * 12;
    const platformId = uncomp.readUInt16BE(recOffset);
    const encodingId = uncomp.readUInt16BE(recOffset + 2);
    const nameId = uncomp.readUInt16BE(recOffset + 6);
    const length = uncomp.readUInt16BE(recOffset + 8);
    const strOffset = uncomp.readUInt16BE(recOffset + 10);
    const strBuf = uncomp.subarray(stringOffset + strOffset, stringOffset + strOffset + length);
    let str = '';
    if (platformId === 0 || platformId === 3) {
      // UTF-16BE
      str = strBuf.toString('utf16be');
    } else {
      str = strBuf.toString('utf8');
    }
    if ([1, 2, 4, 6].includes(nameId)) {
      console.log(`nameId ${nameId} (plat ${platformId}):`, str);
    }
  }
}
