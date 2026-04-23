const fs = require("fs");

const master = JSON.parse(fs.readFileSync("master.json", "utf-8"));
const statePath = "state.json";

const ACTIVE_COUNT = 3;

// load state
let state = { offset: 0 };

if (fs.existsSync(statePath)) {
  state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
}

function sliceBlock(arr, offset) {
  const start = offset % arr.length;
  const end = start + ACTIVE_COUNT;

  if (end <= arr.length) {
    return arr.slice(start, end);
  }

  // wrap-around
  return [
    ...arr.slice(start),
    ...arr.slice(0, end - arr.length),
  ];
}

function buildActive() {
  const active = {};

  for (const [cat, data] of Object.entries(master)) {
    active[cat] = {
      full: sliceBlock(data.full, state.offset),
      thumbs: sliceBlock(data.thumbs, state.offset),
    };
  }

  return active;
}

// write output
fs.writeFileSync(
  "active.json",
  JSON.stringify(buildActive(), null, 2)
);

// update offset (avance de 3 à chaque run)
state.offset = state.offset + ACTIVE_COUNT;

// reset si trop grand (optionnel mais propre)
const maxLen = Math.max(
  ...Object.values(master).map(d => d.full.length)
);

if (state.offset >= maxLen) {
  state.offset = 0;
}

fs.writeFileSync(
  statePath,
  JSON.stringify(state, null, 2)
);

console.log("Rotation updated, offset =", state.offset);
