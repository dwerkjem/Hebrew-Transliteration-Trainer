let words = [];
let currentWord = null;

const toggle = document.getElementById("niqqud-toggle");
const wordDiv = document.getElementById("hebrew-word");
const input = document.getElementById("translit-input");
const feedback = document.getElementById("feedback");
const button = document.getElementById("check-btn");

async function loadWords() {
  const res = await fetch("/words.json");
  words = await res.json();
  nextWord();
}

function nextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  const showNiqqud = toggle.checked;
  wordDiv.textContent = showNiqqud ? currentWord.hebrew : currentWord.hebrew_no_niqqud;
  input.value = "";
  feedback.textContent = "";
}

button.addEventListener("click", () => {
  const userInput = input.value.trim().toLowerCase();
  if (userInput === currentWord.transliteration.toLowerCase()) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `❌ Incorrect. Correct: ${currentWord.transliteration}`;
    feedback.style.color = "red";
  }
  setTimeout(nextWord, 1500);
});

toggle.addEventListener("change", () => {
  if (currentWord) {
    wordDiv.textContent = toggle.checked ? currentWord.hebrew : currentWord.hebrew_no_niqqud;
  }
});

loadWords();
