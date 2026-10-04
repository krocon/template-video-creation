import { createHeaderBadge } from './components/header-badge.js';
import { createMockMail } from './components/mock-mail.js';
import { createChecklistCards } from './components/checklist-card.js';
import { createActionBanner } from './components/action-banner.js';
import { createOutroCTA } from './components/outro-cta.js';

let currentLang = 'de';
let currentFormat = '9x16';

export function initComposition(lang = 'de', format = '9x16') {
  currentLang = lang;
  currentFormat = format;

  const comp = document.getElementById('composition');
  comp.setAttribute('data-format', format);
  if (format === '16x9') {
    comp.setAttribute('data-composition-width', '1920');
    comp.setAttribute('data-composition-height', '1080');
  } else {
    comp.setAttribute('data-composition-width', '1080');
    comp.setAttribute('data-composition-height', '1920');
  }

  // Populate Header
  const headerSlot = document.getElementById('header-slot');
  headerSlot.innerHTML = '';
  headerSlot.appendChild(createHeaderBadge({
    topic: lang === 'de' ? 'IT-SICHERHEIT' : 'IT SECURITY',
    category: lang === 'de' ? '60S BRIEFING' : '60S BRIEFING'
  }));

  // Populate Scenes
  const s1Slot = document.getElementById('scene-01-slot');
  s1Slot.innerHTML = '';
  s1Slot.appendChild(createMockMail({ lang }));

  const s2Slot = document.getElementById('scene-02-slot');
  s2Slot.innerHTML = '';
  s2Slot.appendChild(createMockMail({ lang }));

  const s3Slot = document.getElementById('scene-03-slot');
  s3Slot.innerHTML = '';
  s3Slot.appendChild(createChecklistCards({ lang }));

  const s4Slot = document.getElementById('scene-04-slot');
  s4Slot.innerHTML = '';
  s4Slot.appendChild(createActionBanner({ lang }));

  const s5Slot = document.getElementById('scene-05-slot');
  s5Slot.innerHTML = '';
  s5Slot.appendChild(createOutroCTA({ lang }));

  buildTimeline();
}

function buildTimeline() {
  const compId = 'one-minute-lesson';
  window.__timelines = window.__timelines || {};

  if (window.__timelines[compId]) {
    window.__timelines[compId].kill();
  }

  // Pre-set initial states (MANDATORY HyperFrames rule: gsap.set before timeline)
  gsap.set('.scene-container', { opacity: 0, display: 'none' });
  gsap.set('#scene-01', { opacity: 1, display: 'flex' });
  gsap.set('#progress-fill', { width: '0%' });
  gsap.set('#mail-mockup', { y: 60, opacity: 0, scale: 0.95 });
  gsap.set('.point-card', { opacity: 0.2, y: 20 });
  gsap.set('.action-item', { opacity: 0, x: -30 });
  gsap.set('#outro-punchline', { scale: 0.8, opacity: 0 });
  gsap.set('#outro-badge', { scale: 0.5, opacity: 0 });

  // Paused GSAP master timeline
  const tl = gsap.timeline({ paused: true });

  // Global Progress Bar (0 to 60 seconds)
  tl.to('#progress-fill', {
    width: '100%',
    duration: 60,
    ease: 'none'
  }, 0);

  // --- SCENE 1: Hook (0.0s - 5.2s) ---
  tl.to('#scene-01 #mail-mockup', {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1.4)'
  }, 0.2);

  tl.to('#scene-01 #cta-fake-btn', {
    scale: 1.05,
    repeat: 3,
    yoyo: true,
    duration: 0.35,
    ease: 'power1.inOut'
  }, 3.0);

  // Transition Scene 1 -> Scene 2 at 5.2s
  tl.set('#scene-01', { opacity: 0, display: 'none' }, 5.2);
  tl.set('#scene-02', { opacity: 1, display: 'flex' }, 5.2);

  // --- SCENE 2: Problem (5.2s - 15.0s) ---
  tl.fromTo('#scene-02 .scene-title', 
    { scale: 1.2, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
    5.3
  );

  tl.fromTo('#scene-02 #mail-mockup', 
    { y: 40, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 
    5.8
  );

  tl.to('#scene-02 #sender-pill', {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderColor: '#ffffff',
    scale: 1.1,
    repeat: 3,
    yoyo: true,
    duration: 0.4
  }, 7.5);

  // Transition Scene 2 -> Scene 3 at 15.0s
  tl.set('#scene-02', { opacity: 0, display: 'none' }, 15.0);
  tl.set('#scene-03', { opacity: 1, display: 'flex' }, 15.0);

  // --- SCENE 3: The 5 Warning Signs (15.0s - 44.5s) ---
  // Point 1: Absender (15.1s)
  tl.to('#point-card-1', {
    opacity: 1,
    y: 0,
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    duration: 0.5,
    ease: 'power2.out'
  }, 15.1);

  // Point 2: Anrede & Grammatik (21.0s)
  tl.to('#point-card-1', { opacity: 0.5, duration: 0.3 }, 20.8);
  tl.to('#point-card-2', {
    opacity: 1,
    y: 0,
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    duration: 0.5,
    ease: 'power2.out'
  }, 21.0);

  // Point 3: Künstlicher Zeitdruck (26.7s)
  tl.to('#point-card-2', { opacity: 0.5, duration: 0.3 }, 26.5);
  tl.to('#point-card-3', {
    opacity: 1,
    y: 0,
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    duration: 0.5,
    ease: 'power2.out'
  }, 26.7);

  // Point 4: Passwort & PIN (32.4s)
  tl.to('#point-card-3', { opacity: 0.5, duration: 0.3 }, 32.2);
  tl.to('#point-card-4', {
    opacity: 1,
    y: 0,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    duration: 0.5,
    ease: 'power2.out'
  }, 32.4);

  // Point 5: Links & Anhänge (38.2s)
  tl.to('#point-card-4', { opacity: 0.5, duration: 0.3 }, 38.0);
  tl.to('#point-card-5', {
    opacity: 1,
    y: 0,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    duration: 0.5,
    ease: 'power2.out'
  }, 38.2);

  // Transition Scene 3 -> Scene 4 at 44.5s
  tl.set('#scene-03', { opacity: 0, display: 'none' }, 44.5);
  tl.set('#scene-04', { opacity: 1, display: 'flex' }, 44.5);

  // --- SCENE 4: Action (44.5s - 54.5s) ---
  tl.to('#action-item-1', {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'back.out(1.2)'
  }, 45.0);

  tl.to('#action-item-2', {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'back.out(1.2)'
  }, 48.5);

  tl.to('#action-item-3', {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'back.out(1.2)'
  }, 51.5);

  // Transition Scene 4 -> Scene 5 at 54.5s
  tl.set('#scene-04', { opacity: 0, display: 'none' }, 54.5);
  tl.set('#scene-05', { opacity: 1, display: 'flex' }, 54.5);

  // --- SCENE 5: Outro & Takeaway (54.5s - 60.0s) ---
  tl.to('#outro-punchline', {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: 'elastic.out(1, 0.6)'
  }, 55.0);

  tl.to('#outro-badge', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(1.4)'
  }, 56.8);

  window.__timelines[compId] = tl;
  return tl;
}

// Interactive Preview Controls
document.addEventListener('DOMContentLoaded', () => {
  initComposition(currentLang, currentFormat);

  const btnPlay = document.getElementById('btn-play');
  const btnToggleLang = document.getElementById('btn-toggle-lang');
  const btnToggleFormat = document.getElementById('btn-toggle-format');
  const timeDisplay = document.getElementById('time-display');

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      const tl = window.__timelines['one-minute-lesson'];
      if (!tl) return;
      if (tl.paused()) {
        tl.play();
        btnPlay.innerText = 'Pause';
      } else {
        tl.pause();
        btnPlay.innerText = 'Play';
      }
    });
  }

  if (btnToggleLang) {
    btnToggleLang.addEventListener('click', () => {
      currentLang = currentLang === 'de' ? 'en' : 'de';
      initComposition(currentLang, currentFormat);
      btnToggleLang.innerText = currentLang.toUpperCase();
    });
  }

  if (btnToggleFormat) {
    btnToggleFormat.addEventListener('click', () => {
      currentFormat = currentFormat === '9x16' ? '16x9' : '9x16';
      initComposition(currentLang, currentFormat);
      btnToggleFormat.innerText = currentFormat;
    });
  }

  // Update timer display
  gsap.ticker.add(() => {
    const tl = window.__timelines ? window.__timelines['one-minute-lesson'] : null;
    if (tl && timeDisplay) {
      const cur = tl.time();
      const min = Math.floor(cur / 60).toString().padStart(2, '0');
      const sec = Math.floor(cur % 60).toString().padStart(2, '0');
      timeDisplay.innerText = `${min}:${sec}`;
    }
  });
});
