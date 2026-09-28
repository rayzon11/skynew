import fs from 'node:fs';
import assert from 'node:assert/strict';
import {products} from './catalogue.mjs';
const html=fs.readFileSync('dist/index.html','utf8');
assert.deepEqual(products.map(p=>p.name),['SKYEXCH247','1XBETFAIR','LASER247','REDDY247','TIGEREXCHANGE247','RADHEEXCH']);
assert.equal((html.match(/class="product-card /g)||[]).length,6);
assert.match(html,/<main id="main"><section class="collection wrap" id="products">/);
assert(!/SSECH|SSEXCH|TENEXCH/i.test(html));
for(const p of products){assert(fs.existsSync(`dist/assets/${p.logo}`));assert(html.includes(`href="${p.url}"`));assert(html.includes(`data-open="${p.id}"`));assert.equal(new URL(p.url).protocol,'https:');}
for(const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)){assert(fs.existsSync(`dist${match[1]}`),`Missing asset ${match[1]}`);}
const css=fs.readFileSync('dist/styles.css','utf8');for(const match of css.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g)){assert(fs.existsSync(`dist${match[1]}`),`Missing CSS asset ${match[1]}`);}
assert(css.includes('prefers-reduced-motion:reduce'));
assert(fs.readFileSync('dist/scene.js','utf8').includes('webglcontextlost'));
assert(fs.readFileSync('dist/app.js','utf8').includes('showModal()'));
console.log('PASS: exactly six approved products, catalogue first, original logos and HTTPS links, all referenced assets, reduced-motion and WebGL fallbacks.');
