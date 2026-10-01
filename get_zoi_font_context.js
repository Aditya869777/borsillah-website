const https = require('https');

https.get('https://www.drinkzoi.co/wp-content/themes/drinkzoi/dist/scripts/main_bce6a455.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = 886451;
    console.log(data.substring(idx - 300, idx + 400));
  });
});
