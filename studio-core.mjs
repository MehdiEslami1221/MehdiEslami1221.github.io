export const cleanName = (value, limit = 40) => Array.from(String(value).normalize('NFC').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim()).slice(0, limit).join('');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function alphabetStyle(text, upper, lower, digit) {
  return Array.from(text, c => {
    const i = alphabet.indexOf(c);
    return i < 0 ? c : String.fromCodePoint(i < 26 ? upper + i : i < 52 ? lower + i - 26 : digit + i - 52);
  }).join('');
}
const glyphs = {
 A:'01110/10001/11111/10001/10001',B:'11110/10001/11110/10001/11110',C:'01111/10000/10000/10000/01111',D:'11110/10001/10001/10001/11110',E:'11111/10000/11110/10000/11111',F:'11111/10000/11110/10000/10000',G:'01111/10000/10111/10001/01111',H:'10001/10001/11111/10001/10001',I:'11111/00100/00100/00100/11111',J:'00111/00010/00010/10010/01100',K:'10001/10010/11100/10010/10001',L:'10000/10000/10000/10000/11111',M:'10001/11011/10101/10001/10001',N:'10001/11001/10101/10011/10001',O:'01110/10001/10001/10001/01110',P:'11110/10001/11110/10000/10000',Q:'01110/10001/10101/10010/01101',R:'11110/10001/11110/10010/10001',S:'01111/10000/01110/00001/11110',T:'11111/00100/00100/00100/00100',U:'10001/10001/10001/10001/01110',V:'10001/10001/10001/01010/00100',W:'10001/10001/10101/11011/10001',X:'10001/01010/00100/01010/10001',Y:'10001/01010/00100/00100/00100',Z:'11111/00010/00100/01000/11111',
 '0':'01110/10011/10101/11001/01110','1':'00100/01100/00100/00100/01110','2':'01110/10001/00010/00100/11111','3':'11110/00001/01110/00001/11110','4':'10010/10010/11111/00010/00010','5':'11111/10000/11110/00001/11110','6':'01110/10000/11110/10001/01110','7':'11111/00010/00100/01000/01000','8':'01110/10001/01110/10001/01110','9':'01110/10001/01111/00001/01110',' ':'00000/00000/00000/00000/00000','-':'00000/00000/11111/00000/00000','.':'00000/00000/00000/00000/00100','_':'00000/00000/00000/00000/11111'
};
export function asciiName(value) {
  const text = cleanName(value).toUpperCase();
  if (!text || !/^[A-Z0-9 ._-]+$/.test(text)) return null;
  const chunks = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (word.length > 10) {
      if (line) chunks.push(line);
      chunks.push(...word.match(/.{1,10}/g));
      line = '';
    } else if (line && line.length + word.length + 1 > 10) {
      chunks.push(line); line = word;
    } else line += (line ? ' ' : '') + word;
  }
  if (line) chunks.push(line);
  return chunks.map(chunk => Array.from({length:5}, (_, row) => Array.from(chunk, c => glyphs[c].split('/')[row].replaceAll('1','#').replaceAll('0',' ')).join(' ')).join('\n')).join('\n\n');
}
export function profileStyles(value) {
  const text = cleanName(value);
  if (!text) return [];
  const result = [
    {id:'plain', en:'Original',fa:'ساده',text},
    {id:'spark', en:'Starlight',fa:'ستاره‌ای',text:`✦ ${text} ✦`},
    {id:'frame', en:'Corner frame',fa:'قاب گوشه‌دار',text:`╭── ✧ ──╮\n${text}\n╰── ✧ ──╯`},
    {id:'bracket',en:'Minimal',fa:'مینیمال',text:`「 ${text} 」`},
    {id:'orbit',en:'Orbit',fa:'مداری',text:`⟡ ── ${text} ── ⟡`},
    {id:'code',en:'Code',fa:'کدنویسی',text:`{ ${text} }`},
    {id:'pearl',en:'Dots',fa:'نقطه‌ای',text:`• ${text} •`},
    {id:'petal',en:'Blossom',fa:'شکوفه',text:`❀ ${text} ❀`},
    {id:'wing',en:'Ornament',fa:'نقش‌دار',text:`༺ ${text} ༻`},
    {id:'line',en:'Fine lines',fa:'خطوط ظریف',text:`── ${text} ──`},
  ];
  if (/[A-Za-z0-9]/.test(text)) {
    result.push({id:'bold',en:'Bold',fa:'حروف ضخیم',text:alphabetStyle(text,0x1d400,0x1d41a,0x1d7ce)});
    result.push({id:'mono',en:'Monospace',fa:'حروف ماشینی',text:alphabetStyle(text,0x1d670,0x1d68a,0x1d7f6)});
    result.push({id:'wide',en:'Full width',fa:'حروف پهن',text:alphabetStyle(text,0xff21,0xff41,0xff10)});
  }
  const ascii=asciiName(text);
  if (ascii) result.push({id:'ascii',en:'ASCII lettering',fa:'حروف ASCII',text:ascii});
  return result;
}
export const projectModules = [
 {id:'auth',en:'User accounts',fa:'حساب کاربران'}, {id:'dashboard',en:'Admin dashboard',fa:'پنل مدیریت'},
 {id:'payment',en:'Payments',fa:'پرداخت'}, {id:'notify',en:'Notifications',fa:'اعلان‌ها'},
 {id:'report',en:'Reports',fa:'گزارش‌ها'}, {id:'files',en:'File uploads',fa:'بارگذاری فایل'}
];
export function projectBrief(ids, lang='en') {
  const selected=projectModules.filter(m=>new Set(ids).has(m.id));
  return (lang==='fa'?'امکانات پیشنهادی پروژه:\n':'Proposed project features:\n')+selected.map(m=>'• '+m[lang]).join('\n');
}
export function projectMapSvg(ids,lang='en') {
  const selected=projectModules.filter(m=>ids.includes(m.id));
  const labels=lang==='fa'?['کاربران','رابط وب یا موبایل','API برنامه','پایگاه داده']:['People','Web / mobile','Application API','Database'];
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const box=(label,x,y,width=160)=>`<rect x="${x}" y="${y}" width="${width}" height="62" rx="10" fill="#102015" stroke="#bcf36a" stroke-opacity=".65"/><text x="${x+width/2}" y="${y+37}" fill="#edf3e9" text-anchor="middle" font-family="Arial,sans-serif" font-size="15">${escape(label)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="440" viewBox="0 0 800 440"><title>${lang==='fa'?'نقشهٔ اولیهٔ پروژه':'Initial project map'}</title><rect width="800" height="440" fill="#080a09"/><path d="M100 111H700" fill="none" stroke="#bcf36a" stroke-opacity=".5"/>${labels.map((l,i)=>box(l,25+i*197,80)).join('')}${selected.map((m,i)=>box(m[lang],40+(i%3)*250,205+Math.floor(i/3)*85,220)).join('')}<text x="400" y="410" fill="#9ba19b" text-anchor="middle" font-family="Arial,sans-serif" font-size="14">ME · mehdieslami.ir</text></svg>`;
}
export const requestScenarios = {
 normal:{code:200,en:['Browser sends a request.','API validates the input.','Database returns the sample record.','200 OK: the page receives a response.'],fa:['مرورگر درخواست را می‌فرستد.','API ورودی را بررسی می‌کند.','پایگاه داده رکورد نمونه را برمی‌گرداند.','پاسخ موفق ۲۰۰ به صفحه می‌رسد.']},
 invalid:{code:400,en:['Browser sends incomplete data.','API finds a required field missing.','Database is not queried.','400: show a helpful validation message.'],fa:['مرورگر اطلاعات ناقص می‌فرستد.','API نبودِ یک فیلد ضروری را تشخیص می‌دهد.','درخواستی به پایگاه داده نمی‌رسد.','خطای ۴۰۰: پیام راهنما نمایش داده می‌شود.']},
 offline:{code:0,en:['Browser tries to send a request.','The connection is unavailable.','The server receives nothing.','Offer retry and preserve the input.'],fa:['مرورگر تلاش می‌کند درخواست را بفرستد.','ارتباط شبکه برقرار نیست.','درخواستی به سرور نمی‌رسد.','امکان تلاش دوباره و حفظ ورودی فراهم می‌شود.']},
 slow:{code:200,en:['Browser starts a request.','The response takes longer than usual.','Keep the page responsive while waiting.','200 OK: replace the waiting state with the result.'],fa:['مرورگر درخواست را آغاز می‌کند.','دریافت پاسخ بیش از معمول طول می‌کشد.','صفحه هنگام انتظار همچنان قابل استفاده می‌ماند.','پاسخ ۲۰۰: نتیجه جایگزین حالت انتظار می‌شود.']}
};
export function nameSeed(value) { let seed=2166136261; for (const c of cleanName(value)) seed=Math.imul(seed^c.codePointAt(0),16777619);return seed>>>0; }
export function signaturePoints(value,count=44) {
  let seed=nameSeed(value);const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  return Array.from({length:Math.min(64,Math.max(8,count))},()=>({x:.08+random()*.84,y:.12+random()*.56,phase:random()*Math.PI*2}));
}
