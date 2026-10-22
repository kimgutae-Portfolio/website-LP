const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

export function galleryScrollState(left: number, scrollWidth: number, width: number, offsets: number[]) {
 const maximum = Math.max(0, scrollWidth - width);
 const position = clamp(left, maximum);
 const first = offsets[0] ?? 0;
 const targets = offsets.map(offset => clamp(offset - first, maximum));
 let index = 0;
 for (let i = 1; i < targets.length; i++) if (Math.abs(targets[i] - position) < Math.abs(targets[index] - position)) index = i;
 return { index, progress: maximum > 0 ? position / maximum * 100 : 0, atStart: position < 2, atEnd: maximum - position < 2, maximum, targets };
}
