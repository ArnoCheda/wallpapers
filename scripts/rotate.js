const fs = require("fs");
const seedrandom = require("seedrandom");

const master = JSON.parse(fs.readFileSync("master.json", "utf-8"));

const ACTIVE_COUNT = 3;

// seed unique à chaque run (manuel ou GitHub Action)
const seed = Date.now().toString();
const rng = seedrandom(seed);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildActive() {
  const active = {};

  for (const [cat, data] of Object.entries(master)) {
    const full = shuffle(data.full).slice(0, ACTIVE_COUNT);
    const thumbs = shuffle(data.thumbs).slice(0, ACTIVE_COUNT);

    active[cat] = { full, thumbs };
  }

  return active;
}

fs.writeFileSync(
  "active.json",
  JSON.stringify(buildActive(), null, 2)
);

console.log("active.json updated");
