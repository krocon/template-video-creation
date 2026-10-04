/**
 * Mock Email & Browser Window Component
 */
export function createMockMail({ lang = 'de' } = {}) {
  const isDe = lang === 'de';

  const strings = {
    senderLabel: isDe ? 'Absender:' : 'From:',
    fakeSender: 'support@sparkasse-sicherheit-login24.xyz',
    subjectLabel: isDe ? 'Betreff:' : 'Subject:',
    subjectText: isDe ? 'WICHTIG: Ihr Bankkonto wird in 2 Stunden gesperrt!' : 'URGENT: Your account will be locked in 2 hours!',
    bodyText: isDe 
      ? 'Sehr geehrter Kunde,<br><br>aufgrund verdächtiger Transaktionen müssen Sie Ihre Identität sofort verifizieren. Klicken Sie auf den Button, um die Sperre abzuwenden.'
      : 'Dear customer,<br><br>Due to suspicious transactions, you must verify your identity immediately. Click the button below to prevent permanent suspension.',
    ctaText: isDe ? '⚠️ JETZT KONTO ENTSPERREN' : '⚠️ UNLOCK ACCOUNT NOW'
  };

  const card = document.createElement('div');
  card.className = 'glass-card mail-mockup';
  card.id = 'mail-mockup';
  card.innerHTML = `
    <div class="mail-header">
      <div class="mail-row">
        <span class="mail-label">${strings.senderLabel}</span>
        <span class="mail-sender-pill" id="sender-pill">${strings.fakeSender}</span>
      </div>
      <div class="mail-row">
        <span class="mail-label">${strings.subjectLabel}</span>
        <span style="font-weight: 700; color: #f87171;">${strings.subjectText}</span>
      </div>
    </div>
    <div class="mail-body">
      ${strings.bodyText}
    </div>
    <div class="cta-alert-btn" id="cta-fake-btn">
      ${strings.ctaText}
    </div>
  `;
  return card;
}
