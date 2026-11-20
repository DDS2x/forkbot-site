// =====================================================================
// 1. ПОЯВЛЕНИЕ ПРИ ПРОКРУТКЕ
// IntersectionObserver сообщает, когда элемент попал в экран.
// Тогда мы добавляем ему класс "in", а CSS плавно его показывает.
// =====================================================================
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target); // показали один раз — больше не следим
      }
    }
  },
  { threshold: 0.15 } // элемент считается «видимым», когда показано 15% его высоты
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =====================================================================
// 2. ВЕТКИ ВИДЕОКАРТ
// Данные взяты из gpu.ts бота: [название, нужно XP, шанс майнинга 0..1]
// =====================================================================
const BRANCHES = {
  amd: [
    ["RX 580", 300, 0.99],
    ["RX 5700 XT", 800, 0.4],
    ["RX 6700 XT", 1600, 0.25],
    ["RX 6800 XT", 3000, 0.2],
    ["RX 7900 XTX", 5200, 0.02],
    ["RX 9070 XT", 8500, 0.01],
  ],
  intel: [
    ["Arc A380", 300, 0.01],
    ["Arc A580", 800, 0.01],
    ["Arc A750", 1600, 0.02],
    ["Arc A770", 3000, 0.02],
    ["Arc B580", 5200, 0.01],
    ["Arc B770", 8500, 0.01],
  ],
  nvidia: [
    ["GTX 1060", 300, 0.6],
    ["GTX 1660 Super", 800, 0.15],
    ["RTX 2070", 1600, 0.1],
    ["RTX 3070", 3000, 0.35],
    ["RTX 4080", 5200, 0.02],
    ["RTX 5090", 8500, 0.01],
  ],
};

const list = document.getElementById("cards");
const tabs = document.querySelectorAll(".tabs button");

function showBranch(branch) {
  list.innerHTML = ""; // очищаем старый список

  BRANCHES[branch].forEach(([name, xp, mined], i) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", i); // номер строки → задержка анимации в CSS

    // textContent вместо innerHTML: безопасно, даже если в данных будут спецсимволы
    const n = document.createElement("span");
    n.className = "n";
    n.textContent = String(i + 1).padStart(2, "0");

    const nm = document.createElement("span");
    nm.className = "name";
    nm.textContent = name;

    const x = document.createElement("span");
    x.className = "xp";
    x.textContent = `${xp.toLocaleString("ru-RU")} XP`;

    const m = document.createElement("span");
    m.className = "mine" + (mined >= 0.3 ? " high" : "");
    m.textContent = `Майнен. ${Math.round(mined * 100)}%`;

    li.append(n, nm, x, m);
    list.append(li);
  });
}

tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
    showBranch(tab.dataset.branch);
  })
);

showBranch("amd"); // стартовая ветка
