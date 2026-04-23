const fs = require("fs");

const master = JSON.parse(fs.readFileSync("master.json", "utf-8"));

const statePath = "state.json";
const ACTIVE_COUNT = 3;

// -----------------------------
// LOAD STATE
// -----------------------------
let state = {};

if (fs.existsSync(statePath)) {
  state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
}

// -----------------------------
// INIT STATE PER CATEGORY
// -----------------------------
for (const cat of Object.keys(master)) {
  if (!state[cat]) state[cat] = 0;
}

// -----------------------------
// HELPERS
// -----------------------------
function getBlock(arr, offset) {
  const start = offset % arr.length;
  const end = start + ACTIVE_COUNT;

  return end <= arr.length
    ? arr.slice(start, end)
    : [...arr.slice(start), ...arr.slice(0, end - arr.length)];
}

// -----------------------------
// BUILD ACTIVE
// -----------------------------
const active = {};

for (const [cat, data] of Object.entries(master)) {
  const offset = state[cat];

  active[cat] = {
    full: getBlock(data.full, offset),
    thumbs: getBlock(data.thumbs, offset),
  };

  // advance offset
  state[cat] = (offset + ACTIVE_COUNT) % data.full.length;
}

// -----------------------------
// WRITE FILES
// -----------------------------
fs.writeFileSync("active.json", JSON.stringify(active, null, 2));
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

console.log("Rotation updated");
