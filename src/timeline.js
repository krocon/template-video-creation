/**
 * GSAP-Master-Timeline „one-minute-lesson“ – beat-synchron zu den Whisper-Cues (src/cues.js).
 * Registriert wird sie in index.html: window.__timelines["one-minute-lesson"] = window.__buildLessonTimeline();
 *
 * HyperFrames-Kontrakt:
 *  - genau EINE pausierte Timeline auf window.__timelines["one-minute-lesson"]
 *  - Initialzustände ausschließlich per gsap.set() VOR dem Aufbau der Timeline
 *  - keine CSS-Transitions, kein repeat:-1, kein Zufall, keine Uhrzeit
 *
 * Sprache/Format: --variables '{"lang":"en","format":"16x9"}' (Render)
 *                 bzw. ?lang=en&format=16x9 (Browser-Preview).
 */
window.__buildLessonTimeline = function () {
  'use strict';

  // ---------- Variablen auflösen ----------
  const qs = new URLSearchParams(window.location.search);
  const hfVars = Object.assign(
    {},
    (window.__hyperframes && typeof window.__hyperframes.getVariables === 'function' && window.__hyperframes.getVariables()) || {},
    window.__hfVariables || {}
  );
  const lang = (qs.get('lang') || hfVars.lang || 'de') === 'en' ? 'en' : 'de';
  const format = (qs.get('format') || hfVars.format || '9x16') === '16x9' ? '16x9' : '9x16';

  const DATA = window.__LESSON_CUES.languages[lang];
  const c = DATA.cues;
  const TOTAL = DATA.total;
  const T = window.LESSON_CONTENT[lang];
  const LC = window.LC;

  // ---------- Root & Audio konfigurieren ----------
  document.documentElement.lang = lang;
  const root = document.getElementById('composition');
  root.setAttribute('data-format', format);
  root.setAttribute('data-width', format === '16x9' ? '1920' : '1080');
  root.setAttribute('data-height', format === '16x9' ? '1080' : '1920');
  root.setAttribute('data-duration', String(TOTAL));

  const vo = document.getElementById('voiceover');
  vo.setAttribute('src', DATA.audio);
  vo.setAttribute('data-duration', String(TOTAL));

  // ---------- Inhalte einsetzen ----------
  const $ = (id) => document.getElementById(id);
  $('header-slot').appendChild(LC.createHeaderBadge(T.header));
  $('hook-greet').textContent = T.hook.greet;
  $('hook-greet').classList.add('grad');
  $('hook-question').innerHTML = T.hook.question;
  $('hook-slot').appendChild(LC.createMockForm(T.hook));
  $('versions-title').textContent = T.versions.title;
  $('versions-subtitle').textContent = T.versions.subtitle;
  $('versions-slot').appendChild(LC.createVersionTrack(T.versions));
  $('reactive-title').textContent = T.reactive.title;
  $('reactive-slot').appendChild(LC.createReactiveProblem(T.reactive));
  $('points-slot').appendChild(LC.createPoints(T.points));
  $('action-title').textContent = T.action.title;
  $('action-slot').appendChild(LC.createActionBanner(T.action));
  $('outro-slot').appendChild(LC.createOutroCTA(T.outro));

  // ---------- Farben für Zustände ----------
  const STEP_IDLE = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#b3acd1' };
  const STEP_ACTIVE = { backgroundColor: 'rgba(195,92,255,0.24)', borderColor: '#c35cff', color: '#ffffff' };
  const STEP_DONE = { backgroundColor: 'rgba(62,224,161,0.12)', borderColor: 'rgba(62,224,161,0.6)', color: '#3ee0a1' };
  const LINE_WARN = { backgroundColor: 'rgba(255,92,122,0.18)', borderLeftColor: '#ff5c7a' };
  const LINE_OK = { backgroundColor: 'rgba(195,92,255,0.18)', borderLeftColor: '#c35cff' };

  // ---------- Initialzustände (vor der Timeline!) ----------
  gsap.set('.scene', { autoAlpha: 0 });
  gsap.set('#scene-hook', { autoAlpha: 1 });
  gsap.set('#progress-fill', { scaleX: 0 });
  gsap.set('#brand-logo', { autoAlpha: 0 });

  gsap.set('#hook-greet', { autoAlpha: 0, scale: 0.4 });
  gsap.set('#hook-question', { autoAlpha: 0, y: 40 });
  gsap.set('#form-mock', { autoAlpha: 0, y: 60 });
  gsap.set('.sub-chip', { autoAlpha: 0, scale: 0 });
  gsap.set('#hook-count', { autoAlpha: 0, y: 30 });

  gsap.set('#versions-title', { autoAlpha: 0, scale: 1.15 });
  gsap.set('#versions-subtitle', { autoAlpha: 0, y: 20 });
  gsap.set(['#vt-node-1', '#vt-node-2'], { autoAlpha: 0, y: 30 });
  gsap.set('#vt-line-fill', { scaleX: 0 });
  gsap.set('#prod-badge', { autoAlpha: 0, scale: 0.6 });

  gsap.set('#reactive-title', { autoAlpha: 0, y: 20 });
  gsap.set('#rx-code', { autoAlpha: 0, y: 40 });
  gsap.set('.code-tag', { autoAlpha: 0, x: 30 });
  gsap.set('#rx-stamp', { autoAlpha: 0, scale: 1.8 });
  gsap.set('.bug', { autoAlpha: 0, y: 20 });

  gsap.set('.step', STEP_IDLE);
  gsap.set('.point-card', { autoAlpha: 0 });
  gsap.set(['#p1-code-l1', '#p1-code-l2'], { autoAlpha: 0, x: -20 });
  gsap.set('#p1-inner', { autoAlpha: 0, scale: 0.6 });
  gsap.set('#p1-outer', { borderColor: 'rgba(195,92,255,0)', backgroundColor: 'rgba(195,92,255,0)' });
  gsap.set('#p1-outer .wrap-label', { autoAlpha: 0 });
  gsap.set('#p2-code-l1', { autoAlpha: 0, x: -20 });
  gsap.set(['#p2-input', '#p2-model'], { autoAlpha: 0, y: 30 });
  gsap.set('#p2-arrows', { autoAlpha: 0, scale: 0.5 });
  gsap.set(['#p3-code-l2', '#p3-code-l3', '#p3-code-l4'], { autoAlpha: 0, x: -20 });
  gsap.set('#p3-input', { autoAlpha: 0 });
  gsap.set('#p3-msg', { autoAlpha: 0, y: -10 });
  gsap.set('#p4-nosub', { autoAlpha: 0, scale: 0.7 });

  gsap.set('#action-title', { autoAlpha: 0, y: 20 });
  gsap.set('.action-item', { autoAlpha: 0, x: -80 });
  gsap.set(['#action-import', '#action-model'], { autoAlpha: 0, y: 14 });

  gsap.set('#outro-kicker', { autoAlpha: 0, y: 20 });
  gsap.set(['#outro-line-1', '#outro-line-2'], { autoAlpha: 0, scale: 0.6 });
  gsap.set('#outro-badge', { autoAlpha: 0, y: 24 });

  // ---------- Timeline ----------
  const tl = gsap.timeline({ paused: true });
  const cut = (from, to, t) => {
    tl.set(from, { autoAlpha: 0 }, t);
    tl.set(to, { autoAlpha: 1 }, t);
  };
  const popIn = (sel, t, extra) => tl.to(sel, Object.assign({ autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 0.45, ease: 'power3.out' }, extra), t);
  const mark = (sel, t, style) => tl.to(sel, Object.assign({ duration: 0.3, ease: 'power1.out' }, style), t);

  // Fortschrittsbalken über die gesamte Länge (legt zugleich die Timeline-Dauer fest)
  tl.to('#progress-fill', { scaleX: 1, duration: TOTAL, ease: 'none' }, 0);
  tl.to('#brand-logo', { autoAlpha: 0.8, duration: 0.8, ease: 'power1.out' }, 0.3);   // Logo dezent einblenden

  // 1 · HOOK ------------------------------------------------------------
  popIn('#hook-greet', 0.05, { duration: 0.8, ease: 'elastic.out(1, 0.6)' });
  popIn('#hook-question', c.hook_question);
  popIn('#form-mock', c.hook_question + 0.25, { duration: 0.6 });
  const chipSpan = Math.max(0.6, c.hook_fields - c.hook_subs);
  tl.to('.sub-chip', { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.2)', stagger: chipSpan / 6 }, c.hook_subs);
  popIn('#hook-count', c.hook_fields + 0.1, { ease: 'back.out(1.6)' });

  // 2a · VERSIONEN ------------------------------------------------------
  cut('#scene-hook', '#scene-versions', c.scene2);
  popIn('#versions-title', c.scene2, { duration: 0.55 });
  popIn('#versions-subtitle', c.scene2 + 0.35);
  popIn('#vt-node-1', c.scene2 + 0.7);
  const lineStart = c.scene2 + 1.0;
  tl.to('#vt-line-fill', { scaleX: 1, duration: Math.max(0.3, c.s2_v22 - lineStart), ease: 'power1.inOut' }, lineStart);
  popIn('#vt-node-2', c.s2_v22, { ease: 'back.out(1.8)' });
  tl.to('#vt-node-2 .vt-dot', { scale: 1.3, duration: 0.22, yoyo: true, repeat: 1, ease: 'power1.inOut' }, c.s2_stable);
  popIn('#prod-badge', c.s2_prod, { ease: 'back.out(1.8)' });

  // 2b · REACTIVE FORMS -------------------------------------------------
  cut('#scene-versions', '#scene-reactive', c.scene2b);
  popIn('#reactive-title', c.scene2b);
  popIn('#rx-code', c.scene2b + 0.15, { duration: 0.5 });
  mark(['#rx-code-l1', '#rx-code-l2'], c.s2b_groups, LINE_WARN);
  popIn('#rx-tag-groups', c.s2b_groups + 0.1);
  mark('#rx-code-l9', c.s2b_value, LINE_WARN);
  popIn('#rx-tag-value', c.s2b_value + 0.1);
  mark('#rx-code-l10', c.s2b_types, LINE_WARN);
  popIn('#rx-tag-types', c.s2b_types + 0.1);
  popIn('#rx-stamp', c.s2b_boiler, { duration: 0.4, ease: 'back.out(2)' });
  tl.to('.bug', { autoAlpha: 1, y: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.14 }, c.s2b_bugs);

  // 3 · KERNPUNKTE ------------------------------------------------------
  cut('#scene-reactive', '#scene-points', c.p1);
  const points = [c.p1, c.p2, c.p3, c.p4];
  points.forEach((t, i) => {
    const n = i + 1;
    if (n > 1) {
      tl.set(`#point-card-${n - 1}`, { autoAlpha: 0 }, t);
      mark(`#step-${n - 1}`, t, STEP_DONE);
    }
    tl.set(`#point-card-${n}`, { autoAlpha: 1 }, t);
    mark(`#step-${n}`, t, STEP_ACTIVE);
    tl.from(`#point-card-${n} .point-head`, { y: 24, duration: 0.4, ease: 'power3.out', immediateRender: false }, t);
  });

  // 01 Modell zuerst: signal() erscheint, dann legt sich form() darum
  popIn('#p1-code-l1', c.p1_signal);
  popIn('#p1-inner', c.p1_signal + 0.05, { ease: 'back.out(1.8)' });
  popIn('#p1-code-l2', c.p1_form);
  mark('#p1-outer', c.p1_form + 0.05, { borderColor: 'rgba(195,92,255,1)', backgroundColor: 'rgba(195,92,255,0.08)', duration: 0.45 });
  popIn('#p1-outer .wrap-label', c.p1_form + 0.2);

  // 02 Binden mit formField: Input ⇄ Modell
  popIn('#p2-code-l1', c.p2_field);
  popIn('#p2-input', c.p2_input);
  popIn('#p2-model', c.p2_input + 0.4);
  popIn('#p2-arrows', c.p2_sync, { ease: 'back.out(2)' });
  mark(['#p2-input', '#p2-model'], c.p2_sync, { borderColor: '#3ee0a1' });

  // 03 Validierung im Schema: Regeln Zeile für Zeile, dann die Fehlermeldung
  popIn('#p3-code-l2', c.p3_required);
  popIn('#p3-code-l3', c.p3_email);
  popIn('#p3-code-l4', c.p3_min);
  popIn('#p3-input', c.p3_required + 0.3);
  popIn('#p3-msg', c.p3_message, { ease: 'back.out(1.8)' });

  // 04 Alles ist ein Signal: Status-Pills + passende Template-Zeilen
  const PILL_ON = { backgroundColor: 'rgba(195,92,255,0.28)', borderColor: '#c35cff', color: '#ffffff' };
  [[c.p4_valid, 1, 'l1'], [c.p4_touched, 2, 'l2'], [c.p4_errors, 3, 'l3']].forEach(([t, n, line]) => {
    mark(`#p4-pill-${n}`, t, PILL_ON);
    tl.from(`#p4-pill-${n}`, { scale: 1.18, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
    mark(`#p4-code-${line}`, t, LINE_OK);
  });
  popIn('#p4-nosub', c.p4_nosub, { ease: 'back.out(2)' });

  // 4 · HANDLUNG --------------------------------------------------------
  cut('#scene-points', '#scene-action', c.scene4);
  popIn('#action-title', c.scene4);
  popIn('#action-item-1', c.a_pick, { ease: 'back.out(1.2)', duration: 0.5 });
  popIn('#action-item-2', c.a_import, { ease: 'back.out(1.2)', duration: 0.5 });
  popIn('#action-import', c.a_import + 0.25);
  popIn('#action-model', c.a_model);
  popIn('#action-item-3', c.a_migrate, { ease: 'back.out(1.2)', duration: 0.5 });
  const migStart = c.a_migrate + 0.5;
  const migSpan = Math.max(0.8, c.scene5 - 0.2 - migStart);
  tl.to('.mig-seg', { backgroundColor: '#3ee0a1', duration: 0.25, stagger: migSpan / 4 }, migStart);

  // 5 · OUTRO -----------------------------------------------------------
  cut('#scene-action', '#scene-outro', c.scene5);
  popIn('#outro-kicker', c.scene5);
  popIn('#outro-line-1', Math.max(c.scene5 + 0.15, c.o_signal - 0.4), { duration: 0.9, ease: 'elastic.out(1, 0.55)' });
  popIn('#outro-line-2', c.o_form - 0.25, { duration: 0.9, ease: 'elastic.out(1, 0.55)' });
  popIn('#outro-badge', Math.min(c.o_form + 0.4, TOTAL - 0.5));

  return tl;
};
