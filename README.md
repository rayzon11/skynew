# SKY247 luxury casino collection

The current presentation uses a neutral off-white and graphite SKY theme, restrained yellow controls and new original casino lounge and display-chamber images. `dist/theme-warm.css` contains the theme. Generated source artwork and the exact built-in image generation prompts are saved under `artwork/`; optimized WebP variants live in `dist/assets/`.

Catalogue-first static website with six equally sized product cards. The collection contains SKYEXCH247, 1XBETFAIR, LASER247, REDDY247, TIGEREXCHANGE247 and RADHEEXCH, in that order. The duplicate SKY247 entry has been removed; the former fourth product, SKYEXCH247, is first and retains its original supplied logo and destination.

The collection opens animated accessible product dialogs. Direct destination links remain available on every card. The page continues through an original casino lounge, four sports environments, illustrated programme highlights, a wide cinematic casino-lounge hero and contact links.

All six products display the user-confirmed Rs 300 minimum ID, Rs 1 per point, Rs 100 minimum bet and Rs 100 fancy minimum. Bonus benefits and Claim bonus contact buttons appear only for SKYEXCH247, REDDY247 and TIGEREXCHANGE247. These buttons open the existing support contact route; they do not automatically submit or approve bonus claims.

## Build and preview

Run `node build.mjs`, `node verify.mjs`, then `node server.mjs`. Preview: http://127.0.0.1:4277/.

- `catalogue.mjs`: product data, original logos, destination URLs and existing benefit lists.
- `build.mjs`: generates `dist/index.html` and `dist/catalogue.json`.
- `dist/styles.css`: responsive layouts, glass and metal surfaces, shimmer, modal transitions and reduced-motion styling.
- `dist/app.js`: modal content, keyboard focus return, navigation, card tilt, magnetic buttons, parallax and motion control.
- `dist/scene.js`: one shared Three.js renderer, reflected studio environment, glass logo plate, metal rings, blue felt table, chips, abstract playing cards and depth particles. The former 3D chamber is replaced with a casino hero image. The retained renderer module is not loaded when no scene host exists.
- `dist/assets`: local original logos, optimized original CGI images, fonts and Three.js license files.

Reduced-motion preference avoids loading the 3D renderer. Pause stops its animation loop. Hidden/offscreen rendering stops; mobile and lower-power devices use fewer objects and particles, lower pixel ratio and simpler shadows. WebGL initialization failure or context loss preserves a static chamber and all navigation.

## Hosting

Upload the contents of `dist` into Hostinger `public_html`, including `.htaccess`. No production Node.js runtime is required. Metadata and sitemap target https://sky247demo.com/. The existing Sites project connection returned “project not found”; this local work does not change the public domain.

The programme descriptions and rates were carried over from the existing package, not independently reverified. Images are presentation artwork. Third-party destinations and programme terms may change.
