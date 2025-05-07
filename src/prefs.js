export function initPrefs() {
  const toggle            = document.getElementById("niqqud-toggle");
  const translationToggle = document.getElementById("translation-toggle");
  const darkToggle        = document.getElementById("dark-toggle");

  toggle.checked            = JSON.parse(localStorage.getItem("showNiqqud")     ?? "true");
  translationToggle.checked = JSON.parse(localStorage.getItem("showTranslation") ?? "true");
  darkToggle.checked        = JSON.parse(localStorage.getItem("darkMode")        ?? "false");
  document.body.classList.toggle("dark", darkToggle.checked);

  toggle.addEventListener("change", () => {
    localStorage.setItem("showNiqqud", JSON.stringify(toggle.checked));
  });
  translationToggle.addEventListener("change", () => {
    localStorage.setItem("showTranslation", JSON.stringify(translationToggle.checked));
  });
  darkToggle.addEventListener("change", () => {
    localStorage.setItem("darkMode", JSON.stringify(darkToggle.checked));
    document.body.classList.toggle("dark", darkToggle.checked);
  });
}