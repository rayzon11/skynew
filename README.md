# SKY247 Collection

Complete static website with a seven-product catalogue, seven shareable product detail routes, Three.js scenes, galleries, sports storytelling, original brand logos, a floating source-linked WhatsApp contact, and responsive layouts.

## Run locally

Requires Node.js 20 or later. No dependency installation is needed.

```sh
node build.mjs
node server.mjs
```

Open http://127.0.0.1:4277/.

## Editing

- `catalogue.mjs`: single source for product names, order, destinations and descriptions.
- `build.mjs`: reusable catalogue, card, detail, gallery, sports, feature, showcase, navigation and footer renderers; generates HTML and SEO files.
- `dist/styles.css`: responsive gold and charcoal visual system.
- `dist/app.js`: accessible navigation, card expansion transitions, galleries and motion controls.
- `dist/scene.js`: one shared WebGL renderer, viewport-limited scenes, camera response, particles and reduced-motion handling.
- `dist/assets`: original source logos, optimized original artwork, self-hosted fonts and Three.js.

## Hosting

Publish the contents of `dist` to a static web host. Every product has a real `products/<slug>/index.html`; no application server or SPA fallback is required. The local server is for preview, not production.

Canonical metadata, sitemap and social-image URLs are prepared for `https://sky247demo.com`. Domain DNS and custom-domain connection must be configured separately before a public launch on that domain. The Sites preview is owner-private by default.

## Destination provenance

Destinations and logos are imported from https://1xdemo.com/ and checked with successful HTTP GET requests on 2026-09-27. SKY247 and SKYEXCH247 intentionally share https://skyexch247.io/: the source associates the SKY247 logo with that address and the destination identifies itself as SKY 247. A separate address was not invented.

The floating WhatsApp button uses the source-listed routing link https://awl247wa.com/casino/1xbetfair. General support uses https://1xbetfaircustomercare.com/. Links open in new tabs with `noopener noreferrer`.

Artwork is original showcase imagery, not screenshots or claims about product functionality. Product key points describe the showcase presentation. Third-party destinations can change independently.

## Accessibility and performance

Semantic content, skip navigation, visible focus, keyboard-operable native dialog, focus return, route announcements, motion toggle and system reduced-motion support. With unavailable WebGL, imagery and navigation remain usable. One renderer serves only visible 3D scenes; hidden scenes release geometry, mobile uses fewer particles and lower pixel density. Fonts and imagery are self-hosted; responsive WebP images are lazy-loaded except the primary presentation.

Font licenses are in `dist/assets/fonts/`. Three.js license is `dist/assets/THREE-LICENSE.txt`.
