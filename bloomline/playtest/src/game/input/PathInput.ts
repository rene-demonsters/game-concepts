import Phaser from 'phaser';
import { type Tile, DIRS, add, isAdjacent, manhattan, sameTile } from '../../core/coords.ts';
import type { StepCheck } from '../../core/path.ts';
import type { BoardView } from '../view/BoardView.ts';
import type { PathModel } from './PathModel.ts';

export type PathInputHooks = {
  enabled(): boolean;
  onChange(): void;
  onStep(): void;
  onBump(tile: Tile, reason: StepCheck | 'start-here'): void;
  onDragStart(): void;
  onDragEnd(): void;
};

/** The pointer must be this far inside a tile (0.5 = whole tile) before the path moves onto it. */
const DEAD_ZONE = 0.36;

/**
 * Pointer (mouse and touch) to path edits. One pointer at a time; a second finger is ignored.
 * - Drag from Ochre or the path head to draw; from any other path tile to cut back to there.
 * - The path only moves once the pointer is well inside the next tile (no edge jitter).
 * - Fast swipes are sampled along the way, and skipped tiles are filled in.
 * - Dragging onto the previous tile undoes one step.
 * - Tapping a tile next to the head extends the path.
 */
export class PathInput {
  dragging = false;
  private pointerId: number | null = null;
  private last: { x: number; y: number } | null = null;
  private lastBump: string | null = null;
  private readonly board: BoardView;
  private readonly model: PathModel;
  private readonly hooks: PathInputHooks;

  constructor(scene: Phaser.Scene, board: BoardView, model: PathModel, hooks: PathInputHooks) {
    this.board = board;
    this.model = model;
    this.hooks = hooks;
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.down, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.move, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.up, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.up, this);
    scene.input.on(Phaser.Input.Events.GAME_OUT, () => this.up());
  }

  private down(p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]): void {
    if (this.pointerId !== null || !this.hooks.enabled()) return;
    if (over.length > 0) return; // a button took it
    if (p.rightButtonDown()) return;
    const hit = this.board.hit(p.x, p.y);
    if (!hit) return;
    const t = hit.tile;
    const idx = this.model.indexOf(t);
    this.lastBump = null;
    if (idx === this.model.tiles.length - 1) {
      this.begin(p);
    } else if (idx >= 0) {
      this.model.truncateTo(idx);
      this.hooks.onChange();
      this.begin(p);
    } else if (isAdjacent(this.model.head, t)) {
      if (this.tryExtend(t)) this.begin(p);
    } else {
      this.hooks.onBump(t, 'start-here');
    }
  }

  private begin(p: Phaser.Input.Pointer): void {
    this.dragging = true;
    this.pointerId = p.id;
    this.last = { x: p.x, y: p.y };
    this.hooks.onDragStart();
  }

  private move(p: Phaser.Input.Pointer): void {
    if (!this.dragging || p.id !== this.pointerId || !this.last) return;
    if (!this.hooks.enabled()) return this.up();
    // Sample the segment so a fast swipe still passes through every tile.
    const dx = p.x - this.last.x;
    const dy = p.y - this.last.y;
    const dist = Math.hypot(dx, dy);
    const stepPx = this.board.ts * 0.2;
    const n = Math.max(1, Math.ceil(dist / stepPx));
    for (let i = 1; i <= n; i++) this.sample(this.last.x + (dx * i) / n, this.last.y + (dy * i) / n);
    this.last = { x: p.x, y: p.y };
  }

  private sample(x: number, y: number): void {
    const hit = this.board.hit(x, y);
    if (!hit) return;
    if (Math.abs(hit.fx - 0.5) > DEAD_ZONE || Math.abs(hit.fy - 0.5) > DEAD_ZONE) return;
    const t = hit.tile;
    const head = this.model.head;
    if (sameTile(t, head)) return;
    if (this.model.isPrevious(t)) {
      this.model.pop();
      this.lastBump = null;
      this.hooks.onChange();
      return;
    }
    if (isAdjacent(head, t)) {
      this.tryExtend(t);
      return;
    }
    if (this.model.indexOf(t) >= 0) return; // crossing your own trail does nothing
    this.fillToward(t);
  }

  /** The pointer skipped tiles (e.g. a diagonal through a corner): step toward it one tile at a time. */
  private fillToward(target: Tile): void {
    for (let guard = 0; guard < 12; guard++) {
      const head = this.model.head;
      if (sameTile(head, target)) return;
      const dx = target.x - head.x;
      const dy = target.y - head.y;
      const options = DIRS.map((d) => add(head, d))
        .filter((t) => manhattan(t, target) < manhattan(head, target))
        .sort((a, b) => {
          // Prefer the axis with the bigger gap.
          const pa = Math.abs(dx) >= Math.abs(dy) ? (a.x !== head.x ? 0 : 1) : a.y !== head.y ? 0 : 1;
          const pb = Math.abs(dx) >= Math.abs(dy) ? (b.x !== head.x ? 0 : 1) : b.y !== head.y ? 0 : 1;
          return pa - pb;
        });
      const next = options.find((t) => this.model.check(t) === 'ok');
      if (!next) {
        if (options[0]) this.bump(options[0], this.model.check(options[0]));
        return;
      }
      this.model.extend(next);
      this.hooks.onStep();
      this.hooks.onChange();
    }
  }

  private tryExtend(t: Tile): boolean {
    const r = this.model.extend(t);
    if (r === 'ok') {
      this.lastBump = null;
      this.hooks.onStep();
      this.hooks.onChange();
      return true;
    }
    this.bump(t, r);
    return false;
  }

  private bump(t: Tile, r: StepCheck): void {
    const key = `${t.x},${t.y},${this.model.length}`;
    if (this.lastBump === key) return; // one bump per wall, not one per frame
    this.lastBump = key;
    this.hooks.onBump(t, r);
  }

  private up(p?: Phaser.Input.Pointer): void {
    if (p && this.pointerId !== null && p.id !== this.pointerId) return;
    const was = this.dragging;
    this.dragging = false;
    this.pointerId = null;
    this.last = null;
    if (was) this.hooks.onDragEnd();
  }

  cancel(): void {
    this.up();
  }
}
