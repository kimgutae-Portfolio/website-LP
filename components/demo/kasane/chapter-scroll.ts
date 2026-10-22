export type ChapterBounds = { id: string; top: number; bottom: number };
export type ChapterStop = { id: string; start: number; end: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function chapterStops(bounds: ChapterBounds[], viewport: number, header: number, maxScroll: number): ChapterStop[] {
  return bounds.map((chapter, index) => {
    const start = index === 0 ? 0 : clamp(chapter.top - header, 0, maxScroll);
    return { id: chapter.id, start, end: Math.max(start, clamp(chapter.bottom - viewport, 0, maxScroll)) };
  });
}

export function chapterAt(stops: ChapterStop[], position: number): number {
  let index = 0;
  for (let i = 1; i < stops.length; i++) {
    if (position + 3 < stops[i].start) break;
    index = i;
  }
  return index;
}

/** Oversized chapters advance in overlapping screens, never past unread content. */
export function chapterStep(stops: ChapterStop[], position: number, viewport: number, header: number, direction: 1 | -1): { top: number; index: number } {
  if (!stops.length) return { top: position, index: 0 };
  const index = chapterAt(stops, position);
  const current = stops[index];
  const page = Math.max(120, (viewport - header) * .86);
  if (direction === 1) {
    if (position < current.end - 3) return { top: Math.min(position + page, current.end), index };
    if (index === stops.length - 1) return { top: current.end, index };
    const next = Math.min(index + 1, stops.length - 1);
    return { top: stops[next].start, index: next };
  }
  if (position > current.start + 3) return { top: Math.max(position - page, current.start), index };
  if (index === 0) return { top: current.start, index };
  const previous = Math.max(0, index - 1);
  return { top: stops[previous].end, index: previous };
}
