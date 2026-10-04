/**
 * Handlungs-Szene: drei Schritte, die nacheinander hereinsliden.
 */
(function () {
  const LC = (window.LC = window.LC || {});
  LC.createActionBanner = function (t) {
    const grid = document.createElement('div');
    grid.className = 'action-grid';
    grid.innerHTML = t.items
      .map((it, i) => {
        const n = i + 1;
        let extra = '';
        if (n === 2) {
          extra = `<div class="import-chip mono" id="action-import">${LC.highlight("import { form } from '@angular/forms/signals';")}</div>
                   <div class="model-chip" id="action-model">+ ${t.modelChip}</div>`;
        }
        if (n === 3) {
          extra = `<div class="migrate-bar">${[1, 2, 3, 4].map((k) => `<span class="mig-seg" id="mig-seg-${k}"></span>`).join('')}</div>`;
        }
        return `<div class="action-item glass-card" id="action-item-${n}">
          <div class="action-num">${it.num}</div>
          <div class="action-text"><h4>${it.title}</h4>${it.desc ? `<p>${it.desc}</p>` : ''}${extra}</div>
        </div>`;
      })
      .join('');
    return grid;
  };
})();
