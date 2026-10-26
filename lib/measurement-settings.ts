export const MEASUREMENT_OPTOUT_KEY = "machinowebs:measurement-opt-out:v1";

// An opt-out never expires on its own. Malformed saved choices fail closed.
// A previous explicit refusal is respected; an old grant is not called consent.
export function measurementOptedOut(value: string | null, legacy: string | null = null): boolean {
  if (value !== null) {
    try { return JSON.parse(value).disabled !== false; } catch { return true; }
  }
  try { return JSON.parse(legacy ?? "null")?.choice === "denied"; } catch { return true; }
}

export function measurementAllowed(eligible: boolean, optedOut: boolean | null, privacySignal: boolean): boolean {
  return eligible && optedOut === false && !privacySignal;
}
