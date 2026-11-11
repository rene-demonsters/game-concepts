import Phaser from 'phaser';
import { type Tile, add, manhattan } from '../../core/coords.ts';
import { type Creature, type Level, inBounds, isWalkable, tileAt, tileIndex } from '../../core/level.ts';
import { type CreatureLook, drawCreature, drawObstacle, drawOchre } from '../skin/vector-skin.ts';
import { TEX } from '../skin/textures.ts';
import { BLOOM_TILES, COLORS, FLOWERS, FONT, hex, mix } from '../theme.ts';

export type CreatureSprite = {
  creature: Creature;
  container: Phaser.GameObjects.Container;
  gfx: Phaser.GameObjects.Graphics;
  look: CreatureLook;
  sign?: Phaser.GameObjects.Text;
  zz?: Phaser.GameObjects.Text;
  markers: Phaser.GameObjects.GameObject[];
};

type TileSprite = { top: Phaser.GameObjects.Image; shadow: Phaser.GameObjects.Image; colour: number; bloomed: boolean };

export const DEPTH = { tiles: 0, grid: 1, markers: 2, path: 3, things: 10, float: 100, ui: 200 } as const;

/** Draws one level and answers geometry questions. Holds no game rules. */
export class BoardView {
  readonly scene: Phaser.Scene;
  readonly level: Level;
  readonly ts: number;
  readonly ox: number;
  readonly oy: number;
  readonly creatures: CreatureSprite[] = [];
  readonly ochre: Phaser.GameObjects.Container;
  private tiles: (TileSprite | null)[] = [];
  private grid: Phaser.GameObjects.Graphics;
  private flowers: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, level: Level, tileSize: number, originX: number, originY: number) {
    this.scene = scene;
    this.level = level;
    this.ts = tileSize;
    this.ox = originX;
    this.oy = originY;
    const s = tileSize;

    // Table slab under the grid.
    const slab = scene.add.graphics().setDepth(DEPTH.tiles - 1);
    slab.fillStyle(COLORS.tableEdge, 1);
    slab.fillRoundedRect(originX - s * 0.18, originY - s * 0.14, s * level.width + s * 0.36, s * level.height + s * 0.4, s * 0.3);
    slab.fillStyle(COLORS.table, 1);
    slab.fillRoundedRect(originX - s * 0.16, originY - s * 0.16, s * level.width + s * 0.32, s * level.height + s * 0.32, s * 0.28);

    for (let i = 0; i < level.width * level.height; i++) {
      const t = tileAt(level, i);
      const terrain = level.terrain[i]!;
      if (terrain === 'water') {
        this.tiles.push(null);
      } else {
        const { x, y } = this.centre(t);
        const inner = s * 0.9;
        const shadow = scene.add.image(x, y + s * 0.045, TEX.tile).setDisplaySize(inner, inner).setTint(COLORS.tileShadow).setDepth(DEPTH.tiles);
        const top = scene.add.image(x, y, TEX.tile).setDisplaySize(inner, inner).setTint(COLORS.tileGray).setDepth(DEPTH.tiles);
        this.tiles.push({ top, shadow, colour: BLOOM_TILES[(t.x * 7 + t.y * 3) % BLOOM_TILES.length]!, bloomed: false });
      }
      if (terrain !== 'floor') {
        const g = scene.add.graphics();
        drawObstacle(g, terrain, s, i);
        const c = this.centre(t);
        g.setPosition(c.x, c.y).setDepth(terrain === 'water' ? DEPTH.tiles : this.depthFor(t));
      }
    }

    this.grid = scene.add.graphics().setDepth(DEPTH.grid).setAlpha(0);
    this.grid.lineStyle(Math.max(1, s * 0.02), COLORS.tileOutline, 0.55);
    for (let i = 0; i < this.tiles.length; i++) {
      const t = tileAt(level, i);
      if (!isWalkable(level, t)) continue;
      const c = this.centre(t);
      this.grid.strokeRoundedRect(c.x - s * 0.45, c.y - s * 0.45, s * 0.9, s * 0.9, s * 0.16);
    }

    for (const c of level.creatures) this.creatures.push(this.makeCreature(c));

    this.ochre = scene.add.container(0, 0);
    const og = scene.add.graphics();
    drawOchre(og, s);
    this.ochre.add(og);
    this.placeOchre(level.start);
  }

  centre(t: Tile): { x: number; y: number } {
    return {
      x: this.ox + (t.x + 0.5) * this.ts,
      y: this.oy + (this.level.height - 1 - t.y + 0.5) * this.ts,
    };
  }

  depthFor(t: Tile): number {
    return DEPTH.things + (this.level.height - t.y) * 2;
  }

  /** The tile under a point, plus where in the tile (0..1 from its top-left). */
  hit(px: number, py: number): { tile: Tile; fx: number; fy: number } | null {
    const gx = (px - this.ox) / this.ts;
    const gy = (py - this.oy) / this.ts;
    const col = Math.floor(gx);
    const row = Math.floor(gy);
    const tile = { x: col, y: this.level.height - 1 - row };
    if (!inBounds(this.level, tile)) return null;
    return { tile, fx: gx - col, fy: gy - row };
  }

  placeOchre(t: Tile): void {
    const c = this.centre(t);
    this.ochre.setPosition(c.x, c.y).setDepth(this.depthFor(t) + 1);
  }

  setGridVisible(on: boolean): void {
    this.scene.tweens.killTweensOf(this.grid);
    this.scene.tweens.add({ targets: this.grid, alpha: on ? 1 : 0, duration: on ? 140 : 320 });
  }

  // ---- creatures ----

  private makeCreature(c: Creature): CreatureSprite {
    const s = this.ts;
    const pos = this.centre(c.at);
    const container = this.scene.add.container(pos.x, pos.y).setDepth(this.depthFor(c.at));
    const gfx = this.scene.add.graphics();
    drawCreature(gfx, c.kind, c.species, s, 'gray');
    container.add(gfx);
    const sprite: CreatureSprite = { creature: c, container, gfx, look: 'gray', markers: [] };

    if (c.kind === 'worrier') {
      sprite.sign = this.scene.add
        .text(0, -s * 0.5, String(c.countdown), {
          fontFamily: FONT,
          fontSize: `${Math.round(s * 0.24)}px`,
          fontStyle: 'bold',
          color: hex(COLORS.text),
          backgroundColor: hex(0xf3ecdf),
          padding: { x: s * 0.07, y: s * 0.02 },
        })
        .setOrigin(0.5);
      container.add(sprite.sign);
    }
    if (c.kind === 'sleepy') {
      sprite.zz = this.scene.add
        .text(s * 0.24, -s * 0.36, 'z z', { fontFamily: FONT, fontSize: `${Math.round(s * 0.2)}px`, fontStyle: 'bold', color: hex(COLORS.sleepyMark) })
        .setOrigin(0.5);
      container.add(sprite.zz);
      this.scene.tweens.add({ targets: sprite.zz, y: -s * 0.44, alpha: 0.5, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.inOut' });
      // Quiet zone: the tiles where turning wakes it.
      for (const d of ['N', 'E', 'S', 'W'] as const) {
        const t = add(c.at, d);
        if (!isWalkable(this.level, t)) continue;
        const p = this.centre(t);
        const m = this.scene.add.graphics().setDepth(DEPTH.markers);
        m.lineStyle(Math.max(1.5, s * 0.025), COLORS.sleepyMark, 0.7);
        const r = s * 0.36;
        // Dashed ring: "tiptoe here".
        for (let a = 0; a < 12; a++) {
          if (a % 2) continue;
          m.beginPath();
          m.arc(p.x, p.y, r, (a / 12) * Math.PI * 2, ((a + 1) / 12) * Math.PI * 2, false);
          m.strokePath();
        }
        sprite.markers.push(m);
      }
    }
    if (c.kind === 'shy' && c.facing) {
      // Gaze line: dots along every tile it can see, chevrons on the approach tile.
      let t = add(c.at, c.facing);
      let first = true;
      while (inBounds(this.level, t) && isWalkable(this.level, t)) {
        const p = this.centre(t);
        const m = this.scene.add.graphics().setDepth(DEPTH.markers);
        m.fillStyle(COLORS.gaze, first ? 0.75 : 0.45);
        if (first) {
          // Chevron pointing at the creature: walk this way.
          const v = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[c.facing];
          const back = { x: -v[0]!, y: -v[1]! };
          const tip = { x: p.x + back.x * s * 0.2, y: p.y + back.y * s * 0.2 };
          const side = { x: -back.y, y: back.x };
          for (const off of [0, -0.17]) {
            const tx = tip.x + back.x * s * off;
            const ty = tip.y + back.y * s * off;
            m.fillTriangle(
              tx,
              ty,
              tx - back.x * s * 0.13 + side.x * s * 0.12,
              ty - back.y * s * 0.13 + side.y * s * 0.12,
              tx - back.x * s * 0.13 - side.x * s * 0.12,
              ty - back.y * s * 0.13 - side.y * s * 0.12,
            );
          }
        } else {
          for (const k of [-0.22, 0, 0.22]) {
            const vx = c.facing === 'E' || c.facing === 'W' ? k : 0;
            const vy = c.facing === 'N' || c.facing === 'S' ? k : 0;
            m.fillCircle(p.x + vx * s, p.y + vy * s, s * 0.04);
          }
        }
        sprite.markers.push(m);
        first = false;
        t = add(t, c.facing);
      }
    }
    return sprite;
  }

  setLook(index: number, look: CreatureLook): void {
    const sp = this.creatures[index]!;
    sp.look = look;
    drawCreature(sp.gfx, sp.creature.kind, sp.creature.species, this.ts, look);
    if (look !== 'gray') {
      for (const m of sp.markers) this.scene.tweens.add({ targets: m, alpha: 0, duration: 300 });
      if (sp.zz) sp.zz.setVisible(look !== 'cheered' && look !== 'grumpy' ? sp.zz.visible : false);
    }
    if (look === 'hidden') {
      this.scene.tweens.add({ targets: sp.container, scaleY: 0.55, scaleX: 0.9, alpha: 0.75, duration: 220, ease: 'Back.in' });
    }
  }

  setCountdown(index: number, remaining: number): void {
    const sign = this.creatures[index]?.sign;
    if (!sign) return;
    sign.setText(String(Math.max(0, remaining)));
    if (remaining <= 2) sign.setColor(hex(0xc8463a));
    this.scene.tweens.add({ targets: sign, scale: 1.25, yoyo: true, duration: 90 });
  }

  // ---- bloom ----

  /** Colour soaks outward from the origin. Instant when `animate` is false. */
  bloom(indices: readonly number[], origin: Tile, animate = true): void {
    const s = this.ts;
    for (const i of indices) {
      const ts = this.tiles[i];
      const t = tileAt(this.level, i);
      const delay = animate ? manhattan(t, origin) * 70 : 0;
      if (ts && !ts.bloomed) {
        ts.bloomed = true;
        const from = COLORS.tileGray;
        const to = ts.colour;
        if (!animate) {
          ts.top.setTint(to);
          ts.shadow.setTint(mix(to, 0x2d5a1e, 0.35));
        } else {
          const counter = { v: 0 };
          this.scene.tweens.add({
            targets: counter,
            v: 1,
            delay,
            duration: 380,
            ease: 'Sine.out',
            onUpdate: () => {
              ts.top.setTint(mix(from, to, counter.v));
              ts.shadow.setTint(mix(COLORS.tileShadow, mix(to, 0x2d5a1e, 0.35), counter.v));
            },
          });
          this.scene.tweens.add({ targets: [ts.top], scale: ts.top.scale * 1.06, yoyo: true, delay, duration: 160 });
        }
      }
      // A few flowers pop up on bloomed floor tiles that nothing stands on.
      const idx = tileIndex(this.level, t);
      if (this.level.terrain[idx] === 'floor' && this.level.creatureAt[idx] === -1) {
        const c = this.centre(t);
        const n = 2 + ((t.x * 5 + t.y * 3) % 2);
        for (let k = 0; k < n; k++) {
          const a = (t.x * 13 + t.y * 7 + k * 2.4) % (Math.PI * 2);
          const rr = s * (0.22 + 0.1 * ((k + t.x) % 2));
          const f = this.scene.add
            .image(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr * 0.9, TEX.dot)
            .setTint(FLOWERS[(t.x + t.y * 2 + k) % FLOWERS.length]!)
            .setDepth(DEPTH.markers)
            .setDisplaySize(s * 0.1, s * 0.1);
          const target = f.scale;
          f.setScale(0);
          this.scene.tweens.add({ targets: f, scale: target, delay: delay + 200 + k * 60, duration: 260, ease: 'Back.out' });
          this.flowers.push(f);
        }
      }
    }
  }

  floatText(at: Tile, text: string, colour: number = COLORS.text, sizeFactor = 0.22): void {
    const c = this.centre(at);
    const t = this.scene.add
      .text(c.x, c.y - this.ts * 0.45, text, {
        fontFamily: FONT,
        fontSize: `${Math.round(this.ts * sizeFactor)}px`,
        fontStyle: 'bold',
        color: hex(colour),
        stroke: hex(0xfffaf0),
        strokeThickness: Math.max(2, this.ts * 0.05),
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.float);
    this.scene.tweens.add({ targets: t, y: t.y - this.ts * 0.45, alpha: { from: 1, to: 0 }, duration: 1100, ease: 'Sine.out', onComplete: () => t.destroy() });
  }

  shake(target: Phaser.GameObjects.Container, amount = 0.06): void {
    const x = target.x;
    this.scene.tweens.add({ targets: target, x: x + this.ts * amount, yoyo: true, repeat: 3, duration: 50, onComplete: () => target.setX(x) });
  }
}
