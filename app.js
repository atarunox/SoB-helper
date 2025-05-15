import { gearList } from './gear.js';
import { skillTree } from './skills.js';
import { hexcrawlConditions } from './conditions.js';

let heroName = "Jargono Native";
let inventory = [...gearList];
let equipped = {};
let selectedSkills = [];
let useHexcrawl = true;

let baseStats = {
  Agility: 3, Strength: 3, Cunning: 3, Spirit: 3, Lore: 3, Luck: 3,
  Initiative: 3, Combat: 3, Grit: 1, Willpower: 3, Defense: 3,
  Health: 10, Sanity: 10
};

let conditions = {
  Mutations: [],
  Injuries: [],
  Madness: []
};

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(t => t.style.display = 'none');
  const tab = document.getElementById(id);
  if (tab) tab.style.display = 'block';
}

function calcTotalStats() {
  const stats = { ...baseStats };
  Object.values(equipped).forEach(item => {
    Object.entries(item.effects).forEach(([stat, val]) => {
      if (stats[stat] != null) stats[stat] += val;
    });
  });
  selectedSkills.forEach(key => {
    const [path, index] = key.split("-");
    const skill = skillTree.find(p => p.path === path)?.skills[+index];
    if (skill?.effects) {
      Object.entries(skill.effects).forEach(([stat, val]) => {
        if (stats[stat] != null) stats[stat] += val;
      });
    }
  });
  return stats;
}

function renderStatsTab() {
  const tab = document.getElementById('statsTab');
  tab.innerHTML = '<h3>Stats</h3>';
  const stats = calcTotalStats();
  Object.entries(stats).forEach(([k, v]) => {
    const div = document.createElement('div');
    div.textContent = `${k}: ${v}`;
    tab.appendChild(div);
  });
}

function renderGearTab() {
  const tab = document.getElementById('gearTab');
  tab.innerHTML = '<h3>Gear</h3>';
  const slots = ["Head", "Torso", "Hands", "Feet"];
  slots.forEach(slot => {
    const label = document.createElement('label');
    label.textContent = slot + ": ";
    const select = document.createElement('select');
    select.innerHTML = '<option value="">None</option>';
    gearList.filter(g => g.slot === slot).forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      if (equipped[slot]?.id === item.id) opt.selected = true;
      select.appendChild(opt);
    });
    select.onchange = () => {
      if (select.value === "") delete equipped[slot];
      else equipped[slot] = gearList.find(g => g.id === select.value);
      renderStatsTab();
      renderGearTab();
    };
    tab.appendChild(label);
    tab.appendChild(select);
    tab.appendChild(document.createElement('br'));
  });
}

function renderConditionsTab() {
  const tab = document.getElementById('conditionsTab');
  tab.innerHTML = '';
  const toggle = document.createElement('label');
  toggle.innerHTML = `<input type="checkbox" ${useHexcrawl ? "checked" : ""}> Use Hexcrawl`;
  toggle.querySelector("input").onchange = () => {
    useHexcrawl = toggle.querySelector("input").checked;
    renderConditionsTab();
  };
  tab.appendChild(toggle);
  Object.entries(conditions).forEach(([type, list]) => {
    const section = document.createElement('div');
    const color = type === 'Mutations' ? 'green' : type === 'Injuries' ? 'red' : 'blue';
    section.innerHTML = `<h3 style="color:${color}">${type}</h3>`;
    list.forEach((c, i) => {
      const div = document.createElement('div');
      div.textContent = c;
      const btn = document.createElement('button');
      btn.textContent = "Remove";
      btn.onclick = () => {
        if (confirm(`Remove ${type} condition?`)) {
          list.splice(i, 1);
          renderConditionsTab();
        }
      };
      div.appendChild(btn);
      section.appendChild(div);
    });
    const select = document.createElement('select');
    select.innerHTML = '<option value="">-- Choose --</option>';
    hexcrawlConditions[type].forEach(e => {
      const opt = document.createElement('option');
      opt.value = e;
      opt.textContent = e;
      select.appendChild(opt);
    });
    select.onchange = () => {
      if (select.value) {
        list.push(select.value);
        renderConditionsTab();
      }
    };
    const rollBtn = document.createElement('button');
    rollBtn.textContent = "Roll";
    rollBtn.onclick = () => {
      const roll = (Math.floor(Math.random() * 6) + 1) * 10 + Math.floor(Math.random() * 6) + 1;
      const result = hexcrawlConditions[type].find(e => e.startsWith(String(roll))) || `Rolled ${roll}: Unknown`;
      list.push(result);
      renderConditionsTab();
    };
    section.appendChild(select);
    section.appendChild(rollBtn);
    tab.appendChild(section);
  });
}

function renderSkillTree() {
  const tab = document.getElementById('treeTab');
  tab.innerHTML = '<h3>Skill Tree</h3>';
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${skillTree.length}, 1fr)`;
  skillTree.forEach(path => {
    const col = document.createElement('div');
    path.skills.forEach((skill, row) => {
      const key = `${path.path}-${row}`;
      const btn = document.createElement('button');
      btn.textContent = skill.name;
      btn.title = skill.desc;
      const isSelected = selectedSkills.includes(key);
      const canUnlock = row === 0 || selectedSkills.includes(`${path.path}-${row - 1}`);
      btn.disabled = !isSelected && !canUnlock;
      btn.style.background = isSelected ? 'lightgreen' : '';
      btn.onclick = () => {
        if (isSelected) selectedSkills = selectedSkills.filter(k => k !== key);
        else if (selectedSkills.length < 7) selectedSkills.push(key);
        renderSkillTree();
        renderStatsTab();
      };
      col.appendChild(btn);
    });
    grid.appendChild(col);
  });
  tab.appendChild(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  renderStatsTab();
  renderGearTab();
  renderConditionsTab();
  renderSkillTree();
  showTab('statsTab');
});
