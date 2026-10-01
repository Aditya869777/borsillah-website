const https = require('https');

https.get('https://www.drinkzoi.co/wp-content/themes/drinkzoi/dist/scripts/main_bce6a455.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Script size:', data.length);
    // Find occurrences of "Freeze" or "Drink" or "Shake"
    const words = ['Freeze', 'Drink', 'Shake'];
    words.forEach(w => {
      let idx = 0;
      while ((idx = data.indexOf(w, idx)) !== -1) {
        console.log(`Found "${w}" at ${idx}:`, data.substring(Math.max(0, idx - 100), Math.min(data.length, idx + 150)));
        idx += w.length;
      }
    });
  });
});
