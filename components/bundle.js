/* Personal Brand Design System — small helpers for print texture, the terminal layer, the dossier, wear and dada layers. No React, no network. Sets window.PB.
   All motion is stepped and stops under prefers-reduced-motion (final state shown at once). */
(function () {
  function tok(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  /* Fill a .pb-band__run from its data-words ("A|B|C") with upright words for a static zine print strip. */
  function runningBand(run) {
    var words = String(run.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (!words.length) return;
    var all = words.concat(words, words);
    run.textContent = '';
    all.forEach(function (w) { var s = document.createElement('span'); s.textContent = w; run.appendChild(s); });
  }

  /* Fill a .pb-mark with an 11x11 left-right mirrored stitch pattern seeded by a string (the display name). */
  function stitchMark(el, seed) {
    var h = 2166136261, str = String(seed == null ? el.getAttribute('data-seed') || '' : seed);
    for (var i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    function rnd() { h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909); return (h >>> 0) / 4294967296; }
    var cols = [tok(el, '--ground'), tok(el, '--signal'), tok(el, '--text'), tok(el, '--text-muted')];
    var half = [];
    for (var y = 0; y < 11; y++) { half[y] = []; for (var x = 0; x < 6; x++) { var p = rnd(); half[y][x] = p < 0.42 ? 0 : p < 0.72 ? 1 : p < 0.88 ? 2 : 3; } }
    el.textContent = '';
    for (var yy = 0; yy < 11; yy++) for (var xx = 0; xx < 11; xx++) {
      var cell = document.createElement('i');
      cell.style.background = cols[half[yy][xx < 6 ? xx : 10 - xx]];
      el.appendChild(cell);
    }
  }


  /* ---------- Terminal layer ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/_<>=+';
  function reduced() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  /* Run fn once when el first comes into view (or at once if there is no IntersectionObserver). */
  function onView(el, fn, threshold) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } }); }, { threshold: threshold == null ? 0.2 : threshold, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  }
  function cursorEl() { var c = document.createElement('span'); c.className = 'pb-cursor'; c.setAttribute('aria-hidden', 'true'); return c; }

  /* Type the .pb-term__line elements of a terminal one after another.
     --cmd lines type character by character; other lines appear whole, like program output.
     data-loop on the .pb-term restarts it after a pause. Screen readers get the full text at once. */
  function terminal(term, opts) {
    if (term.__pbTerm) return; term.__pbTerm = true;
    opts = opts || {};
    var body = term.querySelector('.pb-term__body') || term;
    var lines = Array.prototype.slice.call(body.querySelectorAll('.pb-term__line'));
    if (!lines.length) return;
    var texts = lines.map(function (l) { return l.textContent; });
    var sr = document.createElement('div'); sr.className = 'pb-sr'; sr.textContent = texts.join('\n');
    body.parentNode.insertBefore(sr, body); body.setAttribute('aria-hidden', 'true');
    var cur = cursorEl();
    if (reduced()) { lines[lines.length - 1].appendChild(cur); return; }
    var speed = opts.speed || 22, loop = term.hasAttribute('data-loop');
    function run() {
      lines.forEach(function (l) { l.textContent = ''; l.hidden = true; });
      var i = 0;
      function next() {
        if (i >= lines.length) { lines[lines.length - 1].appendChild(cur); if (loop) setTimeout(run, 5200); return; }
        var l = lines[i], t = texts[i]; l.hidden = false; l.appendChild(cur);
        if (l.classList.contains('pb-term__line--cmd')) {
          var n = 0;
          (function type() {
            n++; l.textContent = t.slice(0, n); l.appendChild(cur);
            if (n < t.length) setTimeout(type, speed + (Math.random() < .08 ? 90 : 0)); else { i++; setTimeout(next, 320); }
          })();
        } else { setTimeout(function () { l.textContent = t; i++; next(); }, 90 + Math.random() * 120); }
      }
      next();
    }
    onView(term, run);
  }

  /* Resolve an element's text out of random characters. data-decode="hover" also replays it on pointer enter. */
  function decode(el, opts) {
    opts = opts || {};
    var text = el.__pbText || (el.__pbText = el.textContent);
    if (!el.__pbDecode) {
      el.__pbDecode = true;
      el.classList.add('pb-decode');
      el.textContent = '';
      var real = document.createElement('span'); real.className = 'pb-decode__real'; real.textContent = text;
      var fx = document.createElement('span'); fx.className = 'pb-decode__fx'; fx.setAttribute('aria-hidden', 'true');
      real.appendChild(fx); el.appendChild(real); el.__pbReal = real; el.__pbFx = fx;
      if (el.getAttribute('data-decode') === 'hover') el.addEventListener('pointerenter', function () { play(); });
    }
    var real = el.__pbReal, fx = el.__pbFx, timer;
    function play() {
      if (reduced() || el.__pbBusy) return;
      el.__pbBusy = true;
      var dur = opts.duration || 640, frame = 45, steps = Math.ceil(dur / frame), k = 0;
      var at = text.split('').map(function (c, idx) { return Math.floor((idx / text.length) * steps * 0.7 + Math.random() * steps * 0.3); });
      real.classList.add('is-hidden');
      timer = setInterval(function () {
        k++;
        var out = '';
        for (var j = 0; j < text.length; j++) {
          var c = text[j];
          if (c === ' ' || c === '\n' || k >= at[j]) out += c.replace(/[&<]/g, function (m) { return m === '&' ? '&amp;' : '&lt;'; });
          else out += '<i>' + GLYPHS[(Math.random() * GLYPHS.length) | 0] + '</i>';
        }
        fx.innerHTML = out;
        if (k >= steps) { clearInterval(timer); fx.innerHTML = ''; real.classList.remove('is-hidden'); el.__pbBusy = false; }
      }, frame);
    }
    if (opts.now) play(); else onView(el, play);
    return play;
  }

  /* Sliced glitch bursts on one headline at random gaps (min..max ms). */
  function glitch(el, opts) {
    if (el.__pbGlitch) return; el.__pbGlitch = true;
    opts = opts || {};
    el.setAttribute('data-text', el.textContent.trim());
    if (reduced()) return;
    var min = opts.min || 3800, max = opts.max || 8500;
    function burst() {
      el.classList.remove('is-glitching'); void el.offsetWidth; el.classList.add('is-glitching');
      setTimeout(function () { el.classList.remove('is-glitching'); }, 280);
      setTimeout(burst, min + Math.random() * (max - min));
    }
    setTimeout(burst, 900);
  }

  /* Readout: dd[data-count] counts up in steps, dd[data-clock] shows the local time, span.pb-meter[data-value] lights 0-10 cells. */
  function readout(el) {
    if (el.__pbReadout) return; el.__pbReadout = true;
    Array.prototype.forEach.call(el.querySelectorAll('.pb-meter[data-value]'), function (m) {
      var v = Math.max(0, Math.min(1, parseFloat(m.getAttribute('data-value')) || 0)), n = Math.round(v * 10);
      m.setAttribute('role', 'img'); m.setAttribute('aria-label', Math.round(v * 100) + ' percent'); m.textContent = '';
      for (var i = 0; i < 10; i++) { var c = document.createElement('i'); m.appendChild(c); }
      var cells = m.children, k = 0;
      function light() { for (var j = 0; j < 10; j++) cells[j].className = j < k ? 'on' : ''; }
      if (reduced()) { k = n; light(); return; }
      onView(m, function () { var t = setInterval(function () { light(); if (k++ >= n) clearInterval(t); }, 70); });
    });
    Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), function (d) {
      var target = parseInt(d.getAttribute('data-count'), 10) || 0, pad = (d.getAttribute('data-pad') | 0) || String(target).length;
      function show(v) { d.textContent = String(v).padStart(pad, '0'); }
      if (reduced()) { show(target); return; }
      show(0);
      onView(d, function () { var k = 0, steps = 14, t = setInterval(function () { k++; show(Math.round(target * k / steps)); if (k >= steps) clearInterval(t); }, 45); });
    });
    Array.prototype.forEach.call(el.querySelectorAll('[data-clock]'), function (d) {
      function tick() { var n = new Date(); d.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()].map(function (x) { return String(x).padStart(2, '0'); }).join(':'); }
      tick(); setInterval(tick, 1000);
    });
  }

  /* Signal trace: a line sweeps left to right over a grid, leaving a fading trail. Deterministic shape from data-seed. */
  function trace(cv, opts) {
    if (cv.__pbTrace) return; cv.__pbTrace = true;
    opts = opts || {};
    var seed = 0, str = String(cv.getAttribute('data-seed') || 'trace');
    for (var i = 0; i < str.length; i++) seed = (seed * 31 + str.charCodeAt(i)) | 0;
    var a = [1 + (seed & 3), 3 + ((seed >> 2) & 7), 9 + ((seed >> 5) & 7)], ph = (seed & 255) / 40;
    var sweep = opts.sweep || 2400, w = 0, h = 0, g, start = 0, live = false, raf;
    function size() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height; if (!w || !h) return false;
      cv.width = w * dpr; cv.height = h * dpr; g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); return true;
    }
    function y(x, t) {
      var u = x / w * Math.PI * 2;
      var v = Math.sin(u * a[0] + ph) * .45 + Math.sin(u * a[1] + t * .0013) * .22 + Math.sin(u * a[2] - t * .0021) * .1;
      if (((x / 6) | 0) % 37 === 11) v += .6 * Math.sin(u * 40);
      return h / 2 - v * h * .38;
    }
    function grid() {
      g.clearRect(0, 0, w, h); g.fillStyle = tok(cv, '--trace-grid') || '#2a2522';
      for (var gx = 0; gx <= w; gx += 24) g.fillRect(Math.round(gx), 0, 1, h);
      for (var gy = 0; gy <= h; gy += 24) g.fillRect(0, Math.round(gy), w, 1);
      g.fillRect(0, Math.round(h / 2), w, 1);
    }
    function frame(t) {
      if (!start) start = t;
      var head = ((t - start) % sweep) / sweep * w;
      grid();
      var col = tok(cv, '--signal') || '#f0352a';
      g.strokeStyle = col; g.lineWidth = 1.5; g.lineJoin = 'miter';
      for (var x = 0; x < head; x += 3) {
        var age = (head - x) / w; g.globalAlpha = Math.max(0.08, 1 - age * 1.6);
        g.beginPath(); g.moveTo(x, y(x, t)); g.lineTo(x + 3, y(x + 3, t)); g.stroke();
      }
      g.globalAlpha = 1; g.fillStyle = col; g.shadowColor = tok(cv, '--phosphor'); g.shadowBlur = 8;
      g.fillRect(Math.round(head) - 2, Math.round(y(head, t)) - 2, 4, 4); g.shadowBlur = 0;
      if (live) raf = requestAnimationFrame(frame);
    }
    function still() { if (!size()) return; grid(); var col = tok(cv, '--signal') || '#f0352a'; g.strokeStyle = col; g.lineWidth = 1.5; g.beginPath();
      for (var x = 0; x <= w; x += 3) { if (x) g.lineTo(x, y(x, 0)); else g.moveTo(x, y(x, 0)); } g.stroke(); }
    if (reduced()) { still(); window.addEventListener('resize', still); return; }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) {
        if (e.isIntersecting && !live) { live = true; raf = requestAnimationFrame(frame); }
        else if (!e.isIntersecting) { live = false; cancelAnimationFrame(raf); }
      }); }).observe(cv);
    } else { live = true; raf = requestAnimationFrame(frame); }
  }


  /* ---------- Dossier layer ---------- */
  /* Feed the children of a .pb-feed in one after another when the group comes into view (80ms apart). */
  function feed(el, opts) {
    if (el.__pbFeed) return; el.__pbFeed = true;
    opts = opts || {};
    var kids = Array.prototype.slice.call(el.children), gap = opts.gap || 80;
    if (reduced()) { kids.forEach(function (k) { k.style.clipPath = 'none'; }); return; }
    /* Watch the group, not the clipped cards: a fully clipped card never counts as visible. */
    onView(el, function () {
      kids.forEach(function (k, i) {
        k.style.setProperty('--pb-feed-delay', (i * gap) + 'ms');
        k.classList.add('is-fed');
        k.addEventListener('animationend', function () { k.style.clipPath = 'none'; k.classList.remove('is-fed'); }, { once: true });
      });
    }, 0);
  }

  /* Add one line to a .pb-console log: status word in signal, then the text, typed in. Keeps the last `max` lines. */
  function log(consoleEl, status, text, opts) {
    opts = opts || {};
    var list = consoleEl.querySelector('.pb-console__log'); if (!list) return;
    var li = document.createElement('li'), b = document.createElement('b'), t = document.createElement('span');
    b.textContent = status; li.appendChild(b); li.appendChild(t); list.insertBefore(li, list.firstChild);
    var max = opts.max || 8; while (list.children.length > max) list.removeChild(list.lastChild);
    if (reduced()) { t.textContent = text; return; }
    var n = 0; (function type() { n++; t.textContent = text.slice(0, n); if (n < text.length) setTimeout(type, 14); })();
  }


  /* Retired sci-fi/Dada helpers kept as safe no-ops so plain typography stays straight and sharp. */
  function decode() { return function () {}; }
  function glitch() {}
  function trace() {}
  function dymo() {}
  function cutup() {}


  /* ---------- Scroll choreography ---------- */
  /* Measure stacked sheets and keep --pb-sheet-top synced so tall sheets scroll to their bottom before sticking. */
  function sheets(root) {
    root = root || document;
    var list = Array.prototype.slice.call(root.querySelectorAll('.pb-sheet--stack'));
    var bar = document.querySelector('.pb-toolbar');
    function update() {
      var barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty('--pb-toolbar-h', barH + 'px');
      var active = !reduced() && window.innerWidth > 760;
      list.forEach(function (el) {
        if (!active) { el.style.removeProperty('--pb-sheet-top'); return; }
        var top = Math.min(barH, window.innerHeight - el.offsetHeight);
        el.style.setProperty('--pb-sheet-top', Math.round(top) + 'px');
      });
    }
    update();
    window.addEventListener('resize', update);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(update);
      if (bar) ro.observe(bar);
      list.forEach(function (el) { ro.observe(el); });
    }
  }

  /* Two-plate press registration lock: snaps discrete --pb-reg steps 4..0 as elements reach center reading band. */
  function register(root) {
    root = root || document;
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-register]'));
    if (!items.length) return;
    if (reduced()) {
      items.forEach(function (el) { el.style.setProperty('--pb-reg', '0'); el.classList.add('is-locked'); });
      return;
    }
    var raf = 0;
    function update() {
      raf = 0;
      var vh = window.innerHeight || 800, mid = vh * 0.5, band = vh * 0.24, stepSpan = Math.max(40, vh * 0.11);
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var dist = Math.abs((r.top + r.height * 0.5) - mid);
        var step = dist <= band ? 0 : Math.min(4, Math.ceil((dist - band) / stepSpan));
        el.style.setProperty('--pb-reg', String(step));
        el.classList.toggle('is-locked', step === 0);
      });
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }

  /* Live scroll spy: stepped toolbar progress, natural-offset anchor nav, active tab/folio, figure index, console log. */
  function scrollSpy(root) {
    root = root || document;
    var bar = document.querySelector('.pb-toolbar');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.pb-toolbar .pb-tabs a[href^="#"]'));
    var folio = document.querySelector('[data-folio-now]');
    var secList = Array.prototype.slice.call(root.querySelectorAll('[data-log][id]'));
    var figCards = Array.prototype.slice.call(root.querySelectorAll('.pb-spread-plates [data-fig]'));
    var figLinks = Array.prototype.slice.call(root.querySelectorAll('.pb-fig-index [data-fig-link]'));
    var consoleEl = document.querySelector('.pb-console');
    var consoleNow = document.querySelector('[data-log-now]');
    var currentSec = '';

    function sheetNaturalTop(sheet) {
      var parent = sheet.parentElement, sum = parent ? parent.offsetTop : 0;
      if (!parent) return sheet.offsetTop;
      for (var i = 0; i < parent.children.length; i++) {
        var ch = parent.children[i];
        if (ch === sheet) return sum;
        if (ch.classList.contains('pb-sheet')) sum += ch.offsetHeight;
      }
      return sum;
    }

    function naturalTop(el) {
      if (el.classList.contains('pb-sheet')) return sheetNaturalTop(el);
      var sheet = el.closest && el.closest('.pb-sheet');
      if (sheet) return sheetNaturalTop(sheet) + (el.getBoundingClientRect().top - sheet.getBoundingClientRect().top);
      var y = 0, cur = el;
      while (cur) { y += cur.offsetTop || 0; cur = cur.offsetParent; }
      return y;
    }

    /* Fix anchor navigation across sticky sheets by scrolling to the sheet's true natural offset. */
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        ev.preventDefault();
        var barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
        var y = Math.max(0, naturalTop(target) - (window.innerWidth > 760 ? barH : 0));
        window.scrollTo({ top: y, behavior: 'auto' });
        update();
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });

    var raf = 0;
    function update() {
      raf = 0;
      var doc = document.documentElement;
      var maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      var pct = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      var stepped = Math.round(pct * 50) / 50;
      if (bar) bar.style.setProperty('--pb-progress', String(stepped));

      if (secList.length) {
        var barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
        var probe = window.scrollY + barH + window.innerHeight * 0.28;
        var chosen = secList[0];
        for (var i = 0; i < secList.length; i++) {
          if (naturalTop(secList[i]) <= probe) chosen = secList[i];
        }
        var id = chosen.getAttribute('id');
        if (id && id !== currentSec) {
          currentSec = id;
          tabs.forEach(function (t) {
            if (t.getAttribute('href') === '#' + id) t.setAttribute('aria-current', 'page');
            else t.removeAttribute('aria-current');
          });
          if (folio) {
            var code = chosen.getAttribute('data-folio');
            if (code) folio.textContent = code;
          }
          var logName = chosen.getAttribute('data-log');
          if (consoleEl && consoleNow && logName && consoleNow.textContent !== logName) {
            consoleNow.textContent = logName;
            log(consoleEl, 'open', logName, { max: 6 });
          }
        }
      }

      if (figCards.length) {
        var mid = (window.innerHeight || 800) * 0.5, best = figCards[0], bestDist = Infinity;
        figCards.forEach(function (card) {
          var r = card.getBoundingClientRect();
          var d = Math.abs((r.top + r.height * 0.5) - mid);
          if (d < bestDist) { bestDist = d; best = card; }
        });
        var activeFig = best.getAttribute('data-fig');
        figCards.forEach(function (card) { card.classList.toggle('is-selected', card === best); });
        figLinks.forEach(function (lnk) {
          var on = lnk.getAttribute('data-fig-link') === activeFig;
          lnk.classList.toggle('is-active', on);
          if (on) lnk.setAttribute('aria-current', 'true'); else lnk.removeAttribute('aria-current');
        });
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }

  /* Wire up every active zine & terminal helper found in a root. */
  function init(root) {
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll('.pb-band__run[data-words]'), runningBand);
    Array.prototype.forEach.call(root.querySelectorAll('.pb-mark[data-seed]'), function (m) { stitchMark(m); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-term'), function (t) { terminal(t); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-readout'), function (d) { readout(d); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-feed'), function (f) { feed(f); });
    sheets(root);
    register(root);
    scrollSpy(root);
  }

  window.PB = { runningBand: runningBand, stitchMark: stitchMark, dymo: dymo, cutup: cutup,
    terminal: terminal, decode: decode, glitch: glitch, readout: readout, trace: trace,
    feed: feed, log: log, sheets: sheets, register: register, scrollSpy: scrollSpy, init: init };
})();
