/**
 * Checklist Cards Component (The 5 Warning Signs)
 */
export function createChecklistCards({ lang = 'de' } = {}) {
  const isDe = lang === 'de';

  const points = isDe ? [
    {
      num: '01',
      icon: '🔍',
      title: 'Der Absender',
      desc: 'Maus drüberhalten ohne Klick – oft steht eine fremde Fake-Domain dahinter.'
    },
    {
      num: '02',
      icon: '✍️',
      title: 'Allgemeine Anrede',
      desc: '„Sehr geehrter Kunde“ statt deines Namens, garniert mit Rechtschreibfehlern.'
    },
    {
      num: '03',
      icon: '⏳',
      title: 'Künstlicher Zeitdruck',
      desc: '„Konto sperrt in 2 Stunden!“ Panikmache soll unüberlegtes Klicken erzwingen.'
    },
    {
      num: '04',
      icon: '🔒',
      title: 'Passwort & TAN-Abfrage',
      desc: 'Banken fragen niemals PINs, Passwörter oder TANs per E-Mail ab!'
    },
    {
      num: '05',
      icon: '📎',
      title: 'Gefährliche Links & Anhänge',
      desc: 'Vorausgefüllte Login-Seiten oder getarnte Anhänge (.zip, .exe).'
    }
  ] : [
    {
      num: '01',
      icon: '🔍',
      title: 'Sender Address',
      desc: 'Hover without clicking – inspect the actual domain behind the display name.'
    },
    {
      num: '02',
      icon: '✍️',
      title: 'Generic Greeting',
      desc: '“Dear Customer” instead of your name, combined with poor grammar.'
    },
    {
      num: '03',
      icon: '⏳',
      title: 'Artificial Urgency',
      desc: '“Locked in 2 hours!” Panic is designed to rush you into making a mistake.'
    },
    {
      num: '04',
      icon: '🔒',
      title: 'PIN & Password Requests',
      desc: 'Legitimate institutions will never ask for credentials via email.'
    },
    {
      num: '05',
      icon: '📎',
      title: 'Deceptive Links & Files',
      desc: 'Fake login destinations or dangerous attachments (.zip, .exe).'
    }
  ];

  const container = document.createElement('div');
  container.className = 'points-list';
  container.id = 'points-list';

  points.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'point-card';
    card.id = `point-card-${idx + 1}`;
    card.innerHTML = `
      <div class="point-number">${p.num}</div>
      <div class="point-content">
        <div class="point-headline">${p.title}</div>
        <div class="point-desc">${p.desc}</div>
      </div>
      <div class="point-icon">${p.icon}</div>
    `;
    container.appendChild(card);
  });

  return container;
}
