import { initPrefs }      from './prefs.js';
import { initQuiz }       from './quiz.js';
import { drawHourlyChart }from './charting.js';
import { initStorageUI }  from './storage-ui.js';

async function boot() {
  initPrefs();
  await initQuiz();           // loads words and wires up Check/Next
  drawHourlyChart();          // initial chart render
  initStorageUI();            // clear/export/import buttons
}

boot();
