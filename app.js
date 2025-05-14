import { heroes } from './heroes.js';

let hero = {};
let heroName = "Outlaw Joe";

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

function updateUI() {
  const s = hero.stats;
  const statsTab = document.getElementById('statsTab');
  statsTab.innerHTML = `<h2>${hero.customName}</h2>`;
  for (let stat in s) {
    statsTab.innerHTML += `<label>${stat}: <input type="number" value="${s[stat]}" onchange="updateStat('${stat}', this.value)" /></label><br/>`;
  }
}

window.updateStat = function(stat, value) {
  hero.stats[stat] = parseInt(value);
  updateUI();
};

window.initHero = function(className) {
  const data = heroes[className];
  hero = {
    name: className,
    customName: heroName,
    stats: { ...data.stats }
  };
  updateUI();
};

window.updateHeroName = function(value) {
  heroName = value;
  hero.customName = value;
  updateUI();
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  document.getElementById("heroSelect").addEventListener("change", e => initHero(e.target.value));
  document.getElementById("heroName").addEventListener("change", e => updateHeroName(e.target.value));
  initHero("Bandido");
  showTab("statsTab");
});
