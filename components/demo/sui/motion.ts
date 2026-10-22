export type SuiScene = "hero" | "look" | "salon" | "craft";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const round = (value: number) => Math.round(value * 1000) / 1000;

/** Small, bounded camera moves: the photograph always covers its original frame. */
export function sceneMotion(scene: SuiScene, top: number, height: number, width: number, viewport: number) {
  const mobile = width <= 700;
  const progress = clamp((viewport - top) / (viewport + Math.max(1, height)));
  if (scene === "hero") return {
    travel: round(clamp(-top / Math.max(1, height)) * Math.min(height * .027, mobile ? 12 : 36)),
    scale: 1.06,
    inset: 0,
  };
  if (scene === "salon") {
    const arrival = clamp((viewport - top) / (viewport * .78));
    return {
      travel: round((.5 - progress) * Math.min(height * .045, 40)),
      scale: round(1.13 - progress * .08),
      inset: round(Math.pow(1 - arrival, 3) * width * (mobile ? .055 : .075)),
    };
  }
  return {
    travel: round((.5 - progress) * Math.min(height * .065, mobile ? 24 : 56)),
    scale: scene === "craft" ? 1.09 : 1.08,
    inset: 0,
  };
}
