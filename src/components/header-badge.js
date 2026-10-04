/**
 * Header-Tag, Logo (rechts oben) & Fortschrittsbalken (über alle Szenen sichtbar).
 */
(function () {
  const LC = (window.LC = window.LC || {});
  LC.createHeaderBadge = function ({ topic, category }) {
    const header = document.createElement('div');
    header.className = 'comp-header';
    header.innerHTML = `
      <div class="header-row">
      <div class="badge-tag">
        <span class="badge-dot"></span>
        <span class="badge-topic">${topic}</span>
        <span class="badge-sep">//</span>
        <span>${category}</span>
      </div>
      <img class="brand-logo" id="brand-logo" src="assets/logo/logo.svg" alt="">
      </div>
      <div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div>`;
    return header;
  };
})();
