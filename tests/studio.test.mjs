import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanName,profileStyles,asciiName,projectBrief,signaturePoints,requestScenarios} from '../studio-core.mjs';
test('Persian frames preserve connected text and zero-width non-joiners',()=>{
 const name='مهدی اسلامی';
 const styles=profileStyles(name);
 assert.equal(styles.length,10);
 for(const style of styles)assert.ok(style.text.includes(name));
 assert.equal(cleanName('علی‌رضا'),'علی‌رضا');
 assert.equal(asciiName(name),null);
});
test('Name handling bounds Unicode input, removes direction overrides and handles empty values',()=>{
 assert.equal(cleanName('  Mehdi\u202e\n Eslami  '),'Mehdi Eslami');
 assert.equal(Array.from(cleanName('🌟'.repeat(70))).length,40);
 assert.deepEqual(profileStyles('   '),[]);
 assert.equal(cleanName('<img src=x>'),'<img src=x>'); // Rendering, not sanitization, must keep this inert.
});
test('Latin names produce real ASCII and distinct copyable Unicode styles',()=>{
 const styles=profileStyles('Mehdi Eslami');
 assert.equal(new Set(styles.map(s=>s.text)).size,styles.length);
 const ascii=asciiName('Mehdi Eslami');
 assert.match(ascii,/^[# \n]+$/);
 assert.ok(ascii.split('\n').every(line=>line.length<=59));
 assert.equal(asciiName('Hi🙂'),null);
 assert.ok(profileStyles('مهدی Mehdi').some(s=>s.id==='bold'&&s.text.includes('مهدی')));
});
test('Project briefs contain only selected known features and retain both languages',()=>{
 assert.equal(projectBrief(['auth','auth','unknown','<script>'],'en'),'Proposed project features:\n• User accounts');
 assert.match(projectBrief(['payment'],'fa'),/پرداخت/);
 assert.ok(!projectBrief([]).includes('•'));
});
test('Personal circuit geometry is deterministic, bounded and changes with the name',()=>{
 const a=signaturePoints('Mehdi');
 assert.deepEqual(a,signaturePoints('Mehdi'));
 assert.notDeepEqual(a,signaturePoints('مهدی'));
 assert.equal(signaturePoints('a',1000).length,64);
 assert.ok(a.every(p=>p.x>=.08&&p.x<=.92&&p.y>=.12&&p.y<=.68));
});
test('Request scenarios distinguish validation and connection failure from a successful response',()=>{
 assert.equal(requestScenarios.invalid.code,400);
 assert.equal(requestScenarios.offline.code,0);
 assert.equal(requestScenarios.normal.code,200);
 for(const scenario of Object.values(requestScenarios))assert.equal(scenario.en.length,scenario.fa.length);
});
