import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export function trackHourly(isCorrect) {
  const now = new Date();
  const key = now.toISOString().slice(0,13)+":00";
  const db = JSON.parse(localStorage.getItem("hourlyStats")||"{}");
  const b = db[key] || {attempts:0, correct:0};
  b.attempts++; if(isCorrect) b.correct++;
  db[key]=b;
  localStorage.setItem("hourlyStats",JSON.stringify(db));
  drawHourlyChart();
}

export function drawHourlyChart() {
  const raw = JSON.parse(localStorage.getItem("hourlyStats")||"{}");
  const entries = Object.entries(raw)
    .sort(([a],[b]) => new Date(a)-new Date(b));
  const data = entries.map(([h,b])=>({x:new Date(h), y:Math.round(b.correct/b.attempts*100)}));
  const ctx = document.getElementById("hourly-chart").getContext("2d");
  if(window.hourlyChart){
    window.hourlyChart.data.datasets[0].data = data;
    window.hourlyChart.update();
  } else {
    window.hourlyChart = new Chart(ctx,{
      type:'line',
      data:{datasets:[{
        label:'Accuracy %', data,
        borderColor:'#3a6ea5', backgroundColor:'rgba(58,110,165,0.2)',
        fill:true, tension:0.3
      }]},
      options:{scales:{
        x:{type:'time', time:{unit:'hour'}}, y:{beginAtZero:true, max:100}
      }, plugins:{legend:{display:false}}}
    });
  }
}