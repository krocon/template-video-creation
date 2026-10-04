/**
 * Kernpunkte: Stepper (01–04) + je Punkt eine Karte mit Code und einer kleinen Erklär-Visualisierung.
 */
(function () {
  const LC = (window.LC = window.LC || {});

  const CODE = (t) => [
    ["model = signal({ email: '', age: 18 });", 'loginForm = form(this.model);'],
    ['<input [formField]="loginForm.email" />'],
    [
      'loginForm = form(this.model, (s) => {',
      `  required(s.email, { message: '${t.requiredMsg}' });`,
      '  email(s.email);',
      '  min(s.age, 18);',
      '});',
    ],
    [
      '<button [disabled]="!loginForm().valid()">',
      '@if (loginForm.email().touched()) {',
      '  {{ loginForm.email().errors()[0]?.message }}',
      '}',
    ],
  ];

  const VIZ = (t) => [
    `<div class="wrap-viz">
       <div class="wrap-outer" id="p1-outer"><span class="wrap-label">${t.wrapOuter}</span>
         <div class="wrap-inner" id="p1-inner">${t.wrapInner}</div>
       </div>
     </div>`,
    `<div class="sync-viz">
       <div class="sync-box" id="p2-input"><span class="sync-cap">&lt;input&gt;</span><span class="sync-val">${t.inputValue}</span></div>
       <div class="sync-arrows" id="p2-arrows"><span>→</span><span>←</span></div>
       <div class="sync-box model" id="p2-model"><span class="sync-cap">model</span><span class="sync-val mono">email: '${t.inputValue}'</span></div>
     </div>`,
    `<div class="err-viz">
       <div class="err-input" id="p3-input"></div>
       <div class="err-bubble" id="p3-msg">⚠ ${t.requiredMsg}</div>
     </div>`,
    `<div class="pill-viz">
       <span class="state-pill" id="p4-pill-1">valid()</span>
       <span class="state-pill" id="p4-pill-2">touched()</span>
       <span class="state-pill" id="p4-pill-3">errors()</span>
       <span class="nosub" id="p4-nosub">${t.noSubscribe} <s>.subscribe()</s></span>
     </div>`,
  ];

  LC.createPoints = function (t) {
    const wrap = document.createElement('div');
    wrap.className = 'points-stage';
    wrap.innerHTML = `<div class="stepper">${t.steps
      .map((s, i) => `<div class="step" id="step-${i + 1}"><b>0${i + 1}</b><span>${s}</span></div>`)
      .join('')}</div><div class="point-deck" id="point-deck"></div>`;
    const deck = wrap.querySelector('.point-deck');
    const code = CODE(t);
    const viz = VIZ(t);
    t.items.forEach((item, i) => {
      const n = i + 1;
      const card = document.createElement('div');
      card.className = 'point-card glass-card';
      card.id = `point-card-${n}`;
      card.innerHTML = `
        <div class="point-head">
          <span class="point-num">0${n}</span>
          <div><div class="point-title">${item.title}</div><div class="point-note">${item.note}</div></div>
        </div>`;
      card.appendChild(LC.createCodeEditor({ id: `p${n}-code`, file: n === 2 || n === 4 ? 'login.component.html' : 'login.component.ts', lines: code[i], compact: true }));
      card.insertAdjacentHTML('beforeend', viz[i]);
      deck.appendChild(card);
    });
    return wrap;
  };
})();
