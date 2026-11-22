import {cleanName,profileStyles,projectModules,projectBrief,projectMapSvg,requestScenarios,signaturePoints,nameSeed} from './studio-core.mjs?v=20261122-studio1';
const $=s=>document.querySelector(s), lang=document.documentElement.lang, t=(en,fa)=>lang==='fa'?fa:en;
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const status=(id,text)=>{const node=$(id);if(node)node.textContent=text;};
function download(blob,name){const url=URL.createObjectURL(blob),link=el('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
async function copy(value,button,target){
 try{await navigator.clipboard.writeText(value);status(target,t('Copied. Ready to paste.','کپی شد؛ می‌توانید متن را جای‌گذاری کنید.'));const old=button.textContent;button.textContent=t('Copied','کپی شد');setTimeout(()=>button.textContent=old,1600);}
 catch{const field=el('textarea','copy-fallback');field.value=value;field.readOnly=true;field.setAttribute('aria-label',t('Select and copy this text','متن را انتخاب و کپی کنید'));button.after(field);field.focus();field.select();status(target,t('Automatic copy is unavailable. The text is selected; use your device’s Copy command.','کپی خودکار در دسترس نیست. متن انتخاب شده است؛ از گزینهٔ کپی دستگاه استفاده کنید.'));field.addEventListener('blur',()=>field.remove(),{once:true});}
}
// Preserve unfinished input across the ordinary language links only.
try{const saved=JSON.parse(sessionStorage.getItem('studio-draft')||'null');sessionStorage.removeItem('studio-draft');if(saved&&saved.path===location.pathname.replace(/^\/fa(?=\/)/,'')){
 for(const id of ['profile-name','signature-name','request-scenario'])if($('#'+id)&&typeof saved[id]==='string')$('#'+id).value=saved[id];
 if(Array.isArray(saved.modules))document.querySelectorAll('.module-options input').forEach(n=>n.checked=saved.modules.includes(n.value));
}}catch{}
$('.service-switch')?.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const saved={path:location.pathname.replace(/^\/fa(?=\/)/,''),modules:[...document.querySelectorAll('.module-options input:checked')].map(n=>n.value)};for(const id of ['profile-name','signature-name','request-scenario'])if($('#'+id))saved[id]=$('#'+id).value;try{sessionStorage.setItem('studio-draft',JSON.stringify(saved));}catch{}if(location.hash)event.currentTarget.hash=location.hash;});

if($('#profile-name')){
 const render=()=>{const value=cleanName($('#profile-name').value),results=$('#profile-results');results.replaceChildren();
  if(!value){status('#profile-status',t('Write a name to see the styles.','برای دیدن طرح‌ها، نامی بنویسید.'));return;}
  status('#profile-status',t('Choose a style and copy it.','طرح دلخواه را انتخاب و کپی کنید.'));
  for(const style of profileStyles(value)){const card=el('article','profile-result'),heading=el('h2','',style[lang]),pre=el('pre',style.id==='ascii'?'ascii-preview':'',style.text);pre.dir=style.id==='ascii'?'ltr':'auto';pre.tabIndex=0;pre.setAttribute('aria-label',style[lang]);const button=el('button','button secondary',t('Copy text','کپی متن'));button.type='button';button.setAttribute('aria-label',t('Copy '+style.en,'کپی طرح '+style.fa));button.addEventListener('click',()=>copy(style.text,button,'#profile-status'));card.append(heading,pre,button);results.append(card);}
 };
 $('#profile-name').addEventListener('input',render);render();
}

if($('#skill-map')){
 const data={java:[{id:'videofetch',name:'VideoFetch',stack:'Spring Boot · REST API'}],next:[{id:'dearlater',name:'DearLater',stack:'Next.js · TypeScript'},{id:'didgah',name:'Didgah',stack:'Next.js'},{id:'yadban',name:'Yadban',stack:'Next.js'},{id:'videofetch',name:'VideoFetch',stack:'Next.js'}],sqlite:[{id:'dearlater',name:'DearLater',stack:'SQLite'},{id:'didgah',name:'Didgah',stack:'SQLite'}]};
 const render=skill=>{const map=$('#skill-map');map.replaceChildren();const hub=el('div','skill-hub',skill==='java'?'Java / Spring Boot':skill==='next'?'Next.js / TypeScript':'SQLite');hub.dir='ltr';map.append(hub);const links=el('div','skill-connections');for(const p of data[skill]){const a=el('a','skill-project');a.href=(lang==='fa'?'/fa/':'/')+'#project-'+p.id;const name=el('strong','',p.name),stack=el('span','muted',p.stack);a.append(name,stack);links.append(a);}map.append(links);document.querySelectorAll('[data-skill]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.skill===skill)));};
 document.querySelectorAll('[data-skill]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.skill)));render('java');
}

if($('#bug-board')){
 let round=0,target=0,started=0,penalty=0,running=false;
 let best;try{best=Number(localStorage.getItem('portfolio-circuit-best'));}catch{}
 if(best>0)$('#bug-best').textContent=t('Personal best: ','رکورد شخصی: ')+best.toFixed(1)+t('s',' ثانیه');
 function board(){target=Math.floor(Math.random()*9);$('#bug-board').replaceChildren();for(let i=0;i<9;i++){const button=el('button','circuit-node'+(i===target?' broken':''));button.type='button';button.append(el('span','node-number',i===0?'IN':i===8?'OUT':String(i+1)),el('span','wire'));button.setAttribute('aria-label',t(`Node ${i+1}${i===target?', connection gap':''}`,`گرهٔ ${i+1}${i===target?'، اتصال قطع‌شده':''}`));button.addEventListener('click',()=>{if(!running)return;if(i!==target){penalty+=3;status('#bug-status',t('That connection works. +3 seconds.','این اتصال سالم است؛ ۳ ثانیه اضافه شد.'));return;}round++;if(round===3){running=false;const time=(performance.now()-started)/1000+penalty;document.querySelectorAll('.circuit-node').forEach(n=>{n.disabled=true;n.classList.remove('broken');});if(!best||time<best){best=time;try{localStorage.setItem('portfolio-circuit-best',String(best));}catch{}$('#bug-best').textContent=t('Personal best: ','رکورد شخصی: ')+best.toFixed(1)+t('s',' ثانیه');}const mark=el('img','circuit-complete-mark');mark.src='/assets/logo.svg';mark.width=100;mark.height=74;mark.alt='ME';$('#bug-board').append(mark);status('#bug-status',t('Circuit complete! Your time: ','مدار کامل شد! زمان شما: ')+time.toFixed(1)+t('s.',' ثانیه.'));$('#bug-start').focus();}else{status('#bug-status',t('Repaired. Round ','تعمیر شد. مرحلهٔ ')+(round+1)+'/3');board();$('#bug-board button').focus();}});$('#bug-board').append(button);}}
 $('#bug-start').addEventListener('click',()=>{round=0;penalty=0;started=performance.now();running=true;status('#bug-status',t('Round 1/3. Find the gap.','مرحلهٔ ۱ از ۳؛ اتصال قطع‌شده را پیدا کنید.'));board();$('#bug-board button').focus();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){running=false;document.querySelectorAll('.circuit-node').forEach(n=>n.disabled=true);status('#bug-status',t('Round stopped while you were away. Start again when ready.','بازی هنگام خروج از صفحه متوقف شد. برای ادامه، دوباره شروع کنید.'));}});
}

if($('#builder-map')){
 const selected=()=>[...document.querySelectorAll('.module-options input:checked')].map(n=>n.value);
 const render=()=>{const ids=selected(),map=$('#builder-map');map.replaceChildren();const route=el('div','architecture-route');for(const name of [t('People','کاربران'),t('Web / mobile interface','رابط وب یا موبایل'),t('Application API','API برنامه'),t('Database','پایگاه داده')])route.append(el('span','architecture-node',name));map.append(route);const modules=el('div','architecture-modules');for(const m of projectModules.filter(m=>ids.includes(m.id)))modules.append(el('span','architecture-node',m[lang]));if(!ids.length)modules.append(el('span','muted',t('Select a feature to extend the map.','برای تکمیل نقشه، یک قابلیت انتخاب کنید.')));map.append(modules);$('#builder-brief').value=projectBrief(ids,lang);status('#brief-status','');};
 document.querySelectorAll('.module-options input').forEach(n=>n.addEventListener('change',render));$('#brief-copy').addEventListener('click',event=>copy($('#builder-brief').value,event.currentTarget,'#brief-status'));$('#map-download').addEventListener('click',()=>download(new Blob([projectMapSvg(selected(),lang)],{type:'image/svg+xml;charset=utf-8'}),'project-map.svg'));$('#brief-download').addEventListener('click',()=>download(new Blob(['\ufeff'+$('#builder-brief').value],{type:'text/plain;charset=utf-8'}),'project-brief.txt'));render();
}

if($('#request-route')){
 let step=-1;
 function reset(){step=-1;$('#request-log').replaceChildren();$('#request-next').disabled=true;document.querySelectorAll('#request-route span').forEach(n=>n.className='');}
 function next(){step++;const scenario=requestScenarios[$('#request-scenario').value] || requestScenarios.normal;if(step>=scenario[lang].length)return;$('#request-log').append(el('li','',scenario[lang][step]));const mode=$('#request-scenario').value;const reached=mode==='offline'?[0,-1,-1,0]:mode==='invalid'?[0,1,-1,3]:mode==='slow'?[0,1,1,3]:[0,1,2,3];document.querySelectorAll('#request-route span').forEach((n,i)=>{n.classList.toggle('active',i===reached[step]);n.classList.toggle('skipped',i===2&&reached[step]===-1);});$('#request-next').disabled=step===3;}
 $('#request-run').addEventListener('click',()=>{reset();$('#request-next').disabled=false;next();});$('#request-next').addEventListener('click',next);$('#request-reset').addEventListener('click',reset);$('#request-scenario').addEventListener('change',reset);
}

if($('#signature-canvas')){
 const canvas=$('#signature-canvas'),ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let points=[],name='',paused=reduced.matches,visible=false,raf=0,clock=0,phase=0,pointer=null;
 try{paused ||= localStorage.getItem('portfolio-motion')==='paused';}catch{}
 function draw(time=0){if(!ctx)return;ctx.clearRect(0,0,1200,750);ctx.fillStyle='#080a09';ctx.fillRect(0,0,1200,750);const glow=ctx.createRadialGradient(600,310,10,600,310,580);glow.addColorStop(0,'#243d203d');glow.addColorStop(1,'#080a0900');ctx.fillStyle=glow;ctx.fillRect(0,0,1200,750);
  const positions=points.map(p=>{let x=p.x*1200+Math.sin(time+p.phase)*8,y=p.y*750+Math.cos(time*.6+p.phase)*8;if(pointer){const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);if(d<160&&d>0){x+=dx/d*12;y+=dy/d*12;}}return{x,y};});
  ctx.lineWidth=1.1;for(let i=0;i<positions.length;i++){const a=positions[i];for(let j=i+1;j<positions.length;j++){const b=positions[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<155){ctx.strokeStyle=`rgba(188,243,106,${(.4*(1-d/155)).toFixed(3)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo((a.x+b.x)/2,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}ctx.fillStyle=i%5===0?'#83d4cc':'#bcf36a';ctx.beginPath();ctx.arc(a.x,a.y,i%5===0?3:2,0,Math.PI*2);ctx.fill();}
  ctx.direction=/[\u0600-\u06ff]/.test(name)?'rtl':'ltr';ctx.textAlign='center';ctx.fillStyle='#edf3e9';let size=96;do{ctx.font=`700 ${size}px IRANSansX, Vazir, Arial, sans-serif`;if(ctx.measureText(name).width<1040)break;size-=4;}while(size>28);ctx.fillText(name||t('Your name','نام شما'),600,590);ctx.font='20px Arial, sans-serif';ctx.fillStyle='#a8b89e';ctx.direction='ltr';ctx.fillText('ME · mehdieslami.ir',600,688);ctx.font='16px monospace';ctx.textAlign='left';ctx.fillText('#'+nameSeed(name).toString(16).padStart(8,'0').toUpperCase(),80,80);
 }
 function loop(stamp){raf=0;if(paused||!visible||document.hidden)return;if(stamp-clock>1000/24){phase+=.025;draw(phase);clock=stamp;}raf=requestAnimationFrame(loop);}
 function sync(){cancelAnimationFrame(raf);raf=0;$('#signature-motion').setAttribute('aria-pressed',String(paused));$('#signature-motion').textContent=paused?t('Resume motion','ادامهٔ حرکت'):t('Pause motion','توقف حرکت');if(!paused&&visible&&!document.hidden)raf=requestAnimationFrame(loop);else draw(phase);}
 function render(){name=cleanName($('#signature-name').value);points=signaturePoints(name);phase=0;draw();status('#signature-status','');}
 $('#signature-name').addEventListener('input',render);$('#signature-motion').addEventListener('click',()=>{paused=!paused;sync();});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',event=>{if(event.matches){paused=true;sync();}});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});observer.observe(canvas);
 canvas.addEventListener('pointermove',event=>{const rect=canvas.getBoundingClientRect();pointer={x:(event.clientX-rect.left)*1200/rect.width,y:(event.clientY-rect.top)*750/rect.height};if(paused)draw(phase);});canvas.addEventListener('pointerleave',()=>{pointer=null;if(paused)draw(phase);});
 $('#signature-save').addEventListener('click',()=>{if(!name){status('#signature-status',t('Write a name first.','ابتدا نامی بنویسید.'));return;}draw(phase);canvas.toBlob(blob=>{if(blob){download(blob,'light-signature.png');status('#signature-status',t('Your image is ready.','تصویر شما آماده شد.'));}else status('#signature-status',t('The image could not be saved. Please try again.','ذخیرهٔ تصویر انجام نشد؛ دوباره تلاش کنید.'));},'image/png');});
 render();document.fonts.ready.then(()=>draw(phase));sync();
}
