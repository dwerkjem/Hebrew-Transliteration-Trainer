import Chart      from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

let chart, view = localStorage.getItem('chartView')||'hourly';
const sel = document.getElementById('timeframe-selector');

export function initCharting() {
  if (sel) {
    sel.value = view;
    sel.addEventListener('change', () => {
      view = sel.value;
      localStorage.setItem('chartView', view);
      draw();
    });
  }
  draw();
}

export function track(ok) {
  const now = new Date();
  // Use ISO string for the current hour
  const hourKey = now.toISOString().slice(0, 13) + ':00';
  const stats = loadHourly(); 
  if (!stats[hourKey]) stats[hourKey] = { attempts: 0, correct: 0 };
  stats[hourKey].attempts++;
  if (ok) stats[hourKey].correct++;
  saveHourly(stats);
  renderChart(stats);
}

export function trackCorrectOnly() {
  const now = new Date();
  const hourKey = now.toISOString().slice(0, 13) + ':00';
  const stats = loadHourly();
  if (!stats[hourKey]) stats[hourKey] = { attempts: 0, correct: 0 };
  stats[hourKey].correct++;
  saveHourly(stats);
  renderChart(stats);
}

function group(raw) {
  const buckets = {};
  Object.entries(raw).forEach(([iso,b])=>{
    if (!b.attempts) return;
    let k = iso;
    const dt = new Date(iso);
    if (view==='daily') k = iso.slice(0,10)+'T00:00';
    if (view==='weekly') {
      const day = dt.getDay(), diff = (day+6)%7;
      const wk = new Date(dt); wk.setDate(dt.getDate()-diff);
      k = wk.toISOString().slice(0,13)+':00';
    }
    buckets[k] = buckets[k]||{attempts:0,correct:0};
    buckets[k].attempts += b.attempts;
    buckets[k].correct  += b.correct;
  });
  return Object.entries(buckets)
    .sort(([a],[b])=>new Date(a)-new Date(b))
    .map(([k,b])=>({ x:new Date(k), y:Math.round(b.correct/b.attempts*100) }));
}

// Fill missing hours for continuity in time series
function fillMissingHours(data, start, end) {
  const filled = [];
  let current = new Date(start);
  const endDate = new Date(end);
  let i = 0;
  while (current <= endDate) {
    const hourISO = current.toISOString().slice(0, 13) + ':00';
    if (i < data.length && data[i].x.getTime() === current.getTime()) {
      filled.push(data[i]);
      i++;
    } else {
      filled.push({ x: new Date(current), y: null });
    }
    current.setHours(current.getHours() + 1);
  }
  return filled;
}

export function draw() {
  const raw = JSON.parse(localStorage.getItem('hourlyStats')||'{}');
  const data = group(raw);
  const ctx  = document.getElementById('hourly-chart')?.getContext('2d');
  if (!ctx) return;
  const unit = view==='hourly'?'hour':view==='daily'?'day':'week';

  // Fill missing hours for time series continuity (hourly only)
  let chartData = data;
  if (view === 'hourly' && data.length > 1) {
    const start = data[0].x;
    const end = data[data.length - 1].x;
    chartData = fillMissingHours(data, start, end);
  }

  if (chart) {
    chart.data.datasets[0].data = chartData;
    chart.options.scales.x.time.unit = unit;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type:'line',
      data:{ datasets:[{
        label:'Accuracy %', data: chartData,
        borderColor:'#3a6ea5',
        backgroundColor:'rgba(58,110,165,0.2)',
        fill:true, tension:0.3
      }]},
      options:{
        scales:{
          x:{ type:'time', time:{ unit, displayFormats: { hour: 'yyyy-MM-dd HH:00' } }, title:{ display:true,text:'Time' } },
          y:{ beginAtZero:true, max:100, title:{ display:true,text:'%' } }
        },
        plugins:{ legend:{ display:false } },
        interaction: { mode: 'nearest', intersect: false },
        spanGaps: true
      }
    });
  }
}

function loadHourly() {
  return JSON.parse(localStorage.getItem('hourlyStats') || '{}');
}

function saveHourly(stats) {
  localStorage.setItem('hourlyStats', JSON.stringify(stats));
}

function renderChart(stats) {
  draw();
}