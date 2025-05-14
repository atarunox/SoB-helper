document.addEventListener("DOMContentLoaded", () => {
  let hero = { name: "Bandido", customName: "Outlaw Joe", stats: { Agility: 3, Strength: 4 } };
  function showTab(id) {
    document.querySelectorAll(".tabContent").forEach(tab => tab.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
  }
  function renderStatsTab() {
    const tab = document.getElementById("statsTab");
    tab.innerHTML = '<h3>' + hero.customName + '</h3>';
    tab.innerHTML += '<p>Agility: ' + hero.stats.Agility + '</p>';
    tab.innerHTML += '<p>Strength: ' + hero.stats.Strength + '</p>';
  }
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  renderStatsTab();
  showTab("statsTab");
});
