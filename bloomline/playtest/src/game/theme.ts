import type { Species } from '../core/level.ts';

export const COLORS = {
  table: 0xdcd7ce,
  tableEdge: 0xcdc7bc,
  tileGray: 0xc3beb6,
  tileShadow: 0xa39d94,
  tileOutline: 0x8f887e,
  obstacle: 0x878178,
  obstacleDark: 0x6b665e,
  water: 0xa3aeb2,
  creatureGray: 0xa8a39b,
  creatureGrayDark: 0x8e8981,
  face: 0x47423d,
  ochre: 0xe5893a,
  ochreDark: 0xc56d24,
  scarf: 0xc8463a,
  cheek: 0xf09b93,
  path: 0xf0a24a,
  pathEdge: 0xd9822c,
  gaze: 0x6f6a63,
  sleepyMark: 0x8796b8,
  text: 0x3b3631,
  textSoft: 0x6e675f,
  panel: 0xf7f2e9,
  panelEdge: 0xd8d0c3,
  button: 0xefe8dc,
  buttonEdge: 0xcfc6b7,
  accent: 0xe5893a,
  accentDark: 0xc56d24,
  heart: 0xe0566b,
  heartEmpty: 0xc9c1b6,
  star: 0xf2b636,
  grumpy: 0x8f99ad,
} as const;

/** The forest area's bloom colours: tiles pick one by position, so the spread looks natural. */
export const BLOOM_TILES = [0xa5d47c, 0x9bcd72, 0xb3dc88, 0x93c76c, 0xaad87f] as const;
export const FLOWERS = [0xf6a5b8, 0xffd56e, 0xfff6e8, 0xb9a2f0, 0xf58f6f] as const;

export const SPECIES_COLOR: Record<Species, number> = {
  rabbit: 0xf2c4a2,
  owl: 0xc7965f,
  goose: 0xf8f4ec,
  bear: 0xb07650,
  fox: 0xec8848,
  hedgehog: 0xc39570,
  toad: 0x93c36b,
  mole: 0x9b86a6,
};

export const GREETING: Record<Species, string> = {
  rabbit: 'boop!',
  owl: 'high five!',
  goose: 'there there',
  bear: 'big hug!',
  fox: 'boop!',
  hedgehog: 'careful hug',
  toad: 'mwah!',
  mole: 'boop!',
};

export const SPECIES_NAME: Record<Species, string> = {
  rabbit: 'rabbit',
  owl: 'owl',
  goose: 'goose',
  bear: 'bear',
  fox: 'fox',
  hedgehog: 'hedgehog',
  toad: 'toad',
  mole: 'mole',
};

export const FONT = 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

export function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}
