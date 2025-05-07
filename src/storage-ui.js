import { collectData, importData } from './storage.js';

export function initStorageUI() {
  document.getElementById('clear-data')
    .addEventListener('click', () => {
      if (confirm('Delete all data?')) {
        localStorage.clear();
        location.reload();
      }
    });

  document.getElementById('export-data')
    .addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(collectData(),null,2)],{type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'trainer-data.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });

  const imp = document.getElementById('import-data');
  const fi  = document.getElementById('import-file');
  imp.addEventListener('click', () => fi.click());
  fi.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f || !confirm('Overwrite data?')) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const obj = JSON.parse(r.result);
        importData(obj);
        location.reload();
      } catch (e) {
        alert('Import failed: ' + e.message);
      }
    };
    r.readAsText(f);
  });
}