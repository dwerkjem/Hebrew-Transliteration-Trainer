import { updateStats, incrementAttempt, incrementCorrect } from './stats.js';
import { trackHourly }      from './charting.js';

let words = [], currentWord;
const toggle            = document.getElementById("niqqud-toggle");
const translationToggle = document.getElementById("translation-toggle");
const wordDiv           = document.getElementById("hebrew-word");
const translationDiv    = document.getElementById("translation-word");
const input             = document.getElementById("translit-input");
const feedback          = document.getElementById("feedback");
const button            = document.getElementById("check-btn");
const overrideBtn       = document.getElementById("override-btn");
const lengthSlider      = document.getElementById("length-slider");
const lengthLabel       = document.getElementById("length-label");

export async function initQuiz() {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const url  = `${base}words.json`;
    console.log('fetching words from', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    words = await res.json();
    console.log('loaded', words.length, 'words');
    wireLengthSlider();
    wireCheckButton();
    nextWord();
  } catch (err) {
    console.error('⚠️ loadWords error:', err);
    document.getElementById('quiz-container')
      .textContent = 'Error loading words (see console).';
  }
}

function wireLengthSlider() {
  lengthSlider.addEventListener("input", () => {
    lengthLabel.textContent = lengthSlider.value;
  });
}

function nextWord() {
  const maxLen = +lengthSlider.value;
  const pool = words.filter(w => w.Niqqud_Length <= maxLen);
  if (!pool.length) {
    wordDiv.textContent = `No words ≤ length ${maxLen}`; 
    return;
  }
  currentWord = pool[Math.floor(Math.random() * pool.length)];
  wordDiv.textContent = toggle.checked
    ? currentWord.Niqqud
    : currentWord.Hebrew;
  translationDiv.textContent = '';
  input.value = '';
  feedback.textContent = '';
  button.textContent = 'Check';
  overrideBtn.style.display = 'none';
}

function wireCheckButton() {
  button.addEventListener("click", () => {
    if (button.textContent === "Check") {
      incrementAttempt();
      const user = input.value.trim().toLowerCase();
      const correct = user === currentWord.Transliteration.toLowerCase();
      if (correct) {
        incrementCorrect();
        feedback.textContent = "✅ Correct!";
      } else {
        feedback.textContent = `❌ Incorrect. Correct: ${currentWord.Transliteration}`;
        overrideBtn.style.display = 'inline-block';
      }
      trackHourly(correct);
      translationDiv.textContent = translationToggle.checked
        ? currentWord.Translation
        : '';
      updateStats();
      button.textContent = "Next";
    } else {
      nextWord();
    }
  });

  overrideBtn.addEventListener("click", () => {
    incrementCorrect();
    updateStats();
    feedback.textContent = "✅ Marked correct";
    overrideBtn.style.display = 'none';
    trackHourly(true);
  });
}