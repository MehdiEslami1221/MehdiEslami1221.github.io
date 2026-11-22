import {cleanName,profileStyles,customStyle} from './profile-core.mjs?v=20261122-profile2';

const $=selector=>document.querySelector(selector);
const lang=document.documentElement.lang;
const t=(en,fa)=>lang==='fa'?fa:en;
const format=n=>new Intl.NumberFormat(lang).format(n);
const make=(tag,className,text)=>{
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
};
let category='all',variation=0,limit=24,styles=[],matches=[],composing=false,pendingBase='';
let favorites=new Set();
try {
  const saved=JSON.parse(localStorage.getItem('profile-favorite-styles')||'[]');
  if(Array.isArray(saved))favorites=new Set(saved.filter(id=>typeof id==='string').slice(0,250));
} catch {}
try {
  const draft=JSON.parse(sessionStorage.getItem('profile-text-draft')||'null');
  sessionStorage.removeItem('profile-text-draft');
  if(draft&&typeof draft.name==='string') {
    $('#profile-name').value=draft.name.slice(0,160);
    $('#profile-search').value=typeof draft.search==='string'?draft.search.slice(0,100):'';
    const requested=String(draft.category).replace(/[^a-z]/g,'');
    if(document.querySelector(`[data-category="${requested}"]`))category=requested;
    pendingBase=typeof draft.base==='string'?draft.base:'';
    $('#profile-custom').open=draft.customOpen===true;
    variation=Math.abs(Math.trunc(Number(draft.variation)||0))%1000;
    $('#profile-size').value=String(Math.max(18,Math.min(36,Number(draft.size)||25)));
    $('#custom-symbol').value=typeof draft.symbol==='string'?draft.symbol.slice(0,8):'';
    $('#custom-frame').value=String(Math.max(0,Math.min(57,Number(draft.frame)||0)));
  }
} catch {}
$('.service-switch').addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  try {sessionStorage.setItem('profile-text-draft',JSON.stringify({name:$('#profile-name').value,search:$('#profile-search').value,category,variation,size:$('#profile-size').value,symbol:$('#custom-symbol').value,frame:$('#custom-frame').value,base:$('#custom-base').value,customOpen:$('#profile-custom').open}));}catch{}
});

function announce(text,target='#profile-status') {$(target).textContent=text;}
async function copy(value,button,target='#profile-status') {
  if(!value)return;
  try {
    await navigator.clipboard.writeText(value);
    announce(t('Copied. Ready to paste.','کپی شد؛ می‌توانید متن را جای‌گذاری کنید.'),target);
    const label=button.textContent;
    button.textContent=t('Copied','کپی شد');
    setTimeout(()=>button.textContent=label,1400);
  } catch {
    document.querySelectorAll('.profile-copy-fallback').forEach(n=>n.remove());
    const field=make('textarea','profile-copy-fallback');
    field.value=value;field.readOnly=true;
    field.setAttribute('aria-label',t('Selected text for manual copying','متن انتخاب‌شده برای کپی دستی'));
    button.after(field);field.focus();field.select();
    announce(t('Text selected. Use Copy on your device.','متن انتخاب شد؛ از گزینهٔ کپی دستگاه استفاده کنید.'),target);
    field.addEventListener('blur',()=>field.remove(),{once:true});
  }
}
function saveFavorites(){try{localStorage.setItem('profile-favorite-styles',JSON.stringify([...favorites]));}catch{}}
function favoriteLabel(button,style) {
  const selected=favorites.has(style.id);
  button.textContent=selected?'★':'☆';
  button.setAttribute('aria-pressed',String(selected));
  button.setAttribute('aria-label',t((selected?'Unsave ':'Save ')+style.en,(selected?'برداشتن نشانِ ':'نشان‌کردنِ ')+style.fa));
}
function renderCards() {
  const container=$('#profile-results');container.replaceChildren();
  const fragment=document.createDocumentFragment();
  for(const style of matches.slice(0,limit)) {
    const card=make('article','profile-result'+(style.category==='ascii'?' profile-ascii':''));
    const top=make('div','profile-result-top');
    const heading=make('h2','',style[lang]);
    const favorite=make('button','profile-favorite');favorite.type='button';favoriteLabel(favorite,style);
    favorite.addEventListener('click',()=>{
      if(favorites.has(style.id))favorites.delete(style.id);else favorites.add(style.id);
      saveFavorites();favoriteLabel(favorite,style);
      if(category==='saved')filterStyles();
    });
    top.append(heading,favorite);
    const preview=make('pre','',style.text);preview.dir=style.category==='ascii'?'ltr':'auto';preview.tabIndex=0;
    preview.setAttribute('aria-label',style[lang]);
    const button=make('button','button secondary',t('Copy text','کپی متن'));button.type='button';
    button.setAttribute('aria-label',t('Copy '+style.en,'کپی '+style.fa));
    button.addEventListener('click',()=>copy(style.text,button));
    card.append(top,preview,button);fragment.append(card);
  }
  container.append(fragment);
  if(!matches.length) {
    const text=!cleanName($('#profile-name').value)?t('Write a name to see the styles.','برای دیدن سبک‌ها، نامی بنویسید.'):
      category==='saved'?t('No saved styles for this text yet. Use the star on a style to keep it.','هنوز سبکی برای این متن نشان نشده است. با ستارهٔ کنار هر سبک آن را نگه دارید.'):
      category==='persian'?t('Enter Persian text to see Persian lettering.','برای دیدن سبک‌های فارسی، نام یا عبارت فارسی وارد کنید.'):
      category==='ascii'?t('ASCII lettering supports Latin letters, numbers, spaces, dots, underscores and hyphens.','متن اسکی از حروف لاتین، عدد، فاصله، نقطه، زیرخط و خط تیره پشتیبانی می‌کند.'):
      t('No styles match. Try another category or clear the search.','سبکی پیدا نشد؛ دسته را تغییر دهید یا عبارت جست‌وجو را پاک کنید.');
    container.append(make('p','profile-empty',text));
  }
  $('#profile-count').textContent=t(`${format(matches.length)} matching styles · ${format(styles.length)} total`,`${format(matches.length)} سبک در این دسته · ${format(styles.length)} سبک در مجموع`);
  $('#profile-more').hidden=matches.length<=limit;
  $('#profile-more').textContent=t('Show more styles','نمایش سبک‌های بیشتر')+' ('+format(Math.max(0,matches.length-limit))+')';
  $('#profile-copy-all').disabled=!matches.length;
  $('#profile-download').disabled=!matches.length;
}
function filterStyles() {
  const query=$('#profile-search').value.normalize('NFKC').toLocaleLowerCase().trim();
  matches=styles.filter(style=>(category==='all'||(category==='saved'?favorites.has(style.id):style.category===category))&&(!query||(style.en+' '+style.fa+' '+style.id).toLocaleLowerCase().includes(query)));
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  limit=24;renderCards();
}
function renderCustom() {
  const value=customStyle($('#profile-name').value,$('#custom-base').value,$('#custom-frame').value,$('#custom-symbol').value,variation);
  $('#custom-preview').textContent=value;
  $('#custom-copy').disabled=!value;
  announce('','#custom-status');
}
function render() {
  const name=cleanName($('#profile-name').value);
  styles=profileStyles(name,variation);
  $('#profile-length').textContent=format(Array.from(name).length)+'/'+format(80);
  announce('');
  const selected=pendingBase||$('#custom-base').value;pendingBase='';
  $('#custom-base').replaceChildren();
  for(const style of styles.filter(s=>['letters','persian'].includes(s.category))) {
    const option=make('option','',style[lang]);option.value=style.id;$('#custom-base').append(option);
  }
  if([...$('#custom-base').options].some(n=>n.value===selected))$('#custom-base').value=selected;
  filterStyles();renderCustom();
}
let inputTimer;
$('#profile-name').addEventListener('compositionstart',()=>composing=true);
$('#profile-name').addEventListener('compositionend',()=>{composing=false;clearTimeout(inputTimer);render();});
$('#profile-name').addEventListener('input',event=>{if(composing||event.isComposing)return;clearTimeout(inputTimer);inputTimer=setTimeout(render,90);});
$('#profile-search').addEventListener('input',filterStyles);
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;filterStyles();}));
$('#profile-more').addEventListener('click',()=>{const old=limit;limit+=24;renderCards();$('#profile-results').children[old]?.querySelector('.profile-favorite')?.focus({preventScroll:true});});
$('#profile-shuffle').addEventListener('click',()=>{variation=(variation+1)%1000;render();announce(t('New mixes are ready. Find them in Symbols & effects.','ترکیب‌های تازه آماده‌اند؛ آن‌ها را در دستهٔ نماد و افکت ببینید.'));});
$('#profile-copy-all').addEventListener('click',event=>copy(matches.map(s=>s.text).join('\n\n'),event.currentTarget));
$('#profile-download').addEventListener('click',()=>{
  if(!matches.length)return;
  const text=matches.map(s=>s[lang]+'\n'+s.text).join('\n\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));
  const link=make('a');link.href=url;link.download='profile-text-styles.txt';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
});
$('#profile-size').addEventListener('input',()=>$('#profile').style.setProperty('--profile-size',$('#profile-size').value+'px'));
for(const id of ['custom-base','custom-frame','custom-symbol'])$('#'+id).addEventListener('input',renderCustom);
$('#custom-copy').addEventListener('click',event=>copy($('#custom-preview').textContent,event.currentTarget,'#custom-status'));
$('#profile').style.setProperty('--profile-size',$('#profile-size').value+'px');
render();
