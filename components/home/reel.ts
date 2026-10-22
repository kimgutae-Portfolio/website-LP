export const REEL_DURATION = 16.4;

export function reelSceneAt(time: number) {
  if (!Number.isFinite(time) || time < 5.6 || time >= 16) return 0;
  return time < 10.8 ? 1 : 2;
}
