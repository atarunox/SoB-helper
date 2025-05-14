import { heroes } from './heroes.js';
import { keywords } from './keywords.js';

let hero = {};
let heroName = "Outlaw Joe";

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

function updateUI() {
  document.getElementById('statsTab').innerHTML = `<h2>${hero.customName}</h2><p>Agility: ${hero.stats.Agility}</p><p>Strength: ${hero.stats.Strength}</p>`;
}

function initHero(className) {
  const data = heroes[className];
  hero = {
    name: className,
    customName: heroName,
    stats: { ...data.stats }
  };
  updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      showTab(tabId);
    });
  });

  document.getElementById("heroSelect").addEventListener("change", (e) => {
    initHero(e.target.value);
  });

  document.getElementById("heroName").addEventListener("change", (e) => {
    heroName = e.target.value;
    hero.customName = heroName;
    updateUI();
  });

  initHero("Bandido");
  showTab("statsTab");
});
