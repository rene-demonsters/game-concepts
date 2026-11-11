/**
 * Grid coordinates. x is the column (0 = A), y is the row (0 = row 1, at the bottom),
 * matching the notation in the concept ("A1" is bottom-left).
 */
export type Tile = { readonly x: number; readonly y: number };
export type Dir = 'N' | 'E' | 'S' | 'W';

export const DIRS: readonly Dir[] = ['N', 'E', 'S', 'W'];

export const DIR_VEC: Readonly<Record<Dir, Tile>> = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

export const OPPOSITE: Readonly<Record<Dir, Dir>> = { N: 'S', E: 'W', S: 'N', W: 'E' };

const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function tile(x: number, y: number): Tile {
  return { x, y };
}

/** Parses "A1" style notation. */
export function parseTile(name: string): Tile {
  const m = /^([A-Z])(\d+)$/.exec(name.trim().toUpperCase());
  if (!m) throw new Error(`Bad tile name: ${name}`);
  return { x: COLS.indexOf(m[1]!), y: Number(m[2]) - 1 };
}

export function tileName(t: Tile): string {
  return `${COLS[t.x]}${t.y + 1}`;
}

export function sameTile(a: Tile, b: Tile): boolean {
  return a.x === b.x && a.y === b.y;
}

export function add(a: Tile, d: Dir): Tile {
  const v = DIR_VEC[d];
  return { x: a.x + v.x, y: a.y + v.y };
}

export function manhattan(a: Tile, b: Tile): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function isAdjacent(a: Tile, b: Tile): boolean {
  return manhattan(a, b) === 1;
}

/** Direction of a single orthogonal step from a to b, or null if they aren't adjacent. */
export function dirBetween(a: Tile, b: Tile): Dir | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 1 && dy === 0) return 'E';
  if (dx === -1 && dy === 0) return 'W';
  if (dx === 0 && dy === 1) return 'N';
  if (dx === 0 && dy === -1) return 'S';
  return null;
}
