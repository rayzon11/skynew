# SKY247 3D casino site

A dark, 3D casino-themed static site. It opens directly on six equally sized platform cards under a slim "SKY247" heading: SKYEXCH247, 1XBETFAIR, LASER247, REDDY247, TIGEREXCHANGE247 and RADHEEXCH, in that order. Each card shows its original logo on a floating gold-edged slab above a felt table, the destination link, and the four user-confirmed rates (Rs 300 minimum ID, Rs 1 per point, Rs 100 minimum bet, Rs 100 fancy minimum).

Bonus benefits and Claim bonus buttons appear only for SKYEXCH247, REDDY247 and TIGEREXCHANGE247; the others show Get ID Now. All Get ID, Claim bonus and WhatsApp buttons open the existing support route https://awl247wa.com/casino/sky247 in a new tab. They do not submit or approve bonus claims.

Every card has a 3D Showroom button that opens an accessible dialog: a tiltable felt table with the platform logo, the rates, bonus or access details, a platform rail and previous/next controls (Escape closes and returns focus). Below the platforms: table stakes, bonus programmes, a rotating 3D ring of four sports arenas, the casino lounge contact card and the footer. 3D effects are CSS only; motion pauses with the header toggle and is off under reduced-motion.

## Build and preview

Run `node build.mjs`, `node verify.mjs`, then `node server.mjs`. Preview: http://127.0.0.1:4277/.

- `catalogue.mjs`: product data, original logos, destination URLs and existing benefit lists.
- `build.mjs`: generates `dist/index.html` and `dist/catalogue.json`.
- `dist/casino.css`: the live stylesheet (3D casino theme, responsive layout, showroom dialog, reduced motion). `dist/styles.css`, `dist/theme-warm.css` and `dist/scene.js` are the previous design and are no longer loaded.
- `dist/app.js`: motion toggle, responsive menu, 3D showroom dialog and arena ring.
- `dist/assets`: local original logos, optimized original CGI images, fonts and Three.js license files.

## Hosting

Upload the contents of `dist` into Hostinger `public_html`, including `.htaccess` (or upload the ZIP there and extract it so index.html sits directly in public_html). No production Node.js runtime is required. Metadata and sitemap target https://sky247demo.com/. The existing Sites project connection returned “project not found”; this local work does not change the public domain.

The programme descriptions and rates were carried over from the existing package, not independently reverified. Images are presentation artwork. Third-party destinations and programme terms may change.
