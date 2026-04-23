const fs = require("fs");

const master = JSON.parse(fs.readFileSync("master.json", "utf-8"));

const ACTIVE_COUNT = 3;

function rotate(arr, offset) {
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}

function buildActive() {
  const month = new Date().getMonth(); // 0-11

  const active = {};

  for (const [cat, data] of Object.entries(master)) {
    const full = rotate(data.full, month).slice(0, ACTIVE_COUNT);
    const thumbs = rotate(data.thumbs, month).slice(0, ACTIVE_COUNT);

    active[cat] = { full, thumbs };
  }

  return active;
}

fs.writeFileSync(
  "active.json",
  JSON.stringify(buildActive(), null, 2)
);

console.log("active.json updated");
