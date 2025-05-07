const attemptCountSpan = document.getElementById("attempt-count");
const correctCountSpan= document.getElementById("correct-count");
const correctPercentSpan = document.getElementById("correct-percent");

let attemptCount = +localStorage.getItem("attemptCount") ?? 0;
let correctCount = +localStorage.getItem("correctCount") ?? 0;

export function updateStats() {
  attemptCountSpan.textContent = attemptCount;
  correctCountSpan.textContent = correctCount;
  const pct = attemptCount ? Math.round((correctCount/attemptCount)*100) : 0;
  correctPercentSpan.textContent = pct;
  localStorage.setItem("attemptCount", attemptCount);
  localStorage.setItem("correctCount", correctCount);
}
export function incrementAttempt() { attemptCount++; }
export function incrementCorrect() { correctCount++; }