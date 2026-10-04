/**
 * Versions-Zeitstrahl v21 → v22 mit „stabil“- und „produktionsreif“-Badge.
 */
(function () {
  const LC = (window.LC = window.LC || {});
  LC.createVersionTrack = function (t) {
    const el = document.createElement('div');
    el.className = 'version-track';
    el.innerHTML = `
      <div class="vt-line"><div class="vt-line-fill" id="vt-line-fill"></div></div>
      ${t.nodes
        .map(
          (n, i) => `<div class="vt-node" id="vt-node-${i + 1}">
            <div class="vt-dot"></div><div class="vt-v">${n.v}</div><div class="vt-label">${n.label}</div>
          </div>`
        )
        .join('')}
      <div class="prod-badge" id="prod-badge"><span class="check">✓</span>${t.prod}</div>`;
    return el;
  };
})();
