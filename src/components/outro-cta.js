/**
 * Outro: Merksatz mit elastischem Einstieg + Themen-Badge.
 */
(function () {
  const LC = (window.LC = window.LC || {});
  LC.createOutroCTA = function (t) {
    const wrap = document.createElement('div');
    wrap.className = 'outro-wrap';
    wrap.innerHTML = `
      <div class="outro-kicker" id="outro-kicker">${t.kicker}</div>
      <div class="outro-punchline">
        <span class="outro-line" id="outro-line-1">${t.line1}</span>
        <span class="outro-line grad" id="outro-line-2">${t.line2}</span>
      </div>
      <div class="outro-badge" id="outro-badge">${t.badge}</div>`;
    return wrap;
  };
})();
