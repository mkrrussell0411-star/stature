/**
 * SugarCube Setting.addList: `list` must be a string array; `default` must be one of those strings.
 * @param {object} Setting
 * @param {object} setup
 * @param {(key: string, value: unknown) => void} onChange
 */
export function registerReaderSettings(Setting, setup, onChange) {
  if (!Setting?.addList) return;

  const rs = setup.readerSettings;

  const pacingLabels = ["Gentle", "Steady", "Surge"];
  const pacingKey = { Gentle: "gentle", Steady: "steady", Surge: "surge" };
  const pacingLabel = { gentle: "Gentle", steady: "Steady", surge: "Surge" };

  const unitLabels = ["Metric", "Imperial", "Relative (storeys / cars)"];
  const unitKey = {
    Metric: "metric",
    Imperial: "imperial",
    "Relative (storeys / cars)": "relative",
  };
  const unitLabel = {
    metric: "Metric",
    imperial: "Imperial",
    relative: "Relative (storeys / cars)",
  };

  const povLabels = ["Ask each scene", "Bigger character", "Smaller character"];
  const povKey = {
    "Ask each scene": "ask",
    "Bigger character": "big",
    "Smaller character": "small",
  };
  const povLabel = {
    ask: "Ask each scene",
    big: "Bigger character",
    small: "Smaller character",
  };

  const imageLabels = ["Off", "Keyframes", "Live (self-hosted)"];
  const imageKey = {
    Off: "off",
    Keyframes: "keyframes",
    "Live (self-hosted)": "live",
  };
  const imageLabel = {
    off: "Off",
    keyframes: "Keyframes",
    live: "Live (self-hosted)",
  };

  Setting.addToggle("statureModuleScale", {
    label: "Scale module",
    default: rs.modules?.scale !== false,
    onChange(value) {
      rs.modules = rs.modules ?? {};
      rs.modules.scale = value;
      onChange("modules", rs.modules);
    },
  });

  Setting.addRange("statureIntensityCap", {
    label: "Growth intensity cap (× baseline height)",
    min: 1.5,
    max: 100,
    step: 0.5,
    default: rs.intensityCapScale ?? 50,
    onChange(value) {
      rs.intensityCapScale = value;
      onChange("intensityCapScale", value);
    },
  });

  Setting.addList("staturePacing", {
    label: "Pacing",
    list: pacingLabels,
    default: pacingLabel[rs.pacing] ?? "Steady",
    onChange(value) {
      rs.pacing = pacingKey[value] ?? String(value).toLowerCase();
      onChange("pacing", rs.pacing);
    },
  });

  Setting.addList("statureUnits", {
    label: "Units",
    list: unitLabels,
    default: unitLabel[rs.units] ?? "Metric",
    onChange(value) {
      rs.units = unitKey[value] ?? "metric";
      onChange("units", rs.units);
    },
  });

  Setting.addList("staturePov", {
    label: "POV default",
    list: povLabels,
    default: povLabel[rs.pov] ?? "Ask each scene",
    onChange(value) {
      rs.pov = povKey[value] ?? "ask";
      onChange("pov", rs.pov);
    },
  });

  Setting.addToggle("statureAiFlavor", {
    label: "AI flavor text (optional backend)",
    default: rs.aiFlavor === true,
    onChange(value) {
      rs.aiFlavor = value;
      onChange("aiFlavor", value);
    },
  });

  Setting.addList("statureImages", {
    label: "Images",
    list: imageLabels,
    default: imageLabel[rs.images] ?? "Keyframes",
    onChange(value) {
      rs.images = imageKey[value] ?? "keyframes";
      onChange("images", rs.images);
    },
  });
}
