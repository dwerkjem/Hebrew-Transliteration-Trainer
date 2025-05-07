let words = [];
let currentWord = null;

const toggle             = document.getElementById("niqqud-toggle");
const translationToggle  = document.getElementById("translation-toggle");
const darkToggle         = document.getElementById("dark-toggle");
const wordDiv = document.getElementById("hebrew-word");
const translationDiv = document.getElementById("translation-word");
const input = document.getElementById("translit-input");
const feedback = document.getElementById("feedback");
const button             = document.getElementById("check-btn");
const lengthSlider       = document.getElementById("length-slider");
const lengthLabel        = document.getElementById("length-label");
// new stats spans
const attemptCountSpan   = document.getElementById("attempt-count");
const correctCountSpan   = document.getElementById("correct-count");
const correctPercentSpan = document.getElementById("correct-percent");

// load stats
let attemptCount = parseInt(localStorage.getItem("attemptCount") ?? "0", 10);
let correctCount = parseInt(localStorage.getItem("correctCount") ?? "0", 10);

// update UI + persist
function updateStats() {
  attemptCountSpan.textContent   = attemptCount;
  correctCountSpan.textContent   = correctCount;
  const pct = attemptCount
    ? Math.round((correctCount / attemptCount) * 100)
    : 0;
  correctPercentSpan.textContent = pct;
  localStorage.setItem("attemptCount", attemptCount);
  localStorage.setItem("correctCount", correctCount);
}

// initial render
updateStats();

// --- load saved prefs ---
toggle.checked            = JSON.parse(localStorage.getItem("showNiqqud")     ?? "true");
translationToggle.checked = JSON.parse(localStorage.getItem("showTranslation") ?? "true");
darkToggle.checked        = JSON.parse(localStorage.getItem("darkMode")        ?? "false");
// apply dark class
document.body.classList.toggle("dark", darkToggle.checked);

async function loadWords() {
    const base = import.meta.env.BASE_URL || '/'
    const res = await fetch(`${base}words.json`)
    if (!res.ok) {
        console.error('failed to load words.json', res.status)
        return
    }
    words = await res.json()
    nextWord()
}

// live‐update the label
lengthSlider.addEventListener("input", () => {
  lengthLabel.textContent = lengthSlider.value;
});

// pick only words ≤ slider value
function nextWord() {
  const maxLen = parseInt(lengthSlider.value, 10);
  const pool   = words.filter(w => w.Niqqud_Length <= maxLen);

  if (!pool.length) {
    wordDiv.textContent = `No words ≤ length ${maxLen}`;
    translationDiv.textContent = "";
    feedback.textContent = "";
    button.textContent = "Check";
    return;
  }

  currentWord = pool[Math.floor(Math.random() * pool.length)];
  const showNiqud = toggle.checked;
  wordDiv.textContent = showNiqud
    ? currentWord.Niqqud
    : currentWord.Hebrew;

    // always clear translation until after submission
    translationDiv.textContent = "";
    input.value = "";
    feedback.textContent = "";

    // reset button to “Check”
    button.textContent = "Check";
}

button.addEventListener("click", () => {
  if (button.textContent === "Check") {
    // count attempt
    attemptCount++;

    const userInput = input.value.trim().toLowerCase();
    if (userInput === currentWord.Transliteration.toLowerCase()) {
      correctCount++;
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = `❌ Incorrect. Correct: ${currentWord.Transliteration}`;
      feedback.style.color = "red";
    }

    // show translation if enabled
    if (translationToggle.checked) {
      translationDiv.textContent = currentWord.Translation;
    }

    // refresh stats
    updateStats();

    // switch to Next
    button.textContent = "Next";

  } else {
    nextWord();
  }
});

input.addEventListener("keydown", e => {
    if (e.key === "Enter") button.click();
});

toggle.addEventListener("change", () => {
  localStorage.setItem("showNiqqud", toggle.checked);
  if (currentWord && button.textContent === "Check") {
    wordDiv.textContent = toggle.checked
      ? currentWord.Niqqud
      : currentWord.Hebrew;
  }
});

translationToggle.addEventListener("change", () => {
  localStorage.setItem("showTranslation", translationToggle.checked);
  if (button.textContent !== "Check" && currentWord) {
    translationDiv.textContent = translationToggle.checked
      ? currentWord.Translation
      : "";
  }
});

darkToggle.addEventListener("change", () => {
  localStorage.setItem("darkMode", darkToggle.checked);
  document.body.classList.toggle("dark", darkToggle.checked);
});

loadWords();
