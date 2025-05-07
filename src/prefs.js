export function initPrefs() {
  const niq = document.getElementById('niqqud-toggle');
  const trn = document.getElementById('translation-toggle');
  const drk = document.getElementById('dark-toggle');

  // safe parse
  niq.checked = JSON.parse(localStorage.getItem('showNiqqud')     ?? 'true');
  trn.checked = JSON.parse(localStorage.getItem('showTranslation')?? 'true');
  drk.checked = JSON.parse(localStorage.getItem('darkMode')       ?? 'false');
  document.body.classList.toggle('dark', drk.checked);

  niq.addEventListener('change', () => {
    localStorage.setItem('showNiqqud', JSON.stringify(niq.checked));
  });
  trn.addEventListener('change', () => {
    localStorage.setItem('showTranslation', JSON.stringify(trn.checked));
  });
  drk.addEventListener('change', () => {
    localStorage.setItem('darkMode', JSON.stringify(drk.checked));
    document.body.classList.toggle('dark', drk.checked);
  });
}