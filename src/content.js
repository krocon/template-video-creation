/**
 * Bildschirmtexte DE/EN – getrennt vom Voiceover (assets/scripts_text/*), damit beide Sprachen
 * unabhängig lokalisiert werden können. Code-Beispiele sind sprachneutral (bis auf Meldungstexte).
 */
window.LESSON_CONTENT = {
  de: {
    header: { topic: 'Angular 22', category: 'Signal Forms · 60s' },
    hook: {
      greet: 'Hallo zusammen!',
      question: 'Dein Formular hat mehr <em>Subscriptions</em> als Eingabefelder?',
      formTitle: 'Login',
      fields: ['E-Mail', 'Passwort'],
      countFields: 'Felder',
      countSubs: 'Subscriptions',
    },
    versions: {
      title: 'Signal Forms',
      subtitle: 'Die neue Formular-API von Angular',
      nodes: [
        { v: 'v21', label: 'experimentell' },
        { v: 'v22', label: 'stabil' },
      ],
      prod: 'produktionsreif',
    },
    reactive: {
      title: 'Reactive Forms heute',
      tags: { groups: 'verschachtelt', value: 'Subscription', types: 'Typ-Cast', bugs: 'Fehlerquelle' },
      stamp: 'Boilerplate',
    },
    points: {
      steps: ['Modell', 'Binden', 'Validieren', 'Signale'],
      items: [
        { title: 'Das Modell zuerst', note: 'Deine Daten: ein normales Signal' },
        { title: 'Binden mit formField', note: 'Wert & Status synchron – in beide Richtungen' },
        { title: 'Validierung im Schema', note: 'Regeln direkt am Feld, mit eigener Meldung' },
        { title: 'Alles ist ein Signal', note: 'Status direkt im Template lesen' },
      ],
      inputValue: 'anna@dev.io',
      requiredMsg: 'E-Mail fehlt',
      wrapInner: 'signal()',
      wrapOuter: 'form()',
      noSubscribe: 'kein',
    },
    action: {
      title: 'Und jetzt?',
      items: [
        { num: '01', title: 'Nächstes Formular', desc: 'Neu mit Signal Forms starten' },
        { num: '02', title: 'Importieren & loslegen', desc: '' },
        { num: '03', title: 'Reactive Forms migrieren', desc: 'Schritt für Schritt' },
      ],
      modelChip: 'mit einem signal()-Modell starten',
    },
    outro: {
      kicker: 'Merksatz',
      line1: 'Erst das Signal,',
      line2: 'dann das Formular.',
      badge: 'Angular 22 · Signal Forms',
    },
  },
  en: {
    header: { topic: 'Angular 22', category: 'Signal Forms · 60s' },
    hook: {
      greet: 'Hey nerds!',
      question: 'Does your form have more <em>subscriptions</em> than input fields?',
      formTitle: 'Login',
      fields: ['Email', 'Password'],
      countFields: 'Fields',
      countSubs: 'Subscriptions',
    },
    versions: {
      title: 'Signal Forms',
      subtitle: 'Angular’s new forms API',
      nodes: [
        { v: 'v21', label: 'experimental' },
        { v: 'v22', label: 'stable' },
      ],
      prod: 'production-ready',
    },
    reactive: {
      title: 'Reactive Forms today',
      tags: { groups: 'nested', value: 'subscription', types: 'type cast', bugs: 'bug source' },
      stamp: 'Boilerplate',
    },
    points: {
      steps: ['Model', 'Bind', 'Validate', 'Signals'],
      items: [
        { title: 'Model first', note: 'Your data: a plain signal' },
        { title: 'Bind with formField', note: 'Value & state in sync – both ways' },
        { title: 'Validation in the schema', note: 'Rules right on the field, with your own message' },
        { title: 'Everything is a signal', note: 'Read state straight in the template' },
      ],
      inputValue: 'anna@dev.io',
      requiredMsg: 'Email required',
      wrapInner: 'signal()',
      wrapOuter: 'form()',
      noSubscribe: 'no',
    },
    action: {
      title: 'So what now?',
      items: [
        { num: '01', title: 'Your next form', desc: 'Build it with Signal Forms' },
        { num: '02', title: 'Import & go', desc: '' },
        { num: '03', title: 'Migrate Reactive Forms', desc: 'Step by step' },
      ],
      modelChip: 'start with a signal() model',
    },
    outro: {
      kicker: 'Remember',
      line1: 'Signal first,',
      line2: 'the form follows.',
      badge: 'Angular 22 · Signal Forms',
    },
  },
};
