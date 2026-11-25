/* Dossier demos: SCHEDA offline search (Fig. 01) and Garden of Despair charts (Fig. 02).
   Plain JS, no framework. Charts are ported from the Garden of Despair web observatory. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ───────────── SCHEDA: offline search demo ───────────── */
  var ALIASES = {
    'blauer reiter': 'The Blue Rider', 'der blaue reiter': 'The Blue Rider', 'blue rider': 'The Blue Rider',
    'futurismus': 'Futurism', 'futurist': 'Futurism', 'futuristen': 'Futurism',
    'sironi': 'Mario Sironi', 'schiele': 'Egon Schiele'
  };
  var KIND = { 'Mario Sironi': 'Künstler', 'Egon Schiele': 'Künstler', 'The Blue Rider': 'Bewegung', 'Futurism': 'Bewegung' };
  var LABEL = { 'The Blue Rider': 'Der Blaue Reiter', 'Futurism': 'Futurismus' };
  var RIGHTS = { public_domain: 'Gemeinfrei', cc0: 'CC0', cc_by: 'CC BY', unknown: 'Rechte unklar' };

  function initScheda() {
    var root = document.getElementById('scheda-demo');
    var data = window.SCHEDA_DEMO;
    if (!root || !data) return;
    var form = root.querySelector('form');
    var input = root.querySelector('input');
    var log = root.querySelector('[data-demo-log]');
    var grid = root.querySelector('[data-demo-grid]');
    var count = root.querySelector('[data-demo-count]');
    var timers = [];

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { if (reduce) fn(); else timers.push(setTimeout(fn, ms)); }

    function resolve(q) {
      var k = q.trim().toLowerCase();
      if (!k) return null;
      if (ALIASES[k]) return { subject: ALIASES[k] };
      var subjects = Object.keys(KIND);
      for (var i = 0; i < subjects.length; i++) if (subjects[i].toLowerCase().indexOf(k) > -1) return { subject: subjects[i] };
      return { text: k };
    }

    function card(r, n) {
      var meta = [r.m, r.i].filter(Boolean).map(esc).join(' · ');
      return '<article class="scheda-card">' +
        '<div class="scheda-card__top"><span class="pb-fig">Fig. ' + String(n).padStart(2, '0') + '</span>' +
        '<span class="scheda-card__rights' + (r.rights === 'unknown' ? ' is-unknown' : '') + '">' + esc(RIGHTS[r.rights] || r.rights) + '</span></div>' +
        '<h4 class="scheda-card__title">' + esc(r.t) + '</h4>' +
        '<p class="scheda-card__who">' + esc(r.a) + ' · ' + esc(r.y) + '</p>' +
        (meta ? '<p class="scheda-card__meta">' + meta + '</p>' : '') +
        '<p class="scheda-card__src">Quelle: ' + esc(r.src) + (r.conf ? ' · ' + (r.conf === 'confirmed' ? 'bestätigt' : 'wahrscheinlich') : '') + '</p>' +
        '</article>';
    }

    function line(text, cls) {
      var p = document.createElement('p');
      p.className = 'pb-term__line' + (cls ? ' ' + cls : '');
      p.textContent = text;
      log.appendChild(p);
    }

    function run(q) {
      clear();
      log.innerHTML = '';
      grid.innerHTML = '';
      count.textContent = '0 Werke';
      line('suche "' + q + '"', 'pb-term__line--cmd');
      var r = resolve(q);
      var hits;
      if (!r) { line('Bitte einen Namen, eine Bewegung oder einen Titel eingeben.'); return; }
      if (r.subject) {
        hits = data.filter(function (d) { return d.q === r.subject; });
        later(function () { line('Verstanden: ' + KIND[r.subject] + ' · ' + (LABEL[r.subject] || r.subject)); }, 260);
      } else {
        hits = data.filter(function (d) { return (d.t + ' ' + d.a + ' ' + d.i).toLowerCase().indexOf(r.text) > -1; });
        later(function () { line('Verstanden: Freitext · Titel, Künstler, Sammlung'); }, 260);
      }
      later(function () { line('Quellen: Wikidata · WikiArt · Museums-APIs · Commons', 'pb-term__line--dim'); }, 520);
      later(function () {
        if (!hits.length) { line('Keine Treffer in den Beispieldaten. Versuch: Sironi, Schiele, Blauer Reiter, Futurismus.', 'pb-term__line--hl'); return; }
        var pd = hits.filter(function (h) { return h.rights !== 'unknown'; }).length;
        line(hits.length + ' Werke gefunden · ' + pd + ' mit freien Rechten', 'pb-term__line--hl');
        hits.forEach(function (h, i) {
          later(function () {
            grid.insertAdjacentHTML('beforeend', card(h, i + 1));
            count.textContent = (i + 1) + (i ? ' Werke' : ' Werk');
          }, 90 * i);
        });
      }, 820);
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); });
    root.querySelectorAll('[data-demo-q]').forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.getAttribute('data-demo-q'); run(input.value); });
    });
    input.value = 'Mario Sironi';
    run(input.value);
  }

  /* ───────────── Garden of Despair: charts ───────────── */
  var REGIMES = ['secure', 'precarious', 'debt'];
  var REGIME_LABELS = { secure: 'Abgesichert', precarious: 'Prekär', debt: 'Verschuldet' };
  var INK = '#1a1714', PAPER = '#ece4d3', MUTED = '#5e574e', RULE = '#b9ae99', RED = '#b8001f';

  function defs() {
    return '<defs><pattern id="god-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="6" height="6" fill="' + PAPER + '"/><line x1="0" y1="0" x2="0" y2="6" stroke="' + INK + '" stroke-width="2.2"/></pattern></defs>';
  }
  function fill(r) { return r === 'secure' ? INK : r === 'precarious' ? 'url(#god-hatch)' : RED; }

  function bars(cats, s) {
    var W = 360, H = 300, L = 34, R = 8, T = 16, B = 58;
    var pw = W - L - R, ph = H - T - B, gw = pw / cats.length, bw = Math.min(22, (gw - 14) / 3);
    var out = [defs()];
    [0, 25, 50, 75, 100].forEach(function (v) {
      var y = T + ph - v / 100 * ph;
      out.push('<line x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y + '" stroke="' + (v ? RULE : INK) + '" stroke-width="' + (v ? 1 : 1.5) + '"/>');
      out.push('<text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end" class="god-tick">' + v + '</text>');
    });
    cats.forEach(function (c, ci) {
      var gx = L + ci * gw + gw / 2, sx = gx - (3 * bw + 6) / 2;
      REGIMES.forEach(function (r, ri) {
        var v = Number(s.regimes[r][c.key] || 0), bh = Math.max(1, Math.min(100, v) / 100 * ph);
        var x = sx + ri * (bw + 3), y = T + ph - bh;
        out.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="' + fill(r) + '" stroke="' + INK + '" stroke-width="1.2"><title>' + REGIME_LABELS[r] + ', ' + c.label + ': ' + v + ' %</title></rect>');
        out.push('<text x="' + (x + bw / 2).toFixed(1) + '" y="' + Math.max(11, y - 4).toFixed(1) + '" text-anchor="middle" class="god-val">' + Math.round(v) + '</text>');
      });
      c.label.split('\n').forEach(function (part, li) {
        out.push('<text x="' + gx.toFixed(1) + '" y="' + (H - B + 18 + li * 13) + '" text-anchor="middle" class="god-cat">' + esc(part.toUpperCase()) + '</text>');
      });
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(cats.map(function (c) { return c.label.replace('\n', ' '); }).join(', ')) + '">' + out.join('') + '</svg>';
  }

  function trajectory(key, min, max, s) {
    var W = 360, H = 300, L = 34, R = 12, T = 16, B = 40;
    var pw = W - L - R, ph = H - T - B, span = max - min;
    var y = function (v) { return T + ph - (v - min) / span * ph; };
    var x = function (sh) { return L + (sh - 1) / 6 * pw; };
    var out = [];
    for (var i = 0; i <= 5; i++) {
      var v = min + span * i / 5, yy = y(v);
      out.push('<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (W - R) + '" y2="' + yy.toFixed(1) + '" stroke="' + (i ? RULE : INK) + '" stroke-width="' + (i ? 1 : 1.5) + '"/>');
      out.push('<text x="' + (L - 6) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" class="god-tick">' + Math.round(v) + '</text>');
    }
    for (var sh = 1; sh <= 7; sh++) out.push('<text x="' + x(sh).toFixed(1) + '" y="' + (H - 16) + '" text-anchor="middle" class="god-cat">S0' + sh + '</text>');
    var st = { secure: [INK, ''], precarious: [MUTED, '5 3'], debt: [RED, ''] };
    REGIMES.forEach(function (r) {
      var pts = s.regimes[r].trajectory.filter(function (p) { return p[key] != null; });
      out.push('<polyline fill="none" stroke="' + st[r][0] + '" stroke-width="2.4" stroke-dasharray="' + st[r][1] + '" points="' + pts.map(function (p) { return x(p.shift).toFixed(1) + ',' + y(p[key]).toFixed(1); }).join(' ') + '"/>');
      pts.forEach(function (p) {
        out.push('<rect x="' + (x(p.shift) - 3).toFixed(1) + '" y="' + (y(p[key]) - 3).toFixed(1) + '" width="6" height="6" fill="' + st[r][0] + '" stroke="' + PAPER + '" stroke-width="1"><title>' + REGIME_LABELS[r] + ', Schicht ' + p.shift + ': ' + p[key] + '</title></rect>');
      });
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Verzweiflung im Tagebuch je Schicht, 0 bis 10">' + out.join('') + '</svg>';
  }

  function initGarden() {
    var s = window.GARDEN_SUMMARY;
    if (!s) return;
    var a = document.getElementById('god-chart-promises');
    var b = document.getElementById('god-chart-craft');
    var c = document.getElementById('god-chart-despair');
    if (a) a.innerHTML = bars([
      { key: 'survivalPct', label: 'Überlebt' },
      { key: 'maraSchoolPct', label: 'Mara zur\nSchule' },
      { key: 'pressBoughtPct', label: 'Presse\ngekauft' },
      { key: 'bothPromisesKeptPct', label: 'Beides\ngehalten' }
    ], s);
    if (b) b.innerHTML = bars([
      { key: 'deepCheckPct', label: 'Gründlich\ngeprüft' },
      { key: 'trueAccuracyPct', label: 'Genauigkeit' },
      { key: 'bribeAcceptPct', label: 'Bestechung\nangenommen' },
      { key: 'fudgeAcceptPct', label: 'Zahlen\ngeschönt' }
    ], s);
    if (c) c.innerHTML = trajectory('meanDespair', 0, 10, s);
  }

  function boot() { initScheda(); initGarden(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
