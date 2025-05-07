// cache DOM spans
const spanAttempts      = document.getElementById("attempt-count");
const spanCorrect       = document.getElementById("correct-count");
const spanCorrectPct    = document.getElementById("correct-percent");

// safe loader for integer counts
function loadCount(key) {
  const raw = localStorage.getItem(key);
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

let attempts    = loadCount("attemptCount");
let correct     = loadCount("correctCount");

// render UI & persist to localStorage
function render() {
  const pct = attempts ? Math.round((correct / attempts) * 100) : 0;
  spanAttempts.textContent   = attempts;
  spanCorrect.textContent    = correct;
  spanCorrectPct.textContent = pct;
  localStorage.setItem("attemptCount", attempts);
  localStorage.setItem("correctCount", correct);
}

// public API
export function updateStats() {
  render();
}

export function incrementAttempt() {
  attempts++;
  render();
}

export function incrementCorrect() {
  correct++;
  render();
}

// override: remove one attempt and add one correct
export function overrideCorrect() {
  if (attempts > 0) {
    correct++;
    render();
  }
}

// initialize on load
render();