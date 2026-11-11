import type Phaser from 'phaser';
import type { CreatureKind, Species, Terrain } from '../../core/level.ts';
import { COLORS, SPECIES_COLOR, mix } from '../theme.ts';

/**
 * The stand-in art. Everything is drawn around (0, 0) at tile size `s`.
 * The clay art replaces this file later; views only call these functions by meaning.
 */
/** Phaser accepts plain {x, y} points here; its types ask for Vector2. */
const pts2 = (p: { x: number; y: number }[]) => p as unknown as Phaser.Math.Vector2[];

export type CreatureLook = 'gray' | 'cheered' | 'hidden' | 'grumpy' | 'honked';

function eyesSad(g: Phaser.GameObjects.Graphics, s: number, y: number, gap: number): void {
  g.lineStyle(s * 0.035, COLORS.face, 1);
  g.lineBetween(-gap - s * 0.05, y - s * 0.012, -gap + s * 0.04, y + s * 0.02);
  g.lineBetween(gap + s * 0.05, y - s * 0.012, gap - s * 0.04, y + s * 0.02);
}

function eyesHappy(g: Phaser.GameObjects.Graphics, s: number, y: number, gap: number): void {
  g.lineStyle(s * 0.035, COLORS.face, 1);
  for (const x of [-gap, gap]) {
    g.beginPath();
    g.arc(x, y + s * 0.02, s * 0.045, Math.PI * 1.1, Math.PI * 1.9, false);
    g.strokePath();
  }
}

function eyesClosed(g: Phaser.GameObjects.Graphics, s: number, y: number, gap: number): void {
  g.lineStyle(s * 0.03, COLORS.face, 1);
  for (const x of [-gap, gap]) {
    g.beginPath();
    g.arc(x, y - s * 0.01, s * 0.04, Math.PI * 0.15, Math.PI * 0.85, false);
    g.strokePath();
  }
}

function eyesGrumpy(g: Phaser.GameObjects.Graphics, s: number, y: number, gap: number): void {
  g.fillStyle(COLORS.face, 1);
  g.fillCircle(-gap, y + s * 0.015, s * 0.025);
  g.fillCircle(gap, y + s * 0.015, s * 0.025);
  g.lineStyle(s * 0.035, COLORS.face, 1);
  g.lineBetween(-gap - s * 0.06, y - s * 0.06, -gap + s * 0.04, y - s * 0.025);
  g.lineBetween(gap + s * 0.06, y - s * 0.06, gap - s * 0.04, y - s * 0.025);
}

function mouth(g: Phaser.GameObjects.Graphics, s: number, y: number, happy: boolean): void {
  g.lineStyle(s * 0.03, COLORS.face, 1);
  g.beginPath();
  if (happy) g.arc(0, y - s * 0.03, s * 0.06, Math.PI * 0.2, Math.PI * 0.8, false);
  else g.arc(0, y + s * 0.05, s * 0.05, Math.PI * 1.25, Math.PI * 1.75, false);
  g.strokePath();
}

function cheeks(g: Phaser.GameObjects.Graphics, s: number, y: number, gap: number): void {
  g.fillStyle(COLORS.cheek, 0.85);
  g.fillEllipse(-gap - s * 0.04, y + s * 0.06, s * 0.08, s * 0.05);
  g.fillEllipse(gap + s * 0.04, y + s * 0.06, s * 0.08, s * 0.05);
}

/** Ears, beaks and spikes. Purely flavour; the body shape carries the rule. */
function speciesParts(g: Phaser.GameObjects.Graphics, species: Species, s: number, body: number, dark: number, top: number): void {
  g.fillStyle(body, 1);
  switch (species) {
    case 'rabbit':
      g.fillEllipse(-s * 0.11, top - s * 0.12, s * 0.1, s * 0.26);
      g.fillEllipse(s * 0.11, top - s * 0.12, s * 0.1, s * 0.26);
      g.fillStyle(mix(body, 0xf4a3a3, 0.45), 1);
      g.fillEllipse(-s * 0.11, top - s * 0.11, s * 0.045, s * 0.17);
      g.fillEllipse(s * 0.11, top - s * 0.11, s * 0.045, s * 0.17);
      break;
    case 'fox':
      g.fillTriangle(-s * 0.22, top + s * 0.06, -s * 0.06, top, -s * 0.2, top - s * 0.14);
      g.fillTriangle(s * 0.22, top + s * 0.06, s * 0.06, top, s * 0.2, top - s * 0.14);
      break;
    case 'owl':
      g.fillTriangle(-s * 0.24, top + s * 0.08, -s * 0.1, top + s * 0.02, -s * 0.23, top - s * 0.09);
      g.fillTriangle(s * 0.24, top + s * 0.08, s * 0.1, top + s * 0.02, s * 0.23, top - s * 0.09);
      break;
    case 'bear':
      g.fillCircle(-s * 0.2, top + s * 0.04, s * 0.075);
      g.fillCircle(s * 0.2, top + s * 0.04, s * 0.075);
      g.fillStyle(dark, 1);
      g.fillCircle(-s * 0.2, top + s * 0.04, s * 0.035);
      g.fillCircle(s * 0.2, top + s * 0.04, s * 0.035);
      break;
    case 'hedgehog':
      g.fillStyle(dark, 1);
      for (let i = -3; i <= 3; i++) {
        const x = i * s * 0.07;
        g.fillTriangle(x - s * 0.05, top + s * 0.08, x + s * 0.05, top + s * 0.08, x, top - s * 0.06);
      }
      break;
    case 'mole':
    case 'goose':
    case 'toad':
      break;
  }
}

export function drawCreature(g: Phaser.GameObjects.Graphics, kind: CreatureKind, species: Species, s: number, look: CreatureLook): void {
  g.clear();
  const colour = look === 'cheered';
  let body: number = colour ? SPECIES_COLOR[species] : COLORS.creatureGray;
  if (look === 'grumpy') body = COLORS.grumpy;
  const dark = mix(body, 0x000000, 0.25);
  const r = s * 0.31;
  const droop = colour ? 0 : s * 0.03;
  const cy = s * 0.05 + droop;

  // Soft contact shadow.
  g.fillStyle(0x000000, 0.13);
  g.fillEllipse(0, s * 0.33, s * 0.62, s * 0.14);

  let top = cy - r;
  g.fillStyle(body, 1);
  g.lineStyle(s * 0.022, dark, 1);
  switch (kind) {
    case 'gloomy':
      g.fillEllipse(0, cy, r * 2, r * 2 * (colour ? 1 : 0.9));
      g.strokeEllipse(0, cy, r * 2, r * 2 * (colour ? 1 : 0.9));
      break;
    case 'shy': {
      // Tall egg shape: an owl-ish lookout.
      g.fillEllipse(0, cy, r * 1.75, r * 2.2);
      g.strokeEllipse(0, cy, r * 1.75, r * 2.2);
      top = cy - r * 1.1;
      break;
    }
    case 'sleepy':
      // Wide and heavy.
      g.fillEllipse(0, cy + s * 0.03, r * 2.5, r * 1.8);
      g.strokeEllipse(0, cy + s * 0.03, r * 2.5, r * 1.8);
      top = cy + s * 0.03 - r * 0.9;
      break;
    case 'worrier': {
      // A rounded triangle with a beak: the goose.
      const pts = [
        { x: 0, y: cy - r * 1.15 },
        { x: r * 1.05, y: cy + r * 0.85 },
        { x: -r * 1.05, y: cy + r * 0.85 },
      ];
      g.fillPoints(pts2(pts), true);
      g.strokePoints(pts2(pts), true);
      g.fillCircle(0, cy + r * 0.2, r * 0.82);
      top = cy - r * 1.1;
      break;
    }
  }
  speciesParts(g, species, s, body, dark, top);

  const faceY = kind === 'sleepy' ? cy + s * 0.01 : cy - s * 0.02;
  const gap = s * 0.085;
  if (kind === 'shy' && look !== 'cheered' && look !== 'hidden') {
    // One big watchful eye.
    g.fillStyle(0xffffff, 1);
    g.fillCircle(0, faceY - s * 0.02, s * 0.1);
    g.lineStyle(s * 0.02, dark, 1);
    g.strokeCircle(0, faceY - s * 0.02, s * 0.1);
    g.fillStyle(COLORS.face, 1);
    g.fillCircle(0, faceY - s * 0.02, s * 0.05);
  } else if (look === 'cheered') {
    eyesHappy(g, s, faceY, gap);
    cheeks(g, s, faceY, gap);
  } else if (look === 'grumpy') {
    eyesGrumpy(g, s, faceY, gap);
  } else if (kind === 'sleepy' || look === 'hidden') {
    eyesClosed(g, s, faceY, gap);
  } else {
    eyesSad(g, s, faceY, gap);
  }

  if (kind === 'worrier' || species === 'goose') {
    g.fillStyle(colour ? 0xf0a33a : COLORS.creatureGrayDark, 1);
    g.fillTriangle(-s * 0.05, faceY + s * 0.05, s * 0.05, faceY + s * 0.05, 0, faceY + s * 0.11);
  } else if (species === 'mole') {
    g.fillStyle(colour ? 0xf3a0b0 : COLORS.creatureGrayDark, 1);
    g.fillCircle(0, faceY + s * 0.07, s * 0.035);
  } else if (kind !== 'shy' || look === 'cheered') {
    mouth(g, s, faceY + s * 0.09, look === 'cheered');
  }
}

export function drawOchre(g: Phaser.GameObjects.Graphics, s: number): void {
  g.clear();
  const r = s * 0.3;
  g.fillStyle(0x000000, 0.16);
  g.fillEllipse(0, s * 0.31, s * 0.58, s * 0.13);
  g.fillStyle(COLORS.ochre, 1);
  g.lineStyle(s * 0.024, COLORS.ochreDark, 1);
  g.fillCircle(0, s * 0.02, r);
  g.strokeCircle(0, s * 0.02, r);
  // Big knitted scarf.
  g.fillStyle(COLORS.scarf, 1);
  g.fillRoundedRect(-r * 0.98, s * 0.06, r * 1.96, s * 0.1, s * 0.05);
  g.fillRoundedRect(r * 0.25, s * 0.1, s * 0.09, s * 0.17, s * 0.03);
  g.lineStyle(s * 0.012, 0xa3352b, 1);
  for (let i = -3; i <= 3; i++) g.lineBetween(i * s * 0.07, s * 0.07, i * s * 0.07 + s * 0.02, s * 0.15);
  // Face.
  g.fillStyle(COLORS.face, 1);
  g.fillCircle(-s * 0.08, -s * 0.04, s * 0.028);
  g.fillCircle(s * 0.08, -s * 0.04, s * 0.028);
  g.fillStyle(COLORS.cheek, 0.95);
  g.fillEllipse(-s * 0.15, s * 0.01, s * 0.08, s * 0.05);
  g.fillEllipse(s * 0.15, s * 0.01, s * 0.08, s * 0.05);
  g.lineStyle(s * 0.026, COLORS.face, 1);
  g.beginPath();
  g.arc(0, -s * 0.01, s * 0.045, Math.PI * 0.2, Math.PI * 0.8, false);
  g.strokePath();
}

export function drawObstacle(g: Phaser.GameObjects.Graphics, terrain: Terrain, s: number, seed: number): void {
  g.clear();
  const wob = ((seed * 9301 + 49297) % 233280) / 233280;
  g.fillStyle(0x000000, 0.14);
  g.fillEllipse(0, s * 0.3, s * 0.7, s * 0.16);
  switch (terrain) {
    case 'rock': {
      g.fillStyle(COLORS.obstacle, 1);
      g.lineStyle(s * 0.025, COLORS.obstacleDark, 1);
      const pts = [];
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        const rr = s * (0.3 + 0.05 * Math.sin(i * 2.3 + wob * 6));
        pts.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr * 0.82 + s * 0.02 });
      }
      g.fillPoints(pts2(pts), true);
      g.strokePoints(pts2(pts), true);
      g.fillStyle(0xffffff, 0.18);
      g.fillEllipse(-s * 0.08, -s * 0.08, s * 0.16, s * 0.08);
      break;
    }
    case 'stump': {
      g.fillStyle(0x8d7766, 1);
      g.lineStyle(s * 0.025, 0x6e5a4b, 1);
      g.fillRoundedRect(-s * 0.27, -s * 0.12, s * 0.54, s * 0.4, s * 0.06);
      g.strokeRoundedRect(-s * 0.27, -s * 0.12, s * 0.54, s * 0.4, s * 0.06);
      g.fillStyle(0xa8927f, 1);
      g.fillEllipse(0, -s * 0.12, s * 0.54, s * 0.22);
      g.strokeEllipse(0, -s * 0.12, s * 0.54, s * 0.22);
      g.lineStyle(s * 0.015, 0x7d6858, 1);
      g.strokeEllipse(0, -s * 0.12, s * 0.3, s * 0.11);
      break;
    }
    case 'bush': {
      g.fillStyle(0x8b9187, 1);
      g.lineStyle(s * 0.022, 0x6d7269, 1);
      for (const [x, y, r] of [[-0.13, 0.06, 0.18], [0.13, 0.06, 0.18], [0, -0.08, 0.2]] as const) {
        g.fillCircle(x * s, y * s, r * s);
        g.strokeCircle(x * s, y * s, r * s);
      }
      g.fillCircle(0, s * 0.04, s * 0.17);
      break;
    }
    case 'water': {
      g.fillStyle(COLORS.water, 1);
      g.fillRoundedRect(-s * 0.46, -s * 0.46, s * 0.92, s * 0.92, s * 0.16);
      g.lineStyle(s * 0.02, 0xffffff, 0.5);
      g.lineBetween(-s * 0.2, -s * 0.05, s * 0.05, -s * 0.05);
      g.lineBetween(-s * 0.05, s * 0.12, s * 0.22, s * 0.12);
      break;
    }
    case 'floor':
      break;
  }
}
