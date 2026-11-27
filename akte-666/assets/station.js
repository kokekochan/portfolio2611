/* AR-666 Datenstation · views, typed lines, red dither slots, live tracker. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }
  function stamp(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }

  /* ── Fit the fixed 1360×880 stage into the window ── */
  function fit() {
    var vv = window.visualViewport;
    var vw = vv ? vv.width : window.innerWidth;
    var vh = vv ? vv.height : window.innerHeight;
    var s = Math.min(vw / 1380, vh / 900);
    document.documentElement.style.setProperty('--s', s.toFixed(4));
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);

  /* ── Clock (year shown as 1983) ── */
  function tickClock() {
    var d = new Date(), t = stamp(d);
    $$('[data-clock]').forEach(function (c) { c.textContent = t; });
    $$('[data-date]').forEach(function (c) { c.textContent = pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.1983'; });
  }
  tickClock(); setInterval(tickClock, 1000);

  /* ── Tickers: duplicate content so the loop is seamless ── */
  $$('.ticker__run').forEach(function (run) { run.innerHTML += run.innerHTML; });

  /* ── Red ordered dither ── */
  var BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  var PAL = [[14, 2, 3], [92, 10, 12], [200, 30, 28], [255, 132, 108]];
  function dither(slot, img) {
    var cw = slot.clientWidth, ch = slot.clientHeight;
    if (!cw || !ch) return null;
    var px = Number(slot.getAttribute('data-px') || 2);
    var w = Math.max(8, Math.round(cw / px)), h = Math.max(8, Math.round(ch / px));
    var c = slot.querySelector('canvas') || document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d');
    var s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    g.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    var data;
    try { data = g.getImageData(0, 0, w, h); } catch (e) { return false; }
    var d = data.data, n = PAL.length - 1, k = Number(slot.getAttribute('data-contrast') || 1.25), bgcut = slot.hasAttribute('data-bgcut');
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = (y * w + x) * 4;
      if (bgcut && d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238) {
        d[i] = PAL[0][0]; d[i + 1] = PAL[0][1]; d[i + 2] = PAL[0][2]; d[i + 3] = 255;
        continue;
      }
      var l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      l = Math.min(1, Math.max(0, (l - 0.5) * k + 0.5));
      var f = l * n, t = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      var lv = Math.min(n, Math.floor(f) + ((f - Math.floor(f)) > t ? 1 : 0));
      d[i] = PAL[lv][0]; d[i + 1] = PAL[lv][1]; d[i + 2] = PAL[lv][2]; d[i + 3] = 255;
    }
    g.putImageData(data, 0, 0);
    if (!c.parentNode) slot.insertBefore(c, slot.firstChild);
    return true;
  }
  function render(slot) {
    if (!slot._img) return;
    var r = dither(slot, slot._img);
    if (r === false && !slot.querySelector('img.fallback')) {
      slot._img.className = 'fallback'; slot.insertBefore(slot._img, slot.firstChild);
    }
  }
  function show(slot, src) {
    var img = new Image();
    img.onload = function () {
      var old = slot.querySelector('img.fallback'); if (old) old.remove();
      slot._img = img; slot.classList.add('is-filled'); render(slot);
    };
    img.src = src;
  }
  var EXT = ['jpg', 'png', 'webp', 'jpeg'];
  var KNOWN = { 'katia-02': 'webp', 'katia-04': 'webp', 'katia-07': 'webp', 'katia-08': 'webp', 'katia-09': 'webp', 'katia-10': 'webp', 'katia-11': 'webp', 'katia-12': 'webp', 'katia-13': 'webp' };
  function probe(slot, name, k, list) {
    list = list || (KNOWN[name] ? [KNOWN[name]].concat(EXT.filter(function (x) { return x !== KNOWN[name]; })) : EXT);
    if (k >= list.length) return;
    var p = new Image();
    p.onload = function () { show(slot, p.src); };
    p.onerror = function () { probe(slot, name, k + 1, list); };
    p.src = 'bilder/' + name + '.' + list[k];
  }
  $$('.slot').forEach(function (slot) {
    var name = slot.getAttribute('data-img');
    ['tl', 'tr', 'bl', 'br'].forEach(function (k) { var e = document.createElement('i'); e.className = 'corner corner--' + k; slot.appendChild(e); });
    var hint = document.createElement('span');
    hint.className = 'slot__hint';
    hint.innerHTML = (slot.getAttribute('data-label') || 'Lichtbild') + '<small>bilder/' + name + '.jpg · ablegen · klicken</small>';
    slot.appendChild(hint);
    probe(slot, name, 0);
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    input.addEventListener('change', function () { if (input.files[0]) show(slot, URL.createObjectURL(input.files[0])); });
    slot.appendChild(input);
    slot.addEventListener('click', function () { input.click(); });
    slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('is-over'); });
    slot.addEventListener('dragleave', function () { slot.classList.remove('is-over'); });
    slot.addEventListener('drop', function (e) {
      e.preventDefault(); slot.classList.remove('is-over');
      var f = e.dataTransfer.files[0];
      if (f && f.type.indexOf('image/') === 0) show(slot, URL.createObjectURL(f));
    });
  });

  /* ── Typed lines per view ── */
  var typeTimer;
  function typeView(view) {
    clearTimeout(typeTimer);
    var box = $('[data-type]', view);
    if (!box) return;
    if (!box._lines) box._lines = $$('p', box).map(function (p) {
      var cur = p.querySelector('.cursor'); if (cur) cur.remove();
      return { p: p, t: p.textContent, html: p.innerHTML, cur: cur };
    });
    var lines = box._lines;
    if (reduce) { lines.forEach(function (L) { L.p.hidden = false; L.p.innerHTML = L.html; if (L.cur) L.p.appendChild(L.cur); }); return; }
    lines.forEach(function (L) { L.p.hidden = true; L.p.textContent = ''; });
    var j = 0;
    (function next() {
      if (j >= lines.length) return;
      var L = lines[j++], n = 0, sp = L.p.classList.contains('cmd') ? 34 : 10;
      L.p.hidden = false;
      (function type() {
        L.p.textContent = L.t.slice(0, ++n);
        if (n < L.t.length) typeTimer = setTimeout(type, sp);
        else { L.p.innerHTML = L.html; if (L.cur) L.p.appendChild(L.cur); typeTimer = setTimeout(next, 140); }
      })();
    })();
  }

  /* ── Views ── */
  var views = $$('.view'), btns = $$('[data-view]');
  function open(id) {
    views.forEach(function (v) { v.classList.toggle('is-on', v.id === id); });
    btns.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-view') === id); });
    var v = document.getElementById(id);
    if (!v) return;
    $$('.slot', v).forEach(render);
    typeView(v);
    var t = $('[data-now]'); if (t) t.textContent = v.getAttribute('data-title') || id;
    if (id === 'v-ortung') sizeTracker(big);
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-view')); }); });
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k >= '1' && k <= '9') {
      var target = $('.nav [data-view]:nth-of-type(' + k + ')');
      if (target) open(target.getAttribute('data-view'));
    }
    else if (k === 'Escape' || k === '0') open('v-boot');
    else if (k === 'h' || k === 'H') document.body.classList.toggle('clean');
  });
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { $$('.view.is-on .slot').forEach(render); sizeTracker(mini); sizeTracker(big); }, 150); });

  /* ── Faux real-time tracker ── */
  function makeTracker(canvas) { return { c: canvas, g: canvas.getContext('2d'), w: 0, h: 0, trail: [] }; }
  function sizeTracker(T) {
    if (!T) return;
    var r = T.c.getBoundingClientRect(), s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1;
    var w = Math.round(T.c.clientWidth), h = Math.round(T.c.clientHeight);
    if (!w || !h) return;
    T.w = w; T.h = h; T.c.width = w; T.c.height = h;
  }
  var mini = $('#trk-mini') && makeTracker($('#trk-mini'));
  var big = $('#trk-big') && makeTracker($('#trk-big'));
  sizeTracker(mini); sizeTracker(big);

  var t0 = performance.now();
  function pos(t) {
    // smooth wandering path, values in 0..1
    var a = t / 1000;
    return {
      x: 0.5 + 0.30 * Math.sin(a * 0.071) + 0.08 * Math.sin(a * 0.23 + 1.3),
      y: 0.5 + 0.26 * Math.sin(a * 0.053 + 2.1) + 0.07 * Math.cos(a * 0.19)
    };
  }
  var state = { lat: 0, lon: 0, kmh: 0, hdg: 0, sig: 82 };
  function draw(T, now, detail) {
    if (!T || !T.w) return;
    var g = T.g, w = T.w, h = T.h, a = (now - t0) / 1000;
    g.fillStyle = '#0a0303'; g.fillRect(0, 0, w, h);
    // grid
    var step = detail ? 60 : 34;
    g.strokeStyle = 'rgba(143,29,23,.35)'; g.lineWidth = 1;
    for (var x = (w / 2) % step; x < w; x += step) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, h); g.stroke(); }
    for (var y = (h / 2) % step; y < h; y += step) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(w, y + .5); g.stroke(); }
    if (detail) {
      g.fillStyle = 'rgba(143,29,23,.8)'; g.font = '11px Consolas, monospace';
      var cols = 'ABCDEFGHIJKL', ci = 0;
      for (x = (w / 2) % step; x < w; x += step) g.fillText(cols[ci++ % 12], x + 4, 12);
      var ri = 1;
      for (y = (h / 2) % step; y < h; y += step) g.fillText(String(ri++), 4, y - 4);
    }
    // range rings around the airbase
    var bx = w * 0.42, by = h * 0.58, R = Math.min(w, h);
    g.strokeStyle = 'rgba(255,58,46,.28)';
    [0.12, 0.24, 0.36].forEach(function (k) { g.beginPath(); g.arc(bx, by, R * k, 0, Math.PI * 2); g.stroke(); });
    // sweep
    var sw = (a * 0.9) % (Math.PI * 2);
    var grad = g.createRadialGradient(bx, by, 0, bx, by, R * 0.4);
    grad.addColorStop(0, 'rgba(255,58,46,.25)'); grad.addColorStop(1, 'rgba(255,58,46,0)');
    g.fillStyle = grad; g.beginPath(); g.moveTo(bx, by); g.arc(bx, by, R * 0.4, sw - 0.5, sw); g.closePath(); g.fill();
    // airbase marker
    g.strokeStyle = '#ff3a2e'; g.lineWidth = 1.5; g.strokeRect(bx - 5, by - 5, 10, 10);
    if (detail) { g.fillStyle = '#8f1d17'; g.font = '11px Consolas, monospace'; g.fillText("Militärflugplatz 'Felix Dscherschinski'", bx + 10, by + 4); }
    // trail + blip
    var p = pos(now - t0), px = p.x * w, py = p.y * h;
    T.trail.push([px, py]); if (T.trail.length > (detail ? 220 : 140)) T.trail.shift();
    for (var i = 1; i < T.trail.length; i++) {
      g.strokeStyle = 'rgba(255,58,46,' + (i / T.trail.length * 0.6).toFixed(3) + ')';
      g.beginPath(); g.moveTo(T.trail[i - 1][0], T.trail[i - 1][1]); g.lineTo(T.trail[i][0], T.trail[i][1]); g.stroke();
    }
    var pulse = 4 + 3 * Math.abs(Math.sin(a * 3));
    g.fillStyle = '#ffd0c2'; g.fillRect(px - 3, py - 3, 6, 6);
    g.strokeStyle = '#ff3a2e'; g.strokeRect(px - pulse - 3, py - pulse - 3, (pulse + 3) * 2, (pulse + 3) * 2);
    g.fillStyle = '#ff3a2e'; g.font = (detail ? '12' : '10') + 'px Consolas, monospace';
    g.fillText('W-01', px + 10, py - 8);
    if (detail) {
      g.strokeStyle = 'rgba(255,58,46,.45)'; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(px, 0); g.lineTo(px, h); g.moveTo(0, py); g.lineTo(w, py); g.stroke(); g.setLineDash([]);
    }
  }
  function updateState(now) {
    var t = now - t0, p = pos(t), q = pos(t - 1000);
    state.lat = 52.38 + (0.5 - p.y) * 0.9;
    state.lon = 13.06 + (p.x - 0.5) * 1.4;
    var dx = (p.x - q.x) * 1.4 * 68, dy = (q.y - p.y) * 0.9 * 111;
    var v = Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)); // screen units per second
    state.kmh = Math.min(140, 4 + v * 3000);
    state.hdg = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
    state.sig = Math.max(31, Math.min(99, state.sig + (Math.random() - 0.5) * 6));
    var f = function (v, d) { return v.toFixed(d); };
    $$('[data-trk=lat]').forEach(function (e) { e.textContent = f(state.lat, 4) + ' N'; });
    $$('[data-trk=lon]').forEach(function (e) { e.textContent = f(state.lon, 4) + ' O'; });
    $$('[data-trk=kmh]').forEach(function (e) { e.textContent = pad(Math.round(state.kmh), 3) + ' KM/H'; });
    $$('[data-trk=hdg]').forEach(function (e) { e.textContent = pad(Math.round(state.hdg), 3) + '°'; });
    $$('[data-trk=sig]').forEach(function (e) { e.textContent = Math.round(state.sig) + ' %'; });
    $$('[data-meter]').forEach(function (m) {
      var v = m.getAttribute('data-meter') === 'sig' ? state.sig : 30 + 60 * Math.abs(Math.sin(now / (3000 + m.textContent.length * 97)));
      m.querySelector('i').style.setProperty('--v', v.toFixed(0) + '%');
      m.querySelector('span:last-child').textContent = Math.round(v) + '%';
    });
    var nd = $('#hw-needle');
    if (nd) {
      var ang = (-46 + (state.sig / 100) * 92) * Math.PI / 180;
      nd.setAttribute('x2', (32 + 21 * Math.sin(ang)).toFixed(1));
      nd.setAttribute('y2', (36 - 21 * Math.cos(ang)).toFixed(1));
    }
  }
  var EVENTS = [
    'PEILUNG BESTAETIGT · SEKTOR %S',
    'OBJEKT W-01 IN BEWEGUNG',
    'FUNKSTILLE SEIT 00:%M',
    'POSTEN 3 MELDET SICHTKONTAKT',
    'SIGNAL SCHWACH · NACHFUEHRUNG',
    'KURSAENDERUNG ERFASST',
    'OBJEKT HAELT AN · SEKTOR %S',
    'RELAISSTATION NORD UEBERNIMMT',
    'ABGLEICH MIT ZENTRALE · BEREIT'
  ];
  var evLog = $('#trk-log');
  function addEvent() {
    if (!evLog) return;
    var s = 'ABCDEFGHIJKL'[Math.floor(Math.random() * 12)] + (1 + Math.floor(Math.random() * 9));
    var line = EVENTS[Math.floor(Math.random() * EVENTS.length)].replace('%S', s).replace('%M', pad(Math.floor(Math.random() * 59)));
    var p = document.createElement('p');
    p.innerHTML = '<span class="dimt">' + stamp(new Date()) + '</span>  ' + line;
    evLog.insertBefore(p, evLog.firstChild);
    while (evLog.children.length > 16) evLog.lastChild.remove();
  }
  for (var e = 0; e < 6; e++) addEvent();
  setInterval(addEvent, 3200);

  var last = 0;
  function loop(now) {
    if (mini && !mini.w) sizeTracker(mini);
    draw(mini, now, false);
    if (big && big.c.offsetParent) { if (!big.w) sizeTracker(big); draw(big, now, true); }
    if (now - last > 500) { updateState(now); last = now; }
    if (!reduce) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  if (reduce) setInterval(function () { loop(performance.now()); }, 1000);

  /* ── Startup Sign-In & Clearance Sequence ── */
  var gate = $('#gate'), gateLog = $('#gate-log'), gateStat = $('#gate-stat');
  var gateDone = false, gateTimer;
  function finishGate() {
    if (gateDone) return;
    gateDone = true;
    clearTimeout(gateTimer);
    if (gate) gate.classList.add('is-done');
    open('v-boot');
  }
  if (gate && gateLog && !reduce) {
    var STEPS = [
      { t: '> anmeldung --dienststelle HA1/4', d: 240 },
      { t: 'VERBINDUNG ZUR ZENTRALE .......... BEREIT', d: 300 },
      { t: 'BENUTZER: HA I / 4 · BEREICH AUFKLAERUNG', d: 280 },
      { t: 'KENNWORT: ********', d: 360 },
      { t: 'SICHERHEITSFREIGABE: STUFE II ... BESTAETIGT', d: 340 },
      { t: 'SONDERBERICHT W-01 (WALDHEIM) .... ENTSCHLUESSELT', d: 340 },
      { html: '<span class="inv">ZUGRIFF GEWAEHRT</span> · OEFFNE GESAMTBERICHT ...', d: 520, stat: 'FREIGABE STUFE II' }
    ];
    var si = 0;
    (function step() {
      if (gateDone) return;
      if (si >= STEPS.length) { finishGate(); return; }
      var item = STEPS[si++];
      var p = document.createElement('p');
      if (item.html) p.innerHTML = item.html;
      else p.textContent = item.t;
      gateLog.appendChild(p);
      if (item.stat && gateStat) gateStat.textContent = item.stat;
      gateTimer = setTimeout(step, item.d);
    })();
    gate.addEventListener('click', finishGate);
    document.addEventListener('keydown', function onGateKey(e) {
      if (!gateDone && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
        document.removeEventListener('keydown', onGateKey);
        finishGate();
      }
    });
  } else {
    finishGate();
  }

  /* ── Bio sub-tabs (Blatt 3a / 3b) ── */
  var bioTabs = $$('[data-bio-tab]'), bioPanes = $$('#v-bio .bio-pane');
  bioTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-bio-tab');
      bioTabs.forEach(function (t) { t.classList.toggle('is-on', t === tab); });
      bioPanes.forEach(function (p) { p.classList.toggle('is-on', p.id === target); });
      if (target === 'bio-motive') typeView($('#v-bio'));
    });
  });

  /* ── Hardware Touch Controls (H, P) ── */
  var btnClean = $('#btn-clean');
  if (btnClean) btnClean.addEventListener('click', function () { document.body.classList.toggle('clean'); btnClean.classList.toggle('is-on'); });
  var btnGate = $('#btn-gate');
  if (btnGate) btnGate.addEventListener('click', function () { location.reload(); });
})();
