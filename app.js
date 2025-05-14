import { heroes } from './heroes.js';
import { keywords } from './keywords.js';

let hero = {};
let heroName = "Outlaw Joe";
let corruption = 0;
let corruptionMax = 5;

window.showTab = function(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
};

window.initHero = function(className) {
  const data = heroes[className];
  hero = {
    name: className,
    customName: heroName,
    stats: { ...data.stats },
    baseStats: { ...data.stats },
    gear: [],
    abilities: [],
    conditions: []
  };
  updateUI();
};

window.updateStat = function(stat, value) {
  hero.stats[stat] = parseInt(value);
  updateUI();
};

window.updateHeroName = function(value) {
  heroName = value;
  hero.customName = value;
  updateUI();
};

function updateUI() {
  renderStatsTab();
  renderGearTab();
  renderAbilitiesTab();
  renderTreeTab();
  renderConditionsTab();
  renderLibraryTab();
  renderDevTab();
}

function renderStatsTab() {
  const tab = document.getElementById('statsTab');
  const s = hero.stats;
  const base = ['Agility','Cunning','Spirit','Strength','Lore','Luck'];
  const combat = ['Initiative','Combat','Grit','Willpower','Defense'];
  const vitals = ['Health','Sanity'];

  tab.innerHTML = `<h2>${hero.customName || hero.name}</h2>
    <label>Name: <input value="${hero.customName}" onchange="updateHeroName(this.value)" /></label><br/>`;

  tab.innerHTML += '<h3>Primary Stats</h3>';
  base.forEach(stat => {
    tab.innerHTML += `<label>${stat}: <input type="number" value="${s[stat]}" onchange="updateStat('${stat}', this.value)"></label><br/>`;
  });

  tab.innerHTML += '<h3>Combat & Support</h3>';
  combat.forEach(stat => {
    tab.innerHTML += `<label>${stat}: <input type="number" value="${s[stat]}" onchange="updateStat('${stat}', this.value)"></label><br/>`;
  });

  tab.innerHTML += '<h3>Vital Stats</h3>';
  vitals.forEach(stat => {
    tab.innerHTML += `<label>${stat}: <input type="number" value="${s[stat]}" onchange="updateStat('${stat}', this.value)"></label><br/>`;
  });

  const carryMax = s.Strength + 5;
  tab.innerHTML += `<h3>Encumbrance</h3><p>Carry Weight: 0 / ${carryMax}</p>`;
  tab.innerHTML += `<h3>Corruption</h3>
    <label>Corruption: <input type="number" value="${corruption}" onchange="corruption = parseInt(this.value)" /></label><br/>
    <label>Max: <input type="number" value="${corruptionMax}" onchange="corruptionMax = parseInt(this.value)" /></label><br/>`;
}

function renderGearTab() {
  document.getElementById('gearTab').innerHTML = '<h3>Gear</h3><p>Coming soon...</p>';
}
function renderAbilitiesTab() {
  document.getElementById('abilitiesTab').innerHTML = '<h3>Abilities</h3><p>Coming soon...</p>';
}
function renderTreeTab() {
  document.getElementById('treeTab').innerHTML = '<h3>Upgrade Tree</h3><p>Coming soon...</p>';
}
function renderConditionsTab() {
  document.getElementById('conditionsTab').innerHTML = '<h3>Conditions</h3><p>Coming soon...</p>';
}

function renderLibraryTab() {
  const tab = document.getElementById('libraryTab');
  tab.innerHTML = '<h3>Keyword Library</h3>';
  const input = document.createElement('input');
  input.placeholder = "Search...";
  const resultsDiv = document.createElement('div');
  tab.appendChild(input);
  tab.appendChild(resultsDiv);

  const displayResults = (data) => {
    resultsDiv.innerHTML = '';
    let currentCategory = null;
    data.forEach(k => {
      if (k.keyword === "Category") {
        currentCategory = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = k.description;
        currentCategory.appendChild(summary);
        resultsDiv.appendChild(currentCategory);
      } else if (currentCategory) {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${k.keyword}</strong>: ${k.description}`;
        div.style.marginLeft = "1em";
        currentCategory.appendChild(div);
      }
    });
  };

  input.oninput = () => {
    const value = input.value.toLowerCase();
    const filtered = keywords.filter(k =>
      k.keyword !== "Category" &&
      (k.keyword.toLowerCase().includes(value) || k.description.toLowerCase().includes(value))
    );
    resultsDiv.innerHTML = '';
    filtered.forEach(k => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${k.keyword}</strong>: ${k.description}`;
      resultsDiv.appendChild(div);
    });
  };

  displayResults(keywords);
}

function renderDevTab() {
  const tab = document.getElementById('devTab');
  tab.innerHTML = '<h3>Dev Mode</h3>';
  const exportBtn = document.createElement('button');
  exportBtn.textContent = "Export Hero";
  exportBtn.onclick = () => {
    const name = hero.customName?.toLowerCase().replace(/\s+/g, '-') || 'hero';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hero));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${name}.json`;
    a.click();
  };
  tab.appendChild(exportBtn);

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        hero = JSON.parse(reader.result);
        heroName = hero.customName;
        updateUI();
      } catch {
        alert("Invalid hero file.");
      }
    };
    reader.readAsText(file);
  };
  tab.appendChild(document.createElement('br'));
  tab.appendChild(input);
}

window.onload = () => {
  document.getElementById('heroSelect').addEventListener('change', e => initHero(e.target.value));
  document.getElementById('heroName')?.addEventListener('change', e => updateHeroName(e.target.value));
  initHero('Bandido');
  showTab('statsTab');
};
