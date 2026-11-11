import { type Dir, type Tile, parseTile, tileName } from './coords.ts';

export type CreatureKind = 'gloomy' | 'shy' | 'sleepy' | 'worrier';

/** Flavour only: decides the colour, the greeting word and the little ears or beak. */
export type Species = 'rabbit' | 'owl' | 'goose' | 'bear' | 'fox' | 'hedgehog' | 'toad' | 'mole';

export type Terrain = 'floor' | 'rock' | 'stump' | 'bush' | 'water';

export type BloomConfig = {
  /** Ochre's start tile is in colour before the first move. */
  startTile: boolean;
  /** 0 = just the start tile, 1 = a 3×3 patch. */
  startRadius: number;
  /** 0 = only the tiles Ochre walks on. -1 = path tiles don't bloom. */
  pathRadius: number;
  /** 1 = 3×3 around a cheered creature. */
  greetRadius: number;
  /** square = Chebyshev distance (3×3), diamond = orthogonal distance. */
  shape: 'square' | 'diamond';
};

export const DEFAULT_BLOOM: BloomConfig = {
  startTile: true,
  startRadius: 0,
  pathRadius: 0,
  greetRadius: 1,
  shape: 'square',
};

export type CreatureDef = {
  kind: CreatureKind;
  at: string;
  species?: Species;
  /** Shy: the direction it looks in. */
  facing?: Dir;
  /** Worrier: beats until it honks. */
  countdown?: number;
  /** Shown in the level as a dry little caption. */
  note?: string;
};

/** The authoring format. Map rows are written top row first, as in the concept. */
export type LevelDef = {
  id: string;
  name: string;
  /** One-line hint or joke shown before the level. */
  intro?: string;
  warmth: number;
  par: number;
  bloomTarget: number;
  start: string;
  /** '.' floor, 'R' rock, 'S' stump, 'B' bush, '~' water. Spaces between cells are optional. */
  map: string[];
  creatures: CreatureDef[];
  bloom?: Partial<BloomConfig>;
};

export type Creature = {
  index: number;
  id: string;
  kind: CreatureKind;
  species: Species;
  at: Tile;
  facing: Dir | undefined;
  countdown: number | undefined;
  note: string | undefined;
};

export type Level = {
  id: string;
  name: string;
  intro: string | undefined;
  width: number;
  height: number;
  warmth: number;
  par: number;
  bloomTarget: number;
  start: Tile;
  terrain: Terrain[];
  creatures: Creature[];
  /** Creature index by tile index, -1 when empty. */
  creatureAt: Int16Array;
  bloom: BloomConfig;
};

const TERRAIN_CHARS: Record<string, Terrain> = {
  '.': 'floor',
  R: 'rock',
  S: 'stump',
  B: 'bush',
  '~': 'water',
};

const DEFAULT_SPECIES: Record<CreatureKind, Species> = {
  gloomy: 'rabbit',
  shy: 'owl',
  sleepy: 'bear',
  worrier: 'goose',
};

export function defineLevel(def: LevelDef): LevelDef {
  return def;
}

export function parseLevel(def: LevelDef): Level {
  const rows = def.map.map((r) => r.replace(/\s+/g, ''));
  const height = rows.length;
  const width = rows[0]?.length ?? 0;
  if (height === 0 || width === 0) throw new Error(`${def.id}: empty map`);
  const terrain: Terrain[] = Array.from<Terrain>({ length: width * height });
  rows.forEach((row, r) => {
    if (row.length !== width) throw new Error(`${def.id}: row ${r} has ${row.length} cells, expected ${width}`);
    const y = height - 1 - r;
    for (let x = 0; x < width; x++) {
      const t = TERRAIN_CHARS[row[x]!];
      if (!t) throw new Error(`${def.id}: unknown map character '${row[x]}'`);
      terrain[y * width + x] = t;
    }
  });

  const creatureAt = new Int16Array(width * height).fill(-1);
  const counts: Partial<Record<Species, number>> = {};
  const creatures: Creature[] = def.creatures.map((c, index) => {
    const at = parseTile(c.at);
    const i = at.y * width + at.x;
    if (at.x < 0 || at.y < 0 || at.x >= width || at.y >= height) throw new Error(`${def.id}: creature at ${c.at} is off the map`);
    if (terrain[i] !== 'floor') throw new Error(`${def.id}: creature at ${c.at} sits on ${terrain[i]}`);
    if (creatureAt[i] !== -1) throw new Error(`${def.id}: two creatures at ${c.at}`);
    if (c.kind === 'shy' && !c.facing) throw new Error(`${def.id}: shy creature at ${c.at} needs a facing`);
    if (c.kind === 'worrier' && !(c.countdown && c.countdown > 0)) throw new Error(`${def.id}: worrier at ${c.at} needs a countdown`);
    creatureAt[i] = index;
    const species = c.species ?? DEFAULT_SPECIES[c.kind];
    counts[species] = (counts[species] ?? 0) + 1;
    return {
      index,
      id: `${species}-${counts[species]}`,
      kind: c.kind,
      species,
      at,
      facing: c.facing,
      countdown: c.countdown,
      note: c.note,
    };
  });

  const start = parseTile(def.start);
  const si = start.y * width + start.x;
  if (terrain[si] !== 'floor' || creatureAt[si] !== -1) throw new Error(`${def.id}: start ${def.start} isn't a free floor tile`);

  return {
    id: def.id,
    name: def.name,
    intro: def.intro,
    width,
    height,
    warmth: def.warmth,
    par: def.par,
    bloomTarget: def.bloomTarget,
    start,
    terrain,
    creatures,
    creatureAt,
    bloom: { ...DEFAULT_BLOOM, ...def.bloom },
  };
}

export function inBounds(level: Level, t: Tile): boolean {
  return t.x >= 0 && t.y >= 0 && t.x < level.width && t.y < level.height;
}

export function tileIndex(level: Level, t: Tile): number {
  return t.y * level.width + t.x;
}

export function tileAt(level: Level, i: number): Tile {
  return { x: i % level.width, y: Math.floor(i / level.width) };
}

/** Floor without a creature on it. The only tiles a path may use. */
export function isWalkable(level: Level, t: Tile): boolean {
  if (!inBounds(level, t)) return false;
  const i = tileIndex(level, t);
  return level.terrain[i] === 'floor' && level.creatureAt[i] === -1;
}

export function walkableCount(level: Level): number {
  let n = 0;
  for (let i = 0; i < level.terrain.length; i++) {
    if (level.terrain[i] === 'floor' && level.creatureAt[i] === -1) n++;
  }
  return n;
}

export function describeTile(t: Tile): string {
  return tileName(t);
}
