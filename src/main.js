let words = [];
let currentWord = null;

const toggle = document.getElementById("niqqud-toggle");
const wordDiv = document.getElementById("hebrew-word");
const input = document.getElementById("translit-input");
const feedback = document.getElementById("feedback");
const button = document.getElementById("check-btn");

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

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    const showNiqud = toggle.checked;
    // JSON uses capitalized keys
    wordDiv.textContent = showNiqud
        ? currentWord.Niqqud
        : currentWord.Hebrew;
    input.value = "";
    feedback.textContent = "";
}

button.addEventListener("click", () => {
    const userInput = input.value.trim().toLowerCase();
    if (userInput === currentWord.Transliteration.toLowerCase()) {
        feedback.textContent = "✅ Correct!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = `❌ Incorrect. Correct: ${currentWord.Transliteration}`;
        feedback.style.color = "red";
    }
    setTimeout(nextWord, 1500);
});

toggle.addEventListener("change", () => {
    if (currentWord) {
        wordDiv.textContent = toggle.checked
            ? currentWord.Niqqud
            : currentWord.Hebrew;
    }
});

loadWords();
