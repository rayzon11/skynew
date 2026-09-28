import fs from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {products, features} from './catalogue.mjs';

const root = new URL('./dist/', import.meta.url);
const contact = 'https://awl247wa.com/casino/sky247';
const arrow = '<span aria-hidden="true">↗</span>';
const ext = 'target="_blank" rel="noopener noreferrer"';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const host = url => new URL(url).hostname;
const taglines = {skyexch247: 'The SKY247 signature exchange.'};
const tagline = p => p.tagline || taglines[p.id] || '';
const isBonus = p => Boolean(p.benefits?.length);

// Read each logo's intrinsic size from its PNG header so width/height match the original aspect ratio.
function pngSize(file) {
  const b = readFileSync(new URL(`assets/${file}`, root));
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
const logoImg = (p, attrs = '') => {
  const [w, h] = pngSize(p.logo);
  return `<img src="assets/${p.logo}" width="${w}" height="${h}" ${attrs} decoding="async">`;
};

const specs = cls => `<dl class="specs${cls ? ` ${cls}` : ''}"><div><dt>Min ID</dt><dd>Rs 300</dd></div><div><dt>1 point</dt><dd>Rs 1</dd></div><div><dt>Min bet</dt><dd>Rs 100</dd></div><div><dt>Fancy min</dt><dd>Rs 100</dd></div></dl>`;
const featureIcons = {
  'ID in 5 min': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'Instant bet': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  'Instant withdrawal': '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M16 12.5h2"/><path d="M2 10h20"/>',
};
const featureList = cls => `<ul class="features${cls ? ` ${cls}` : ''}">${features.map(f => `<li><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${featureIcons[f] || ''}</svg>${esc(f)}</li>`).join('')}</ul>`;
const cube = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12"/><path d="M21 7l-9 5-9-5"/></svg>';
const chevron = dir => `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}"/></svg>`;
const die = '<span class="die"><i class="f1"></i><i class="f6"></i><i class="f2"></i><i class="f5"></i><i class="f3"></i><i class="f4"></i></span>';
const chipPairs = [['cy', 'ck'], ['cw', 'cg'], ['cg', 'cy'], ['ck', 'cw'], ['cy', 'cg'], ['cw', 'ck']];
const floats = ['float', 'float2', 'float3'];

function card(p, i) {
  const bonus = isBonus(p);
  const [left, right] = chipPairs[i % chipPairs.length];
  return `<article class="product-card ${bonus ? 'bonus-product' : 'standard-product'}" data-product="${p.id}">
<div class="card-top"><span class="card-num"><b>${p.number}</b>/ 0${products.length}</span>${bonus ? '<span class="badge badge-bonus">BONUS SITE</span>' : '<span class="badge">DIRECT ACCESS</span>'}</div>
<button class="stage" type="button" data-open="${p.id}" aria-haspopup="dialog" aria-label="Open the 3D showroom for ${esc(p.name)}"><span class="minifloor"></span><span class="mt"><span class="mt-a"></span><span class="mt-b"></span><span class="mt-c"><span class="felt mt-felt"></span></span></span><span class="chip ${left} low c-left"></span><span class="chip ${right} low c-right"></span><span class="lift"><span class="${floats[i % 3]} slab"><span class="se e1"></span><span class="se e2"></span><span class="se e3"></span><span class="sf">${logoImg(p, 'alt="" loading="lazy"')}<span class="sheen"></span></span></span></span></button>
<h2 class="card-name">${esc(p.name)}</h2>
<div class="card-sub"><span>${esc(p.category)}</span><a class="destination" href="${p.url}" ${ext} aria-label="Visit ${esc(p.name)} website, ${host(p.url)} (opens a new tab)">${host(p.url)} ${arrow}</a></div>
${specs()}
${featureList()}
<div class="offer">${bonus
    ? `<p class="offer-label">BONUS &amp; REWARDS</p><ul class="benefits">${p.benefits.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`
    : '<p class="offer-label muted">PRODUCT ACCESS</p><p class="access-note">Get your ID or visit the platform to explore.</p>'}</div>
<div class="card-cta"><a class="btn btn-gold${bonus ? ' bonus-claim' : ' get-id'}" href="${contact}" ${ext} aria-label="${bonus ? `Ask support to claim a bonus for ${esc(p.name)}` : `Get an ID for ${esc(p.name)}`} (opens WhatsApp support in a new tab)">${bonus ? 'Claim bonus' : 'Get ID Now'} ${arrow}</a><button class="btn btn-ghost" type="button" data-open="${p.id}" aria-haspopup="dialog">${cube}3D Showroom</button></div>
<p class="card-note">${bonus ? 'Contact support to claim. Eligibility and terms apply.' : 'Contact support to get started.'}</p>
</article>`;
}

const stakes = [['cy', '300', 'Rs 300', 'Minimum ID'], ['cw', '1', 'Rs 1', 'Per point'], ['cg', '100', 'Rs 100', 'Minimum bet'], ['ck', '100', 'Rs 100', 'Fancy minimum']];
const privileges = [
  ['auto-bonus', 'Auto Bonus', 'Automatic bonus offers for eligible accounts.', 'Blue glass gift box with a chrome ribbon on dark marble'],
  ['weekly-loss-back', 'Weekly Loss Back', 'Explore the weekly loss-back programme.', 'Polished return ring surrounding blue and silver chips'],
  ['refer-earn', 'Refer &amp; Earn', 'Discover rewards for eligible referrals.', 'Three linked glass and metal membership medallions'],
  ['deposit-commission', 'Deposit Commission', 'Explore deposit commission offers.', 'Dark chrome vault with blue and silver chips'],
];
const benefitIcons = {
  'Auto Bonus': '<path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 21V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
  'Weekly Loss Back': '<path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  'Refer & Earn': '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M19 8v6M22 11h-6"/>',
  'Deposit Commission': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v1M12 15v1M8 12h1M15 12h1"/>',
};
const bonusBenefits = products.find(isBonus).benefits;
const arenas = [['Cricket', 'Every delivery. Every possibility.', 'cricket'], ['Football', 'The world’s game. A wider perspective.', 'football'], ['Tennis', 'Precision in every moment.', 'tennis'], ['Basketball', 'The energy of the arena.', 'basketball']];

const title = 'SKY247 — Sports exchange & casino platforms';
const description = 'Explore six original platforms in the SKY247 3D casino showroom: SKYEXCH247, 1XBETFAIR, LASER247, REDDY247, TIGEREXCHANGE247 and RADHEEXCH.';
const schema = {'@context': 'https://schema.org', '@type': 'ItemList', name: 'SKY247 platforms', itemListElement: products.map((p, i) => ({'@type': 'ListItem', position: i + 1, name: p.name, url: p.url}))};
const data = products.map(p => ({id: p.id, name: p.name, number: p.number, category: p.category, tagline: tagline(p), url: p.url, logo: p.logo, benefits: p.benefits || []}));
const json = v => JSON.stringify(v).replace(/</g, '\\u003c');

const fontFace = (family, file, weight) => `@font-face{font-family:${family};src:url(data:font/woff2;base64,${readFileSync(new URL(`assets/fonts/${file}`, root)).toString('base64')}) format("woff2");font-weight:${weight};font-display:swap}`;
const fontsCss = `/* Generated by build.mjs from dist/assets/fonts (SIL OFL 1.1). Embedded so the site renders the same from any folder. */\n${fontFace('Unbounded', 'unbounded-latin-200-900.woff2', '200 900')}\n${fontFace('Manrope', 'manrope-latin-400-800.woff2', '400 800')}\n`;
// Version query strings change whenever a file changes, so browsers and the host cache never serve an old copy after an upload.
const version = text => createHash('sha1').update(text).digest('hex').slice(0, 10);
const v = {fonts: version(fontsCss), css: version(readFileSync(new URL('casino.css', root))), js: version(readFileSync(new URL('app.js', root)))};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#06070A"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://sky247demo.com/"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="https://sky247demo.com/"><meta property="og:image" content="https://sky247demo.com/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://sky247demo.com/og.png"><link rel="icon" href="assets/skyexch247.png" type="image/png"><link rel="stylesheet" href="fonts.css?v=${v.fonts}"><link rel="stylesheet" href="casino.css?v=${v.css}"><script defer src="app.js?v=${v.js}"></script><script type="application/ld+json">${json(schema)}</script></head><body>
<a class="skip" href="#products">Skip to products</a>
<div class="backdrop" aria-hidden="true"><span class="floor"></span></div>
<header class="site-header"><div class="wrap header-inner">
<a class="brand" href="#products" aria-label="SKY247 home">${logoImg(products[0], 'alt=""')}<span class="wordmark">SKY<b>247</b></span></a>
<nav id="navigation" aria-label="Main navigation"><a href="#products">Platforms <span>06</span></a><a href="#stakes">Stakes</a><a href="#bonus">Bonuses</a><a href="#arenas">Arenas</a><a href="#lounge">Lounge</a></nav>
<div class="header-actions"><a class="btn btn-gold btn-sm" href="${contact}" ${ext} aria-label="Get ID (opens WhatsApp support in a new tab)">Get ID ${arrow}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Open menu"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>
</div></header>
<main id="main"><section class="collection wrap" id="products">
<div class="collection-head"><div class="head-left"><h1 class="brand-3d">SKY<span>247</span></h1><span class="head-rule" aria-hidden="true"></span><p class="eyebrow">♠ Six platforms · One table</p></div><div class="head-right"><p>Tap any platform to open its 3D showroom.</p><p class="legend"><span class="badge badge-bonus">BONUS SITE</span> Bonus programmes</p></div></div>
<div class="product-grid">${products.map(card).join('\n')}</div>
<div class="baseline"><span>SKY247 / PLATFORMS 01 — 0${products.length}</span><span>ORIGINAL IDENTITIES · DIRECT ACCESS</span></div>
</section>
<section class="stakes section" id="stakes"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">♦ 01 / Table stakes</p><h2>Same stakes.<br><span class="gold">Every table.</span></h2></div><p class="lede">All six platforms share the same four numbers.</p></div>
<div class="stakes-table"><span class="felt stakes-felt" aria-hidden="true"></span><div class="stakes-grid">${stakes.map(([c, face, value, label], i) => `<div class="stake"><span class="chip-wrap ${floats[i % 3]}" aria-hidden="true"><span class="chip ${c}"><span>${face}</span></span></span><p><strong>${value}</strong><small>${label}</small></p></div>`).join('')}</div></div>
</div></section>
<section class="bonus section" id="bonus"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">♣ 02 / Bonus programmes</p><h2>Four ways<br><span class="gold">to play more.</span></h2></div><p class="lede">Available on ${products.filter(isBonus).map(p => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1')} only.</p></div>
<div class="fan-grid">${privileges.map(([img, name, copy, alt], i) => `<article class="fan"><picture><source srcset="assets/${img}-480.webp 480w, assets/${img}-960.webp 960w" sizes="(max-width:720px) 50vw, 25vw"><img src="assets/${img}-960.webp" alt="${alt}" width="960" height="640" loading="lazy" decoding="async"></picture><div class="fan-body"><span>0${i + 1}</span><h3>${name}</h3><p>${copy}</p></div></article>`).join('')}</div>
<div class="bonus-foot"><div class="available"><span>AVAILABLE ON</span>${products.filter(isBonus).map(p => `<span class="logo-pill">${logoImg(p, `alt="${esc(p.name)}" loading="lazy"`)}</span>`).join('')}</div><div class="claim-row"><p>Contact support to claim. Eligibility and terms apply.</p><a class="btn btn-gold btn-lg bonus-claim" href="${contact}" ${ext} aria-label="Claim bonus (opens WhatsApp support in a new tab)">Claim bonus ${arrow}</a></div></div>
</div></section>
<section class="arenas section" id="arenas"><div class="wrap">
<div class="section-head"><div><p class="eyebrow">♥ 03 / The arenas</p><h2>Spin to<br><span class="gold arena-name" aria-live="polite">Cricket.</span></h2></div><div class="arena-ctrl"><button class="icon-btn arena-prev" type="button" aria-label="Previous arena">${chevron('left')}</button><button class="icon-btn solid arena-next" type="button" aria-label="Next arena">${chevron('right')}</button></div></div>
</div>
<div class="ring-stage"><div class="ring">${arenas.map(([name, line, img]) => `<figure><picture><source srcset="assets/${img}-800.webp 800w, assets/${img}-1600.webp 1600w" sizes="(max-width:720px) 90vw, 640px"><img src="assets/${img}-1600.webp" alt="${name} arena with dramatic lighting" width="1600" height="900" loading="lazy" decoding="async"></picture><figcaption><h3>${name}</h3><p>${line}</p></figcaption></figure>`).join('')}</div></div>
<div class="arena-tabs wrap">${arenas.map(([name], i) => `<button type="button" aria-pressed="${i === 0}">${name}</button>`).join('')}</div>
</section>
<section class="lounge section" id="lounge"><div class="wrap"><div class="lounge-card"><picture><source srcset="assets/casino-lounge-800.webp 800w, assets/casino-lounge-1600.webp 1600w" sizes="(max-width:720px) 100vw, 1248px"><img src="assets/casino-lounge-1600.webp" alt="SKY247 casino lounge with gaming tables and chandeliers" width="1600" height="900" loading="lazy" decoding="async"></picture><span class="lounge-shade" aria-hidden="true"></span><div class="lounge-copy"><h2>Make your<br><span class="gold">next move.</span></h2><div class="lounge-actions"><a class="btn btn-gold btn-lg get-id" href="${contact}" ${ext} aria-label="Get ID Now (opens WhatsApp support in a new tab)">Get ID Now ${arrow}</a><a class="text-link whatsapp" href="${contact}" ${ext}>Contact us on WhatsApp ${arrow}</a></div></div></div></div></section>
</main>
<footer class="site-footer"><div class="wrap footer-inner"><a class="brand" href="#products" aria-label="SKY247, back to top">${logoImg(products[0], 'alt="" loading="lazy"')}<span class="wordmark">SKY<b>247</b></span></a><a href="#products">Back to platforms ↑</a><span>Six identities. Terms vary by platform and account.</span><span>© ${new Date().getFullYear()} SKY247DEMO.COM</span></div></footer>
<dialog id="product-dialog" class="showroom" aria-labelledby="sr-name">
<div class="sr-top"><p class="eyebrow">♠ 3D Showroom <span class="sr-count"><b class="sr-num">01</b> <span>/ 0${products.length}</span></span></p><div class="sr-actions"><button class="icon-btn sr-prev" type="button" aria-label="Previous product">${chevron('left')}</button><button class="icon-btn sr-next" type="button" aria-label="Next product">${chevron('right')}</button><button class="sr-close" type="button" aria-label="Close showroom"><span class="sr-close-label">Close</span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div></div>
<div class="sr-body">
<div class="sr-stage" aria-hidden="true"><span class="floor"></span><div class="sr-persp"><div class="sr-scene">
<span class="sr-table"><span class="t1"></span><span class="t2"></span><span class="t3"></span><span class="t4"><span class="felt"><span class="t-ring"></span></span></span></span>
<span class="sr-slab"><span class="float sr-slab-inner"><span class="sse s1"></span><span class="sse s2"></span><span class="sse s3"></span><span class="sse s4"></span><span class="ssf"><img class="sr-logo" src="assets/${products[0].logo}" alt="" width="320" height="160"><span class="sheen"></span></span></span></span>
<span class="pcard pcard-a"><span class="float2 pface">A<br>♠<b>♠</b></span></span><span class="pcard pcard-b"><span class="float3 pface red">K<br>♥<b>♥</b></span></span>
<span class="sr-die die-a"><span class="float2 die-float">${die}</span></span><span class="sr-die die-b"><span class="float3 die-float">${die.replace('class="die"', 'class="die slow"')}</span></span>
<span class="sr-chip chip-a"><span class="chip cy"></span></span><span class="sr-chip chip-b"><span class="chip ck low"></span></span><span class="sr-chip chip-c"><span class="chip cw"></span></span>
</div></div><p class="sr-hint">Move your cursor to tilt the table ↻</p></div>
<div class="sr-info"><div class="sr-titles"><p class="eyebrow sr-cat"></p><h2 id="sr-name"></h2><p class="sr-tag"></p></div>${specs('specs-lg')}${featureList('features-lg')}
<div class="sr-bonus" hidden><p class="offer-label">BONUS &amp; REWARDS</p><ul class="sr-benefits">${bonusBenefits.map(b => `<li><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${benefitIcons[b] || ''}</svg>${esc(b)}</li>`).join('')}</ul></div>
<div class="sr-access" hidden><p class="offer-label muted">PRODUCT ACCESS</p><p class="sr-access-note">Get your ID or visit the platform to explore. Bonus programmes are offered on ${products.filter(isBonus).map(p => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p></div>
<div class="sr-cta"><a class="btn btn-gold sr-primary" href="${contact}" ${ext}><span class="sr-primary-label">Claim bonus</span> ${arrow}</a><a class="btn btn-ghost sr-visit" href="${products[0].url}" ${ext}>Visit website ${arrow}</a></div>
<p class="sr-note"></p></div>
</div>
<div class="sr-rail" role="group" aria-label="Choose a platform">${products.map(p => `<button type="button" aria-current="false" aria-label="Show ${esc(p.name)}">${logoImg(p, 'alt="" loading="lazy"')}<span>${p.number} · ${esc(p.name)}</span></button>`).join('')}</div>
</dialog>
<script type="application/json" id="catalogue-data">${json(data)}</script>
</body></html>`;

await fs.writeFile(new URL('fonts.css', root), fontsCss);
await fs.writeFile(new URL('index.html', root), html);
await fs.writeFile(new URL('catalogue.json', root), JSON.stringify(products));
console.log('Built SKY247 3D casino site: six approved platforms, showroom dialog, stakes, bonuses, arenas and lounge.');
