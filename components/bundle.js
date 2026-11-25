/* Personal Brand Design System — small helpers for print texture, the terminal layer, the dossier, wear and dada layers. No React, no network. Sets window.PB.
   All motion is stepped and stops under prefers-reduced-motion (final state shown at once). */
(function () {
  function tok(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  /* Fill a .pb-band__run from its data-words ("A|B|C"), repeated so the 60s loop is seamless. */
  function runningBand(run) {
    var words = String(run.getAttribute('data-words') || '').split('|');
    var one = [];
    for (var i = 0; i < 4; i++) one = one.concat(words);
    var all = one.concat(one, one);
    run.textContent = '';
    all.forEach(function (w, k) { var s = document.createElement('span'); s.textContent = w; if (k % 5 === 3) s.className = 'is-flip'; run.appendChild(s); });
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


  /* ---------- Wear layer ---------- */
  /* Split a .pb-dymo into letters, each pushed a pixel up or down like a hand-cranked label maker. Deterministic per text. */
  function dymo(el) {
    if (el.__pbDymo) return; el.__pbDymo = true;
    var text = el.textContent, h = 0;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    el.setAttribute('aria-label', text); el.textContent = '';
    for (var j = 0; j < text.length; j++) {
      var b = document.createElement('b'); b.setAttribute('aria-hidden', 'true'); b.textContent = text[j] === ' ' ? '\u00a0' : text[j];
      h = (h * 1103515245 + 12345) | 0; var off = ((h >>> 16) % 3) - 1;
      b.style.transform = 'translateY(' + off + 'px)'; el.appendChild(b);
    }
  }


  /* ---------- Dada layer ---------- */
  /* Set a heading's letters as if cut from different printed matter: chips, signal, mono, outline; each a little off.
     Deterministic per text, so the same word always gets the same cut. Screen readers read the plain word. */
  function cutup(el) {
    if (el.__pbCutup) return; el.__pbCutup = true;
    var text = el.textContent.trim(), h = 7;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    function rnd() { h = (h * 1103515245 + 12345) | 0; return ((h >>> 8) & 0xffff) / 0xffff; }
    var kinds = ['', '', 'is-chip', 'is-mono', 'is-line', '', 'is-chip', 'is-sig'], sig = 0;
    el.setAttribute('aria-label', text); el.textContent = ''; el.classList.add('pb-cutup');
    for (var j = 0; j < text.length; j++) {
      var b = document.createElement('b'); b.setAttribute('aria-hidden', 'true');
      if (text[j] === ' ') { b.className = 'is-gap'; el.appendChild(b); continue; }
      var k = kinds[(rnd() * kinds.length) | 0];
      if (k === 'is-sig' && sig++) k = 'is-chip';           /* one signal letter at most */
      b.className = k; b.textContent = text[j];
      b.style.setProperty('--r', ((rnd() - .5) * 10).toFixed(1) + 'deg');
      b.style.setProperty('--y', ((rnd() - .5) * .12).toFixed(3) + 'em');
      b.style.setProperty('--s', (.84 + rnd() * .3).toFixed(2) + 'em');
      el.appendChild(b);
    }
  }

  /* Wire up every helper found in a root. */
  function init(root) {
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll('.pb-band__run[data-words]'), runningBand);
    Array.prototype.forEach.call(root.querySelectorAll('.pb-mark[data-seed]'), function (m) { stitchMark(m); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-term'), function (t) { terminal(t); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-decode]'), function (d) { decode(d); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-glitch'), function (d) { glitch(d); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-readout'), function (d) { readout(d); });
    Array.prototype.forEach.call(root.querySelectorAll('canvas.pb-trace'), function (c) { trace(c); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-feed'), function (f) { feed(f); });
    Array.prototype.forEach.call(root.querySelectorAll('.pb-dymo'), function (d) { dymo(d); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-cutup]'), function (d) { cutup(d); });
  }

  window.PB = { runningBand: runningBand, stitchMark: stitchMark, dymo: dymo, cutup: cutup,
    terminal: terminal, decode: decode, glitch: glitch, readout: readout, trace: trace,
    feed: feed, log: log, init: init };
})();
