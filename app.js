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


import { keywords } from './keywords.js';

function renderLibraryTab() {
  const tab = document.getElementById('libraryTab');
  tab.innerHTML = '<h3>Keyword Library</h3>';
  const input = document.createElement('input');
  input.placeholder = "Search...";
  const resultsDiv = document.createElement('div');
  tab.appendChild(input);
  tab.appendChild(resultsDiv);

  const displayResults = (list) => {
    resultsDiv.innerHTML = '';
    let currentCategory = null;
    list.forEach(k => {
      if (k.keyword === "Category") {
        currentCategory = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = k.description;
        currentCategory.appendChild(summary);
        resultsDiv.appendChild(currentCategory);
      } else if (currentCategory) {
        const div = document.createElement('div');
        div.innerHTML = '<strong>' + k.keyword + '</strong>: ' + k.description;
        div.style.marginLeft = '1em';
        currentCategory.appendChild(div);
      }
    });
  };

  input.addEventListener('input', () => {
    const val = input.value.toLowerCase();
    const filtered = keywords.filter(k =>
      k.keyword !== "Category" && (
        k.keyword.toLowerCase().includes(val) ||
        k.description.toLowerCase().includes(val)
      )
    );
    resultsDiv.innerHTML = '';
    filtered.forEach(k => {
      const div = document.createElement('div');
      div.innerHTML = '<strong>' + k.keyword + '</strong>: ' + k.description;
      resultsDiv.appendChild(div);
    });
  });

  displayResults(keywords);
}

document.addEventListener("DOMContentLoaded", () => {
  renderLibraryTab();
});
