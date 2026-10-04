/**
 * Outro CTA Component (Takeaway & Final Merksatz)
 */
export function createOutroCTA({ lang = 'de' } = {}) {
  const isDe = lang === 'de';

  const strings = {
    title: isDe ? 'Merke dir:' : 'Key Takeaway:',
    punchline: isDe ? 'Kurz prüfen,<br>nicht anbeißen!' : 'Pause before you click,<br>don’t take the bait!',
    badge: isDe ? '🛡️ IT-Sicherheit meistert man gemeinsam' : '🛡️ Cybersecurity is teamwork'
  };

  const wrap = document.createElement('div');
  wrap.style.textAlign = 'center';
  wrap.id = 'outro-wrap';
  wrap.innerHTML = `
    <div style="font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-primary); margin-bottom: 24px; font-weight: 700;">
      ${strings.title}
    </div>
    <div class="outro-punchline" id="outro-punchline">
      ${strings.punchline}
    </div>
    <div class="outro-badge" id="outro-badge">
      ${strings.badge}
    </div>
  `;
  return wrap;
}
