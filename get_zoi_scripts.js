const https = require('https');

https.get('https://www.drinkzoi.co/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scripts = [];
    const re = /src=["']([^"']+\.js[^"']*)["']/g;
    let m;
    while ((m = re.exec(data)) !== null) {
      scripts.push(m[1]);
    }
    console.log('Script URLs:', scripts);
  });
});
