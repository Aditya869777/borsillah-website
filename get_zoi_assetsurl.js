const https = require('https');

https.get('https://www.drinkzoi.co/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('assetsURL');
    console.log(data.substring(Math.max(0, idx - 100), Math.min(data.length, idx + 200)));
  });
});
