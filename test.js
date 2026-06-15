const fetch = require('node-fetch');
fetch('https://api.vietqr.io/v2/banks').then(res => res.json()).then(data => {
  const momo = data.data.find(b => b.shortName.toLowerCase().includes('momo') || b.code.toLowerCase().includes('momo'));
  console.log('MOMO BANK:', momo);
})
