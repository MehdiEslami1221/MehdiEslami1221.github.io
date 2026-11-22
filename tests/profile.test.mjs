import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cleanName,profileStyles,stretchPersian,shapePersian,asciiName,customStyle,frames} from '../profile-core.mjs';

test('Latin names offer distinct Unicode families, ASCII and more than 140 unique results',()=>{
  const styles=profileStyles('mehdi eslami');
  assert.ok(styles.length>=140);
  assert.equal(new Set(styles.map(s=>s.text)).size,styles.length);
  assert.equal(new Set(styles.map(s=>s.id)).size,styles.length);
  const byId=Object.fromEntries(styles.map(s=>[s.id,s.text]));
  assert.equal(byId.fraktur,'𝔪𝔢𝔥𝔡𝔦 𝔢𝔰𝔩𝔞𝔪𝔦');
  assert.equal(byId['bold-fraktur'],'𝖒𝖊𝖍𝖉𝖎 𝖊𝖘𝖑𝖆𝖒𝖎');
  assert.equal(byId.double,'𝕞𝕖𝕙𝕕𝕚 𝕖𝕤𝕝𝕒𝕞𝕚');
  assert.equal(byId['bold-script'],'𝓶𝓮𝓱𝓭𝓲 𝓮𝓼𝓵𝓪𝓶𝓲');
  assert.match(byId.ascii,/^[# \n]+$/);
  assert.ok(!JSON.stringify(styles).includes('undefined'));
});
test('Persian lettering respects join boundaries, half-spaces, and distinct presentation forms',()=>{
  const styles=profileStyles('مهدی اسلامی');
  assert.ok(styles.length>=130);
  assert.equal(new Set(styles.map(s=>s.text)).size,styles.length);
  assert.equal(stretchPersian('مهدی اسلامی'),'مـهـدی اسـلـامـی');
  assert.equal(stretchPersian('علی‌رضا').replaceAll('ـ',''),'علی‌رضا');
  assert.ok(!stretchPersian('علی‌رضا').includes('یـ'));
  assert.equal(shapePersian('مهدی اسلامی').normalize('NFKC'),'مهدی اسلامی');
  assert.equal(shapePersian('علی‌رضا').normalize('NFKC'),'علی‌رضا');
  assert.equal(asciiName('مهدی'),null);
  assert.ok(styles.some(s=>s.category==='persian'));
  assert.ok(!styles.some(s=>s.category==='ascii'));
});
test('Unicode input is bounded, direction overrides removed and normal Persian joining retained',()=>{
  assert.equal(cleanName('  Mehdi\u202e\n Eslami  '),'Mehdi Eslami');
  assert.equal(Array.from(cleanName('🌟'.repeat(100))).length,80);
  assert.equal(cleanName('علی‌رضا'),'علی‌رضا');
  assert.deepEqual(profileStyles('   '),[]);
  assert.equal(cleanName('<img src=x>'),'<img src=x>');
  const all=profileStyles('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  assert.ok(!JSON.stringify(all).includes('undefined'));
  assert.ok(all.every(s=>s.text.length<3000));
});
test('Mixed names keep Persian text in Latin alphabet variants',()=>{
  const styles=profileStyles('مهدی Mehdi');
  assert.ok(styles.find(s=>s.id==='bold').text.startsWith('مهدی '));
  assert.ok(!styles.some(s=>s.id==='upside'));
});
test('Custom mixes and variation are deterministic, bounded and non-empty for valid input',()=>{
  assert.equal(customStyle('mehdi','double',8,'♡'),'✦ ♡ 𝕞𝕖𝕙𝕕𝕚 ♡ ✦');
  assert.equal(customStyle('','double',0),'');
  assert.equal(profileStyles('mehdi',-2).find(s=>s.id==='mix-0').text,profileStyles('mehdi',2).find(s=>s.id==='mix-0').text);
  assert.notEqual(profileStyles('mehdi',0).find(s=>s.id==='mix-0').text,profileStyles('mehdi',1).find(s=>s.id==='mix-0').text);
  assert.ok(customStyle('مهدی','unknown',-10,'🌟'.repeat(20)).length<100);
  assert.equal(frames.length,58);
});
test('ASCII wraps at word boundaries and rejects unsupported scripts',()=>{
  const ascii=asciiName('Mehdi Eslami');
  assert.match(ascii,/^[# \n]+$/);
  assert.equal(ascii.split('\n\n').length,2);
  assert.ok(ascii.split('\n').every(line=>line.length<=59));
  assert.equal(asciiName('Hi🙂'),null);
});
test('Only profile text remains promoted and retired playground pages are not indexable',async()=>{
  const sitemap=await readFile('sitemap.xml','utf8');
  assert.ok(!sitemap.includes('/playground/'));
  for(const prefix of ['', 'fa/']) {
    const html=await readFile(prefix+'index.html','utf8');
    assert.match(html,/class="profile-discovery"/);
    assert.ok(!html.includes('/playground/'));
    const retired=await readFile(prefix+'playground/index.html','utf8');
    assert.match(retired,/noindex, follow/);
    assert.match(retired,/http-equiv="refresh"/);
    const profile=await readFile(prefix+'tools/profile-text/index.html','utf8');
    assert.ok(!profile.includes('/playground/'));
    for(const id of ['skill-map','bug-board','builder-map','request-route','signature-canvas'])
      assert.ok(!profile.includes('id="'+id+'"'));
  }
});
