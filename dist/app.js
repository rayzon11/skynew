// SKY247 3D casino site: 3D showroom dialog, navigation and the arena ring.
// Classic deferred script written in widely supported JavaScript (no optional chaining, no modules),
// so it also runs from a local folder and on older phone browsers. Each feature starts independently:
// if one fails, the others (above all the showroom) still work.
(function () {
  'use strict';
  var $ = function (selector, scope) { return (scope || document).querySelector(selector); };
  var $$ = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
  var closeMenu = function () {};

  function start(name, fn) {
    try { fn(); } catch (error) { if (window.console) console.error('SKY247 ' + name + ' failed:', error); }
  }

  // 3D showroom
  start('showroom', function () {
    var dialog = $('#product-dialog');
    var products = JSON.parse($('#catalogue-data').textContent);
    var native = typeof dialog.showModal === 'function';
    var stage = $('.sr-stage', dialog);
    var scene = $('.sr-scene', dialog);
    var railButtons = $$('.sr-rail button', dialog);
    var current = 0;
    var previousFocus = null;

    function hostOf(url) { var a = document.createElement('a'); a.href = url; return a.hostname; }

    function render(index) {
      current = (index + products.length) % products.length;
      var p = products[current];
      var bonus = p.benefits && p.benefits.length > 0;
      var host = hostOf(p.url);
      $('.sr-num', dialog).textContent = p.number;
      $('.sr-cat', dialog).textContent = p.category;
      $('#sr-name', dialog).textContent = p.name;
      $('.sr-tag', dialog).textContent = p.tagline;
      var logo = $('.sr-logo', dialog);
      logo.src = 'assets/' + p.logo;
      logo.alt = p.name + ' logo';
      $('.sr-bonus', dialog).hidden = !bonus;
      $('.sr-access', dialog).hidden = bonus;
      var primary = $('.sr-primary', dialog);
      $('.sr-primary-label', primary).textContent = bonus ? 'Claim bonus' : 'Get ID Now';
      primary.setAttribute('aria-label', (bonus ? 'Ask support to claim a bonus for ' : 'Get an ID for ') + p.name + ' (opens WhatsApp support in a new tab)');
      var visit = $('.sr-visit', dialog);
      visit.href = p.url;
      visit.setAttribute('aria-label', 'Visit ' + p.name + ' website, ' + host + ' (opens a new tab)');
      $('.sr-note', dialog).textContent = (bonus ? 'Contact support to claim. Eligibility and terms apply.' : 'Contact support to get started.') + ' Website opens ' + host + ' in a new tab.';
      railButtons.forEach(function (button, i) { button.setAttribute('aria-current', String(i === current)); });
    }

    function fitStage() {
      if (stage.clientWidth) stage.style.setProperty('--s', Math.min(1, stage.clientWidth / 760).toFixed(3));
    }
    if (window.ResizeObserver) new ResizeObserver(fitStage).observe(stage);
    else window.addEventListener('resize', fitStage);

    function resetTilt() {
      scene.style.removeProperty('--rx');
      scene.style.removeProperty('--ry');
    }

    function open(id, trigger) {
      var index = -1;
      products.forEach(function (p, i) { if (p.id === id) index = i; });
      if (index < 0) return;
      previousFocus = trigger || null;
      closeMenu();
      render(index);
      document.documentElement.classList.add('dialog-open');
      if (native) {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.classList.add('sr-fallback');
        dialog.setAttribute('open', '');
        $('.sr-close', dialog).focus();
      }
      fitStage();
    }

    function onClosed() {
      document.documentElement.classList.remove('dialog-open');
      resetTilt();
      if (previousFocus && previousFocus.focus) previousFocus.focus({preventScroll: true});
    }

    function close() {
      if (native) { if (dialog.open) dialog.close(); return; }
      dialog.removeAttribute('open');
      onClosed();
    }

    // One delegated listener: any [data-open] control, or a click anywhere on a platform card that is not a link or other button.
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var opener = target.closest('[data-open]');
      if (opener) { event.preventDefault(); open(opener.getAttribute('data-open'), opener); return; }
      var card = target.closest('.product-card');
      if (card && !target.closest('a, button')) open(card.getAttribute('data-product'), $('[data-open]', card));
    });

    $('.sr-close', dialog).addEventListener('click', close);
    $('.sr-prev', dialog).addEventListener('click', function () { render(current - 1); });
    $('.sr-next', dialog).addEventListener('click', function () { render(current + 1); });
    railButtons.forEach(function (button, i) { button.addEventListener('click', function () { render(i); }); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); render(current + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); render(current - 1); }
      if (event.key === 'Escape' && !native) { event.preventDefault(); close(); }
    });
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
    });
    if (native) dialog.addEventListener('close', onClosed);

    stage.addEventListener('pointermove', function (event) {
      if (reduceMotion.matches || event.pointerType !== 'mouse') return;
      var box = stage.getBoundingClientRect();
      var x = (event.clientX - box.left) / box.width - 0.5;
      var y = (event.clientY - box.top) / box.height - 0.5;
      scene.style.setProperty('--rx', (4 - y * 14).toFixed(1) + 'deg');
      scene.style.setProperty('--ry', (-10 + x * 26).toFixed(1) + 'deg');
    });
    stage.addEventListener('pointerleave', resetTilt);
    document.documentElement.classList.add('showroom-ready');
  });

  // Responsive navigation
  start('navigation', function () {
    var nav = $('#navigation');
    var menu = $('.menu-toggle');
    function setMenu(isOpen) {
      nav.classList.toggle('open', isOpen);
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
    closeMenu = function () { setMenu(false); };
    menu.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (event) { if (event.target.closest && event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
    });
    if (!window.IntersectionObserver) return;
    var links = $$('a', nav);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          var active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-20% 0px -70% 0px'});
    $$('main > section[id]').forEach(function (section) { observer.observe(section); });
  });

  // Arena ring
  start('arenas', function () {
    var ring = $('.ring');
    var name = $('.arena-name');
    var tabs = $$('.arena-tabs button');
    var figures = $$('.ring figure');
    var turn = 0;
    function active() { return ((turn % 4) + 4) % 4; }
    function spin(next) {
      turn = next;
      var a = active();
      ring.style.setProperty('--turn', turn);
      name.textContent = tabs[a].textContent + '.';
      tabs.forEach(function (tab, i) { tab.setAttribute('aria-pressed', String(i === a)); });
      figures.forEach(function (figure, i) { figure.setAttribute('aria-hidden', String(i !== a)); });
    }
    $('.arena-prev').addEventListener('click', function () { spin(turn - 1); });
    $('.arena-next').addEventListener('click', function () { spin(turn + 1); });
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        var delta = i - active();
        if (delta > 2) delta -= 4;
        if (delta < -2) delta += 4;
        spin(turn + delta);
      });
    });
    spin(0);
  });
})();
