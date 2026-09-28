// SKY247 3D casino site: motion control, navigation, 3D showroom dialog and the arena ring.
// Loaded as a classic deferred script (not a module) so it also runs when index.html is opened from a local folder.
{
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const products = JSON.parse($('#catalogue-data').textContent);
let userPaused = false;
const paused = () => reduce.matches || userPaused;

// Motion toggle (also respects the reduced-motion preference)
const motion = $('.motion-toggle');
function syncMotion() {
  document.body.classList.toggle('motion-paused', paused());
  motion.setAttribute('aria-pressed', String(paused()));
  motion.setAttribute('aria-label', reduce.matches ? 'Reduced motion enabled' : userPaused ? 'Resume motion' : 'Pause motion');
  $('.motion-label', motion).textContent = paused() ? 'Motion off' : 'Motion on';
  $('.motion-icon', motion).textContent = paused() ? '▷' : 'Ⅱ';
  if (paused()) resetTilt();
}
motion.addEventListener('click', () => {
  if (reduce.matches) return;
  userPaused = !userPaused;
  syncMotion();
});
reduce.addEventListener('change', syncMotion);

// Responsive navigation
const nav = $('#navigation');
const menu = $('.menu-toggle');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
const navLinks = $$('a', nav);
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navLinks) {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
}, {rootMargin: '-20% 0px -70% 0px'});
$$('main > section[id]').forEach(section => sectionObserver.observe(section));

// 3D showroom dialog
const dialog = $('#product-dialog');
const stage = $('.sr-stage', dialog);
const scene = $('.sr-scene', dialog);
const railButtons = $$('.sr-rail button', dialog);
let current = 0;
let previousFocus = null;

function render(index) {
  current = (index + products.length) % products.length;
  const p = products[current];
  const bonus = p.benefits.length > 0;
  const host = new URL(p.url).hostname;
  $('.sr-num', dialog).textContent = p.number;
  $('.sr-cat', dialog).textContent = p.category;
  $('#sr-name', dialog).textContent = p.name;
  $('.sr-tag', dialog).textContent = p.tagline;
  const logo = $('.sr-logo', dialog);
  logo.src = `assets/${p.logo}`;
  logo.alt = `${p.name} logo`;
  $('.sr-bonus', dialog).hidden = !bonus;
  $('.sr-access', dialog).hidden = bonus;
  const primary = $('.sr-primary', dialog);
  $('.sr-primary-label', primary).textContent = bonus ? 'Claim bonus' : 'Get ID Now';
  primary.classList.toggle('bonus-claim', bonus);
  primary.setAttribute('aria-label', `${bonus ? `Ask support to claim a bonus for ${p.name}` : `Get an ID for ${p.name}`} (opens WhatsApp support in a new tab)`);
  const visit = $('.sr-visit', dialog);
  visit.href = p.url;
  visit.setAttribute('aria-label', `Visit ${p.name} website, ${host} (opens a new tab)`);
  $('.sr-note', dialog).textContent = `${bonus ? 'Contact support to claim. Eligibility and terms apply.' : 'Contact support to get started.'} Website opens ${host} in a new tab.`;
  railButtons.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
}

function fitStage() {
  if (stage.clientWidth) stage.style.setProperty('--s', Math.min(1, stage.clientWidth / 760).toFixed(3));
}
new ResizeObserver(fitStage).observe(stage);

function openShowroom(id, trigger) {
  const index = products.findIndex(p => p.id === id);
  if (index < 0) return;
  previousFocus = trigger;
  setMenu(false);
  render(index);
  document.documentElement.classList.add('dialog-open');
  dialog.showModal();
  fitStage();
}
$$('[data-open]').forEach(button => button.addEventListener('click', () => openShowroom(button.dataset.open, button)));
$('.sr-close', dialog).addEventListener('click', () => dialog.close());
$('.sr-prev', dialog).addEventListener('click', () => render(current - 1));
$('.sr-next', dialog).addEventListener('click', () => render(current + 1));
railButtons.forEach((button, i) => button.addEventListener('click', () => render(i)));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); render(current + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); render(current - 1); }
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('dialog-open');
  resetTilt();
  previousFocus?.focus({preventScroll: true});
});

// Mouse tilt for the showroom table
function resetTilt() {
  scene.style.removeProperty('--rx');
  scene.style.removeProperty('--ry');
}
stage.addEventListener('pointermove', event => {
  if (paused() || event.pointerType !== 'mouse') return;
  const box = stage.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  scene.style.setProperty('--rx', `${(4 - y * 14).toFixed(1)}deg`);
  scene.style.setProperty('--ry', `${(-10 + x * 26).toFixed(1)}deg`);
}, {passive: true});
stage.addEventListener('pointerleave', resetTilt);

// Arena ring
const ring = $('.ring');
const arenaName = $('.arena-name');
const arenaTabs = $$('.arena-tabs button');
const arenaFigures = $$('.ring figure');
let turn = 0;
const activeArena = () => ((turn % 4) + 4) % 4;
function spin(nextTurn) {
  turn = nextTurn;
  const active = activeArena();
  ring.style.setProperty('--turn', turn);
  arenaName.textContent = `${arenaTabs[active].textContent}.`;
  arenaTabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === active)));
  arenaFigures.forEach((figure, i) => figure.setAttribute('aria-hidden', String(i !== active)));
}
$('.arena-prev').addEventListener('click', () => spin(turn - 1));
$('.arena-next').addEventListener('click', () => spin(turn + 1));
arenaTabs.forEach((tab, i) => tab.addEventListener('click', () => {
  let delta = i - activeArena();
  if (delta > 2) delta -= 4;
  if (delta < -2) delta += 4;
  spin(turn + delta);
}));

spin(0);
syncMotion();
}
