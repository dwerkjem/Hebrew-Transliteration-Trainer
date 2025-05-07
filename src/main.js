import { initPrefs }        from './prefs.js';
import { initQuiz }         from './quiz.js';
import { initCharting }     from './charting.js';
import { initStorageUI }    from './storage-ui.js';
import { updateStats }      from './stats.js';

async function boot() {
  try {
    initPrefs();                   // wire up toggles & apply dark mode
    await initQuiz();              // load words, wire up quiz
    updateStats();                 // render persisted stats
    initCharting();                // wire chart selector + render
    initStorageUI();               // wire import/export/clear
  } catch (err) {
    console.error('⚠️ boot error:', err);
    document.body.innerHTML = `<p style="color:red">Initialization failed. See console.</p>`;
  }
}

boot();
