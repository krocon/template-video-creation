/**
 * Problem-Szene: klassischer Reactive-Forms-Code mit Markierungen für
 * Verschachtelung, Subscription, Typ-Cast – plus Boilerplate-Stempel und Fehler-Pins.
 */
(function () {
  const LC = (window.LC = window.LC || {});
  const LINES = [
    'form = new FormGroup({',
    '  user: new FormGroup({',
    "    email: new FormControl(''),",
    '    age: new FormControl<number | null>(null),',
    '  }),',
    '});',
    '',
    'ngOnInit() {',
    '  this.form.valueChanges.subscribe((v) => {',
    '    this.save(v as User);',
    '  });',
    '}',
  ];

  LC.createReactiveProblem = function (t) {
    const wrap = document.createElement('div');
    wrap.className = 'reactive-stage';
    wrap.appendChild(LC.createCodeEditor({ id: 'rx-code', file: 'login.component.ts', lines: LINES }));
    wrap.insertAdjacentHTML(
      'beforeend',
      `<div class="bug-row" id="rx-bugs">
         <span class="bug" id="rx-bug-1">⚠ ${t.tags.bugs}</span>
         <span class="bug" id="rx-bug-2">⚠ ${t.tags.bugs}</span>
         <span class="bug" id="rx-bug-3">⚠ ${t.tags.bugs}</span>
       </div>`
    );
    // Hinweis-Tags direkt an die betroffenen Code-Zeilen hängen (sitzen so immer auf der richtigen Zeile)
    [['groups', 2], ['value', 9], ['types', 10]].forEach(([key, line]) => {
      wrap.querySelector(`#rx-code-l${line}`).insertAdjacentHTML('beforeend', `<span class="code-tag warn" id="rx-tag-${key}">${t.tags[key]}</span>`);
    });
    // Stempel auf der Leerzeile 7 zentrieren – liegt so über dem reinen Boilerplate-Block (Zeilen 5–8)
    wrap.querySelector('#rx-code-l7').insertAdjacentHTML('beforeend', `<div class="stamp" id="rx-stamp">${t.stamp}</div>`);
    return wrap;
  };
})();
