const https = require('https');
const fs = require('fs');
https.get('https://elements.envato.com/fr/a-blue-wave-with-a-white-line-in-the-middle-ZZQLN89', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const m = d.match(/https:\/\/[^"']+\.mp4/);
    if(m) {
      console.log('Found:', m[0]);
      https.get(m[0], r => r.pipe(fs.createWriteStream('public/blue-lines-bg.mp4')).on('finish', () => console.log('Downloaded')));
    } else {
      console.log('Not found');
    }
  });
});
