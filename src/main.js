let words = [];
let currentWord = null;

const toggle = document.getElementById("niqqud-toggle");
const translationToggle = document.getElementById("translation-toggle");
const wordDiv = document.getElementById("hebrew-word");
const translationDiv = document.getElementById("translation-word");
const input = document.getElementById("translit-input");
const feedback = document.getElementById("feedback");
const button = document.getElementById("check-btn");
const lengthSlider = document.getElementById("length-slider");
const lengthLabel  = document.getElementById("length-label");

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
        // evaluate answer
        const userInput = input.value.trim().toLowerCase();
        if (userInput === currentWord.Transliteration.toLowerCase()) {
            feedback.textContent = "✅ Correct!";
            feedback.style.color = "green";
        } else {
            // show correct transliteration when incorrect
            feedback.textContent = `❌ Incorrect. Correct: ${currentWord.Transliteration}`;
            feedback.style.color = "red";
        }

        // show translation after submission (regardless of correctness)
        if (translationToggle.checked) {
            translationDiv.textContent = currentWord.Translation;
        }

        // switch to “Next” mode
        button.textContent = "Next";

    } else {
        // Next pressed → load a new word
        nextWord();
    }
});

// Enter = submit or next
input.addEventListener("keydown", e => {
    if (e.key === "Enter") button.click();
});

// you can still toggle niqqud on the fly
toggle.addEventListener("change", () => {
    if (currentWord && button.textContent === "Check") {
        wordDiv.textContent = toggle.checked
            ? currentWord.Niqqud
            : currentWord.Hebrew;
    }
});

// translation‐toggle has no immediate effect until after “Check”
loadWords();
