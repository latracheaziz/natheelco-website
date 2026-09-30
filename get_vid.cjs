const https = require('https');

https.get('https://elements.envato.com/fr/blue-color-line-animated-background-WPA4Y4C', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let match = data.match(/https:\/\/[^"']+\.mp4/g);
    if(match) console.log(match);
    else console.log('No video found');
  });
}).on('error', console.error);
