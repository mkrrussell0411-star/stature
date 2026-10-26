/**
 * Register SugarCube reader settings (modules, caps, pacing, units, POV, AI, images).
 * @param {object} Setting
 * @param {object} setup
 * @param {(key: string, value: unknown) => void} onChange
 */
export function registerReaderSettings(Setting, setup, onChange) {
  if (!Setting?.add) return;

  const rs = setup.readerSettings;

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
    list: [
      ["gentle", "Gentle"],
      ["steady", "Steady"],
      ["surge", "Surge"],
    ],
    default: rs.pacing ?? "steady",
    onChange(value) {
      rs.pacing = value;
      onChange("pacing", value);
    },
  });

  Setting.addList("statureUnits", {
    label: "Units",
    list: [
      ["metric", "Metric"],
      ["imperial", "Imperial"],
      ["relative", "Relative (storeys / cars)"],
    ],
    default: rs.units ?? "metric",
    onChange(value) {
      rs.units = value;
      onChange("units", value);
    },
  });

  Setting.addList("staturePov", {
    label: "POV default",
    list: [
      ["ask", "Ask each scene"],
      ["big", "Bigger character"],
      ["small", "Smaller character"],
    ],
    default: rs.pov ?? "ask",
    onChange(value) {
      rs.pov = value;
      onChange("pov", value);
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
    list: [
      ["off", "Off"],
      ["keyframes", "Keyframes"],
      ["live", "Live (self-hosted)"],
    ],
    default: rs.images ?? "keyframes",
    onChange(value) {
      rs.images = value;
      onChange("images", value);
    },
  });
}
