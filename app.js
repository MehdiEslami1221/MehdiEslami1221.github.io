'use strict';
const $ = selector => document.querySelector(selector);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
function motionLabel() {
  const button = $('#motion');
  button.textContent = paused ? 'Play background ◌' : 'Pause background ◌';
  button.setAttribute('aria-pressed', String(paused));
}
motionLabel();

const form = $('#project-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const contact = String(data.get('contact')).trim();
  const details = String(data.get('details')).trim();
  if (!name || !contact || details.length < 10) {
    $('#handoff').hidden = false;
    $('#form-status').textContent = 'Please enter your name, contact details and at least 10 characters about the project.';
    return;
  }
  const brief = ['Project inquiry from mehdieslami.ir', `Name: ${name}`, `Contact: ${contact}`,
    `Project: ${form.elements.type.selectedOptions[0].textContent}`, '', details].join('\n');
  const channel = event.submitter?.value || 'telegram';
  const url = channel === 'email'
    ? `mailto:P30lod@gmail.com?subject=${encodeURIComponent('Project inquiry — ' + name)}&body=${encodeURIComponent(brief)}`
    : `https://t.me/Mr_MehdiEslami?text=${encodeURIComponent(brief)}`;
  $('#brief').value = brief;
  $('#handoff-link').href = url;
  $('#handoff').hidden = false;
  $('#form-status').textContent = 'Your brief is ready. Press send in Telegram or your email app to finish. If the app did not open, use the link below or copy the text.';
  if (channel === 'email') window.location.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
});
$('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#brief').value);
    $('#form-status').textContent = 'Copied. Paste the brief into your message or email.';
  } catch {
    $('#brief').focus();
    $('#brief').select();
    $('#form-status').textContent = 'Text selected. Use your device’s copy command.';
  }
});

// Source links stay with each quotation. Rotation never repeats the current entry.
const quotes = [
  {text: 'Simplicity does not precede complexity, but follows it.', author: 'Alan Perlis', source: 'https://www.cs.yale.edu/homes/perlis-alan/quotes.html'},
  {text: 'The tools we use have a profound (and devious!) influence on our thinking habits, and, therefore, on our thinking abilities.', author: 'Edsger W. Dijkstra', source: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html'},
  {text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth', source: 'https://web.stanford.edu/class/archive/cs/cs107/cs107.1224/lectures/16/16-Optimization.html'}
];
let quoteIndex = 0;
let quotePaused = reduced.matches;
let quoteVisible = false;
let quoteTimer = 0;
let quoteHovered = false;
let quoteFocused = false;
const quoteSection = $('.quote-section');
function quoteLabel() {
  $('#quote-pause').textContent = quotePaused ? 'Resume rotation' : 'Pause rotation';
  $('#quote-pause').setAttribute('aria-pressed', String(quotePaused));
}
function scheduleQuote() {
  clearTimeout(quoteTimer);
  if (quotePaused || !quoteVisible || document.hidden || quoteHovered || quoteFocused) return;
  quoteTimer = setTimeout(() => { nextQuote(); }, 14000);
}
function nextQuote() {
  quoteIndex = (quoteIndex + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length;
  const quote = quotes[quoteIndex];
  $('#quote-text').textContent = quote.text;
  $('#quote-author').textContent = quote.author;
  $('#quote-source').href = quote.source;
  $('#quote-index').textContent = `${String(quoteIndex + 1).padStart(2,'0')} / 03`;
  const body = $('.quote-body');
  body.classList.remove('changing');
  // Restart only the short transition; keep the quote area height stable.
  void body.offsetWidth;
  body.classList.add('changing');
  scheduleQuote();
}
$('#quote-next').addEventListener('click', nextQuote);
$('#quote-pause').addEventListener('click', () => { quotePaused = !quotePaused; quoteLabel(); scheduleQuote(); });
quoteSection.addEventListener('mouseenter', () => { quoteHovered = true; scheduleQuote(); });
quoteSection.addEventListener('mouseleave', () => { quoteHovered = false; scheduleQuote(); });
quoteSection.addEventListener('focusin', () => { quoteFocused = true; scheduleQuote(); });
quoteSection.addEventListener('focusout', event => { quoteFocused = quoteSection.contains(event.relatedTarget); scheduleQuote(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => { quoteVisible = entries[0].isIntersecting; scheduleQuote(); }, {threshold:.2}).observe(quoteSection);
} else { quoteVisible = true; scheduleQuote(); }
quoteLabel();

// A circuit field with traveling packets and gentle pointer response.
// Cap pixel density, connections and frame rate; stop all timers when the tab is hidden.
const canvas = $('#network');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, nodes = [], paths = [], raf = 0, last = 0, time = 0;
const pointer = {x:-1000, y:-1000};
const tokens = ['{ }', '</>', '01', '=>', 'API', 'λ'];
function resize() {
  if (!ctx) return;
  const bounds = canvas.parentElement.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  const density = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.25 : 1.5);
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  ctx.setTransform(density, 0, 0, density, 0, 0);
  const count = width < 700 ? 23 : 46;
  nodes = Array.from({length:count}, (_,i) => ({x:Math.random()*width, y:Math.random()*height, r:i%7===0?2:1, phase:Math.random()*6.28}));
  paths = [];
  nodes.forEach((node,i) => {
    const nearest = nodes.map((n,j) => ({j,d:Math.hypot(n.x-node.x,n.y-node.y)}))
      .filter(n=>n.j>i && n.d<Math.max(180,width*.18)).sort((a,b)=>a.d-b.d).slice(0,2);
    nearest.forEach(n=>paths.push({a:i,b:n.j,phase:Math.random(),speed:.035+Math.random()*.035}));
  });
  draw();
}
function draw() {
  if (!ctx) return;
  ctx.clearRect(0,0,width,height);
  ctx.lineWidth=.7;
  paths.forEach((path,i) => {
    const a=nodes[path.a],b=nodes[path.b];
    const distance=Math.hypot((a.x+b.x)/2-pointer.x,(a.y+b.y)/2-pointer.y);
    const active=Math.max(0,1-distance/240);
    ctx.strokeStyle=`rgba(151,202,100,${.075+active*.14})`;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    if (i%2===0) {
      const lengthX=Math.abs(b.x-a.x),lengthY=Math.abs(b.y-a.y),length=lengthX+lengthY;
      const progress=((time*path.speed+path.phase)%1)*length;
      const x=progress<lengthX?a.x+Math.sign(b.x-a.x)*progress:b.x;
      const y=progress<lengthX?a.y:a.y+Math.sign(b.y-a.y)*(progress-lengthX);
      ctx.fillStyle=`rgba(189,243,106,${.35+active*.25})`;
      ctx.fillRect(x-1.5,y-1.5,3,3);
    }
  });
  nodes.forEach((node,i) => {
    const glow=.2+(Math.sin(time*.65+node.phase)+1)*.08;
    ctx.fillStyle=`rgba(172,222,116,${glow})`;
    ctx.beginPath();ctx.arc(node.x,node.y,node.r,0,Math.PI*2);ctx.fill();
    if(i%7===0){ctx.font='10px monospace';ctx.fillStyle='rgba(166,203,126,.18)';ctx.fillText(tokens[Math.floor(i/7)%tokens.length],node.x+9,node.y-8);}
  });
}
function frame(timestamp) {
  raf=0;
  if(paused || document.hidden || !ctx) return;
  const interval=width<700?1000/24:1000/30;
  if(timestamp-last>=interval){time+=Math.min((timestamp-last)/1000,.1);draw();last=timestamp;}
  raf=requestAnimationFrame(frame);
}
function start(){if(!raf && !paused && !document.hidden && ctx){last=performance.now();raf=requestAnimationFrame(frame);}}
function stop(){cancelAnimationFrame(raf);raf=0;}
$('#motion').addEventListener('click',()=>{paused=!paused;motionLabel();paused?stop():start();});
window.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){pointer.x=event.clientX;pointer.y=event.clientY;}},{passive:true});
document.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;});
document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();scheduleQuote();});
reduced.addEventListener('change',event=>{paused=event.matches;quotePaused=event.matches;motionLabel();quoteLabel();scheduleQuote();paused?stop():start();});
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,120);},{passive:true});
resize();start();
