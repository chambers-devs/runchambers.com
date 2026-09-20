/* Chambers motion system.
 *
 * Plain JavaScript, no dependencies. It only runs when the <head> snippet has put
 * `.motion` on <html>, which it does unless the visitor prefers reduced motion, so
 * reduced-motion visitors get the finished page with none of this applied.
 *
 * Everything animates transform, opacity, clip-path or the individual `translate` /
 * `scale` properties; nothing animates layout. One rAF loop serves every
 * scroll- or pointer-linked effect and only runs while something is on screen.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var small = window.matchMedia('(max-width: 767px)').matches;
  var pointerFx = fine && !small;          // mouse-driven effects: desktop and laptop only
  var scrollFactor = small ? 0.45 : 1;     // gentler scroll parallax on phones

  var slice = Array.prototype.slice;
  function $$(sel, ctx) { return slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------------------------------------------------------------------------
     1. Word split: headings reveal word by word, each word rising out of a mask.
        The heading keeps its full text as aria-label; the pieces are aria-hidden.
     ------------------------------------------------------------------------ */
  function splitWords(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var n = 0;
    (function walk(node) {
      slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            var wi = document.createElement('span');
            wi.className = 'wi';
            wi.style.setProperty('--i', n++);
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
    el.setAttribute('aria-label', label);
    el.classList.add('is-split');
  }

  /* ---------------------------------------------------------------------------
     2. Reveal on scroll. Elements are tagged here (no markup changes needed) and
        staggered by their position among siblings of the same kind.
     ------------------------------------------------------------------------ */
  var pending = new Set();
  function reveal(el) {
    el.classList.add('is-in');
    pending.delete(el);
    revealIO.unobserve(el);
    // Screenshots must drop their clip-path once the wipe is over (it would otherwise clip
    // their shadow for good). A timer backs up `transitionend`, which can be missed when the
    // element is revealed off-screen or in a throttled tab.
    if (el.classList.contains('cb-rv--shot')) setTimeout(function () { el.classList.add('is-done'); }, 1900);
  }
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) reveal(entry.target); });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  function watch(el) { pending.add(el); revealIO.observe(el); }

  function tag(selector, step, cls) {
    var groups = new Map();
    $$(selector).forEach(function (el) {
      if (el.classList.contains('cb-hero-title')) return;
      var key = el.parentElement;
      var i = groups.get(key) || 0;
      groups.set(key, i + 1);
      el.classList.add.apply(el.classList, (cls || 'cb-rv').split(' '));
      el.style.setProperty('--d', Math.min(i, 6) * (step || 80) + 'ms');
      watch(el);
    });
  }

  function initReveals() {
    // Headings: word by word
    $$('.cb-h2, .cb-page-title').forEach(function (h) {
      if (h.classList.contains('cb-hero-title')) return;
      splitWords(h);
      watch(h);
    });

    tag('.cb-eyebrow', 0, 'cb-rv cb-rv--line');
    tag('.cb-page-intro, .cb-contact-alt, .cb-lede:not(.cb-hero-aside .cb-lede)', 0);
    tag('.cb-split .cb-row', 90);
    tag('.cb-stat', 90);
    tag('.cb-tri', 90);
    tag('.cb-plan', 120);
    tag('.cb-form, .cb-faq aside', 0);
    tag('.cb-doc-section > h2', 0);
    tag('.cb-panel > :first-child > *', 90);
    tag('footer .grid > div', 70);

    // Screenshots: masked wipe, then a slow scale settle
    $$('.cb-shot').forEach(function (shot, i) {
      shot.classList.add('cb-rv', 'cb-rv--shot');
      shot.style.setProperty('--sx', (small ? 0 : (i % 2 ? -70 : 70)) + 'px');   // odd rows enter from the right, even from the left
      shot.style.setProperty('--d', '80ms');
      shot.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'clip-path') shot.classList.add('is-done'); // lets the shadow render again
      });
      watch(shot);
    });
  }

  /* ---------------------------------------------------------------------------
     3. Count-up for the audience numbers (2M, 85,000, ~1s, 100%).
     ------------------------------------------------------------------------ */
  function initCounters() {
    var nums = $$('.cb-stat-num');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) {
      var text = el.textContent.trim();
      var m = text.match(/(\d[\d,]*(?:\.\d+)?)/);
      if (!m) return;
      el.setAttribute('aria-label', text);
      el._parts = { pre: text.slice(0, m.index), post: text.slice(m.index + m[0].length),
                    n: parseFloat(m[1].replace(/,/g, '')), comma: m[1].indexOf(',') > -1 };
      el.textContent = el._parts.pre + '0' + el._parts.post;
      io.observe(el);
    });
  }

  function countUp(el) {
    var p = el._parts, t0 = null, dur = 1500;
    function fmt(v) {
      var s = String(Math.round(v));
      return p.comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
    }
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = clamp((t - t0) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - k, 4);        // ease-out quart
      el.textContent = p.pre + fmt(p.n * eased) + p.post;
      if (k < 1) requestAnimationFrame(frame); else el.classList.add('pop');
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------------------
     4. Hero and scroll-linked motion: one rAF loop.
        - sky photo drifts slower than the page (depth) and follows the pointer a little
        - dashboard stage tilts toward the pointer and lifts slightly on scroll
        - screenshots slide inside their frames as they cross the viewport
     ------------------------------------------------------------------------ */
  var heroSection = document.querySelector('.cb-hero');
  var hero = document.querySelector('.cb-hero-visual');
  var rows = [];
  var heroBg = hero && hero.querySelector('.cb-hero-bg');
  var heroStage = hero && hero.querySelector('.cb-container');
  var shots = [];
  var visibleShots = new Set();
  var heroVisible = false;
  var pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  var raf = 0, vh = window.innerHeight;

  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

  function tick() {
    raf = 0;
    var settling = false;

    // hero
    if (hero && heroVisible) {
      var r = hero.getBoundingClientRect();
      var p = clamp((vh - r.top) / (vh + r.height), 0, 1);           // 0 as it enters, 1 as it leaves
      pointer.cx += (pointer.x - pointer.cx) * 0.07;
      pointer.cy += (pointer.y - pointer.cy) * 0.07;
      settling = Math.abs(pointer.x - pointer.cx) > 0.002 || Math.abs(pointer.y - pointer.cy) > 0.002;
      if (heroBg) {
        // only ever moves down / sideways, so the bottom edge of the photo never shows a gap
        heroBg.style.translate = (pointer.cx * -10) + 'px ' + (p * 70 * scrollFactor + (pointer.cy + 1) * 4) + 'px';
      }
      if (heroStage) {
        heroStage.style.translate = '0 ' + (-p * 34 * scrollFactor) + 'px';
        heroStage.style.scale = String(1 - p * 0.055 * scrollFactor);   // dashboard recedes as you leave the hero
        if (pointerFx) {
          heroStage.style.transform = 'perspective(1800px) rotateX(' + (-pointer.cy * 1.4) + 'deg) rotateY(' + (pointer.cx * 2) + 'deg)';
        }
      }
    }

    // anything scrolled past without being seen (anchor jumps, fast flicks) is revealed silently
    pending.forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) reveal(el); });

    // rows brighten as they approach the middle of the screen and dim as they leave it
    rows.forEach(function (row) {
      var b = row.getBoundingClientRect();
      if (b.bottom < -80 || b.top > vh + 80) return;
      var d = Math.abs(b.top + b.height / 2 - vh * 0.5) / (vh * 0.5);
      var t = clamp((d - 0.32) / 0.68, 0, 1);
      row.style.setProperty('--f', (1 - t * t * (3 - 2 * t) * 0.62).toFixed(3));
    });

    // screenshots
    visibleShots.forEach(function (shot) {
      var b = shot.getBoundingClientRect();
      var k = clamp((b.top + b.height / 2 - vh / 2) / (vh / 2 + b.height / 2), -1, 1);
      shot.style.setProperty('--p', (k * scrollFactor).toFixed(3));
    });

    if (settling) schedule();
  }

  function initParallax() {
    if (hero) {
      new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; schedule(); }).observe(heroSection || hero);
      if (pointerFx) {
        window.addEventListener('pointermove', function (e) {
          if (!heroVisible) return;
          pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
          pointer.y = (e.clientY / vh - 0.5) * 2;
          schedule();
        }, { passive: true });
        document.addEventListener('pointerleave', function () { pointer.x = pointer.y = 0; schedule(); });
      }
    }
    rows = $$('.cb-row');
    shots = $$('.cb-shot');
    var shotIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visibleShots.add(en.target); else visibleShots.delete(en.target);
      });
      schedule();
    }, { rootMargin: '10% 0px' });
    shots.forEach(function (s) { shotIO.observe(s); });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', function () { vh = window.innerHeight; small = window.matchMedia('(max-width: 767px)').matches; schedule(); });
    schedule();
  }

  /* ---------------------------------------------------------------------------
     5. Tactile interactions (desktop and laptop with a mouse only).
        - pricing cards tilt a few degrees and carry a light that follows the pointer
     ------------------------------------------------------------------------ */
  function initTactile() {
    if (!pointerFx) return;

    $$('.cb-shot').forEach(function (shot) {
      shot.addEventListener('pointermove', function (e) {
        if (!shot.classList.contains('is-done')) return;      // only once its reveal has finished
        var r = shot.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        shot.style.transform = 'perspective(1300px) rotateX(' + ((0.5 - y) * 5) + 'deg) rotateY(' + ((x - 0.5) * 6) + 'deg) scale3d(1.012,1.012,1)';
      });
      shot.addEventListener('pointerleave', function () { shot.style.transform = ''; });
    });

    $$('.cb-plan').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        card.style.transform = 'perspective(1100px) rotateX(' + ((0.5 - y) * 4) + 'deg) rotateY(' + ((x - 0.5) * 5) + 'deg)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------------------
     5b. Hero visual: the sky and the dashboard play when they scroll into view. If they
         are already on screen at page load they wait a beat so the headline leads.
     ------------------------------------------------------------------------ */
  var bootedAt = performance.now();
  function initHeroVisual() {
    if (!hero) return;
    var early = function () { return performance.now() - bootedAt < 1800 ? '450ms' : '0ms'; };
    var skyIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      hero.style.setProperty('--dd', early());
      hero.classList.add('is-sky');
      skyIO.disconnect();
    }, { threshold: 0.04 });
    skyIO.observe(hero);
    var dashIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      hero.style.setProperty('--dd', early());
      hero.classList.add('is-in');
      dashIO.disconnect();
    }, { threshold: 0.28 });
    dashIO.observe(heroStage || hero);
  }

  /* ---------------------------------------------------------------------------
     6. Boot: split the hero title, wait briefly for fonts, then play the intro.
     ------------------------------------------------------------------------ */
  function boot() {
    var title = document.querySelector('.cb-hero-title');
    if (title) splitWords(title);
    initReveals();
    initCounters();
    initParallax();
    initTactile();
    initHeroVisual();

    var go = function () {
      root.classList.add('is-loaded');
      if (title) title.classList.add('is-in');
    };
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var timeout = new Promise(function (res) { setTimeout(res, 700); });   // never hold the intro hostage
    Promise.race([fontsReady, timeout]).then(function () { requestAnimationFrame(go); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
