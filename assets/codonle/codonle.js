/* Codonle: a daily Wordle-style game on the genetic code.
   Stage 1  guess the mRNA codon (4 attempts, Wordle feedback)
   Stage 2  pick the matching tRNA anticodon (4 options)
   Stage 3  pick the amino acid it codes for (4 options, STOP included)  */
(function () {
  'use strict';

  var AA = window.CODONLE_AA;
  var BASES = ['U', 'C', 'A', 'G'];
  var TABLE = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  var CODE = {};
  (function () {
    var i = 0;
    BASES.forEach(function (a) { BASES.forEach(function (b) { BASES.forEach(function (c) {
      CODE[a + b + c] = TABLE[i++];
    }); }); });
  })();
  var CODONS = Object.keys(CODE);
  var COMP = { A: 'U', U: 'A', G: 'C', C: 'G' };
  var MAX_TRIES = 4;
  var STORE = 'codonle:v1';

  /* ---------- helpers ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rand) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function dayNumber(key) {
    var p = key.split('-').map(Number);
    return Math.floor((Date.UTC(p[0], p[1] - 1, p[2]) - Date.UTC(2026, 9, 8)) / 864e5) + 1;
  }
  function antiCodon(c) { return COMP[c[2]] + COMP[c[1]] + COMP[c[0]]; } // written 5'->3'
  function el(html) { var t = document.createElement('div'); t.innerHTML = html.trim(); return t.firstChild; }

  /* ---------- persistence ---------- */
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE)); if (s && s.days) return s; } catch (e) {}
    return { days: {}, practice: 0 };
  }
  function save(s) { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {} }

  /* ---------- feedback ---------- */
  function score(guess, answer) {
    var res = ['absent', 'absent', 'absent'], left = {};
    for (var i = 0; i < 3; i++) {
      if (guess[i] === answer[i]) res[i] = 'correct';
      else left[answer[i]] = (left[answer[i]] || 0) + 1;
    }
    for (var j = 0; j < 3; j++) {
      if (res[j] !== 'correct' && left[guess[j]]) { res[j] = 'present'; left[guess[j]]--; }
    }
    return res;
  }

  /* ---------- options ---------- */
  function anticodonOptions(codon, rand) {
    var right = antiCodon(codon);
    var cands = [
      COMP[codon[0]] + COMP[codon[1]] + COMP[codon[2]],        // complement, not reversed
      codon[2] + codon[1] + codon[0],                          // reversed, not complemented
      codon                                                    // the codon itself
    ];
    var mut = right.split(''); var p = Math.floor(rand() * 3);
    mut[p] = shuffle('ACGU'.split('').filter(function (b) { return b !== mut[p]; }), rand)[0];
    cands.push(mut.join(''));
    var set = [right];
    cands.forEach(function (c) { if (set.indexOf(c) < 0) set.push(c); });
    while (set.length < 4) {
      var r = shuffle(CODONS, rand)[0];
      if (set.indexOf(r) < 0) set.push(r);
    }
    return shuffle(set.slice(0, 4), rand);
  }
  function aminoOptions(codon, rand) {
    var right = CODE[codon], set = [right];
    var near = [];
    for (var i = 0; i < 3; i++) 'ACGU'.split('').forEach(function (b) {
      if (b === codon[i]) return;
      var n = codon.slice(0, i) + b + codon.slice(i + 1), a = CODE[n];
      if (near.indexOf(a) < 0 && a !== right) near.push(a);
    });
    shuffle(near, rand).forEach(function (a) { if (set.length < 4 && set.indexOf(a) < 0) set.push(a); });
    var all = Object.keys(AA);
    shuffle(all, rand).forEach(function (a) { if (set.length < 4 && set.indexOf(a) < 0) set.push(a); });
    return shuffle(set, rand);
  }

  /* ---------- game ---------- */
  var root = document.getElementById('codonle');
  if (!root) return;
  var store = load();
  var mode = 'daily';
  var G; // current game state

  function newGame(kind) {
    var codon, key, rand;
    if (kind === 'daily') {
      key = today();
      if (store.days[key]) return store.days[key];
      codon = CODONS[hash('codonle-' + key) % CODONS.length];
      rand = rng(hash('opt-' + key));
    } else {
      store.practice = (store.practice || 0) + 1; save(store);
      var seed = (Math.random() * 4294967296) >>> 0;
      rand = rng(seed); codon = CODONS[Math.floor(rand() * CODONS.length)];
      key = 'practice';
    }
    var st = { key: key, kind: kind, codon: codon, guesses: [], cur: '', stage: 1,
               s1: null, s2: null, s3: null,
               o2: anticodonOptions(codon, rand), o3: aminoOptions(codon, rand), done: false };
    if (kind === 'daily') { store.days[key] = st; save(store); }
    return st;
  }
  function persist() { if (G.kind === 'daily') { store.days[G.key] = G; save(store); } }

  function stats() {
    var s = { played: 0, solved: 0, dist: [0, 0, 0, 0], fail: 0, a2: 0, a3: 0, streak: 0, best: 0 };
    var keys = Object.keys(store.days).sort();
    var run = 0;
    keys.forEach(function (k) {
      var d = store.days[k]; if (!d.done) return;
      s.played++;
      if (d.s1 && d.s1.solved) { s.solved++; s.dist[d.s1.attempts - 1]++; run++; if (run > s.best) s.best = run; }
      else { s.fail++; run = 0; }
      if (d.s2 && d.s2.correct) s.a2++;
      if (d.s3 && d.s3.correct) s.a3++;
    });
    // current streak: consecutive solved days ending today or yesterday
    var cur = 0, d0 = new Date();
    for (var i = 0; i < 400; i++) {
      var dt = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() - i);
      var kk = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      var dd = store.days[kk];
      if (dd && dd.done && dd.s1 && dd.s1.solved) cur++;
      else if (i === 0 && !(dd && dd.done)) continue; // today not finished yet
      else break;
    }
    s.streak = cur;
    return s;
  }

  /* ---------- rendering ---------- */
  function tile(ch, cls) { return '<span class="cdl-tile ' + (cls || '') + '">' + (ch || '') + '</span>'; }

  function renderBoard() {
    var rows = '';
    for (var r = 0; r < MAX_TRIES; r++) {
      var g = G.guesses[r], html = '';
      if (g) {
        var sc = score(g, G.codon);
        for (var i = 0; i < 3; i++) html += tile(g[i], sc[i]);
      } else if (r === G.guesses.length && G.stage === 1 && !G.done) {
        for (var j = 0; j < 3; j++) html += tile(G.cur[j], G.cur[j] ? 'typing' : '');
      } else { html = tile('') + tile('') + tile(''); }
      rows += '<div class="cdl-row">' + html + '</div>';
    }
    return '<div class="cdl-board" aria-label="Guesses">' + rows + '</div>';
  }

  function keyStates() {
    var st = {};
    var rank = { absent: 1, present: 2, correct: 3 };
    G.guesses.forEach(function (g) {
      var sc = score(g, G.codon);
      for (var i = 0; i < 3; i++) if (!st[g[i]] || rank[sc[i]] > rank[st[g[i]]]) st[g[i]] = sc[i];
    });
    return st;
  }

  function renderKeys() {
    var ks = keyStates();
    var h = '<div class="cdl-keys">';
    ['A', 'U', 'G', 'C'].forEach(function (b) {
      h += '<button type="button" class="cdl-key ' + (ks[b] || '') + '" data-key="' + b + '">' + b + '</button>';
    });
    h += '<button type="button" class="cdl-key wide" data-key="Backspace" aria-label="Delete">⌫</button>';
    h += '<button type="button" class="cdl-key wide enter" data-key="Enter">Enter</button></div>';
    return h;
  }

  function renderOptions(list, kind) {
    var chosen = kind === 2 ? G.s2 : G.s3, h = '<div class="cdl-options">';
    list.forEach(function (o) {
      var cls = '';
      if (chosen) {
        if (o === chosen.right) cls = 'right'; else if (o === chosen.choice) cls = 'wrong'; else cls = 'dim';
      }
      var label = kind === 2 ? '5′-' + o + '-3′' : (AA[o].three === 'Stop' ? 'Stop' : AA[o].name + ' <small>' + AA[o].three + '</small>');
      h += '<button type="button" class="cdl-opt ' + cls + '" data-opt="' + o + '" ' + (chosen ? 'disabled' : '') + '>' + label + '</button>';
    });
    return h + '</div>';
  }

  function pairing(codon) {
    var anti = antiCodon(codon), top = '', mid = '', bot = '';
    for (var i = 0; i < 3; i++) {
      top += '<span>' + codon[i] + '</span>'; mid += '<i></i>'; bot += '<span>' + anti[2 - i] + '</span>';
    }
    return '<div class="cdl-pair" aria-label="codon-anticodon pairing"><div><b>mRNA</b><em>5′</em>' + top + '<em>3′</em></div><div class="bonds">' + mid + '</div><div><b>tRNA</b><em>3′</em>' + bot + '<em>5′</em></div></div>';
  }

  function resultCard() {
    var a = AA[CODE[G.codon]], syn = CONSYN(CODE[G.codon]);
    var chips = syn.map(function (c) { return '<span class="chip' + (c === G.codon ? ' me' : '') + '">' + c + '</span>'; }).join('');
    return '<div class="cdl-result cls-' + a.cls + '"><div class="cdl-structure">' + a.svg + '</div>' +
      '<div class="cdl-resbody"><div class="cdl-resname">' + (a.three === 'Stop' ? 'Stop codon' : a.name) + '</div>' +
      '<div class="cdl-reslabel">' + (a.three === 'Stop' ? 'Translation ends here; a release factor binds instead of a tRNA.' : classText(a.cls) + ' · ' + a.three + ' · ' + one(CODE[G.codon])) + '</div>' +
      '<div class="cdl-chips"><span>Synonymous codons</span>' + chips + '</div></div></div>';
  }
  function one(c) { return c === '*' ? '' : c; }
  function classText(c) {
    return { nonpolar: 'Nonpolar, aliphatic', aromatic: 'Aromatic', polar: 'Polar, uncharged', acidic: 'Acidic (negative)', basic: 'Basic (positive)' }[c];
  }
  function CONSYN(aa) { return CODONS.filter(function (c) { return CODE[c] === aa; }); }

  function shareText() {
    var rows = G.guesses.map(function (g) {
      return score(g, G.codon).map(function (s) { return s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛'; }).join('');
    }).join('\n');
    var n = G.s1 && G.s1.solved ? G.s1.attempts + '/' + MAX_TRIES : 'X/' + MAX_TRIES;
    return 'Codonle #' + dayNumber(G.key) + ' ' + n + '\n' + rows + '\nanticodon ' + (G.s2 && G.s2.correct ? '✅' : '❌') +
      ' · amino acid ' + (G.s3 && G.s3.correct ? '✅' : '❌') + '\nandreeedna.github.io/codonle';
  }

  function render(msg) {
    var head = G.kind === 'daily' ? 'Codonle #' + dayNumber(G.key) + ' · ' + G.key : 'Practice codon';
    var stage = G.done ? 3 : G.stage;
    var steps = ['Codon', 'Anticodon', 'Amino acid'].map(function (t, i) {
      var n = i + 1, cls = G.done || n < G.stage ? 'done' : n === G.stage ? 'on' : '';
      return '<li class="' + cls + '"><span>' + n + '</span>' + t + '</li>';
    }).join('');
    var h = '<div class="cdl-top"><div class="cdl-date">' + head + '</div><ol class="cdl-steps">' + steps + '</ol></div>';

    if (G.stage === 1) {
      h += '<p class="cdl-prompt">Guess the hidden mRNA codon. Letters: A, U, G, C. You have ' + MAX_TRIES + ' attempts.</p>' + renderBoard();
      if (!G.done) h += '<div class="cdl-msg" role="status">' + (msg || '') + '</div>' + renderKeys();
    } else {
      h += renderBoard();
      var solved = G.s1 && G.s1.solved;
      h += '<p class="cdl-note">' + (solved ? 'Codon found in ' + G.s1.attempts + (G.s1.attempts === 1 ? ' attempt.' : ' attempts.')
        : 'Out of attempts. The codon was <b>' + G.codon + '</b>.') + '</p>';
    }
    if (G.stage >= 2) {
      h += '<section class="cdl-stage"><h3>Which anticodon pairs with <span class="mono">' + G.codon + '</span>?</h3>' +
        '<p class="cdl-hint">Anticodons are written 5′→3′, and pairing is antiparallel.</p>' + renderOptions(G.o2, 2);
      if (G.s2) h += pairing(G.codon) + '<p class="cdl-note">' + (G.s2.correct ? 'Correct.' : 'Not quite: the right answer is <b>' + G.s2.right + '</b>.') + '</p>';
      h += '</section>';
    }
    if (G.stage >= 3) {
      h += '<section class="cdl-stage"><h3>Which amino acid does <span class="mono">' + G.codon + '</span> encode?</h3>' + renderOptions(G.o3, 3);
      if (G.s3) h += '<p class="cdl-note">' + (G.s3.correct ? 'Correct.' : 'Not quite.') + '</p>';
      h += '</section>';
    }
    if (G.done) {
      h += resultCard();
      h += '<div class="cdl-actions"><button type="button" class="cdl-btn" data-act="share">Copy result</button>' +
        '<button type="button" class="cdl-btn ghost" data-act="practice">Practice with a random codon</button></div>';
      if (G.kind === 'daily') h += '<p class="cdl-note small">A new codon arrives every day at midnight.</p>';
    }
    h += renderStats();
    root.innerHTML = h;
  }

  function renderStats() {
    var s = stats();
    var max = Math.max.apply(null, s.dist.concat([1]));
    var bars = s.dist.map(function (n, i) {
      return '<div class="bar"><span>' + (i + 1) + '</span><div><i style="width:' + Math.max(n ? 8 : 2, 100 * n / max) + '%"></i></div><em>' + n + '</em></div>';
    }).join('') + '<div class="bar miss"><span>×</span><div><i style="width:' + Math.max(s.fail ? 8 : 2, 100 * s.fail / max) + '%"></i></div><em>' + s.fail + '</em></div>';
    var pct = function (n) { return s.played ? Math.round(100 * n / s.played) + '%' : '–'; };
    return '<details class="cdl-stats"' + (G.done ? ' open' : '') + '><summary>Your statistics</summary>' +
      '<div class="grid"><div><b>' + s.played + '</b>played</div><div><b>' + pct(s.solved) + '</b>codon solved</div>' +
      '<div><b>' + s.streak + '</b>current streak</div><div><b>' + s.best + '</b>best streak</div>' +
      '<div><b>' + pct(s.a2) + '</b>anticodon right</div><div><b>' + pct(s.a3) + '</b>amino acid right</div></div>' +
      '<div class="dist"><h4>Attempts to find the codon</h4>' + bars + '</div>' +
      '<p class="cdl-note small">Statistics are saved in this browser only. Practice rounds are not counted.</p></details>';
  }

  /* ---------- interaction ---------- */
  function submit() {
    if (G.cur.length < 3) return render('Type three letters first.');
    G.guesses.push(G.cur);
    var win = G.cur === G.codon;
    G.cur = '';
    if (win || G.guesses.length >= MAX_TRIES) {
      G.s1 = { solved: win, attempts: G.guesses.length };
      G.stage = 2;
    }
    persist(); render();
  }
  function press(k) {
    if (G.stage !== 1 || G.done) return;
    if (k === 'Enter') return submit();
    if (k === 'Backspace') { G.cur = G.cur.slice(0, -1); persist(); return render(); }
    if (/^[AUGC]$/.test(k) && G.cur.length < 3) { G.cur += k; persist(); render(); }
  }
  function choose(o) {
    if (G.stage === 2 && !G.s2) {
      var right = antiCodon(G.codon);
      G.s2 = { choice: o, right: right, correct: o === right };
      G.stage = 3;
    } else if (G.stage === 3 && !G.s3) {
      var r = CODE[G.codon];
      G.s3 = { choice: o, right: r, correct: o === r };
      G.done = true;
    } else return;
    persist(); render();
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-key],[data-opt],[data-act]'); if (!t) return;
    if (t.dataset.key) press(t.dataset.key);
    else if (t.dataset.opt) choose(t.dataset.opt);
    else if (t.dataset.act === 'practice') { G = newGame('practice'); render(); }
    else if (t.dataset.act === 'share') {
      var txt = shareText();
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { t.textContent = 'Copied'; }, function () { window.prompt('Copy your result:', txt); });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    if (k === 'Enter' || k === 'Backspace') { if (G.stage === 1 && !G.done && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); press(k); } return; }
    if (k.length === 1) { var u = k.toUpperCase(); if (u === 'T') u = 'U'; press(u); }
  });

  G = newGame('daily');
  render();
})();
