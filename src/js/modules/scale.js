export const scaleModule = {
  id: "scale",
  stats: ["height_cm", "mass_kg"],
  mins: { height_cm: 30 },
  stages: [
    { maxS: 1.15, name: "Normal" },
    { maxS: 1.6, name: "Tall" },
    { maxS: 6, name: "Towering" },
    { maxS: 40, name: "Giant" },
    { maxS: Infinity, name: "Titanic" },
  ],
  bands: {
    height: [
      { maxS: 1.15, words: ["tall", "taller than most"] },
      { maxS: 1.6, words: ["towering", "doorframe-ducking"] },
      { maxS: 6, words: ["giant", "roof-high"] },
      { maxS: 40, words: ["building-sized", "skyline-scale"] },
    ],
  },
  defaultRefs: [
    {
      id: "door",
      h: 2.0,
      phrase: "the top of a doorframe",
      thresholdCard: "threshold-door",
    },
    {
      id: "ceiling",
      h: 2.4,
      phrase: "a typical ceiling",
      thresholdCard: "threshold-ceiling",
    },
    {
      id: "sedan",
      h: 1.45,
      phrase: "a car roofline",
      thresholdCard: "threshold-car",
    },
  ],
  defaultCards: [
    {
      id: "threshold-door",
      tags: ["req-heightAboveDoor", "once"],
      modules: ["scale"],
      prose: "[pov-big]You stop ducking and start *seeing* doorframes.[pov-small]",
    },
    {
      id: "threshold-ceiling",
      tags: ["req-eyeAboveCeiling", "once", "settle"],
      modules: ["scale"],
      prose: "Your eye line finds the ceiling—and keeps going.",
    },
  ],
};
