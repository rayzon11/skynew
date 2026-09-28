import fs from 'node:fs';
import assert from 'node:assert/strict';
import {products, features} from './catalogue.mjs';

const contact = 'https://awl247wa.com/casino/sky247';
const approvedBonus = ['skyexch247', 'reddy247', 'tigerexchange247'];
const html = fs.readFileSync('dist/index.html', 'utf8');

// Catalogue: exactly six approved products, in order, first on the page.
assert.deepEqual(products.map(p => p.name), ['SKYEXCH247', '1XBETFAIR', 'LASER247', 'REDDY247', 'TIGEREXCHANGE247', 'RADHEEXCH']);
assert.equal((html.match(/class="product-card /g) || []).length, 6);
assert.match(html, /<main id="main"><section class="collection wrap" id="products">/);
assert(!/SSECH|SSEXCH|TENEXCH/i.test(html));
assert(!/SKY247 <span>COLLECTION|>COLLECTION</.test(html), 'Heading must read SKY247 only');
assert(!/motion-toggle/.test(html), 'The motion on/off button was removed at the user\'s request');

// Each card: original logo, destination, four rates, bonus content only where approved.
const cards = [...html.matchAll(/<article class="product-card [^"]*" data-product="([^"]+)">([\s\S]*?)<\/article>/g)];
assert.equal(cards.length, 6);
cards.forEach(([, id, body], i) => {
  const p = products[i];
  assert.equal(id, p.id, 'Card order must follow the catalogue');
  assert(fs.existsSync(`dist/assets/${p.logo}`));
  assert(body.includes(`src="assets/${p.logo}"`), `${p.name} logo missing`);
  assert(body.includes(`class="destination" href="${p.url}"`), `${p.name} destination missing`);
  assert(body.includes(`data-open="${p.id}"`));
  for (const rate of ['Rs 300', 'Rs 1<', 'Rs 100</dd><\/div><div><dt>Fancy min</dt><dd>Rs 100']) assert(body.includes(rate), `${p.name} rate ${rate} missing`);
  for (const f of features) assert(body.includes(`</svg>${f}</li>`), `${p.name} feature ${f} missing`);
  assert(body.includes(`<button class="stage" type="button" data-open="${p.id}"`), `${p.name} logo stage must open the showroom`);
  const bonus = approvedBonus.includes(p.id);
  assert.equal(body.includes('Claim bonus'), bonus, `${p.name} Claim bonus visibility`);
  assert.equal(body.includes('BONUS &amp; REWARDS'), bonus, `${p.name} bonus benefits visibility`);
  assert.equal(body.includes('Get ID Now'), !bonus, `${p.name} Get ID visibility`);
  assert.equal(new URL(p.url).protocol, 'https:');
});

// Links: every contact button uses the existing support route; every external link is HTTPS and opens safely in a new tab.
const anchors = [...html.matchAll(/<a\b([^>]*)>/g)].map(m => m[1]);
const hrefOf = attrs => (attrs.match(/href="([^"]*)"/) || [])[1];
const external = anchors.filter(a => /href="https?:/.test(a));
assert(!anchors.some(a => /href="http:/.test(a)), 'No plain http links');
for (const attrs of external) {
  assert(/target="_blank"/.test(attrs) && /rel="[^"]*noopener/.test(attrs), `External link must open in a new tab with noopener: ${hrefOf(attrs)}`);
  const href = hrefOf(attrs);
  assert(href === contact || products.some(p => p.url === href), `Unexpected external link: ${href}`);
}
const contactLinks = external.filter(a => hrefOf(a).includes('awl247wa'));
assert(contactLinks.every(a => hrefOf(a) === contact), 'All support links must use the exact contact route');
for (const a of anchors.filter(a => /href="#/.test(a))) assert(html.includes(`id="${hrefOf(a).slice(1)}"`), `Broken in-page link ${hrefOf(a)}`);

// Assets: relative paths only (the site must work from any folder, a subfolder, or opened from disk), and every referenced file exists.
const local = v => !/^(https?:|#|data:|mailto:|tel:)/.test(v);
assert(!/(?:src|href|srcset)="\/(?!\/)/.test(html), 'index.html must use relative paths, not root-absolute /paths');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) if (local(match[1])) assert(fs.existsSync(`dist/${match[1].split('?')[0]}`), `Missing asset ${match[1]}`);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) for (const part of match[1].split(',')) { const file = part.trim().split(/\s+/)[0]; assert(fs.existsSync(`dist/${file}`), `Missing srcset asset ${file}`); }
for (const p of products) assert(fs.existsSync(`dist/assets/${p.logo}`), `Missing showroom logo ${p.logo}`);
const css = fs.readFileSync('dist/casino.css', 'utf8');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) if (local(match[1])) assert(!match[1].startsWith('/') && fs.existsSync(`dist/${match[1]}`), `Missing or root-absolute CSS asset ${match[1]}`);
assert(/<script defer src="app\.js\?v=[0-9a-f]{10}"><\/script>/.test(html), 'app.js must load as a versioned classic deferred script (runs from a local folder, never served stale)');
assert(/href="casino\.css\?v=[0-9a-f]{10}"/.test(html) && /href="fonts\.css\?v=[0-9a-f]{10}"/.test(html), 'Stylesheets must carry version query strings');
assert(!/\?\.|\?\?/.test(fs.readFileSync('dist/app.js', 'utf8').replace(/'[^']*'/g, '')), 'app.js must avoid optional chaining / nullish operators for older phone browsers');
assert((fs.readFileSync('dist/fonts.css', 'utf8').match(/url\(data:font\/woff2;base64,/g) || []).length === 2, 'fonts.css must embed both fonts');
assert(/prefers-reduced-motion:\s*reduce/.test(fs.readFileSync('dist/casino.css', 'utf8')));
assert(fs.readFileSync('dist/app.js', 'utf8').includes('showModal()'));
assert(/Cache-Control "no-cache/.test(fs.readFileSync('dist/.htaccess', 'utf8')), '.htaccess must stop HTML being cached');
assert(fs.existsSync('dist/.htaccess'), '.htaccess must be deployed');
console.log(`PASS: six approved platforms in order, SKY247 heading, four rates and the ${features.length} features per card, bonus buttons only on ${approvedBonus.length} approved platforms, ${contactLinks.length} support links on ${contact}, ${external.length} external links HTTPS + new tab, all assets present with relative paths.`);
