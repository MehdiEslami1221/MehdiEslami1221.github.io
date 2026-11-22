import { arabicForms } from './profile-data.mjs';

export const categories = [
  ['all','All styles','همهٔ سبک‌ها'], ['letters','Lettering','حروف فانتزی'],
  ['persian','Persian','سبک‌های فارسی'], ['frames','Frames','قاب‌ها'],
  ['symbols','Symbols & effects','نماد و افکت'], ['emoji','Emoji','ایموجی'],
  ['ascii','ASCII','اسکی'], ['saved','Favorites','نشان‌شده‌ها'],
];
export const cleanName = (value, limit = 80) => Array.from(String(value).normalize('NFC')
  .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g,'').trim()).slice(0,limit).join('');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function mathAlphabet(text, upper, lower, digits, exceptions={}) {
  return Array.from(text,c=>{
    if(exceptions[c])return exceptions[c];
    const i=letters.indexOf(c);
    return i<0?c:i<26?String.fromCodePoint(upper+i):i<52?String.fromCodePoint(lower+i-26):digits?String.fromCodePoint(digits+i-52):c;
  }).join('');
}
const alphabets = [
 ['bold','Serif bold','سریف ضخیم',0x1d400,0x1d41a,0x1d7ce],
 ['italic','Serif italic','سریف ایتالیک',0x1d434,0x1d44e,0,{h:'ℎ'}],
 ['bold-italic','Bold italic','ضخیم ایتالیک',0x1d468,0x1d482,0],
 ['script','Calligraphic','خوشنویسی لاتین',0x1d49c,0x1d4b6,0,{B:'ℬ',E:'ℰ',F:'ℱ',H:'ℋ',I:'ℐ',L:'ℒ',M:'ℳ',R:'ℛ',e:'ℯ',g:'ℊ',o:'ℴ'}],
 ['bold-script','Bold calligraphic','خوشنویسی ضخیم',0x1d4d0,0x1d4ea,0],
 ['fraktur','Gothic','گوتیک',0x1d504,0x1d51e,0,{C:'ℭ',H:'ℌ',I:'ℑ',R:'ℜ',Z:'ℨ'}],
 ['bold-fraktur','Gothic bold','گوتیک ضخیم',0x1d56c,0x1d586,0],
 ['double','Double-struck','توخالی',0x1d538,0x1d552,0x1d7d8,{C:'ℂ',H:'ℍ',N:'ℕ',P:'ℙ',Q:'ℚ',R:'ℝ',Z:'ℤ'}],
 ['sans','Sans serif','سنس ساده',0x1d5a0,0x1d5ba,0x1d7e2],
 ['sans-bold','Sans bold','سنس ضخیم',0x1d5d4,0x1d5ee,0x1d7ec],
 ['sans-italic','Sans italic','سنس ایتالیک',0x1d608,0x1d622,0],
 ['sans-bold-italic','Sans bold italic','سنس ضخیم ایتالیک',0x1d63c,0x1d656,0],
 ['mono','Monospace','ماشینی',0x1d670,0x1d68a,0x1d7f6],
 ['wide','Full width','حروف پهن',0xff21,0xff41,0xff10],
];
function mapLatin(text, mapping) {
  const chars=Array.from(mapping);
  return Array.from(text,c=>{const i='abcdefghijklmnopqrstuvwxyz'.indexOf(c.toLowerCase());return i<0?c:chars[i];}).join('');
}
const latinMaps = [
 ['small','Small capitals','حروف کوچک‌نما','ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'],
 ['super','Superscript','بالانویس','ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ'],
 ['soft','Soft curves','منحنی نرم','αႦƈԃҽϝɠԋιʝƙʅɱɳσρϙɾʂƚυʋɯxყȥ'],
 ['rune','Angular','زاویه‌دار','卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙'],
 ['thai','Flowing','روان','ค๒ς๔єŦﻮђเןкɭ๓ภ๏קợгรՇยשฬאץչ'],
 ['alternate','Alternate forms','فرم جایگزین','ąɓƈɗęƒɠɧıʝƙƖɱŋơƥզřşŧų۷ῳҳყʑ'],
];
const isMark=c=>/\p{M}/u.test(c);
const hasArabic=text=>/[\u0600-\u06ff]/u.test(text);
const joinInfo=c=>c==='ـ'?{initial:'ـ',medial:'ـ',final:'ـ',isolated:'ـ'}:arabicForms[c];
function neighbor(chars,index,step) {
  for(let i=index+step;i>=0&&i<chars.length;i+=step) {
    if(isMark(chars[i])||chars[i]==='\u200d')continue;
    return chars[i];
  }
  return '';
}
function joins(a,b) {const left=joinInfo(a),right=joinInfo(b);return !!(left?.initial&&right?.final);}
export function stretchPersian(text,amount=1) {
  const chars=Array.from(text),count=Math.max(0,Math.min(3,amount));
  return chars.map((c,i)=>c+(joins(c,neighbor(chars,i,1))?'ـ'.repeat(count):'')).join('');
}
export function shapePersian(text) {
  const chars=Array.from(text);
  return chars.map((c,i)=>{
    const forms=arabicForms[c];if(!forms)return c;
    const before=joins(neighbor(chars,i,-1),c),after=joins(c,neighbor(chars,i,1));
    return forms[before&&after?'medial':before?'final':after?'initial':'isolated']||c;
  }).join('');
}
function effect(text,mark) {
  return Array.from(text,c=>/[\p{L}\p{N}]/u.test(c)?c+mark:c).join('');
}
export const frames = [
 ['「 ',' 」'],['『 ',' 』'],['【 ',' 】'],['〖 ',' 〗'],['《 ',' 》'],['〈 ',' 〉'],['⟦ ',' ⟧'],['⌈ ',' ⌉'],
 ['✦ ',' ✦'],['✧ ',' ✧'],['⟡ ',' ⟡'],['⋆ ',' ⋆'],['☆ ',' ☆'],['★ ',' ★'],['✯ ',' ✯'],['✵ ',' ✵'],
 ['♡ ',' ♡'],['♥ ',' ♥'],['ღ ',' ღ'],['❥ ',' ❥'],['❀ ',' ❀'],['✿ ',' ✿'],['❁ ',' ❁'],['❃ ',' ❃'],
 ['♛ ',' ♛'],['♕ ',' ♕'],['☾ ',' ☽'],['☽ ',' ☾'],['༺ ',' ༻'],['꧁ ',' ꧂'],['༶ ',' ༶'],['ᯓ ',' 𐙚'],
 ['• ',' •'],['· ',' ·'],['∘ ',' ∘'],['⊹ ',' ⊹'],['⊱ ',' ⊰'],['⋆｡°✩ ',' ✩°｡⋆'],['✧･ﾟ ',' ･ﾟ✧'],['˚₊‧ ',' ‧₊˚'],
 ['── ',' ──'],['══ ',' ══'],['━✦ ',' ✦━'],['⟡ ── ',' ── ⟡'],['•° ',' °•'],['｡･:*:･ﾟ ',' ﾟ･:*:･｡'],
 ['{ ',' }'],['[ ',' ]'],['( ',' )'],['< ',' >'],['╭── ✧ ──╮\n','\n╰── ✧ ──╯'],['┌──────┐\n','\n└──────┘'],
 ['╔══════╗\n','\n╚══════╝'],['┏━━ ♡ ━━┓\n','\n┗━━ ♡ ━━┛'],['░ ',' ░'],['▒ ',' ▒'],['⋄ ⋅ ',' ⋅ ⋄'],['彡 ',' 彡'],
];
const emojis = ['🌙','✨','🌿','🦋','🪐','🌸','🌷','🌻','🍀','🕊️','🌊','🔥','⚡','💎','🖤','🤍','💜','🎀','🎧','🎵','🍓','🍒','☁️','❄️','🧿','👑'];
const effects = [
 ['under','Underline','زیرخط','\u0332'],['double-under','Double underline','زیرخط دوتایی','\u0333'],
 ['strike','Strike-through','خط‌خورده','\u0336'],['slash','Slashed','خط مورب','\u0338'],
 ['over','Overline','خط بالا','\u0305'],['dots','Dotted','نقطه‌دار','\u0307'],
 ['double-dots','Double dots','دو نقطه','\u0308'],['wave','Wavy','موج‌دار','\u0303'],
 ['ring','Small rings','حلقه‌دار','\u030a'],['acute','Acute accents','نشان بالا','\u0301'],
 ['low-dots','Dots below','نقطهٔ پایین','\u0323'],['low-ring','Rings below','حلقهٔ پایین','\u0325'],
 ['hook','Hooks above','نشان چرخان','\u0309'],['cross','Cross marks','نشان ضربدری','\u033d'],
 ['low-wave','Waves below','موج پایین','\u0330'],['glitch','Light glitch','گلیچ ملایم','\u0307\u0323'],
 ['glitch-bold','Deep glitch','گلیچ پررنگ','\u030d\u0308\u0324\u0330'],['double','Double accent','دو نشان','\u0302\u032e'],
];
export function profileStyles(value, variation=0) {
  const text=cleanName(value);if(!text)return [];
  variation=Math.abs(Math.trunc(Number(variation)||0))%1000;
  const result=[],seen=new Set();
  const add=(id,en,fa,category,output)=>{if(!output||seen.has(output))return;seen.add(output);result.push({id,en,fa,category,text:output});};
  add('plain','Original','ساده','letters',text);
  const latin=/[A-Za-z0-9]/.test(text),persian=hasArabic(text);
  if(latin) {
    for(const [id,en,fa,u,l,d,x] of alphabets)add(id,en,fa,'letters',mathAlphabet(text,u,l,d,x));
    for(const [id,en,fa,map] of latinMaps)add(id,en,fa,'letters',mapLatin(text,map));
    add('circled','Circled','دایره‌ای','letters',mathAlphabet(text,0x24b6,0x24d0,0,{'0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'}));
    for(const [id,en,fa,base] of [['square','Squared','مربعی',0x1f130],['dark-square','Dark squares','مربع تیره',0x1f170],['dark-circle','Dark circles','دایرهٔ تیره',0x1f150]])
      add(id,en,fa,'letters',Array.from(text,c=>/[A-Za-z]/.test(c)?String.fromCodePoint(base+c.toUpperCase().charCodeAt(0)-65):c).join(''));
    if(!persian) {
      add('upside','Upside down','وارونه','letters',Array.from(mapLatin(text,'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz')).reverse().join(''));
      add('spaced','Spaced letters','حروف فاصله‌دار','letters',Array.from(text,c=>c===' '?'   ':c+' ').join('').trim());
      add('keycaps','Keycap letters','دکمه‌ای','letters',effect(text,'\u20e3'));
      add('boxed-letters','Bracketed letters','قاب برای هر حرف','letters',Array.from(text,c=>/\s/.test(c)?c:`【${c}】`).join(''));
      add('soft-boxed','Fine letter frames','قاب ظریف حروف','letters',Array.from(text,c=>/\s/.test(c)?c:`『${c}』`).join(''));
    }
  }
  if(persian) {
    for(let n=1;n<=3;n++)add('fa-stretch-'+n,`Persian stretch ${n}`,['کشیدهٔ کوتاه','کشیدهٔ متوسط','کشیدهٔ بلند'][n-1],'persian',stretchPersian(text,n));
    add('fa-shaped','Persian classic forms','فرم کلاسیک فارسی','persian',shapePersian(text));
    for(const [id,en,fa,mark] of [['fatha','Fatha','فتحۀ تزئینی','َ'],['kasra','Kasra','کسرۀ تزئینی','ِ'],['damma','Damma','ضمۀ تزئینی','ُ'],['shadda','Shadda','تشدید تزئینی','ّ']]) {
      add('fa-'+id,en,fa,'persian',effect(text,mark));
      add('fa-long-'+id,en+' stretch',fa+' و کشیده','persian',effect(stretchPersian(text,1),mark));
    }
  }
  for(const [id,en,fa,mark] of effects)add('effect-'+id,en,fa,'symbols',effect(text,mark));
  frames.forEach(([left,right],i)=>add('frame-'+i,`Frame ${i+1}`,`قاب ${i+1}`,'frames',left+text+right));
  emojis.forEach((emoji,i)=>add('emoji-'+i,`Emoji ${i+1}`,`ایموجی ${i+1}`,'emoji',`${emoji} ${text} ${emoji}`));
  const bases=result.filter(s=>['letters','persian'].includes(s.category)&&s.id!=='plain');
  for(let i=0;i<24&&bases.length;i++) {
    const base=bases[(i+variation)%bases.length],frame=frames[(i*7+variation)%frames.length];
    add('mix-'+i,`Mix ${i+1}`,`ترکیب ${i+1}`,'symbols',frame[0]+base.text+frame[1]);
  }
  const ascii=asciiName(text);if(ascii)add('ascii','ASCII lettering','حروف اسکی','ascii',ascii);
  const featured = new Map(['plain','fraktur','bold-fraktur','script','bold-script','double','sans-bold','small','fa-stretch-1','fa-shaped','fa-stretch-2','frame-8','frame-18','emoji-1','frame-20','mono','frame-31','emoji-3','frame-50','mix-0','wide','circled'].map((id,i)=>[id,i]));
  return result.sort((a,b)=>(featured.get(a.id)??999)-(featured.get(b.id)??999));
}
export function customStyle(value,styleId,frameIndex=0,symbol='',variation=0) {
  const styles=profileStyles(value,variation),base=styles.find(s=>s.id===styleId)?.text||cleanName(value);
  if(!base)return '';
  const frame=frames[Math.max(0,Math.min(frames.length-1,Number(frameIndex)||0))];
  const decoration=cleanName(symbol,4);
  return frame[0]+(decoration?decoration+' ':'')+base+(decoration?' '+decoration:'')+frame[1];
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
