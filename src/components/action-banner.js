/**
 * Action Banner Component (What to do when receiving suspicious emails)
 */
export function createActionBanner({ lang = 'de' } = {}) {
  const isDe = lang === 'de';

  const items = isDe ? [
    {
      type: 'danger',
      icon: '🛑',
      title: 'Nicht klicken & nicht antworten',
      desc: 'Keine Anhänge öffnen, keine Links betätigen.'
    },
    {
      type: 'success',
      icon: '📞',
      title: 'Absender separat kontaktieren',
      desc: 'Nutze bekannte Telefonnummern oder offizielle Websites.'
    },
    {
      type: 'success',
      icon: '🛡️',
      title: 'IT-Sicherheit / Kollegium warnen',
      desc: 'Mail als Phishing melden, um andere zu schützen.'
    }
  ] : [
    {
      type: 'danger',
      icon: '🛑',
      title: 'Do not click & do not reply',
      desc: 'Never open unexpected attachments or links.'
    },
    {
      type: 'success',
      icon: '📞',
      title: 'Verify via trusted official channel',
      desc: 'Call their official phone number directly.'
    },
    {
      type: 'success',
      icon: '🛡️',
      title: 'Report to IT Security',
      desc: 'Forward to your internal security team to block it.'
    }
  ];

  const grid = document.createElement('div');
  grid.className = 'action-grid';
  grid.id = 'action-grid';

  items.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'action-item';
    el.id = `action-item-${idx + 1}`;
    el.innerHTML = `
      <div class="action-icon-circle ${item.type}">${item.icon}</div>
      <div class="action-text">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    `;
    grid.appendChild(el);
  });

  return grid;
}
