export const ALLOWED = [
  'attemptCount','correctCount',
  'showNiqqud','showTranslation','darkMode',
  'hourlyStats'
];

export function collectData() {
  const out = {};
  ALLOWED.forEach(k => {
    const v = localStorage.getItem(k);
    if (v != null) out[k] = JSON.parse(v);
  });
  return out;
}

export function importData(obj) {
  Object.entries(obj).forEach(([k,v]) => {
    if (ALLOWED.includes(k)) {
      localStorage.setItem(k, JSON.stringify(v));
    }
  });
}