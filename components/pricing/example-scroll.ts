export function exampleScrollTarget(current: number, scrollWidth: number, clientWidth: number, offsets: number[], direction: -1 | 1) {
  const max = Math.max(0, scrollWidth - clientWidth);
  const base = offsets[0] ?? 0;
  const targets = [...new Set([0, ...offsets.map(offset => Math.max(0, Math.min(max, offset - base))), max])].sort((a,b)=>a-b);
  const position = Math.max(0, Math.min(max, current));
  return direction === 1 ? targets.find(target => target > position + 2) ?? max : [...targets].reverse().find(target => target < position - 2) ?? 0;
}
