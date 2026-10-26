/**
 * @param {number} cm
 * @param {"metric"|"imperial"|"relative"} mode
 * @param {object} [opts]
 */
export function formatHeight(cm, mode = "metric", opts = {}) {
  if (mode === "imperial") {
    const totalIn = cm / 2.54;
    const ft = Math.floor(totalIn / 12);
    const inches = Math.round(totalIn - ft * 12);
    return `${ft}′${inches}″`;
  }
  if (mode === "relative") {
    const storeys = cm / (300);
    if (storeys >= 1.2) {
      return `about ${storeys.toFixed(1)} storeys`;
    }
    const carLengths = cm / 450;
    if (carLengths >= 0.8) {
      return `about ${carLengths.toFixed(1)} car lengths`;
    }
    return `about ${(cm / 100).toFixed(1)} meters`;
  }
  if (cm >= 100) {
    return `about ${(cm / 100).toFixed(1)} meters`;
  }
  return `about ${Math.round(cm)} centimeters`;
}

export function formatMass(kg, mode = "metric") {
  if (mode === "imperial") {
    return `about ${Math.round(kg * 2.20462)} pounds`;
  }
  return `about ${Math.round(kg)} kilograms`;
}
