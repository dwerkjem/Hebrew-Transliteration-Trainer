export const ALLOWED = [
  "attemptCount","correctCount",
  "showNiqqud","showTranslation","darkMode",
  "hourlyStats"
];
export function collectData() {
  return ALLOWED.reduce((acc,k)=>{
    const v=localStorage.getItem(k);
    if(v!=null) acc[k]=JSON.parse(v);
    return acc;
  },{});
}
export function importData(obj) {
  Object.keys(obj).forEach(k=>{
    if(ALLOWED.includes(k))
      localStorage.setItem(k, JSON.stringify(obj[k]));
  });
}