/**
 * Hook-Szene: kleines Login-Formular, um das herum .subscribe()-Chips aufpoppen.
 * Positionen der Chips sind fest (deterministisch), relativ zum Formular.
 */
(function () {
  const LC = (window.LC = window.LC || {});
  // [x%, y%, Rotation] – rund um die Karte verteilt
  const CHIPS = [[-6, 4, -6], [62, 0, 5], [-10, 36, 4], [68, 33, -5], [-4, 64, -3], [60, 68, 6]];

  LC.createMockForm = function (t) {
    const wrap = document.createElement('div');
    wrap.className = 'form-stage';
    wrap.id = 'form-stage';
    wrap.innerHTML = `
      <div class="glass-card form-mock" id="form-mock">
        <div class="form-title">${t.formTitle}</div>
        ${t.fields
          .map((f, i) => `<label class="form-field"><span>${f}</span><span class="form-input" id="hook-input-${i + 1}"></span></label>`)
          .join('')}
      </div>
      ${CHIPS.map(([x, y, r], i) => `<span class="sub-chip" id="sub-chip-${i + 1}" style="left:${x}%;top:${y}%;--r:${r}deg">.subscribe()</span>`).join('')}
      <div class="hook-count" id="hook-count">
        <div class="count-box ok"><b>${t.fields.length}</b><span>${t.countFields}</span></div>
        <div class="count-vs">&lt;</div>
        <div class="count-box bad"><b>${CHIPS.length}</b><span>${t.countSubs}</span></div>
      </div>`;
    return wrap;
  };
})();
