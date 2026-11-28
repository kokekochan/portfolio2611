/* Dossier demos:
   1. SCHEDA offline search (Fig. 01)
   2. Garden of Despair Protocol 2.0 — 5-arm synthetic showcase & causal arm inspector (Fig. 02)
   3. Heine software preview in the section purple (Fig. 03)
   Plain JS, no framework. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ───────────── 1. SCHEDA: offline search demo ───────────── */
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

  /* ───────────── 2. Garden of Despair: Protocol 2.0 (5 Arms) ───────────── */
  var INK = '#1a1714', PAPER = '#ece4d3', MUTED = '#5e574e', RULE = '#b9ae99', PRUSSIAN = '#003153', SLATE = '#3b6998';

  function defs() {
    return '<defs>' +
      '<pattern id="god-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="6" height="6" fill="' + PAPER + '"/><line x1="0" y1="0" x2="0" y2="6" stroke="' + INK + '" stroke-width="2.1"/></pattern>' +
      '<pattern id="god-dots" width="6" height="6" patternUnits="userSpaceOnUse">' +
      '<rect width="6" height="6" fill="' + PAPER + '"/><rect x="1.5" y="1.5" width="2.2" height="2.2" fill="' + INK + '"/></pattern>' +
      '<pattern id="god-bluehatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">' +
      '<rect width="6" height="6" fill="' + PAPER + '"/><line x1="0" y1="0" x2="0" y2="6" stroke="' + PRUSSIAN + '" stroke-width="2.4"/></pattern>' +
      '</defs>';
  }

  function armFill(id) {
    if (id === 'control') return 'url(#god-dots)';
    if (id === 'salaried') return INK;
    if (id === 'precarious') return 'url(#god-hatch)';
    if (id === 'indebted') return 'url(#god-bluehatch)';
    return PRUSSIAN;
  }

  function render5ArmBars(metrics, g) {
    var W = 380, H = 300, L = 34, R = 10, T = 20, B = 58;
    var pw = W - L - R, ph = H - T - B;
    var gw = pw / metrics.length;
    var bw = Math.min(18, (gw - 22) / g.order.length);
    var out = [defs()];
    [0, 25, 50, 75, 100].forEach(function (v) {
      var y = T + ph - (v / 100) * ph;
      out.push('<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + (W - R) + '" y2="' + y.toFixed(1) + '" stroke="' + (v ? RULE : INK) + '" stroke-width="' + (v ? 1 : 1.5) + '"/>');
      out.push('<text x="' + (L - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="god-tick">' + v + '</text>');
    });
    metrics.forEach(function (m, mi) {
      var gx = L + mi * gw + gw / 2;
      var totalW = g.order.length * bw + (g.order.length - 1) * 3;
      var sx = gx - totalW / 2;
      g.order.forEach(function (armId, ai) {
        var arm = g.arms[armId];
        var v = Number(arm[m.key] || 0);
        var bh = Math.max(2, (Math.min(100, v) / 100) * ph);
        var x = sx + ai * (bw + 3);
        var y = T + ph - bh;
        out.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="' + armFill(armId) + '" stroke="' + INK + '" stroke-width="1.2"><title>' + esc(arm.code + ' ' + arm.label + ' · ' + m.label.replace('\n', ' ')) + ': ' + v + ' % (Beispieldaten)</title></rect>');
        out.push('<text x="' + (x + bw / 2).toFixed(1) + '" y="' + Math.max(12, y - 4).toFixed(1) + '" text-anchor="middle" class="god-val">' + v + '</text>');
      });
      m.label.split('\n').forEach(function (part, li) {
        out.push('<text x="' + gx.toFixed(1) + '" y="' + (H - B + 18 + li * 13) + '" text-anchor="middle" class="god-cat">' + esc(part.toUpperCase()) + '</text>');
      });
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="5-Arm-Modellvergleich: ' + esc(metrics.map(function (m) { return m.label.replace('\n', ' '); }).join(', ')) + '">' + out.join('') + '</svg>';
  }

  function renderFatigueTrajectory(g) {
    var W = 380, H = 300, L = 34, R = 14, T = 20, B = 42;
    var pw = W - L - R, ph = H - T - B, maxF = 18;
    var y = function (v) { return T + ph - (v / maxF) * ph; };
    var x = function (rd) { return L + ((rd - 1) / 5) * pw; };
    var out = [];
    [0, 3, 6, 9, 12, 15, 18].forEach(function (v) {
      var yy = y(v);
      out.push('<line x1="' + L + '" y1="' + yy.toFixed(1) + '" x2="' + (W - R) + '" y2="' + yy.toFixed(1) + '" stroke="' + (v ? RULE : INK) + '" stroke-width="' + (v ? 1 : 1.5) + '"/>');
      out.push('<text x="' + (L - 6) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" class="god-tick">' + v + '</text>');
    });
    for (var rd = 1; rd <= 6; rd++) {
      out.push('<text x="' + x(rd).toFixed(1) + '" y="' + (H - 16) + '" text-anchor="middle" class="god-cat">R0' + rd + '</text>');
    }
    var styles = {
      salaried: [INK, '2 3', 1.8],
      precarious: [MUTED, '5 3', 2.0],
      indebted: [SLATE, '4 2', 2.4],
      deep_meme: [PRUSSIAN, '', 2.8]
    };
    ['salaried', 'precarious', 'indebted', 'deep_meme'].forEach(function (armId) {
      var arm = g.arms[armId], st = styles[armId];
      var pts = arm.trajectory;
      out.push('<polyline fill="none" stroke="' + st[0] + '" stroke-width="' + st[2] + '" stroke-dasharray="' + st[1] + '" points="' +
        pts.map(function (p) { return x(p.round).toFixed(1) + ',' + y(p.fatigue).toFixed(1); }).join(' ') + '"/>');
      pts.forEach(function (p) {
        out.push('<rect x="' + (x(p.round) - 3).toFixed(1) + '" y="' + (y(p.fatigue) - 3).toFixed(1) + '" width="6" height="6" fill="' + st[0] + '" stroke="' + PAPER + '" stroke-width="1"><title>' + esc(arm.code + ' ' + arm.label) + ', Runde ' + p.round + ': Ermüdung ' + p.fatigue + ' (Erholungskosten +' + (p.fatigue * 350) + ')</title></rect>');
      });
    });
    /* Annotate causal delta A5 - A4 at round 6 */
    var y4 = y(g.arms.indebted.trajectory[5].fatigue), y5 = y(g.arms.deep_meme.trajectory[5].fatigue), x6 = x(6) - 10;
    out.push('<line x1="' + x6.toFixed(1) + '" y1="' + y4.toFixed(1) + '" x2="' + x6.toFixed(1) + '" y2="' + y5.toFixed(1) + '" stroke="' + PRUSSIAN + '" stroke-width="1.5"/>');
    out.push('<text x="' + (x6 - 6).toFixed(1) + '" y="' + ((y4 + y5) / 2 + 3).toFixed(1) + '" text-anchor="end" class="god-cat" fill="' + PRUSSIAN + '">Δ A5−A4</text>');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Ermüdungs- und Reproduktionskosten-Spirale über 6 Runden">' + out.join('') + '</svg>';
  }

  function initGarden() {
    var g = window.GARDEN_P2;
    if (!g) return;
    var a = document.getElementById('god-chart-promises');
    var b = document.getElementById('god-chart-craft');
    var c = document.getElementById('god-chart-despair');
    if (a) a.innerHTML = render5ArmBars([
      { key: 'passRate', label: 'Aufgaben\nbestanden' },
      { key: 'verifyEffort', label: 'Prüf-\naufwand' },
      { key: 'shortfallRisk', label: 'Defizit-\nrisiko' }
    ], g);
    if (b) b.innerHTML = render5ArmBars([
      { key: 'truthfulClaim', label: 'Ehrliche\nTestangabe' },
      { key: 'calibration', label: 'Kalib-\nrierung' }
    ], g);
    if (c) c.innerHTML = renderFatigueTrajectory(g);

    /* Interactive 5-arm causal inspector */
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-god-arm]'));
    var panel = document.getElementById('god-arm-detail');
    if (!buttons.length || !panel) return;
    function showArm(id) {
      var arm = g.arms[id];
      if (!arm) return;
      buttons.forEach(function (btn) {
        var on = btn.getAttribute('data-god-arm') === id;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      panel.innerHTML =
        '<dt>Arm</dt><dd><b>' + esc(arm.code + ' · ' + arm.full) + '</b></dd>' +
        '<dt>Kausale Isolation</dt><dd>' + esc(arm.isolates) + '</dd>' +
        '<dt>Lohn / Bonus</dt><dd>' + esc(arm.params.wage) + '</dd>' +
        '<dt>Schuld / Zins</dt><dd>' + esc(arm.params.debt) + '</dd>' +
        '<dt>Reproduktion</dt><dd>' + esc(arm.params.subsistence) + ' · Schocks: ' + esc(arm.params.shocks) + '</dd>' +
        '<dt>Framing</dt><dd>' + esc(arm.params.framing) + '</dd>';
    }
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { showArm(btn.getAttribute('data-god-arm')); });
    });
    showArm('deep_meme');
  }

  /* ───────────── 3. Heine software preview (section purple) ───────────── */
  var HEINE_OBJECTS = {
    tatami: {
      id: 'obj_014_tatami_hole',
      name: 'Tatami mit Loch (12 × 8 mm)',
      tool: 'TATAMI',
      thread: 'T-02 · VIOLETT #B77CFF',
      spacing: '0,40 mm (2,5 Reihen/mm)',
      length: '3,00 mm',
      angle: '0° (horizontal)',
      underlay: 'edge_walk (inset 0,4 mm)',
      comp: 'pull 0,20 mm · push 0,00 mm',
      trim: 'profile_controlled (AUTO)',
      stitches: '418 Stiche · 1 Sprung',
      hint: 'TATAMI · ENTER SCHLIESST RING · ZWEITES ENTER FÜR LOCH · WINKEL-FÜHRUNG HÄLT ÖFFNUNG FREI'
    },
    satin: {
      id: 'obj_009_satin_col_a',
      name: 'Satinsäule Column A (4 × 8 mm)',
      tool: 'SATIN',
      thread: 'T-01 · SILBER #D4D4CE',
      spacing: '0,40 mm',
      length: 'variabel (4,0–5,2 mm)',
      angle: 'dynamisch aus Rail-Paaren',
      underlay: 'center_walk (step 2,0 mm)',
      comp: 'pull 0,25 mm · push 0,00 mm',
      trim: 'always',
      stitches: '92 Stiche · 0 Sprünge',
      hint: 'COLUMN A · PAARWEISE LINKS/RECHTS KLICKEN · RESHAPE VERSCHIEBT ENDPAAR UND REGENERIERT UNTERLAGE'
    },
    elbow: {
      id: 'fix_001_elbow_dst',
      name: 'Referenzmotiv elbow.dst',
      tool: 'RUN',
      thread: 'T-03 · FLIEDER #D9BFFF',
      spacing: '— (Laufstich)',
      length: '2,00 mm (Raster 0,1 mm)',
      angle: 'folgt Pfad',
      underlay: 'keine',
      comp: 'pull 0,00 mm · push 0,00 mm',
      trim: 'never (1 Sprung ohne Schnitt)',
      stitches: '5 Stiche · 1 Sprung · PASS',
      hint: 'RUN · LINKSKLICK: ECKE · RECHTSKLICK: GLATTER KNOTEN · BACKSPACE: LETZTER PUNKT · ESC: VERWERFEN'
    }
  };

  function renderHeineSvg(key, state) {
    var showPoints = !state.thread && state.points;
    var showGuides = !state.thread && state.guides;
    var showTravel = !state.thread && state.travel;
    var out = [];
    /* 1mm coordinate grid */
    for (var gx = 0; gx <= 240; gx += 16) out.push('<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="152" stroke="rgba(212,212,206,.08)" stroke-width="1"/>');
    for (var gy = 0; gy <= 152; gy += 16) out.push('<line x1="0" y1="' + gy + '" x2="240" y2="' + gy + '" stroke="rgba(212,212,206,.08)" stroke-width="1"/>');

    if (key === 'tatami') {
      var strokeCol = state.thread ? '#b77cff' : '#d9bfff';
      /* Outer 12x8 rect: x 24..216, y 16..136; Hole: x 88..152, y 48..104 */
      for (var y = 20; y <= 132; y += 6) {
        if (y >= 48 && y <= 104) {
          out.push('<line x1="26" y1="' + y + '" x2="86" y2="' + y + '" stroke="' + strokeCol + '" stroke-width="' + (state.thread ? '3.4' : '1.6') + '"/>');
          out.push('<line x1="154" y1="' + y + '" x2="214" y2="' + y + '" stroke="' + strokeCol + '" stroke-width="' + (state.thread ? '3.4' : '1.6') + '"/>');
        } else {
          out.push('<line x1="26" y1="' + y + '" x2="214" y2="' + y + '" stroke="' + strokeCol + '" stroke-width="' + (state.thread ? '3.4' : '1.6') + '"/>');
        }
      }
      if (!state.thread) {
        out.push('<rect x="24" y="16" width="192" height="120" fill="none" stroke="#d4d4ce" stroke-width="1.5"/>');
        out.push('<rect x="88" y="48" width="64" height="56" fill="#121212" stroke="#b77cff" stroke-width="1.5" stroke-dasharray="4 3"/>');
      }
      if (showTravel) {
        out.push('<line x1="86" y1="76" x2="154" y2="76" stroke="#8f8aa0" stroke-width="1.5" stroke-dasharray="5 4"/>');
        out.push('<text x="120" y="71" text-anchor="middle" fill="#8f8aa0" font-family="var(--font-mono)" font-size="9">SPRUNG / TRIM</text>');
      }
      if (showGuides) {
        out.push('<line x1="18" y1="142" x2="222" y2="142" stroke="#b77cff" stroke-width="1.4"/>');
        out.push('<text x="120" y="149" text-anchor="middle" fill="#b77cff" font-family="var(--font-mono)" font-size="8.5">WINKEL 0° · LOCH FREI (X=4..8 MM)</text>');
      }
      if (showPoints) {
        [[26,20],[86,54],[154,54],[214,20],[26,132],[214,132],[86,96],[154,96]].forEach(function (p) {
          out.push('<rect x="' + (p[0] - 2) + '" y="' + (p[1] - 2) + '" width="4" height="4" fill="#d4d4ce"/>');
        });
      }
    } else if (key === 'satin') {
      var colS = state.thread ? '#d4d4ce' : '#b77cff';
      /* Left rail: (76,128)->(76,28); Right rail: (148,128)->(172,20) */
      var steps = 16, pts = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var lx = 76, ly = 128 - t * 100;
        var rx = 148 + t * 24, ry = 128 - t * 108;
        pts.push((i % 2 === 0 ? lx : rx).toFixed(1) + ',' + (i % 2 === 0 ? ly : ry).toFixed(1));
      }
      out.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + colS + '" stroke-width="' + (state.thread ? '4.2' : '2') + '"/>');
      if (!state.thread) {
        out.push('<line x1="76" y1="128" x2="76" y2="28" stroke="#d4d4ce" stroke-width="1.5"/>');
        out.push('<line x1="148" y1="128" x2="172" y2="20" stroke="#d4d4ce" stroke-width="1.5"/>');
      }
      if (showGuides) {
        out.push('<line x1="76" y1="128" x2="148" y2="128" stroke="#8f8aa0" stroke-width="1.4" stroke-dasharray="3 3"/>');
        out.push('<line x1="76" y1="28" x2="172" y2="20" stroke="#8f8aa0" stroke-width="1.4" stroke-dasharray="3 3"/>');
        out.push('<line x1="112" y1="128" x2="124" y2="24" stroke="#d9bfff" stroke-width="1.2" stroke-dasharray="4 3"/>');
      }
      if (showPoints) {
        pts.forEach(function (pair) {
          var xy = pair.split(',');
          out.push('<rect x="' + (Number(xy[0]) - 2) + '" y="' + (Number(xy[1]) - 2) + '" width="4" height="4" fill="#d4d4ce"/>');
        });
      }
    } else {
      var colE = state.thread ? '#d9bfff' : '#d9bfff';
      out.push('<polyline points="36,122 84,122 132,122 132,74" fill="none" stroke="' + colE + '" stroke-width="' + (state.thread ? '3.2' : '2.4') + '"/>');
      if (showTravel) {
        out.push('<line x1="132" y1="74" x2="204" y2="74" stroke="#8f8aa0" stroke-width="1.6" stroke-dasharray="6 4"/>');
        out.push('<text x="168" y="66" text-anchor="middle" fill="#8f8aa0" font-family="var(--font-mono)" font-size="9">JUMP</text>');
      }
      out.push('<line x1="204" y1="74" x2="204" y2="26" stroke="' + colE + '" stroke-width="' + (state.thread ? '3.2' : '2.4') + '"/>');
      if (showGuides) {
        out.push('<text x="84" y="138" text-anchor="middle" fill="#b77cff" font-family="var(--font-mono)" font-size="8.5">RUN 2,0 MM · ECKE EXAKT</text>');
      }
      if (showPoints) {
        [[36,122],[84,122],[132,122],[132,74],[204,74],[204,26]].forEach(function (p) {
          out.push('<rect x="' + (p[0] - 2.5) + '" y="' + (p[1] - 2.5) + '" width="5" height="5" fill="#d4d4ce"/>');
        });
      }
    }
    return '<svg viewBox="0 0 240 152" role="img" aria-label="Heine UI-Entwurf: ' + esc(HEINE_OBJECTS[key].name) + '">' + out.join('') + '</svg>';
  }

  function initHeineMockup() {
    var root = document.getElementById('heine-ui-mockup');
    if (!root) return;
    var canvas = root.querySelector('[data-heine-canvas]');
    var inspector = root.querySelector('[data-heine-inspector]');
    var status = root.querySelector('[data-heine-status]');
    var objBtns = Array.prototype.slice.call(root.querySelectorAll('[data-heine-obj]'));
    var togBtns = Array.prototype.slice.call(root.querySelectorAll('[data-heine-toggle]'));
    var state = { key: 'tatami', points: true, guides: true, travel: true, thread: false };

    function render() {
      var o = HEINE_OBJECTS[state.key];
      objBtns.forEach(function (b) {
        var on = b.getAttribute('data-heine-obj') === state.key;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      togBtns.forEach(function (b) {
        var k = b.getAttribute('data-heine-toggle');
        var on = !!state[k];
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (canvas) canvas.innerHTML = renderHeineSvg(state.key, state);
      if (inspector) {
        inspector.innerHTML =
          '<dt>Objekt-ID</dt><dd>' + esc(o.id) + '</dd>' +
          '<dt>Werkzeug</dt><dd><b>' + esc(o.tool) + '</b></dd>' +
          '<dt>Faden</dt><dd>' + esc(o.thread) + '</dd>' +
          '<dt>Abstand</dt><dd>' + esc(o.spacing) + '</dd>' +
          '<dt>Stichlänge</dt><dd>' + esc(o.length) + '</dd>' +
          '<dt>Winkel</dt><dd>' + esc(o.angle) + '</dd>' +
          '<dt>Unterlage</dt><dd>' + esc(o.underlay) + '</dd>' +
          '<dt>Kompensation</dt><dd>' + esc(o.comp) + '</dd>' +
          '<dt>Schnitt</dt><dd>' + esc(o.trim) + '</dd>' +
          '<dt>Ausgabe</dt><dd><b>' + esc(o.stitches) + '</b></dd>';
      }
      if (status) {
        status.textContent = (state.thread ? 'FADEN-VORSCHAU AKTIV (SPRÜNGE AUSGEBLENDET) · ' : '') + o.hint;
      }
    }

    objBtns.forEach(function (b) {
      b.addEventListener('click', function () { state.key = b.getAttribute('data-heine-obj'); render(); });
    });
    togBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-heine-toggle');
        state[k] = !state[k];
        render();
      });
    });
    render();
  }

  function boot() { initScheda(); initGarden(); initHeineMockup(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
