import fs from 'node:fs';
import assert from 'node:assert/strict';
import {products} from './catalogue.mjs';

const contact = 'https://awl247wa.com/casino/sky247';
const approvedBonus = ['skyexch247', 'reddy247', 'tigerexchange247'];
const html = fs.readFileSync('dist/index.html', 'utf8');

// Catalogue: exactly six approved products, in order, first on the page.
assert.deepEqual(products.map(p => p.name), ['SKYEXCH247', '1XBETFAIR', 'LASER247', 'REDDY247', 'TIGEREXCHANGE247', 'RADHEEXCH']);
assert.equal((html.match(/class="product-card /g) || []).length, 6);
assert.match(html, /<main id="main"><section class="collection wrap" id="products">/);
assert(!/SSECH|SSEXCH|TENEXCH/i.test(html));
assert(!/SKY247 <span>COLLECTION|>COLLECTION</.test(html), 'Heading must read SKY247 only');

// Each card: original logo, destination, four rates, bonus content only where approved.
const cards = [...html.matchAll(/<article class="product-card [^"]*" data-product="([^"]+)">([\s\S]*?)<\/article>/g)];
assert.equal(cards.length, 6);
cards.forEach(([, id, body], i) => {
  const p = products[i];
  assert.equal(id, p.id, 'Card order must follow the catalogue');
  assert(fs.existsSync(`dist/assets/${p.logo}`));
  assert(body.includes(`src="/assets/${p.logo}"`), `${p.name} logo missing`);
  assert(body.includes(`class="destination" href="${p.url}"`), `${p.name} destination missing`);
  assert(body.includes(`data-open="${p.id}"`));
  for (const rate of ['Rs 300', 'Rs 1<', 'Rs 100</dd><\/div><div><dt>Fancy min</dt><dd>Rs 100']) assert(body.includes(rate), `${p.name} rate ${rate} missing`);
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

// Assets referenced by HTML (src, href, srcset) and CSS exist.
for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) assert(fs.existsSync(`dist${match[1]}`), `Missing asset ${match[1]}`);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) for (const part of match[1].split(',')) { const file = part.trim().split(/\s+/)[0]; assert(fs.existsSync(`dist${file}`), `Missing srcset asset ${file}`); }
for (const file of ['dist/casino.css', 'dist/styles.css']) {
  const css = fs.readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g)) assert(fs.existsSync(`dist${match[1]}`), `Missing CSS asset ${match[1]} in ${file}`);
}
assert(/prefers-reduced-motion:\s*reduce/.test(fs.readFileSync('dist/casino.css', 'utf8')));
assert(fs.readFileSync('dist/app.js', 'utf8').includes('showModal()'));
assert(fs.existsSync('dist/.htaccess'), '.htaccess must be deployed');
console.log(`PASS: six approved platforms in order, SKY247 heading, four rates per card, bonus buttons only on ${approvedBonus.length} approved platforms, ${contactLinks.length} support links on ${contact}, ${external.length} external links HTTPS + new tab, all assets present.`);
