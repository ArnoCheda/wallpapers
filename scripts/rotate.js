const fs = require("fs");

const master = JSON.parse(fs.readFileSync("master.json", "utf-8"));
const statePath = "state.json";

const ACTIVE_COUNT = 3;

// load state
let state = {};

if (fs.existsSync(statePath)) {
  state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
}

function getOffset(cat, len) {
  if (!state[cat]) state[cat] = 0;
  return state[cat] % len;
}

function getBlock(arr, offset) {
  const start = offset;
  const end = start + ACTIVE_COUNT;

  return end <= arr.length
    ? arr.slice(start, end)
    : [...arr.slice(start), ...arr.slice(0, end - arr.length)];
}

const active = {};

for (const [cat, data] of Object.entries(master)) {
  const len = data.full.length;
  const offset = getOffset(cat, len);

  active[cat] = {
    full: getBlock(data.full, offset),
    thumbs: getBlock(data.thumbs, offset),
  };

  // advance per category
  state[cat] = (offset + ACTIVE_COUNT) % len;
}

fs.writeFileSync("active.json", JSON.stringify(active, null, 2));
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

console.log("Rotation updated", state);
