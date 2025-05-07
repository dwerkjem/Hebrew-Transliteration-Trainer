import { incrementAttempt, incrementCorrect } from './stats.js';
import { track } from './charting.js';

let words = [], current;
const refs = {
  toggle: document.getElementById('niqqud-toggle'),
  trnTgl: document.getElementById('translation-toggle'),
  word:   document.getElementById('hebrew-word'),
  trans:  document.getElementById('translation-word'),
  input:  document.getElementById('translit-input'),
  feedback: document.getElementById('feedback'),
  btn:    document.getElementById('check-btn'),
  over:   document.getElementById('override-btn'),
  slider: document.getElementById('length-slider'),
  lbl:    document.getElementById('length-label'),
};

export async function initQuiz() {
  try {
    const url = `${import.meta.env.BASE_URL||'/'}words.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    words = await res.json();
    if (!Array.isArray(words) || !words.length) {
      throw new Error('no words found');
    }
    wireControls();
    nextWord();
  } catch (e) {
    console.error('quiz init:', e);
    document.getElementById('quiz-container')
      .textContent = 'Error loading quiz data.';
  }
}

function wireControls() {
  // length slider
  refs.lbl.textContent = refs.slider.value;
  refs.slider.addEventListener('input', () => {
    refs.lbl.textContent = refs.slider.value;
  });
  // ENTER key
  refs.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      refs.btn.click();
    }
  });
  // Niqqud toggle hot update
  refs.toggle.addEventListener('change', () => {
    if (current) {
      refs.word.textContent = refs.toggle.checked
        ? current.Niqqud
        : current.Hebrew;
    }
  });
  // check/next
  refs.btn.addEventListener('click', () => {
    if (refs.btn.textContent === 'Check') {
      attempt();
    } else {
      nextWord();
    }
  });
  // override
  refs.over.addEventListener('click', () => {
    incrementCorrect();
    refs.feedback.textContent = '✅ Marked correct';
    refs.over.style.display = 'none';
    track(true);
  });
}

function attempt() {
  incrementAttempt();
  const ans = refs.input.value.trim().toLowerCase();
  const ok  = ans === current.Transliteration.toLowerCase();
  if (ok) {
    incrementCorrect();
    refs.feedback.textContent = '✅ Correct!';
  } else {
    refs.feedback.textContent = `❌ Incorrect. ${current.Transliteration}`;
    refs.over.style.display = 'inline-block';
  }
  refs.trans.textContent = refs.trnTgl.checked
    ? current.Translation
    : '';
  track(ok);
  refs.btn.textContent = 'Next';
}

function nextWord() {
  const max = +refs.slider.value;
  const pool = words.filter(w => w.Niqqud_Length <= max);
  current = pool[Math.floor(Math.random()*pool.length)];
  refs.word.textContent = refs.toggle.checked
    ? current.Niqqud
    : current.Hebrew;
  refs.trans.textContent = '';
  refs.input.value = '';
  refs.feedback.textContent = '';
  refs.over.style.display = 'none';
  refs.btn.textContent = 'Check';
}