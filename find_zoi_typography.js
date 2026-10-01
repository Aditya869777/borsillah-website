const https = require('https');
const fs = require('fs');

https.get('https://www.drinkzoi.co/wp-content/themes/drinkzoi/dist/styles/main_bce6a455.css', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all rules with font-size containing vw or vh or large rem
    const lines = data.split('}');
    const largeFontRules = lines.filter(l => /font-size:[^;]*(?:vw|rem|[0-9]{3}px)/i.test(l));
    console.log('Found', largeFontRules.length, 'rules with large font-size:');
    largeFontRules.slice(0, 15).forEach(r => console.log('---', r.trim()));
  });
});
