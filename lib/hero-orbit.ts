/** The card facing forward for a CSS rotateY angle (including negative turns). */
export function orbitFrontIndex(yaw: number, count: number): number {
  if (!Number.isFinite(yaw) || !Number.isInteger(count) || count < 1) return 0;
  const index = Math.round(-yaw / (360 / count));
  return ((index % count) + count) % count;
}
