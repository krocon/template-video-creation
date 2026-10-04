/**
 * Code-Editor-Mockup mit leichtgewichtigem Syntax-Highlighting.
 * Jede Zeile bekommt eine ID (<prefix>-l<n>), damit die Timeline Zeilen gezielt einblenden/markieren kann.
 */
(function () {
  const LC = (window.LC = window.LC || {});

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TOKEN = /('(?:[^'\\]|\\.)*')|(\b(?:new|this|import|from|const|return)\b|@if)|([A-Za-z_$][\w$]*)(?=\()|(\b\d+\b)|(\[[\w.]+\])|(<\/?[a-z]+)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;
  const CLS = ['str', 'kw', 'fn', 'num', 'attr', 'tag', 'id', null, 'pu'];

  LC.highlight = function (line) {
    let html = '';
    line.replace(TOKEN, (...m) => {
      const idx = m.slice(1, 10).findIndex((g) => g !== undefined);
      const cls = CLS[idx];
      html += cls ? `<span class="tk-${cls}">${esc(m[0])}</span>` : esc(m[0]);
      return m[0];
    });
    return html || '&nbsp;';
  };

  /** @param {{id:string, file:string, lines:string[], compact?:boolean}} opts */
  LC.createCodeEditor = function ({ id, file, lines, compact = false }) {
    const el = document.createElement('div');
    el.className = 'code-editor' + (compact ? ' compact' : '');
    el.id = id;
    el.innerHTML = `
      <div class="code-bar">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="code-file">${esc(file)}</span>
      </div>
      <div class="code-body">
        ${lines
          .map(
            (l, i) => `<div class="code-line" id="${id}-l${i + 1}"><span class="ln">${i + 1}</span><span class="lc">${LC.highlight(l)}</span></div>`
          )
          .join('')}
      </div>`;
    return el;
  };
})();
