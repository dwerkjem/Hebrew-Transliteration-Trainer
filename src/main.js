import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';  // <-- add date adapter for time scale

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
const overrideBtn       = document.getElementById("override-btn");
const clearBtn = document.getElementById("clear-data");
const exportBtn = document.getElementById("export-data");
const importBtn = document.getElementById("import-data");
const fileInput = document.getElementById("import-file");

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
    overrideBtn.style.display = "none";    // hide override on new word
}

button.addEventListener("click", () => {
  if (button.textContent === "Check") {
    // count attempt
    attemptCount++;

    const userInput = input.value.trim().toLowerCase();
    const isCorrect = userInput === currentWord.Transliteration.toLowerCase();
    if (isCorrect) {
      correctCount++;
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = `❌ Incorrect. Correct: ${currentWord.Transliteration}`;
      feedback.style.color = "red";
      overrideBtn.style.display = "inline-block";  // show override
    }

    // track into our slim‐db
    trackHourly(isCorrect);

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

// override: user-click to mark correct
overrideBtn.addEventListener("click", () => {
  correctCount++;
  updateStats();
  feedback.textContent = "✅ Marked correct";
  feedback.style.color = "green";
  overrideBtn.style.display = "none";

  // use the same ISO‐hour key as trackHourly()
  const now = new Date();
  const hourKey = now.toISOString().slice(0,13) + ":00";
  const db = JSON.parse(localStorage.getItem("hourlyStats") ?? "{}");
  const bucket = db[hourKey] || { attempts: 0, correct: 0 };
  // only bump correct, leave attempts unchanged
  bucket.correct = Math.min(bucket.attempts, bucket.correct + 1);
  db[hourKey] = bucket;
  localStorage.setItem("hourlyStats", JSON.stringify(db));

  // redraw chart with updated bucket
  drawHourlyChart();
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


function trackHourly(isCorrect) {
  const now = new Date();
  const hourKey = now.toISOString().slice(0,13) + ":00";
  const db = JSON.parse(localStorage.getItem("hourlyStats") ?? "{}");
  const bucket = db[hourKey] || { attempts: 0, correct: 0 };
  bucket.attempts++;
  if (isCorrect) bucket.correct++;
  db[hourKey] = bucket;
  localStorage.setItem("hourlyStats", JSON.stringify(db));
  drawHourlyChart();
}

/**
 * Draw or update a line chart of percent‐correct over time.
 * Uses {x:Date, y:Number} points so that Chart.js time‐scale updates correctly.
 */
function drawHourlyChart() {
  const raw = JSON.parse(localStorage.getItem("hourlyStats") ?? "{}");
  const entries = Object.entries(raw)
    .filter(([,b]) => b.attempts > 0)
    .sort(([a], [b]) => new Date(a) - new Date(b));

  // build array of {x: Date, y: percent}
  const dataPoints = entries.map(([hour, b]) => ({
    x: new Date(hour),
    y: Math.round((b.correct / b.attempts) * 100)
  }));

  const ctx = document.getElementById("hourly-chart").getContext("2d");
  if (window.hourlyChart) {
    window.hourlyChart.data.datasets[0].data = dataPoints;
    window.hourlyChart.update();
  } else {
    window.hourlyChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{
          label: "Accuracy %",
          data: dataPoints,
          borderColor: "rgba(58,110,165,0.8)",
          backgroundColor: "rgba(58,110,165,0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
              displayFormats: { hour: "MMM d, HH:00" }
            },
            title: { display: true, text: "Time" }
          },
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: "Accuracy (%)" }
          }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 300 }
      }
    });
  }
}

// ensure chart is drawn after initial load
loadWords().then(() => {
  drawHourlyChart();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Delete all your data? This cannot be undone.")) {
    localStorage.clear();
    location.reload();
  }
});

// keys we allow
const ALLOWED = [
  "attemptCount", "correctCount",
  "showNiqqud","showTranslation","darkMode",
  "hourlyStats"
];

// gather data from localStorage
function collectData() {
  return ALLOWED.reduce((acc, k) => {
    const v = localStorage.getItem(k);
    if (v !== null) acc[k] = JSON.parse(v);
    return acc;
  }, {});
}

// export JSON file
exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(collectData(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hebrew-trainer-data.json";
  a.click();
  URL.revokeObjectURL(url);
});

// import JSON file
importBtn.addEventListener("click", () => {
  fileInput.value = "";
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (!confirm("Importing will overwrite your current data. Continue?")) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(reader.result);
      // validate keys and types
      for (const key of Object.keys(obj)) {
        if (!ALLOWED.includes(key)) {
          throw new Error(`Unexpected key: ${key}`);
        }
      }
      // apply
      ALLOWED.forEach(k => {
        if (k in obj) {
          localStorage.setItem(k, JSON.stringify(obj[k]));
        } else {
          localStorage.removeItem(k);
        }
      });
      alert("Data imported. Reloading...");
      location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to import: " + e.message);
    }
  };
  reader.readAsText(file);
});
