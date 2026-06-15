const fetch = require('node-fetch');
async function test() {
  const res = await fetch('https://api.vietqr.io/v2/banks');
  const data = await res.json();
  const momo = data.data.find(b => b.shortName.toLowerCase().includes('momo') || b.code.toLowerCase().includes('momo') || b.name.toLowerCase().includes('momo'));
  console.log('MOMO BANK:', momo);
  
  // also test if the image URL works
  const imgRes = await fetch('https://img.vietqr.io/image/MOMO-0987654321-compact2.jpg');
  console.log('VietQR Image status for MOMO:', imgRes.status);
}
test();
