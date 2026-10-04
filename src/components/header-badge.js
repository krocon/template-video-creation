/**
 * Header Badge & Progress Bar Component
 */
export function createHeaderBadge({ topic = 'IT-SICHERHEIT', category = '60S BRIEFING' } = {}) {
  const header = document.createElement('div');
  header.className = 'comp-header';
  header.innerHTML = `
    <div class="badge-tag">
      <span class="badge-dot"></span>
      <span id="header-topic">${topic}</span>
      <span style="opacity: 0.4;">//</span>
      <span id="header-category">${category}</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" id="progress-fill"></div>
    </div>
  `;
  return header;
}
